import { createContext, useState } from "react";
import React from "react";

const AuthContext = createContext({
  auth: { accessToken: "", user: "" },
  setAuth: (data: { accessToken: string; user: string }) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<{ accessToken: string; user: string }>({
    accessToken: "",
    user: "",
  });
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
