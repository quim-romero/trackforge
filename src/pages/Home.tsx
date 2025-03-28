import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="h-dvh overflow-hidden flex items-center justify-center px-4 bg-white dark:bg-gray-900 text-center text-gray-900 dark:text-white">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl space-y-4 p-4 sm:space-y-6 sm:p-6"
      >
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight"
          data-cy="main-headline"
        >
          It's not for everyone.
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          TrackForge isn’t just another task manager. It’s a minimal, focused
          space built for makers who think clearly and act with intention.
        </p>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          No noise. No distractions. Just your ideas, your craft — and your
          momentum.
        </p>
        <div className="flex justify-center">
          <Link
            to="/login"
            className="bg-brand hover:bg-brand-dark transition text-white px-6 py-3 rounded-lg text-sm font-medium shadow"
          >
            Enter your flow
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
