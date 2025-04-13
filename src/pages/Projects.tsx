import { useBusinessStore } from "../store/useBusinessStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { useState } from "react";

const STAGES = ["all", "in-progress", "review", "done"] as const;

export default function Projects() {
  const { projects, addProject } = useBusinessStore();
  const density = useSettingsStore((s) => s.density);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  const layoutSpacing = density === "compact" ? "space-y-4" : "space-y-6";
  const sectionPad = density === "compact" ? "p-3" : "p-6";
  const inputsPad =
    density === "compact" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  const gridGap = density === "compact" ? "gap-3" : "gap-6";
  const stageHeadPad = density === "compact" ? "px-3 py-2" : "px-4 py-3";
  const itemPad = density === "compact" ? "p-2.5" : "p-3";
  const headerSize = density === "compact" ? "text-xl" : "text-2xl";
  const btnPad =
    density === "compact" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addProject({
      title: title.trim(),
      clientId: "",
      value: Number(value) || 0,
      stage: "all",
      priority: "medium",
      dueDate: new Date().toISOString(),
    });

    setTitle("");
    setValue("");
    setShowForm(false);
  };

  return (
    <div className={layoutSpacing}>
      <header className="flex justify-between items-center">
        <h2 className={`${headerSize} font-bold`}>Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${btnPad} rounded-lg border border-brand text-brand hover:bg-brand/5 transition`}
        >
          + New Project
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${sectionPad} ${layoutSpacing}`}
        >
          <input
            type="text"
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${inputsPad}`}
            required
          />
          <input
            type="number"
            placeholder="Value ($)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${inputsPad}`}
          />
          <button
            type="submit"
            className={`${btnPad} bg-brand text-white rounded-lg hover:bg-brand-dark transition`}
          >
            Create
          </button>
        </form>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-4 ${gridGap}`}>
        {STAGES.map((stage) => (
          <div
            key={stage}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
          >
            <div
              className={`${stageHeadPad} border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30`}
            >
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize flex items-center gap-2">
                <span className="inline-block w-1.5 h-4 rounded-full bg-brand" />
                {stage.replace("-", " ")}
              </h3>
            </div>

            <div
              className={`${
                density === "compact" ? "p-3" : "p-4"
              } space-y-2 min-h-[88px]`}
            >
              {projects
                .filter((p) => p.stage === stage)
                .map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 ${itemPad} hover:border-brand/40 transition`}
                  >
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {project.title}
                    </p>
                    <p className="text-sm text-gray-500">${project.value}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No projects yet. Create your first one!
        </p>
      )}
    </div>
  );
}
