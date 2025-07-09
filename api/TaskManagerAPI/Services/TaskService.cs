using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services.Interfaces;

namespace TaskManagerAPI.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly string _connectionString;
        private readonly HttpClient _httpClient;

        public TaskService(HttpClient client)
        {
            _connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
            _httpClient = client;
        }

        public async Task<List<TaskItem>> GetTasksAsync()
        {
            var tasks = new List<TaskItem>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            var cmd = new SqlCommand("SELECT * FROM Tasks", conn);
            var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                tasks.Add(new TaskItem
                {
                    Id = reader.GetGuid(0),
                    Title = reader.GetString(1),
                    Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    DueDate = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    Status = reader.GetString(4),
                    CreatedBy = reader.GetString(5),
                    AssignedTo = reader.GetString(6),
                    CreatedAt = reader.GetDateTime(7)
                });
            }

            return tasks;
        }

        public async Task<TaskItem?> GetTaskByIdAsync(Guid id)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            var cmd = new SqlCommand("SELECT * FROM Tasks WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new TaskItem
                {
                    Id = reader.GetGuid(0),
                    Title = reader.GetString(1),
                    Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    DueDate = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    Status = reader.GetString(4),
                    CreatedBy = reader.GetString(5),
                    AssignedTo = reader.GetString(6),
                    CreatedAt = reader.GetDateTime(7)
                };
            }

            return null;
        }

        public async Task<TaskItem> CreateTaskAsync(TaskItem task)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var newId = Guid.NewGuid();
            task.Id = newId; // assign generated Id to the task object

            var cmd = new SqlCommand(@"
        INSERT INTO Tasks (Id, Title, Description, DueDate, Status, CreatedBy, AssignedTo, CreatedAt)
        VALUES (@Id, @Title, @Description, @DueDate, @Status, @CreatedBy, @AssignedTo, @CreatedAt)", conn);

            cmd.Parameters.AddWithValue("@Id", newId);
            cmd.Parameters.AddWithValue("@Title", task.Title);
            cmd.Parameters.AddWithValue("@Description", (object?)task.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DueDate", (object?)task.DueDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", task.Status);
            cmd.Parameters.AddWithValue("@CreatedBy", task.CreatedBy);
            cmd.Parameters.AddWithValue("@AssignedTo", task.AssignedTo);
            cmd.Parameters.AddWithValue("@CreatedAt", task.CreatedAt);

            await cmd.ExecuteNonQueryAsync();

            return task;
        }


        public async Task<TaskItem?> UpdateTaskAsync(TaskItem task)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var updateCmd = new SqlCommand(@"
        UPDATE Tasks
        SET Title = @Title,
            Description = @Description,
            DueDate = @DueDate,
            Status = @Status,
            AssignedTo = @AssignedTo
        WHERE Id = @Id", conn);

            updateCmd.Parameters.AddWithValue("@Id", task.Id);
            updateCmd.Parameters.AddWithValue("@Title", task.Title);
            updateCmd.Parameters.AddWithValue("@Description", (object?)task.Description ?? DBNull.Value);
            updateCmd.Parameters.AddWithValue("@DueDate", (object?)task.DueDate ?? DBNull.Value);
            updateCmd.Parameters.AddWithValue("@Status", task.Status);
            updateCmd.Parameters.AddWithValue("@AssignedTo", task.AssignedTo);

            var rowsAffected = await updateCmd.ExecuteNonQueryAsync();
            if (rowsAffected == 0) return null;

            // Fetch and return the updated task
            var getCmd = new SqlCommand("SELECT * FROM Tasks WHERE Id = @Id", conn);
            getCmd.Parameters.AddWithValue("@Id", task.Id);

            var reader = await getCmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new TaskItem
                {
                    Id = reader.GetGuid(0),
                    Title = reader.GetString(1),
                    Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    DueDate = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    Status = reader.GetString(4),
                    CreatedBy = reader.GetString(5),
                    AssignedTo = reader.GetString(6),
                    CreatedAt = reader.GetDateTime(7)
                };
            }

            return null;
        }


        public async Task<bool> DeleteTaskAsync(Guid id)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new SqlCommand("DELETE FROM Tasks WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

    }
}
