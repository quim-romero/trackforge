import { useState } from "react"
import { useUserStore } from "../store/useUserStore"
import { useThemeStore } from "../store/useThemeStore"
import { useSettingsStore } from "../store/useSettingsStore"
import { motion } from "framer-motion"

export default function Profile() {
  const { name } = useUserStore()
  const { theme } = useThemeStore()
  const density = useSettingsStore((state) => state.density)
  const animations = useSettingsStore((state) => state.animations)

  const padding = density === "compact" ? "p-3" : "p-6"
  const spacing = density === "compact" ? "space-y-3" : "space-y-6"
  const textSize = density === "compact" ? "text-sm" : "text-base"
  const labelSize = density === "compact" ? "text-xs" : "text-sm"

  const content = (
    <div className={`${spacing} max-w-lg`}>
      <header>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Profile</h2>
        <p className={`${labelSize} text-gray-500 dark:text-gray-400`}>
          Manage your personal preferences.
        </p>
      </header>
    </div>
  )

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
  )
}
