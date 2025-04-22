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
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  moveProject: (
    id: string,
    nextStage: Project["stage"],
    index?: number
  ) => void;

  reorderInStage: (stage: Project["stage"], from: number, to: number) => void;

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

      updateProject: (id, patch) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      moveProject: (id, nextStage, index) =>
        set((state) => {
          const projects = [...state.projects];
          const i = projects.findIndex((p) => p.id === id);
          if (i === -1) return { projects };

          const [item] = projects.splice(i, 1);
          item.stage = nextStage;

          const before = projects.filter((p) => p.stage !== nextStage);
          const column = projects.filter((p) => p.stage === nextStage);

          const insertAt = Math.max(
            0,
            Math.min(index ?? column.length, column.length)
          );

          const rebuilt: Project[] = [
            ...before,
            ...column.slice(0, insertAt),
            item,
            ...column.slice(insertAt),
          ];

          return { projects: rebuilt };
        }),

      reorderInStage: (stage, from, to) =>
        set((state) => {
          const others = state.projects.filter((p) => p.stage !== stage);
          const column = state.projects
            .filter((p) => p.stage === stage)
            .sort(
              (a, b) =>
                state.projects.findIndex((p) => p.id === a.id) -
                state.projects.findIndex((p) => p.id === b.id)
            );

          if (
            from < 0 ||
            from >= column.length ||
            to < 0 ||
            to >= column.length
          ) {
            return { projects: state.projects };
          }

          const [moved] = column.splice(from, 1);
          column.splice(to, 0, moved);

          return { projects: [...others, ...column] };
        }),

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
    { name: "trackforge-business" }
  )
);
