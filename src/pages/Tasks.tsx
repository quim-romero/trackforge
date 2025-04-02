import { useState } from "react";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import { motion } from "framer-motion";

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const content = (
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
    </div>
  );

  return <>{content}</>;
}
