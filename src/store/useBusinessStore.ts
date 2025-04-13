import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client, Project } from "../types";

const DEMO_CLIENTS: Client[] = [
  {
    id: "demo-client-1",
    name: "Acme Corp",
    email: "contact@acme.com",
    company: "Acme Corporation",
    notes: "Enterprise client, yearly renewal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-client-2",
    name: "Jane Doe",
    email: "jane@startup.io",
    company: "StartupIO",
    notes: "Early-stage, needs hand-holding",
    createdAt: new Date().toISOString(),
  },
];

const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-proj-1",
    title: "Rebrand Landing",
    clientId: "demo-client-1",
    value: 8500,
    stage: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-proj-2",
    title: "Pitch Deck Design",
    clientId: "demo-client-2",
    value: 2400,
    stage: "review",
    priority: "medium",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

interface BusinessState {
  clients: Client[];
  projects: Project[];
  businessMode: boolean;
  addClient: (client: Omit<Client, "id" | "createdAt">) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  toggleBusinessMode: () => void;
  loadDemoData: () => void;
  clearData: () => void;
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

      loadDemoData: () =>
        set(() => ({
          clients: DEMO_CLIENTS,
          projects: DEMO_PROJECTS,
          businessMode: true,
        })),

      clearData: () =>
        set(() => ({
          clients: [],
          projects: [],
          businessMode: false,
        })),
    }),
    {
      name: "trackforge-business",
    }
  )
);
