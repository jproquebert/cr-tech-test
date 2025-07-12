using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Text.Json;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;
using TaskManagerAPI.Services.Implementations;
using TaskManagerAPI.Services.Interfaces;

namespace TaskManagerAPI.Functions;

public class TaskFunction
{
    private readonly ILogger<TaskFunction> _logger;
    private readonly ITaskService _taskService;

    public TaskFunction(ILogger<TaskFunction> logger, ITaskService taskService)
    {
        _logger = logger;
        _taskService = taskService;
    }

    [Function("GetTasks")]
    [OpenApiOperation("GetTasks", tags: new[] { "Task" })]
    [OpenApiParameter("status", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Comma-separated list of statuses to filter")]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "application/json", typeof(List<TaskItem>), Description = "List of all tasks")]
    public async Task<HttpResponseData> GetTasks(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "tasks")] HttpRequestData req)
    {
        var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
        var statusParam = query.Get("status");
        List<string>? statuses = null;
        if (!string.IsNullOrWhiteSpace(statusParam))
            statuses = statusParam.Split(',').Select(s => s.Trim().ToLower()).ToList();

        var tasks = await _taskService.GetTasksAsync(statuses);
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(tasks);
        return response;
    }

    [Function("GetTaskById")]
    [OpenApiOperation("GetTaskById", tags: new[] { "Task" })]
    [OpenApiParameter("id", In = ParameterLocation.Path, Required = true, Type = typeof(Guid), Description = "Task ID")]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "application/json", typeof(TaskItem), Description = "Task found")]
    [OpenApiResponseWithoutBody(HttpStatusCode.NotFound, Description = "Task not found")]
    public async Task<HttpResponseData> GetTaskById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "tasks/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);
        var response = req.CreateResponse(task is null ? HttpStatusCode.NotFound : HttpStatusCode.OK);
        if (task != null)
            await response.WriteAsJsonAsync(task);
        return response;
    }

    [Function("CreateTask")]
    [OpenApiOperation("CreateTask", tags: new[] { "Task" })]
    [OpenApiRequestBody("application/json", typeof(TaskItem), Description = "New task object")]
    [OpenApiResponseWithBody(HttpStatusCode.Created, "application/json", typeof(TaskItem), Description = "Task successfully created")]
    [OpenApiResponseWithoutBody(HttpStatusCode.BadRequest, Description = "Invalid request payload")]
    public async Task<HttpResponseData> CreateTask(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "tasks")] HttpRequestData req)
    {
        var body = await JsonSerializer.DeserializeAsync<CreateTaskDto>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var created = await _taskService.CreateTaskAsync(body);
        var response = req.CreateResponse(HttpStatusCode.Created);
        await response.WriteAsJsonAsync(created);
        return response;
    }

    [Function("UpdateTask")]
    [OpenApiOperation("UpdateTask", tags: new[] { "Task" })]
    [OpenApiParameter("id", In = ParameterLocation.Path, Required = true, Type = typeof(Guid), Description = "Task ID to update")]
    [OpenApiRequestBody("application/json", typeof(UpdateTaskDto), Description = "Updated task fields")]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "application/json", typeof(TaskItem), Description = "Task successfully updated")]
    [OpenApiResponseWithoutBody(HttpStatusCode.BadRequest, Description = "Invalid task or mismatched ID")]
    [OpenApiResponseWithoutBody(HttpStatusCode.NotFound, Description = "Task not found")]
    public async Task<HttpResponseData> UpdateTask(
    [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "tasks/{id:guid}")] HttpRequestData req,
    Guid id)
    {
        // Define a DTO for allowed update fields
        var updateDto = await JsonSerializer.DeserializeAsync<UpdateTaskDto>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (updateDto is null)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        // Fetch the existing task
        var existingTask = await _taskService.GetTaskByIdAsync(id);
        if (existingTask is null)
            return req.CreateResponse(HttpStatusCode.NotFound);

        // Update only allowed fields
        existingTask.Title = updateDto.Title;
        existingTask.Description = updateDto.Description;
        existingTask.DueDate = updateDto.DueDate;
        existingTask.Status = updateDto.Status;
        existingTask.AssignedTo = updateDto.AssignedTo;

        var result = await _taskService.UpdateTaskAsync(existingTask);
        if (result == null)
            return req.CreateResponse(HttpStatusCode.NotFound);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(result);
        return response;
    }

    [Function("DeleteTask")]
    [OpenApiOperation("DeleteTask", tags: new[] { "Task" })]
    [OpenApiParameter("id", In = ParameterLocation.Path, Required = true, Type = typeof(Guid), Description = "Task ID to delete")]
    [OpenApiResponseWithoutBody(HttpStatusCode.NoContent, Description = "Task successfully deleted")]
    [OpenApiResponseWithoutBody(HttpStatusCode.NotFound, Description = "Task not found")]
    public async Task<HttpResponseData> DeleteTask(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "tasks/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        var result = await _taskService.DeleteTaskAsync(id);

        if (result == null)
            return req.CreateResponse(HttpStatusCode.NotFound);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(result);

        return response;
    }
}
