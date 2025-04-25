import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function useAuth() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      const raw = localStorage.getItem("demo-user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setUser(parsed);
        } catch (e) {
          localStorage.removeItem("demo-user");
          if (process.env.NODE_ENV !== "production") {
            console.warn("Invalid demo-user in localStorage, removed.", e);
          }
        }
      }
    }
  }, [user, setUser]);

  const logout = async () => {
    localStorage.removeItem("demo-user");
    setUser(null);
  };

  return { user, loading: user === undefined, logout, setUser };
}
