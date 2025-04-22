import type { Project } from "../../types";
import ProjectCard from "./ProjectCard";

type Props = {
  title: string;
  stage: Project["stage"];
  projects: Project[];
  dnd: ReturnType<typeof import("../../hooks/useProjectDnd").useProjectDnd>;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  dense?: boolean;
};

export default function ProjectColumn({
  title,
  stage,
  projects,
  dnd,
  onEdit,
  onDelete,
  dense,
}: Props) {
  const pad = dense ? "px-3 py-2" : "px-4 py-3";
  const gap = dense ? "gap-2" : "gap-3";

  const handleSlotDrop = (index: number) => (e: React.DragEvent) =>
    dnd.columnDropProps(stage).onDrop(e, index);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div
        className={`${pad} border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30`}
      >
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize flex items-center gap-2">
          <span className="inline-block w-1.5 h-4 rounded-full bg-brand" />
          {title}
        </h3>
      </div>

      <div
        className={`${dense ? "p-3" : "p-4"} ${gap} min-h-[96px]`}
        onDragOver={dnd.columnDropProps(stage).onDragOver}
        onDrop={(e) => dnd.columnDropProps(stage).onDrop(e)}
      >
        {projects.map((p, i) => (
          <div key={p.id}>
            <div
              className="h-2"
              onDragOver={dnd.columnDropProps(stage).onDragOver}
              onDrop={handleSlotDrop(i)}
            />
            <ProjectCard
              project={p}
              dnd={dnd.draggableProps}
              index={i}
              onEdit={() => onEdit(p)}
              onDelete={() => onDelete(p.id)}
            />
          </div>
        ))}
        <div
          className="h-4"
          onDragOver={dnd.columnDropProps(stage).onDragOver}
          onDrop={handleSlotDrop(projects.length)}
        />
      </div>
    </div>
  );
}
