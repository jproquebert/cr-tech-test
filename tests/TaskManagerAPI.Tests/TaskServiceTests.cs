using Xunit;
using Moq;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;
using TaskManagerAPI.Services.Implementations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TaskManagerAPI.Tests
{
    public class TaskServiceTests
    {
        [Fact]
        public async Task GetTasksAsync_ReturnsTasks()
        {
            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(r => r.GetTasksAsync(null, null))
                .ReturnsAsync(new List<TaskItem> {
                    new TaskItem { Id = Guid.NewGuid(), Title = "Test", Status = "pending", CreatedBy = "user", AssignedTo = "user", CreatedAt = DateTime.UtcNow }
                });

            var service = new TaskService(mockRepo.Object);

            var result = await service.GetTasksAsync();

            Assert.Single(result);
            Assert.Equal("Test", result[0].Title);
        }

        [Fact]
        public async Task GetTaskByIdAsync_ReturnsTask_WhenExists()
        {
            var id = Guid.NewGuid();
            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(r => r.GetTaskByIdAsync(id))
                .ReturnsAsync(new TaskItem { Id = id, Title = "Test", Status = "pending", CreatedBy = "user", AssignedTo = "user", CreatedAt = DateTime.UtcNow });

            var service = new TaskService(mockRepo.Object);

            var result = await service.GetTaskByIdAsync(id);

            Assert.NotNull(result);
            Assert.Equal(id, result.Id);
        }

        [Fact]
        public async Task GetTaskByIdAsync_ReturnsNull_WhenNotExists()
        {
            var id = Guid.NewGuid();
            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(r => r.GetTaskByIdAsync(id)).ReturnsAsync((TaskItem?)null);

            var service = new TaskService(mockRepo.Object);

            var result = await service.GetTaskByIdAsync(id);

            Assert.Null(result);
        }

        [Fact]
        public async Task CreateTaskAsync_ReturnsCreatedTask()
        {
            var dto = new CreateTaskDto
            {
                Title = "New Task",
                Description = "Desc",
                DueDate = DateTime.UtcNow.AddDays(1),
                Status = "pending",
                CreatedBy = "user",
                AssignedTo = "user"
            };
            var created = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate,
                Status = dto.Status,
                CreatedBy = dto.CreatedBy,
                AssignedTo = dto.AssignedTo,
                CreatedAt = DateTime.UtcNow
            };

            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(r => r.CreateTaskAsync(dto)).ReturnsAsync(created);

            var service = new TaskService(mockRepo.Object);

            var result = await service.CreateTaskAsync(dto);

            Assert.NotNull(result);
            Assert.Equal(dto.Title, result.Title);
        }

        [Fact]
        public async Task UpdateTaskAsync_ReturnsUpdatedTask()
        {
            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Updated",
                Description = "Desc",
                DueDate = DateTime.UtcNow.AddDays(1),
                Status = "done",
                CreatedBy = "user",
                AssignedTo = "user",
                CreatedAt = DateTime.UtcNow
            };

            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(r => r.UpdateTaskAsync(task)).ReturnsAsync(task);

            var service = new TaskService(mockRepo.Object);

            var result = await service.UpdateTaskAsync(task);

            Assert.NotNull(result);
            Assert.Equal("Updated", result.Title);
        }

        [Fact]
        public async Task DeleteTaskAsync_ReturnsTrue_WhenDeleted()
        {
            var id = Guid.NewGuid();
            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(r => r.DeleteTaskAsync(id)).ReturnsAsync(true);

            var service = new TaskService(mockRepo.Object);

            var result = await service.DeleteTaskAsync(id);

            Assert.True(result);
        }

        [Fact]
        public async Task DeleteTaskAsync_ReturnsFalse_WhenNotFound()
        {
            var id = Guid.NewGuid();
            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(r => r.DeleteTaskAsync(id)).ReturnsAsync(false);

            var service = new TaskService(mockRepo.Object);

            var result = await service.DeleteTaskAsync(id);

            Assert.False(result);
        }
    }
}