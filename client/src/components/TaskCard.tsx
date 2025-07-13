import type { Task } from "../types/taskTypes";
import { HiPencil, HiTrash } from "react-icons/hi";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "border-yellow-400 bg-yellow-900/40 text-yellow-300";
    case "inprogress":
      return "border-blue-400 bg-blue-900/40 text-blue-300";
    case "done":
      return "border-green-400 bg-green-900/40 text-green-300";
    default:
      return "border-gray-500 bg-gray-800/80 text-gray-200";
  }
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusColor = getStatusColor(task.Status);

  return (
    <div
      className={`relative rounded-2xl p-5 sm:p-7 mb-6 shadow-2xl flex flex-col border-l-8 transition-transform hover:scale-[1.02] hover:shadow-3xl backdrop-blur-lg bg-opacity-90 ${statusColor}`}
    >
      <div className="flex mb-3 gap-2">
        <div className="w-1/2 flex items-center justify-start rounded-lg">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            {task.Title}
          </h3>
        </div>
        <div className="w-1/2 flex items-center justify-end gap-2 rounded-lg">
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow ${statusColor.split(" ")[2]}`}
            style={{ minWidth: "90px", textAlign: "center" }}
          >
            {task.Status}
          </span>
          <button
            className="ml-2 p-2 rounded-full bg-gray-800 hover:bg-blue-600 text-blue-300 hover:text-white transition cursor-pointer"
            title="Edit Task"
            onClick={() => onEdit && onEdit(task)}
          >
            <HiPencil className="text-lg" />
          </button>
          <button
            className="ml-2 p-2 rounded-full bg-gray-800 hover:bg-red-600 text-red-300 hover:text-white transition cursor-pointer"
            title="Delete Task"
            onClick={() => onDelete && onDelete(task)}
          >
            <HiTrash className="text-lg" />
          </button>
        </div>
      </div>
      <p className="text-gray-200 mb-4 italic">
        {task.Description || "No description"}
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap text-sm gap-2 sm:gap-6 mb-3">
        {task.DueDate && (
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-blue-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7V3M16 7V3M4 11H20M4 19H20M4 15H20" />
            </svg>
            <span className="font-semibold">Due:</span>
            <span>{new Date(task.DueDate).toLocaleDateString()}</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4 text-green-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">Assigned to:</span>
          <span>{task.AssignedTo}</span>
        </span>
      </div>
      <div className="mt-auto text-xs text-gray-400 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        Created by: <span className="font-semibold">{task.CreatedBy}</span>
        &middot; {new Date(task.CreatedAt).toLocaleString()}
      </div>
    </div>
  );
}
