// src/components/Login.tsx
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";

export function LoginButton() {
  const { instance } = useMsal();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const email = useSelector((state: any) => state.user.email);

  const login = async () => {
    const result = await instance.loginPopup({
      ...loginRequest,
      prompt: "select_account",
    });
    const { accessToken, account } = result;
    const user = {
      email: account.username,
      name: account.name,
      token: accessToken,
    };
    localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
    dispatch(setUser(user));
  };

  const logout = () => {
    instance.logoutPopup();
    localStorage.removeItem("user"); // Remove from localStorage
    dispatch(setUser({ email: "", name: "", token: "" }));
  };

  if (email) {
    return (
      <div className="flex flex-col items-start gap-2 w-full">
        <span
          className="truncate w-full px-2 py-1 rounded bg-gray-800 text-gray-200"
          title={email}
        >
          <strong>{email}</strong>
        </span>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold shadow text-xs mt-1"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
    >
      Login with Microsoft
    </button>
  );
}
