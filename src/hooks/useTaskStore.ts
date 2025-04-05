import { useEffect, useState } from "react"
import { supabase } from "../auth/supabaseClient"
import { useAuth } from "../auth/useAuth"

export type Task = {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: string
}

export function useTaskStore() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const isDemo = user?.id === "demo-user"

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
  ]
