using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.Tasks;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly TaskFlowDbContext _db;

    public TasksController(TaskFlowDbContext db)
    {
        _db = db;
    }

    private Guid CurrentUserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET /api/tasks?projectId=...&status=Todo&page=1&pageSize=20
    [HttpGet]
    public async Task<IActionResult> GetTasks(
        Guid? projectId,
        TaskFlow.Domain.Enums.TaskStatus? status,
        int page = 1,
        int pageSize = 20)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _db.Tasks
            .AsNoTracking()
            .Where(t => t.Project.OwnerId == CurrentUserId);

        if (projectId.HasValue)
            query = query.Where(t => t.ProjectId == projectId.Value);

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        var total = await query.CountAsync();

        var tasks = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new
            {
                t.Id,
                t.Title,
                t.Description,
                t.Status,
                t.Priority,
                t.DueDate,
                t.CreatedAt,
                t.ProjectId,
                ProjectName = t.Project.Name,
                t.AssignedUserId,
                AssignedUser = t.AssignedUser == null
                    ? null
                    : t.AssignedUser.Name
            })
            .ToListAsync();

        return Ok(new
        {
            page,
            pageSize,
            total,
            totalPages = (int)Math.Ceiling(total / (double)pageSize),
            items = tasks
        });
    }

    // POST /api/tasks/{projectId}
    [HttpPost("{projectId:guid}")]
    public async Task<IActionResult> CreateTask(
        Guid projectId,
        TaskRequest request)
    {
        var projectExists = await _db.Projects.AnyAsync(
            p => p.Id == projectId &&
                 p.OwnerId == CurrentUserId);

        if (!projectExists)
            return NotFound(new { message = "Project not found." });

        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Task title is required." });

        if (request.AssignedUserId.HasValue)
        {
            var userExists = await _db.Users.AnyAsync(
                u => u.Id == request.AssignedUserId.Value);

            if (!userExists)
                return BadRequest(new { message = "Assigned user not found." });
        }

        var task = new TaskItem
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Priority = request.Priority,
            DueDate = request.DueDate,
            AssignedUserId = request.AssignedUserId,
            ProjectId = projectId,
            Status = TaskFlow.Domain.Enums.TaskStatus.Todo
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        return Ok(task);
    }

    // PUT /api/tasks/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTask(
        Guid id,
        TaskRequest request)
    {
        var task = await _db.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(
                t => t.Id == id &&
                     t.Project.OwnerId == CurrentUserId);

        if (task is null)
            return NotFound();

        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Task title is required." });

        task.Title = request.Title.Trim();
        task.Description = request.Description?.Trim();
        task.Priority = request.Priority;
        task.DueDate = request.DueDate;
        task.AssignedUserId = request.AssignedUserId;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // PATCH /api/tasks/{id}/status
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        UpdateTaskStatusRequest request)
    {
        var task = await _db.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(
                t => t.Id == id &&
                     t.Project.OwnerId == CurrentUserId);

        if (task is null)
            return NotFound();

        task.Status = request.Status;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            task.Id,
            task.Status
        });
    }

    // DELETE /api/tasks/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var task = await _db.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(
                t => t.Id == id &&
                     t.Project.OwnerId == CurrentUserId);

        if (task is null)
            return NotFound();

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}