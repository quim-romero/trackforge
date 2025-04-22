import { useRef } from "react";
import { useBusinessStore } from "../store/useBusinessStore";
import type { Project } from "../types";

export function useProjectDnd() {
  const moveProject = useBusinessStore((s) => s.moveProject);
  const reorderInStage = useBusinessStore((s) => s.reorderInStage);
  const dragging = useRef<{
    id: string;
    stage: Project["stage"];
    index: number;
  } | null>(null);

  const draggableProps = (
    id: string,
    stage: Project["stage"],
    index: number
  ) => ({
    draggable: true,
    onDragStart: () => {
      dragging.current = { id, stage, index };
    },
    onDragEnd: () => {
      dragging.current = null;
    },
  });

  const columnDropProps = (stage: Project["stage"]) => ({
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (_e: React.DragEvent, index?: number) => {
      const d = dragging.current;
      if (!d) return;
      if (d.stage === stage && typeof index === "number") {
        reorderInStage(stage, d.index, index);
      } else {
        moveProject(d.id, stage, index);
      }
      dragging.current = null;
    },
  });

  return { draggableProps, columnDropProps };
}
