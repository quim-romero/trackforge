import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  User,
  Settings,
  Briefcase,
  Users,
} from "lucide-react";
import { useBusinessStore } from "../store/useBusinessStore";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/stats", label: "Stats", icon: BarChart2 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export default function Sidebar({ className = "", onNavigate }: SidebarProps) {
  const { businessMode } = useBusinessStore();

  const businessLinks = businessMode
    ? [
        { to: "/clients", label: "Clients", icon: Users },
        { to: "/projects", label: "Projects", icon: Briefcase },
      ]
    : [];

  const allLinks = [...links, ...businessLinks];

  return (
    <aside
      className={`w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4 ${className}`}
    >
      <NavLink
        to="/dashboard"
        className="text-2xl font-bold mb-8 text-brand hover:opacity-90 transition"
      >
        TrackForge
      </NavLink>

      <nav className="flex flex-col gap-2">
        {allLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-brand text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
