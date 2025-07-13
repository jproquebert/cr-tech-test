using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services.Interfaces
{
    public interface ITaskService
    {
        Task<List<TaskItem>> GetTasksAsync(List<string>? statuses = null);
        Task<TaskItem?> GetTaskByIdAsync(Guid id);
        Task<TaskItem> CreateTaskAsync(CreateTaskDto task);
        Task<TaskItem?> UpdateTaskAsync(TaskItem task);
        Task<bool> DeleteTaskAsync(Guid id);
        Task<List<TaskItem>> SearchTasksAsync(string? searchText);
    }
}
