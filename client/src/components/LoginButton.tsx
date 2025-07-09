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

  if (email) {
    return (
      <span className="text-gray-200">
        Logged in as: <strong>{email}</strong>
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
