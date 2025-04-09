import { create } from "zustand"
import { persist } from "zustand/middleware"

type Density = "comfortable" | "compact"

interface SettingsState {
  density: Density
  animations: boolean
  setDensity: (d: Density) => void
  toggleAnimations: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      density: "comfortable",
      animations: true,
      setDensity: (d) => set({ density: d }),
      toggleAnimations: () =>
        set((state) => {
          const newValue = !state.animations

          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("no-anim", !newValue)
          }

          return { animations: newValue }
        }),
    }),
    {
      name: "trackforge-settings",
    }
  )
)
