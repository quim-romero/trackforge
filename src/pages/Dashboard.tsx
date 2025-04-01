import { useSettingsStore } from "../store/useSettingsStore"
import { motion } from "framer-motion"

export default function Dashboard() {
  const density = useSettingsStore((state) => state.density)
  const animationsEnabled = useSettingsStore((state) => state.animations)

  const padding = density === "compact" ? "p-2" : "p-6"
  const gap = density === "compact" ? "gap-2" : "gap-6"
  const textSize = density === "compact" ? "text-xs" : "text-base"
  const spacing = density === "compact" ? "space-y-2" : "space-y-8"

  const content = (
    <div className={spacing}>
      <header>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back 👋
        </h2>
        <p className={`${textSize} text-gray-600 dark:text-gray-400 mt-1`}>
          A quick overview of your performance.
        </p>
      </header>
    </div>
  )

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
  )
}
