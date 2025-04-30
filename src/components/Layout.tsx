import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../auth/useAuth";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <Sidebar className="hidden md:flex" />

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <Sidebar
            className="w-64 bg-white dark:bg-gray-900 p-4"
            onNavigate={() => setIsSidebarOpen(false)}
          />
          <button
            type="button"
            aria-label="Close sidebar"
            className="flex-1 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            aria-label="Open sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700 dark:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 space-y-6">
          <div className="hidden md:flex justify-end gap-3 items-center">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
            >
              Logout
            </button>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
