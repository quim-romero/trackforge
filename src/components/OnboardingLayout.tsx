import { Link, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function OnboardingLayout() {
  const location = useLocation();
  const showBackLink =
    location.pathname !== "/" && location.pathname !== "/about";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-brand hover:opacity-90"
        >
          TrackForge
        </Link>
        <nav className="flex gap-4 items-center text-sm">
          <Link
            to="/about"
            className="text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition"
          >
            About
          </Link>
          <Link
            to="/login"
            className="text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition"
          >
            Login
          </Link>
          <ThemeToggle />
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Outlet />
      </main>
      <footer className="text-xs text-center text-gray-400 py-4">
        {showBackLink && (
          <Link to="/" className="hover:underline text-brand">
            ← Back to home
          </Link>
        )}
        <div className="mt-2">
          © {new Date().getFullYear()} TrackForge. Built for clarity.
        </div>
      </footer>
    </div>
  );
}
