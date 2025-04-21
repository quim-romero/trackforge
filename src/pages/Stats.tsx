import { motion } from "framer-motion";
import { useSettingsStore } from "../store/useSettingsStore";
import { useTaskStore } from "../hooks/useTaskStore";
import { useMemo } from "react";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Stats() {
  const animationsEnabled = useSettingsStore((state) => state.animations);
  const { tasks, loading } = useTaskStore();

  const data = useMemo(() => {
    const counts = new Array(7).fill(0);
    tasks.forEach((task) => {
      if (!task.completed) return;
      const date = dayjs(task.createdAt);
      const weekday = date.day();
      const index = weekday === 0 ? 6 : weekday - 1;
      counts[index]++;
    });
    return {
      labels: [...DAYS],
      datasets: [
        {
          label: "Completed Tasks",
          data: counts,
          backgroundColor: "#10B981",
          borderRadius: 6,
        },
      ],
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 animate-pulse" />
    );
  }

  const content = (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Weekly rhythm.
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A visual snapshot of your recent momentum.
        </p>
      </header>

      {loading ? (
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 animate-pulse" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 w-full max-w-5xl mx-auto"
        >
          <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px]">
            <Bar
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: animationsEnabled
                  ? { duration: 600, easing: "easeOutQuart" }
                  : false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    ticks: {
                      color: "#9CA3AF",
                      stepSize: 1,
                      precision: 0,
                    },
                    grid: {
                      color: "#E5E7EB22",
                    },
                  },
                  x: {
                    ticks: { color: "#9CA3AF" },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );

  return animationsEnabled ? (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
}
