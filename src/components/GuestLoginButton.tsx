import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function GuestLoginButton({
  className = "",
}: {
  className?: string;
}) {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const loginAsGuest = () => {
    const guest = { id: "demo-user", email: "guest@demo.local", name: "Guest" };
    localStorage.setItem("demo-user", JSON.stringify(guest));
    setUser(guest);
    navigate("/dashboard");
  };

  return (
    <button
      data-cy="guest-login"
      onClick={loginAsGuest}
      className={`btn btn-ghost w-full ${className}`}
    >
      Enter as a guest
    </button>
  );
}
