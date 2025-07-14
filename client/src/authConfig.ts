// src/authConfig.ts
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID ,
    authority: import.meta.env.VITE_AZURE_AUTHORITY ,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI ,
  },
  cache: {
    cacheLocation: "localStorage", // Persist tokens across tabs and reloads
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [import.meta.env.VITE_AZURE_SCOPES ],
  prompt: "select_account",
};
