import { useState } from "react";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import { useTaskStore } from "../hooks/useTaskStore";
import { useSettingsStore } from "../store/useSettingsStore";

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, loading, toggleTask, deleteTask } = useTaskStore();
  const { density } = useSettingsStore();

  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "active"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  const filterPadding =
    density === "compact" ? "py-1 px-2 text-xs" : "py-2 px-3 text-sm";

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" ? task.completed : !task.completed);
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-8">
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
          onClick={() => setIsModalOpen(true)}
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

      {isModalOpen && <AddTaskModal onClose={handleCloseModal} />}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading tasks...</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
