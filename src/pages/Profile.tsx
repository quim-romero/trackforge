import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useThemeStore } from "../store/useThemeStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { motion } from "framer-motion";

export default function Profile() {
  const { name, setName } = useUserStore();
  const { theme } = useThemeStore();
  const density = useSettingsStore((state) => state.density);
  const animations = useSettingsStore((state) => state.animations);

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const padding = density === "compact" ? "p-3" : "p-6";
  const spacing = density === "compact" ? "space-y-3" : "space-y-6";
  const textSize = density === "compact" ? "text-sm" : "text-base";
  const labelSize = density === "compact" ? "text-xs" : "text-sm";
  const inputPadding =
    density === "compact" ? "px-2 py-1 text-sm" : "px-3 py-2 text-sm";

  const handleSave = () => {
    if (newName.trim()) {
      setName(newName.trim());
      setEditing(false);
    }
  };

  const content = (
    <div className={`${spacing} max-w-lg`}>
      <header>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Profile
        </h2>
        <p className={`${labelSize} text-gray-500 dark:text-gray-400`}>
          Manage your personal preferences.
        </p>
      </header>

      <section
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${padding} ${spacing}`}
      >
        <div>
          <label
            className={`${labelSize} font-medium text-gray-700 dark:text-gray-300`}
          >
            Display Name
          </label>
          <div className="mt-2 flex gap-2 items-center">
            {editing ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`flex-1 border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand outline-none ${inputPadding}`}
                />
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-brand text-white rounded-md hover:bg-brand-dark transition"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  className={`text-gray-900 dark:text-gray-100 ${textSize}`}
                >
                  {name}
                </span>
                <button
                  onClick={() => setEditing(true)}
                  className={`${labelSize} text-brand hover:underline`}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <label
            className={`${labelSize} font-medium text-gray-700 dark:text-gray-300`}
          >
            Current Theme
          </label>
          <p
            className={`${labelSize} mt-1 text-gray-600 dark:text-gray-400 capitalize`}
          >
            {theme}
          </p>
        </div>
      </section>
    </div>
  );

  return animations ? (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
}
