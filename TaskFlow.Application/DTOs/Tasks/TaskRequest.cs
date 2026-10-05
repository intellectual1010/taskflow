using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.DTOs.Tasks;

public class TaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public DateTime? DueDate { get; set; }
    public Guid? AssignedUserId { get; set; }
}