import { LoginButton } from "./LoginButton";
import { HiPlus, HiX } from "react-icons/hi";

interface SidebarProps {
  email: string;
  onAddTask: () => void;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  email,
  onAddTask,
  open = false,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={`z-50 fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-blue-700 shadow-2xl flex flex-col items-center py-8 px-4 rounded-r-2xl transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} sm:static sm:translate-x-0`}
      style={{ maxWidth: "100vw" }}
    >
      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 sm:hidden text-blue-400 bg-gray-800 p-3 rounded-full z-50"
        style={{ minWidth: "44px", minHeight: "44px" }}
        onClick={() => {
          if (onClose) onClose();
        }}
        aria-label="Close sidebar"
      >
        <HiX className="text-2xl" />
      </button>
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
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow transition mb-6 w-full justify-center"
          onClick={onAddTask}
        >
          <HiPlus className="text-xl" />
          Add Task
        </button>
      )}
    </aside>
  );
}
