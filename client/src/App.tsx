import "./App.css";
import { LoginButton } from "./components/LoginButton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "./store/userSlice";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

function App() {
  const email = useSelector((state: any) => state.user.email);
  const dispatch = useDispatch();
  const { instance, accounts } = useMsal();

  useEffect(() => {
    // Restore user info from MSAL cache if available
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
      <main className="flex flex-col items-center justify-center mt-12">
        {/* Add your main content here */}
      </main>
    </div>
  );
}

export default App;
