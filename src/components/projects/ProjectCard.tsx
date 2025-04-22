import { MoreHorizontal, Pencil, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import type { Project } from "../../types";

type Props = {
  project: Project;
  dnd: ReturnType<
    typeof import("../../hooks/useProjectDnd").useProjectDnd
  >["draggableProps"];
  index: number;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProjectCard({
  project,
  dnd,
  index,
  onEdit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 p-3 hover:border-brand/40 transition"
      {...dnd(project.id, project.stage, index)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="cursor-grab opacity-60 group-hover:opacity-100">
            <GripVertical className="w-4 h-4" />
          </span>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {project.title}
            </p>
            <p className="text-xs text-gray-500">
              ${project.value.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="absolute right-2 top-8 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
