namespace TaskFlow.Application.DTOs.Tasks;

public class UpdateTaskStatusRequest
{
    public TaskFlow.Domain.Enums.TaskStatus Status { get; set; }
}