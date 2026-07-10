"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Payload-native auth context, replacing NextAuth's SessionProvider. It fetches
// the current user from Payload's `/users/me` endpoint (which reads the session
// cookie). The `useSession` / `signIn` / `signOut` exports mirror the NextAuth
// API so existing components only need to swap the import.
const AuthContext = createContext({ user: null, status: "loading", refresh: () => {} });

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/payload-api/users/me", { credentials: "include" });
      const data = await res.json();
      setUser(data?.user || null);
      setStatus(data?.user ? "authenticated" : "unauthenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <AuthContext.Provider value={{ user, status, refresh }}>{children}</AuthContext.Provider>;
}

// NextAuth-compatible shim: returns { data: { user } | null, status }.
export function useSession() {
  const { user, status } = useContext(AuthContext);
  return { data: user ? { user } : null, status };
}

export function signIn() {
  window.location.href = "/login";
}

export async function signOut() {
  await fetch("/payload-api/users/logout", { method: "POST", credentials: "include" });
  window.location.href = "/";
}
