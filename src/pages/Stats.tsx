import { motion } from "framer-motion";
import { useSettingsStore } from "../store/useSettingsStore";

export default function Stats() {
  const animationsEnabled = useSettingsStore((state) => state.animations);

  const content = (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Weekly rhythm.
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A visual snapshot of your recent momentum.
        </p>
      </header>
    </div>
  );

  return animationsEnabled ? (
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
