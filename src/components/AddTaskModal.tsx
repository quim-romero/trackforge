import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type FormData = z.infer<typeof schema>;

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: FormData & { id?: string };
  onSubmit?: (data: FormData) => void;
};

export default function AddTaskModal({
  isOpen,
  onClose,
  defaultValues,
  onSubmit,
}: AddTaskModalProps) {
  const isEditMode = !!defaultValues?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        defaultValues || {
          title: "",
          description: "",
          priority: "medium",
        }
      );
    }
  }, [isOpen, defaultValues, reset]);

  const handleFormSubmit = (data: FormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl relative z-50 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            onClose();
            reset();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {isEditMode ? "Edit Task" : "New Task"}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              {...register("title")}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register("description")}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              {...register("priority")}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              {isEditMode ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
