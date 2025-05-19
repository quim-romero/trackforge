import { useEffect, useState } from "react";
import { supabase } from "../auth/supabaseClient";
import { useAuth } from "../auth/useAuth";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
};

export function useTaskStore() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user tasks
  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading tasks:", error);
      setTasks([]);
    } else {
      const formatted = (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        priority: row.priority,
        completed: row.completed,
        createdAt: row.created_at,
      }));
      setTasks(formatted);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Create new task
  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    if (!user) return;

    const { error } = await supabase.from("tasks").insert({
      ...task,
      user_id: user.id,
    });

    if (error) {
      console.error("Error adding task:", error);
    } else {
      fetchTasks();
    }
  };

  // Mark task complete / undo
  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", id);

    if (error) {
      console.error("Error toggling task:", error);
    } else {
      fetchTasks();
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      fetchTasks();
    }
  };

  // Edit task
  const updateTask = async (id: string, updated: Partial<Task>) => {
    const { createdAt, ...updatePayload } = updated;

    const { error } = await supabase
      .from("tasks")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
    } else {
      fetchTasks();
    }
  };

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
