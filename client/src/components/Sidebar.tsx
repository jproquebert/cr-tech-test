import { useState } from "react";
import { LoginButton } from "./LoginButton";
import { HiPlus } from "react-icons/hi";
import { StatusFilterBubbles } from "./StatusFilterBubbles";

interface SidebarProps {
  email: string;
  onAddTask: () => void;
  onStatusFilterChange?: (status: string[] | null) => void;
}

const statusOptions = [
  { label: "Pending", value: "pending", color: "bg-yellow-500" },
  { label: "In Progress", value: "inprogress", color: "bg-blue-500" },
  { label: "Done", value: "done", color: "bg-green-500" },
];

export function Sidebar({
  email,
  onAddTask,
  onStatusFilterChange,
}: SidebarProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleStatusClick = (status: string) => {
    let newStatuses;
    if (selectedStatuses.includes(status)) {
      newStatuses = selectedStatuses.filter((s) => s !== status);
    } else {
      newStatuses = [...selectedStatuses, status];
    }
    setSelectedStatuses(newStatuses);
    if (onStatusFilterChange)
      onStatusFilterChange(newStatuses.length ? newStatuses : null);
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-blue-700 shadow-2xl flex flex-col items-center py-8 px-4 sticky top-0 left-0 rounded-r-2xl">
      {/* App Title */}
      <div className="text-3xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text text-transparent drop-shadow">
        Task Management
      </div>
      <hr className="border-blue-800 w-3/4 mb-6" />
      {/* Login Info */}
      <div className="mb-6 w-full flex flex-col items-center">
        <LoginButton />
      </div>
      {/* Add Task Button */}
      {email && (
        <>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow transition mb-4 w-full justify-center"
            onClick={onAddTask}
          >
            <HiPlus className="text-xl" />
            Add Task
          </button>
          {/* Status Filter Bubbles */}
          <div className="w-full flex flex-col items-center mb-4">
            <span className="text-sm text-blue-300 font-semibold mb-2 text-center">
              Select one or more bubbles below to filter tasks by status:
            </span>
            <StatusFilterBubbles
              options={statusOptions}
              selected={selectedStatuses}
              onSelect={handleStatusClick}
            />
          </div>
        </>
      )}
    </aside>
  );
}
