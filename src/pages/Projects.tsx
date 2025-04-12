import { useBusinessStore } from "../store/useBusinessStore";
import { useState } from "react";

const STAGES = ["all", "in-progress", "review", "done"] as const;

export default function Projects() {
  const { projects, addProject } = useBusinessStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

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
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
        >
          + New Project
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg"
        >
          <input
            type="text"
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Value ($)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-brand text-white rounded"
          >
            Create
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => (
          <div
            key={stage}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
          >
            <h3 className="font-medium mb-3 capitalize">
              {stage.replace("-", " ")}
            </h3>
            <div className="space-y-2">
              {projects
                .filter((p) => p.stage === stage)
                .map((project) => (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm"
                  >
                    <p className="font-medium">{project.title}</p>
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
