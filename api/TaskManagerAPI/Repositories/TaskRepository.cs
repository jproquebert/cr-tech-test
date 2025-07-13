using Microsoft.Data.SqlClient;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public class TaskRepository
    {
        private readonly string _connectionString;

        public TaskRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<TaskItem>> GetTasksAsync(List<string>? statuses = null, string? searchText = null)
        {
            var tasks = new List<TaskItem>();
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = "SELECT * FROM Tasks WHERE 1=1";
            var cmd = new SqlCommand();
            cmd.Connection = conn;

            if (statuses != null && statuses.Count > 0)
            {
                sql += " AND (" + string.Join(" OR ", statuses.Select((s, i) => $"LOWER(Status) = @Status{i}")) + ")";
                for (int i = 0; i < statuses.Count; i++)
                {
                    cmd.Parameters.AddWithValue($"@Status{i}", statuses[i].ToLower());
                }
            }
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                sql += " AND (Title LIKE @SearchText OR AssignedTo LIKE @SearchText)";
                cmd.Parameters.AddWithValue("@SearchText", $"%{searchText}%");
            }
            sql += " ORDER BY CreatedAt DESC";
            cmd.CommandText = sql;

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

        public async Task<TaskItem> CreateTaskAsync(CreateTaskDto task)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var newId = Guid.NewGuid();

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
            cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);

            await cmd.ExecuteNonQueryAsync();

            // Fetch and return the created object
            var getCmd = new SqlCommand("SELECT * FROM Tasks WHERE Id = @Id", conn);
            getCmd.Parameters.AddWithValue("@Id", newId);
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

            throw new Exception("Failed to fetch created task.");
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