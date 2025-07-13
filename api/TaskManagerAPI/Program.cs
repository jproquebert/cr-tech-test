using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using TaskManagerAPI.Services.Interfaces;
using TaskManagerAPI.Services.Implementations;
using TaskManagerAPI.Repositories;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        var configuration = default(IConfiguration);
        configuration = new ConfigurationBuilder()
                    .AddEnvironmentVariables()
                    .Build();

        services.AddHttpClient();
        services.AddLogging();

        services.AddScoped<TaskRepository>(provider =>
        {
            var config = provider.GetRequiredService<IConfiguration>();
            var connectionString = config["SqlConnectionString"] ?? Environment.GetEnvironmentVariable("SqlConnectionString");
            return RepositoryFactory.CreateTaskRepository(connectionString);
        });
        services.AddScoped<ITaskService, TaskService>();
    })
    .Build();

host.Run();