// src/authConfig.ts
export const msalConfig = {
  auth: {
    clientId: "dc4461c9-e917-4c33-b840-c4f859722768",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "localStorage", // Persist tokens across tabs and reloads
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};
