import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "../store/useSettingsStore";
import { useBusinessStore } from "../store/useBusinessStore";
import { useAuth } from "../auth/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const { density, animations, setDensity, toggleAnimations } =
    useSettingsStore();

  const { businessMode, toggleBusinessMode, clients, projects, loadDemoData } =
    useBusinessStore();

  useEffect(() => {
    const isDemo = user?.id === "demo-user";
    if (!isDemo) return;

    const hasBusinessData = clients.length > 0 || projects.length > 0;
    if (!hasBusinessData) loadDemoData();
    if (!businessMode) toggleBusinessMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const padding = density === "compact" ? "p-4" : "p-6";
  const gap = density === "compact" ? "space-y-4" : "space-y-6";
  const titleSize = density === "compact" ? "text-xl" : "text-2xl";
  const descriptionSize = density === "compact" ? "text-xs" : "text-sm";

  const content = (
    <div className={`${gap} max-w-xl`}>
      <header>
        <h2
          className={`${titleSize} font-semibold text-gray-900 dark:text-gray-100`}
        >
          Settings
        </h2>
        <p className={`${descriptionSize} text-gray-500 dark:text-gray-400`}>
          Customize how TrackForge behaves and feels.
        </p>
        {user?.id === "demo-user" && (
          <p className="mt-2 text-xs text-brand">
            Demo mode: Clients & Projects are preloaded automatically.
          </p>
        )}
      </header>

      <section
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${padding} ${gap}`}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            UI Density
          </label>
          <select
            value={density}
            onChange={(e) =>
              setDensity(e.target.value as "comfortable" | "compact")
            }
            className="w-full px-4 py-2 rounded-md text-sm transition border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="comfortable">Comfortable – spacious layout</option>
            <option value="compact">Compact – tighter spacing</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Animations
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable or disable transition effects.
            </p>
          </div>
          <button
            onClick={toggleAnimations}
            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
              animations
                ? "bg-brand justify-end"
                : "bg-gray-300 dark:bg-gray-600 justify-start"
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Business Mode
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable client & project management
            </p>
          </div>
          <button
            onClick={toggleBusinessMode}
            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
              businessMode
                ? "bg-brand justify-end"
                : "bg-gray-300 dark:bg-gray-600 justify-start"
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow" />
          </button>
        </div>
      </section>
    </div>
  );

  return useSettingsStore.getState().animations ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
}
