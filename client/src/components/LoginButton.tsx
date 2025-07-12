// src/components/Login.tsx
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";

export function LoginButton() {
  const { instance } = useMsal();
  const dispatch = useDispatch();
  const email = useSelector((state: any) => state.user.email);

  const login = async () => {
    const result = await instance.loginPopup(loginRequest);
    const { accessToken, account } = result;
    dispatch(
      setUser({
        email: account.username,
        name: account.name,
        token: accessToken,
      })
    );
  };

  const logout = () => {
    instance.logoutPopup();
    dispatch(setUser({ email: "", name: "", token: "" }));
  };

  if (email) {
    return (
      <span className="flex flex-wrap items-center gap-2 text-gray-200 w-full">
        <span className="break-all max-w-[10rem]">{/* limit width for long emails */}
          Logged in as: <strong>{email}</strong>
        </span>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold shadow text-xs"
        >
          Log out
        </button>
      </span>
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
