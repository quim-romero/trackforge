import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

type FormValues = {
  title: string;
  description?: string;
};

type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: FormValues) => Promise<void> | void;
  defaultValues?: Partial<FormValues>;
};

export default function AddTaskModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}: AddTaskModalProps) {
  const isEditMode = !!(defaultValues && defaultValues.title);

  const [searchParams, setSearchParams] = useSearchParams();
  const qsOpen = searchParams.get("new") === "1";
  const effectiveOpen = open || qsOpen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormValues>({
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const closeAll = useCallback(() => {
    onClose?.();
    if (qsOpen) {
      const next = new URLSearchParams(searchParams);
      next.delete("new");
      setSearchParams(next, { replace: true });
    }
  }, [onClose, qsOpen, searchParams, setSearchParams]);

  useEffect(() => {
    if (effectiveOpen) {
      reset({
        title: defaultValues?.title ?? "",
        description: defaultValues?.description ?? "",
      });
      setTimeout(() => setFocus("title"), 0);
    }
  }, [effectiveOpen, defaultValues, reset, setFocus]);

  useEffect(() => {
    if (!effectiveOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [effectiveOpen, closeAll]);

  const submit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      if (onSubmit) await onSubmit(values);
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  if (!effectiveOpen) return null;

  return (
    <div
      data-cy="add-task-modal"
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="add-task-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAll();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="add-task-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            {isEditMode ? "Edit Task" : "New Task"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="px-6 py-5 space-y-4"
          noValidate
        >
          <div className="space-y-1">
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="task-title"
              type="text"
              {...register("title", { required: "Title is required" })}
              data-cy="task-title"
              className="w-full rounded-md px-3 py-2 text-sm border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Task title"
              disabled={submitting || isSubmitting}
              autoComplete="off"
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description <span className="opacity-60">(optional)</span>
            </label>
            <textarea
              id="task-description"
              {...register("description")}
              className="w-full h-28 rounded-md px-3 py-2 text-sm border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand resize-y"
              placeholder="Add a few details…"
              disabled={submitting || isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeAll}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              disabled={submitting || isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              data-cy="create-task"
              disabled={submitting || isSubmitting}
              className="w-36 bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark disabled:opacity-60 transition"
            >
              {submitting || isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
