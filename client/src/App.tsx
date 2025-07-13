import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setUser } from "./store/userSlice";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTaskManagerEndpoints } from "./services/taskManagerEndpoints";
import type { Task } from "./types/taskTypes";
import { TaskCard } from "./components/TaskCard";
import { AddTaskModal } from "./components/AddTaskModal";
import { EditTaskModal } from "./components/EditTaskModal";
import { DeleteTaskModal } from "./components/DeleteTaskModal";
import { HiMenu } from "react-icons/hi";

function App() {
  const email = useSelector((state: any) => state.user.email);
  const dispatch = useDispatch();
  const { instance, accounts } = useMsal();
  const { getTasks, deleteTask: deleteTaskEndpoint } = useTaskManagerEndpoints();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[] | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    // Restore user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch(setUser(user));
    }

    // Try to acquire token if MSAL account exists
    if (accounts && accounts.length > 0) {
      const account = accounts[0];
      instance
        .acquireTokenSilent({ ...loginRequest, account })
        .then((result) => {
          dispatch(
            setUser({
              email: account.username,
              name: account.name,
              token: result.accessToken,
            })
          );
          setUserLoaded(true); // Set loaded after token is set
        })
        .catch(() => {
          setUserLoaded(true); // Even if token fails, allow UI to show
        });
    } else {
      setUserLoaded(true); // No accounts, allow UI to show
    }
  }, [dispatch, instance, accounts]);

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks", statusFilter],
    queryFn: () => getTasks(statusFilter),
    enabled: !!email && userLoaded, // Only fetch after user is loaded and email is present
  });

  const handleDeleteTask = async () => {
    if (!deleteTask) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteTaskEndpoint(deleteTask.Id);
      setDeleteTask(null);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (err) {
      setDeleteError("Failed to delete task.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-row relative">
      {/* Burger menu for mobile */}
      <button
        className="fixed top-4 left-4 z-50 sm:hidden bg-gray-900 p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <HiMenu className="text-2xl text-blue-400" />
      </button>

      {/* Sidebar */}
      <Sidebar
        email={email}
        onAddTask={() => setShowAddModal(true)}
        onStatusFilterChange={setStatusFilter}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className={`flex-1 overflow-y-auto flex flex-col items-center justify-center w-full px-2 sm:px-0 transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none sm:blur-0 sm:pointer-events-auto" : ""}`}>
        <div className="w-full max-w-2xl rounded-xl shadow-xl bg-black p-4 sm:p-8">
          {!email ? (
            <div className="text-center text-lg text-blue-300 py-12">
              Please log in to view your tasks.
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center w-full h-40">
              <span className="text-blue-300 animate-pulse text-lg">
                Loading tasks...
              </span>
            </div>
          ) : isError ? (
            <div className="text-red-400">Failed to load tasks.</div>
          ) : (
            <ul className="w-full animate-fade-in">
              {tasks?.map((task: Task) => (
                <li key={task.Id} className="w-full">
                  <TaskCard
                    task={task}
                    onEdit={setEditTask}
                    onDelete={setDeleteTask}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      {showAddModal && (
        <AddTaskModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onTaskCreated={() => {
            setShowAddModal(false);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
          }}
        />
      )}
      {editTask && (
        <EditTaskModal
          open={!!editTask}
          id={editTask.Id}
          task={editTask}
          onClose={() => setEditTask(null)}
          onTaskUpdated={() => {
            setEditTask(null);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
          }}
        />
      )}
      <DeleteTaskModal
        open={!!deleteTask}
        taskTitle={deleteTask?.Title || ""}
        onDelete={handleDeleteTask}
        onClose={() => setDeleteTask(null)}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
}

export default App;
