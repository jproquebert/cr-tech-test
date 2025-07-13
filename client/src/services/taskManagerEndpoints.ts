import { useSelector } from "react-redux";
import type { CreateTaskDto, EditTaskDto } from "../types/taskTypes";

export function useTaskManagerEndpoints() {
  const token = useSelector((state: any) => state.user.token);

  const getTasks = async (statuses?: string[] | null, searchText?: string | null) => {
    let url = "http://localhost:7011/api/tasks";
    const params: string[] = [];
    if (statuses && statuses.length > 0) {
      params.push("status=" + encodeURIComponent(statuses.join(",")));
    }
    if (searchText && searchText.length > 0) {
      params.push("searchText=" + encodeURIComponent(searchText));
    }
    if (params.length > 0) {
      url += "?" + params.join("&");
    }
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  };

  const createTask = async (task: CreateTaskDto) => {
    const res = await fetch("http://localhost:7011/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
  };

  const editTask = async (id: string, task: EditTaskDto) => {
    const res = await fetch(`http://localhost:7011/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Title: task.Title,
        Description: task.Description,
        DueDate: task.DueDate,
        Status: task.Status,
        AssignedTo: task.AssignedTo,
      }),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  };

  const deleteTask = async (id: string) => {
    const res = await fetch(`http://localhost:7011/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete task");
    
    // Only try to parse JSON if there's content
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    }
    return { success: true }; // Default success response
  };

  return { getTasks, createTask, editTask, deleteTask };
}
