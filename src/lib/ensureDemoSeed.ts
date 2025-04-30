export function ensureDemoSeed() {
  try {
    if (typeof localStorage === "undefined") return;
    if (localStorage.getItem("demo-seeded")) return;

    const raw = localStorage.getItem("tasks");
    const existing = raw ? (JSON.parse(raw) as unknown) : [];
    if (Array.isArray(existing) && existing.length > 0) {
      localStorage.setItem("demo-seeded", "1");
      return;
    }

    const now = Date.now();
    const demo = [
      {
        id: "demo-1",
        title: "Welcome to TrackForge 👋",
        done: false,
        createdAt: now,
      },
      {
        id: "demo-2",
        title: "Create your first task",
        done: false,
        createdAt: now,
      },
      {
        id: "demo-3",
        title: "Mark tasks as done",
        done: false,
        createdAt: now,
      },
    ];

    localStorage.setItem("tasks", JSON.stringify(demo));
    localStorage.setItem("demo-seeded", "1");
  } catch {
    void 0;
  }
}
