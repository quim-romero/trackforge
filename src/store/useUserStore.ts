import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState {
  name: string
  setName: (newName: string) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "High Performer",
      setName: (newName) => set({ name: newName }),
    }),
    {
      name: "trackforge-user",
    }
  )
)
