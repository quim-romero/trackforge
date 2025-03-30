import { useAuthStore } from "../store/useAuthStore";

export function useAuth() {
  const { user, setUser } = useAuthStore();

  const logout = async () => {
    localStorage.removeItem("demo-user");
    setUser(null);
  };

  return {
    user,
    loading: user === undefined,
    logout,
    setUser,
  };
}
