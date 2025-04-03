import { useSettingsStore } from "../store/useSettingsStore";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type TaskCardProps = {
  title: string;
  completed: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function TaskCard({
  title,
  completed,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const density = useSettingsStore((state) => state.density);
  const [showConfirm, setShowConfirm] = useState(false);

  const padding = density === "compact" ? "p-2" : "p-4";
  const gap = density === "compact" ? "gap-1" : "gap-2";
  const titleSize = density === "compact" ? "text-sm" : "text-base";
  const checkIconSize = density === "compact" ? "w-2.5 h-2.5" : "w-3 h-3";
  const iconSize = density === "compact" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div
      className={`group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${padding} flex flex-col ${gap}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <button
            onClick={onToggle}
            aria-label="Toggle task"
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition ${
              completed
                ? "bg-brand border-brand"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {completed && <Check className={`${checkIconSize} text-white`} />}
          </button>
          <h4
            className={`font-medium ${titleSize} transition ${
              completed
                ? "line-through text-gray-400 dark:text-gray-500"
                : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {title}
          </h4>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-brand dark:hover:text-brand"
              title="Edit"
            >
              <Pencil className={iconSize} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-gray-500 hover:text-red-500 dark:hover:text-red-400"
              title="Delete"
            >
              <Trash2 className={iconSize} />
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex gap-2 items-center">
          ¿Eliminar tarea?
          <button
            onClick={() => {
              onDelete?.();
              setShowConfirm(false);
            }}
            className="text-red-500 hover:underline"
          >
            Sí
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-gray-500 hover:underline"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
