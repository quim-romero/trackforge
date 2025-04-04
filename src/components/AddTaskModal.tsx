import { X } from "lucide-react";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl relative z-50 border border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          New Task
        </h3>
      </div>
    </div>
  );
}
