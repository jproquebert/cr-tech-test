using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;

namespace TaskManagerAPI;

public class TaskFunction
{
    private readonly ILogger<TaskFunction> _logger;
    private readonly TaskService _taskService;

    public TaskFunction(ILogger<TaskFunction> logger, TaskService taskService)
    {
        _logger = logger;
        _taskService = taskService;
    }

    [Function("GetTasks")]
    public async Task<HttpResponseData> GetTasks(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "tasks")] HttpRequestData req)
    {
        var tasks = await _taskService.GetTasksAsync();
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(tasks);
        return response;
    }

    [Function("GetTaskById")]
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
    public async Task<HttpResponseData> CreateTask(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "tasks")] HttpRequestData req)
    {
        var body = await JsonSerializer.DeserializeAsync<TaskItem>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        await _taskService.CreateTaskAsync(body);
        var response = req.CreateResponse(HttpStatusCode.Created);
        await response.WriteAsJsonAsync(body);
        return response;
    }

    [Function("UpdateTask")]
    public async Task<HttpResponseData> UpdateTask(
    [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "tasks/{id:guid}")] HttpRequestData req,
    Guid id)
    {
        var updatedTask = await JsonSerializer.DeserializeAsync<TaskItem>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (updatedTask is null || id != updatedTask.Id)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var result = await _taskService.UpdateTaskAsync(updatedTask);
        if (result == null)
            return req.CreateResponse(HttpStatusCode.NotFound);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(result);
        return response;
    }


    [Function("DeleteTask")]
    public async Task<HttpResponseData> DeleteTask(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "tasks/{id:guid}")] HttpRequestData req,
        Guid id)
    {
        var success = await _taskService.DeleteTaskAsync(id);
        return req.CreateResponse(success ? HttpStatusCode.NoContent : HttpStatusCode.NotFound);
    }
}
