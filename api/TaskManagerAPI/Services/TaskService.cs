using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;
using TaskManagerAPI.Services.Interfaces;

namespace TaskManagerAPI.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly TaskRepository _repository;

        public TaskService(TaskRepository repository)
        {
            _repository = repository;
        }

        public Task<List<TaskItem>> GetTasksAsync(List<string>? statuses = null, string? searchText = null)
            => _repository.GetTasksAsync(statuses, searchText);

        public Task<TaskItem?> GetTaskByIdAsync(Guid id)
            => _repository.GetTaskByIdAsync(id);

        public Task<TaskItem> CreateTaskAsync(CreateTaskDto task)
            => _repository.CreateTaskAsync(task);

        public Task<TaskItem?> UpdateTaskAsync(TaskItem task)
            => _repository.UpdateTaskAsync(task);

        public Task<bool> DeleteTaskAsync(Guid id)
            => _repository.DeleteTaskAsync(id);
    }
}
