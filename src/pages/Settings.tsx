import { useSettingsStore } from "../store/useSettingsStore"

const { setDensity, toggleAnimations, density, animations } = useSettingsStore()

<section
  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${padding} ${gap}`}
>
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      UI Density
    </label>
    <select
      value={density}
      onChange={(e) => setDensity(e.target.value as "comfortable" | "compact")}
      className="w-full px-4 py-2 rounded-md text-sm transition
        border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-brand"
    >
      <option value="comfortable">Comfortable – spacious layout</option>
      <option value="compact">Compact – tighter spacing</option>
    </select>
  </div>

  <div className="flex items-center justify-between mt-4">
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
</section>
