namespace TaskFlow.Application.DTOs.Projects;

public class ProjectRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}