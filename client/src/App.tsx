import "./App.css";
import { LoginButton } from "./components/LoginButton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "./store/userSlice";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useQuery } from "@tanstack/react-query";
import { useTaskManagerEndpoints } from "./services/taskManagerEndpoints";
import type { Task } from "./types/taskTypes";

function App() {
  const email = useSelector((state: any) => state.user.email);
  const dispatch = useDispatch();
  const { instance, accounts } = useMsal();
  const { getTasks } = useTaskManagerEndpoints();

  useEffect(() => {
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
        })
        .catch(() => {
          // Token might be expired or missing, do nothing
        });
    }
  }, [dispatch, instance, accounts]);

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: !!email, // Only fetch if logged in
  });

  console.log("tasks ", tasks);

  return (
    <div className="bg-black min-h-screen text-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 shadow">
        <div className="text-2xl font-bold tracking-tight">
          Task Management app!
        </div>
        <div>
          <LoginButton />
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center mt-12 w-full">
        <h2 className="text-xl mb-4">Tasks</h2>
        {isLoading && <div>Loading tasks...</div>}
        {isError && <div>Failed to load tasks.</div>}
        {tasks && (
          <ul className="w-full max-w-2xl">
            {tasks.map((task: Task) => (
              <li
                key={task.Id}
                className="bg-gray-800 rounded p-4 mb-2 shadow flex flex-col"
              >
                <p>{task.Title}</p>
                {/* Optionally show more task info here */}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
