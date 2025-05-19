export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
};
