import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl w-full py-8 md:py-12"
      >
        <div className="text-center md:text-left space-y-6 max-w-xl">
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight"
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
          <div>
            <Link
              to="/login"
              className="inline-block bg-brand hover:bg-brand-dark transition text-white px-6 py-3 rounded-lg text-sm font-medium shadow"
            >
              Enter your flow
            </Link>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <img
            src="/assets/landing-hero.svg"
            alt="Productivity illustration"
            className="w-full h-auto"
          />
        </div>
      </motion.section>
    </main>
  );
}
