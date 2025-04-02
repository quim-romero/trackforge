import { useState } from "react";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import { useTaskStore } from "../hooks/useTaskStore";
import { useSettingsStore } from "../store/useSettingsStore";
import type { Task } from "../types";
import { motion } from "framer-motion";

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "active"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  const { tasks, loading, toggleTask, deleteTask } = useTaskStore();
  const density = useSettingsStore((state) => state.density);
  const animations = useSettingsStore((state) => state.animations);

  const layoutSpacing = density === "compact" ? "space-y-2" : "space-y-8";
  const cardGridGap = density === "compact" ? "gap-2" : "gap-6";
  const filterPadding =
    density === "compact" ? "py-1 px-2 text-xs" : "py-2 px-3 text-sm";

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "active" && !task.completed);

    const priorityMatch =
      priorityFilter === "all" || task.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  const content = (
    <div className={layoutSpacing}>
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your task flow.
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add, filter, and get things done — without the clutter.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-sm bg-brand text-white rounded-lg hover:bg-brand-dark transition"
        >
          + New Task
        </button>
      </header>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className={`rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${filterPadding}`}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className={`rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${filterPadding}`}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ${cardGridGap}`}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-10 italic text-center">
          Nothing to show. You’re either done or filtering too hard.
        </p>
      ) : (
        <section
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ${cardGridGap}`}
        >
          {filteredTasks.map((task) => (
            <div key={task.id}>
              <TaskCard
                title={task.title}
                description={task.description}
                priority={task.priority}
                completed={task.completed}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onEdit={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
              />
            </div>
          ))}
        </section>
      )}

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultValues={
          editingTask
            ? {
                id: editingTask.id,
                title: editingTask.title ?? "",
                description: editingTask.description ?? "",
                priority: editingTask.priority ?? "medium",
              }
            : undefined
        }
      />
    </div>
  );

  return animations ? (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
}
