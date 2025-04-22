import { useState, useEffect } from "react";
import type { Project, Priority } from "../../types";

type Values = {
  title: string;
  value: number;
  priority: Priority;
  dueDate: string;
};
type Props = {
  initial?: Partial<Project>;
  onCancel: () => void;
  onSubmit: (values: Values) => void;
};

export default function ProjectForm({ initial, onCancel, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [value, setValue] = useState<number>(initial?.value ?? 0);
  const [priority, setPriority] = useState<Priority>(
    initial?.priority ?? "medium"
  );
  const [dueDate, setDueDate] = useState(initial?.dueDate?.slice(0, 10) ?? "");

  useEffect(() => {
    if (!dueDate) setDueDate(new Date().toISOString().slice(0, 10));
  }, [dueDate]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title: title.trim(),
          value: Number(value) || 0,
          priority,
          dueDate: new Date(dueDate).toISOString(),
        });
      }}
      className="space-y-3"
    >
      <input
        className="w-full border rounded-md px-3 py-2 text-sm"
        placeholder="Project title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          className="border rounded-md px-3 py-2 text-sm"
          type="number"
          placeholder="Value ($)"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <input
        className="w-full border rounded-md px-3 py-2 text-sm"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 text-sm rounded-md border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-md bg-brand text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}
