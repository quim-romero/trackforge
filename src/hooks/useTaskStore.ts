import { useCallback, useEffect, useState } from "react";
import { supabase } from "../auth/supabaseClient";
import { useAuth } from "../auth/useAuth";

type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
};

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  completed: boolean;
  created_at: string;
  user_id: string;
};

const DEMO_TASKS: Task[] = [
  {
    id: "1",
    title: "Write landing copy",
    description: "Keep it short and punchy",
    priority: "high",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Refactor auth hook",
    priority: "medium",
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Push latest commit",
    priority: "low",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

type UpdatableTask = Omit<Partial<Task>, "createdAt">;

export function useTaskStore() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const isDemoUser = user?.id === "demo-user";

  const fetchTasks = useCallback(async () => {
    let alive = true;
    setLoading(true);

    try {
      if (!user) {
        if (alive) setTasks([]);
        return;
      }

      if (isDemoUser) {
        if (alive) setTasks(DEMO_TASKS);
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading tasks:", error);
        if (alive) setTasks([]);
        return;
      }

      const formatted: Task[] = ((data as TaskRow[] | null) ?? []).map(
        (row) => ({
          id: row.id,
          title: row.title,
          description: row.description ?? undefined,
          priority: row.priority,
          completed: row.completed,
          createdAt: row.created_at,
        })
      );

      if (alive) setTasks(formatted);
    } finally {
      if (alive) setLoading(false);
    }

    return () => {
      alive = false;
    };
  }, [user, isDemoUser]);

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    if (!user) return;

    if (isDemoUser) {
      const newTask: Task = {
        ...task,
        id:
          globalThis.crypto?.randomUUID?.() ??
          Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        completed: task.completed ?? false,
      };
      setTasks((prev) => [newTask, ...prev]);
      return;
    }

    const insertPayload = {
      title: task.title,
      description: task.description ?? null,
      priority: task.priority,
      completed: task.completed ?? false,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
      return;
    }

    if (data) {
      const formatted: Task = {
        id: data.id,
        title: data.title,
        description: data.description ?? undefined,
        priority: data.priority,
        completed: data.completed,
        createdAt: data.created_at,
      };
      setTasks((prev) => [formatted, ...prev]);
    }
  };

  const toggleTask = async (id: string) => {
    if (!user) return;

    if (isDemoUser) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      return;
    }

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", id);

    if (error) {
      console.error("Error toggling task:", error);
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    if (isDemoUser) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return;
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Error deleting task:", error);
      return;
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = async (id: string, updated: UpdatableTask) => {
    if (!user) return;

    if (isDemoUser) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      );
      return;
    }

    const patch: Partial<
      Pick<TaskRow, "title" | "description" | "priority" | "completed">
    > = {};
    if (updated.title !== undefined) patch.title = updated.title;
    if (updated.description !== undefined)
      patch.description = updated.description ?? null;
    if (updated.priority !== undefined) patch.priority = updated.priority;
    if (updated.completed !== undefined) patch.completed = updated.completed;

    if (Object.keys(patch).length === 0) return;

    const { error } = await supabase.from("tasks").update(patch).eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
  };
}
