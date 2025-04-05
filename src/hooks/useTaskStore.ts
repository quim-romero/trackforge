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

  const isDemo = user?.id === "demo-user";

  const demoTasks: Task[] = [
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

  const fetchTasks = async () => {
    setLoading(true);

    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    if (isDemo) {
      setTasks(demoTasks);
      setLoading(false);
      return;
    }

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
  }, [user?.id]);

  return {
    tasks,
    loading,
    fetchTasks,
  };
}
