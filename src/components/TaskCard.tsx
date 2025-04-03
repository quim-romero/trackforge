import { useSettingsStore } from "../store/useSettingsStore";
import { useState } from "react";
import { Check } from "lucide-react";

type TaskCardProps = {
  title: string;
  completed: boolean;
  onToggle?: () => void;
};

export default function TaskCard({
  title,
  completed,
  onToggle,
}: TaskCardProps) {
  const density = useSettingsStore((state) => state.density);

  const padding = density === "compact" ? "p-2" : "p-4";
  const gap = density === "compact" ? "gap-1" : "gap-2";
  const titleSize = density === "compact" ? "text-sm" : "text-base";
  const checkIconSize = density === "compact" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${padding} flex flex-col ${gap}`}
    >
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
        <h4 className={`font-medium ${titleSize}`}>{title}</h4>
      </div>
    </div>
  );
}
