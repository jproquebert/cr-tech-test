using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Repositories
{
    public static class RepositoryFactory
    {
        public static TaskRepository CreateTaskRepository(string connectionString)
        {
            return new TaskRepository(connectionString);
        }
    }
}