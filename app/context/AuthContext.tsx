"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useContext } from "react";
import { MySession } from "../types";
interface AuthContextProps {
  children: React.ReactNode;
}

export default ({ children }: AuthContextProps) => {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
};

type AuthContextValue = {
  data: MySession | null;
  status: "authenticated" | "loading" | "unauthenticated";
};
const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  data: null,
});
export const useAuth = () => {
  return useContext(AuthContext);
};
const AuthProvider = ({ children }: AuthContextProps) => {
  const session = useSession();
  
  return (
    <AuthContext.Provider
      value={{
        status: session.status,
        data: session.data,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
