using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.Projects;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly TaskFlowDbContext _db;

    public ProjectsController(TaskFlowDbContext db)
    {
        _db = db;
    }

    private Guid CurrentUserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET: api/projects
    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _db.Projects
            .Where(p => p.OwnerId == CurrentUserId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.CreatedAt,
                TaskCount = p.Tasks.Count
            })
            .ToListAsync();

        return Ok(projects);
    }

    // GET: api/projects/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProject(Guid id)
    {
        var project = await _db.Projects
            .Where(p => p.Id == id && p.OwnerId == CurrentUserId)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.CreatedAt,
                Tasks = p.Tasks.Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Status,
                    t.Priority,
                    t.DueDate
                })
            })
            .FirstOrDefaultAsync();

        if (project is null)
            return NotFound();

        return Ok(project);
    }

    // POST: api/projects
    [HttpPost]
    public async Task<IActionResult> CreateProject(ProjectRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Project name is required." });

        var project = new Project
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            OwnerId = CurrentUserId
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetProject),
            new { id = project.Id },
            project);
    }

    // PUT: api/projects/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProject(
        Guid id,
        ProjectRequest request)
    {
        var project = await _db.Projects
            .FirstOrDefaultAsync(
                p => p.Id == id &&
                     p.OwnerId == CurrentUserId);

        if (project is null)
            return NotFound();

        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Project name is required." });

        project.Name = request.Name.Trim();
        project.Description = request.Description?.Trim();

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/projects/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var project = await _db.Projects
            .FirstOrDefaultAsync(
                p => p.Id == id &&
                     p.OwnerId == CurrentUserId);

        if (project is null)
            return NotFound();

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}