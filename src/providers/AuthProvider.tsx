import { createContext, useContext, type ReactNode } from "react";
import { useCurrentUser } from "../api";
import type { User } from "../types";

type AuthContextType = {
  user: User | undefined;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useCurrentUser();

  if (!isLoading && !data) {
    const redirectUri = encodeURIComponent(window.location.href);
    window.location.href = `https://localhost:5413/login?redirect_uri=${redirectUri}`;
    return null;
  }

  return (
    <AuthContext.Provider value={{ user: data, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
