import { useAuth } from "../auth/useAuth";
export default function GuestLoginButton() {
  const { setUser } = useAuth();
  const loginAsGuest = () => {
    const guest = { id: "guest", email: "guest@demo.local", name: "Guest" };
    localStorage.setItem("demo-user", JSON.stringify(guest));
    setUser(guest);
  };
  return (
    <button onClick={loginAsGuest} className="btn btn-ghost w-full">
      Enter as a guest
    </button>
  );
}
