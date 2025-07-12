import { useSelector } from "react-redux";
import type { CreateTaskDto, EditTaskDto } from "../types/taskTypes";

export function useTaskManagerEndpoints() {
  const token = useSelector((state: any) => state.user.token);

  const getTasks = async () => {
    const res = await fetch("http://localhost:7011/api/tasks", {
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

  return { getTasks, createTask, editTask };
}
