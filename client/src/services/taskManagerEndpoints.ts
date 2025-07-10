import { useSelector } from "react-redux";

export function useTaskManagerEndpoints() {
  const token = useSelector((state: any) => state.user.token);

  const getTasks = async () => {
    const res = await fetch("http://localhost:7011/api/tasks", {
      method:"GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  };

  return { getTasks };
}
