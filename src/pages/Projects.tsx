import { useBusinessStore } from "../store/useBusinessStore";

export default function Projects() {
  const { projects } = useBusinessStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Projects</h2>
      {/* Kanban board with stages */}
    </div>
  );
}
