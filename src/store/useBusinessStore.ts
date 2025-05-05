import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client, Project } from "../types";

/* -----------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------- */

const STAGES: ReadonlyArray<Project["stage"]> = [
  "all",
  "in-progress",
  "review",
  "done",
] as const;

function isStage(v: unknown): v is Project["stage"] {
  return typeof v === "string" && (STAGES as readonly string[]).includes(v);
}

function safeUuid(): string {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {
    // fallback to Math.random below
  }
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* -----------------------------------------------------------
 * Demo data
 * ----------------------------------------------------------- */

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

/* -----------------------------------------------------------
 * State
 * ----------------------------------------------------------- */

interface BusinessState {
  clients: Client[];
  projects: Project[];
  businessMode: boolean;

  // Clients
  addClient: (client: Omit<Client, "id" | "createdAt">) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Projects
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  moveProject: (
    id: string,
    nextStage: Project["stage"],
    index?: number
  ) => void;

  reorderInStage: (stage: Project["stage"], from: number, to: number) => void;

  // Misc
  toggleBusinessMode: () => void;
  loadDemoData: () => void;
  clearData: () => void;
  reset: () => void;
}

/* -----------------------------------------------------------
 * Store
 * ----------------------------------------------------------- */

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      clients: [],
      projects: [],
      businessMode: false,

      /* ----------------------- Clients ----------------------- */
      addClient: (client) =>
        set((state) => ({
          clients: [
            ...state.clients,
            {
              ...client,
              id: safeUuid(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateClient: (id, patch) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),

      /* ----------------------- Projects ---------------------- */
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: safeUuid(),
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
          if (!isStage(nextStage)) return { projects: state.projects };

          const current = state.projects.find((p) => p.id === id);
          if (!current) return { projects: state.projects };
          const sameStage = current.stage === nextStage;

          const projects = [...state.projects];

          const fromIndex = projects.findIndex((p) => p.id === id);
          if (fromIndex === -1) return { projects: state.projects };

          const [item] = projects.splice(fromIndex, 1);
          item.stage = nextStage;

          const before = projects.filter((p) => p.stage !== nextStage);
          const column = projects.filter((p) => p.stage === nextStage);

          const insertAt = Number.isFinite(index as number)
            ? Math.max(0, Math.min(index as number, column.length))
            : column.length;

          if (sameStage && insertAt === column.length) {
            // no-op: item is already at the end
          }

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
          if (!isStage(stage)) return { projects: state.projects };

          const projects = state.projects;
          const column = projects
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => p.stage === stage)
            .sort((a, b) => a.i - b.i)
            .map(({ p }) => p);

          const others = projects.filter((p) => p.stage !== stage);

          if (
            from === to ||
            from < 0 ||
            to < 0 ||
            from >= column.length ||
            to >= column.length
          ) {
            return { projects: state.projects };
          }

          const nextColumn = [...column];
          const [moved] = nextColumn.splice(from, 1);
          nextColumn.splice(to, 0, moved);

          const rebuilt: Project[] = [...others, ...nextColumn];

          return { projects: rebuilt };
        }),

      /* ------------------------ Misc ------------------------- */
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

      reset: () =>
        set(() => ({
          clients: [],
          projects: [],
          businessMode: false,
        })),
    }),
    { name: "trackforge-business" }
  )
);
