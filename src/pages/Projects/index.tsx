import { useState, useMemo } from "react";
import { useBusinessStore } from "../../store/useBusinessStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import ProjectColumn from "../../components/projects/ProjectColumn";
import ProjectForm from "../../components/projects/ProjectForm";
import { useProjectDnd } from "../../hooks/useProjectDnd";
import type { Project } from "../../types";

const STAGES: Project["stage"][] = ["all", "in-progress", "review", "done"];

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } =
    useBusinessStore();
  const density = useSettingsStore((s) => s.density);
  const dnd = useProjectDnd();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const byStage = useMemo(() => {
    const m: Record<Project["stage"], Project[]> = {
      all: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    projects.forEach((p) => m[p.stage].push(p));
    return m;
  }, [projects]);

  const handleCreate = (v: {
    title: string;
    value: number;
    priority: Project["priority"];
    dueDate: string;
  }) => {
    addProject({
      title: v.title,
      clientId: "",
      value: v.value,
      stage: "all",
      priority: v.priority,
      dueDate: v.dueDate,
    });
    setShowForm(false);
  };

  const handleEdit = (v: {
    title: string;
    value: number;
    priority: Project["priority"];
    dueDate: string;
  }) => {
    if (!editing) return;
    updateProject(editing.id, {
      title: v.title,
      value: v.value,
      priority: v.priority,
      dueDate: v.dueDate,
    });
    setEditing(null);
  };

  const headerSize = density === "compact" ? "text-xl" : "text-2xl";
  const gridGap = density === "compact" ? "gap-3" : "gap-6";
  const sectionPad = density === "compact" ? "p-3" : "p-6";
  const btnPad =
    density === "compact" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className={`${headerSize} font-bold`}>Projects</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className={`${btnPad} rounded-lg border border-brand text-brand hover:bg-brand/5 transition`}
        >
          + New Project
        </button>
      </header>

      {(showForm || editing) && (
        <section
          className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${sectionPad}`}
        >
          <ProjectForm
            initial={editing ?? undefined}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSubmit={editing ? handleEdit : handleCreate}
          />
        </section>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-4 ${gridGap}`}>
        {STAGES.map((stage) => (
          <ProjectColumn
            key={stage}
            title={stage.replace("-", " ")}
            stage={stage}
            projects={byStage[stage]}
            dnd={dnd}
            onEdit={(p) => setEditing(p)}
            onDelete={(id) => deleteProject(id)}
            dense={density === "compact"}
          />
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
