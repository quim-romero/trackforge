import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client, Project } from '../types'

interface BusinessState {
  clients: Client[];
  projects: Project[];
  businessMode: boolean;
  addClient: (client: Omit<Client, "id" | "createdAt">) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  toggleBusinessMode: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      clients: [],
      projects: [],
      businessMode: false,

      addClient: (client) =>
        set((state) => ({
          clients: [
            ...state.clients,
            {
              ...client,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      toggleBusinessMode: () =>
        set((state) => ({
          businessMode: !state.businessMode,
        })),
    }),
    {
      name: "trackforge-business",
    }
  )
);
