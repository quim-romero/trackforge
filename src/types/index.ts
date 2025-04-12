export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  projectId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  notes?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  value: number;
  stage: "all" | "in-progress" | "review" | "done";
  priority: Priority;
  dueDate: string;
  createdAt: string;
}
