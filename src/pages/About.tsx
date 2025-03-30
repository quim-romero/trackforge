import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl space-y-8 text-center"
      >
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            TrackForge is a manifesto disguised as an app.
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Built by someone who can’t stand noise.
          </p>
        </header>

        <section className="space-y-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            This didn’t start as a product. It started as a tool for myself — a
            way to work with calm, with clarity, and without distractions.
          </p>
          <p>
            I don’t care about trends. I care about tools that feel right. That
            move fast. That get out of the way.
          </p>
        </section>

        <section className="space-y-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            TrackForge is for people who treat focus like an art form. Who
            choose their tools like they choose their instruments.
          </p>
          <p>
            It won’t tell you what to do. It will hold the space for you to do
            it well.
          </p>
          <p>I made it because I needed it. Maybe you do too.</p>
          <p className="italic">— Quim</p>
        </section>

        <div>
          <Link
            to="/"
            className="inline-block mt-6 text-sm text-brand hover:underline"
          >
            ← Back to flow
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
