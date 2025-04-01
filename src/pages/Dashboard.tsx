import { useSettingsStore } from "../store/useSettingsStore";
import { useTaskStore } from "../hooks/useTaskStore";
import { useAuth } from "../auth/useAuth";
import { useUserStore } from "../store/useUserStore";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { tasks, loading } = useTaskStore();
  const { name } = useUserStore();
  const { user } = useAuth();
  const density = useSettingsStore((state) => state.density);
  const animationsEnabled = useSettingsStore((state) => state.animations);

  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedThisWeek = tasks.filter((t) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return t.completed && new Date(t.createdAt).getTime() >= oneWeekAgo;
  }).length;
  const productivity = tasks.length
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0;

  const padding = density === "compact" ? "p-2" : "p-6";
  const gap = density === "compact" ? "gap-2" : "gap-6";
  const textSize = density === "compact" ? "text-xs" : "text-base";
  const cardTitleSize = density === "compact" ? "text-xs" : "text-sm";
  const cardValueSize = density === "compact" ? "text-xl" : "text-3xl";
  const spacing = density === "compact" ? "space-y-2" : "space-y-8";

  const stats = [
    { label: "Active Tasks", value: activeTasks },
    { label: "Completed This Week", value: completedThisWeek },
    { label: "Productivity", value: `${productivity}%` },
  ];

  const content = (
    <div className={spacing}>
      <header>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {name} 👋
        </h2>
        {user?.id === "demo-user" && (
          <p className={`${textSize} text-brand font-medium mt-1`}>
            You're viewing the demo version.
          </p>
        )}
        <p className={`${textSize} text-gray-600 dark:text-gray-400 mt-1`}>
          A quick overview of your performance.
        </p>
      </header>

      {loading ? (
        <div className={`grid grid-cols-1 md:grid-cols-3 ${gap}`}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <section className={`grid grid-cols-1 md:grid-cols-3 ${gap}`}>
          {stats.map(({ label, value }, index) => {
            const delay = animationsEnabled ? index * 0.1 : 0;

            const card = (
              <div
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${padding}`}
              >
                <h3
                  className={`${cardTitleSize} font-medium text-gray-500 dark:text-gray-400`}
                >
                  {label}
                </h3>
                <p className={`${cardValueSize} font-bold mt-2 text-brand`}>
                  {value}
                </p>
              </div>
            );

            return animationsEnabled ? (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay, ease: "easeOut" }}
              >
                {card}
              </motion.div>
            ) : (
              <div key={label}>{card}</div>
            );
          })}
        </section>
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
