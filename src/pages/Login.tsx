import { useState } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm space-y-8 text-center"
      >
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Get back to your flow.
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No friction. No passwords. Just your momentum, waiting.
          </p>
        </header>

        <form className="space-y-4 text-left">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Your email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@intentional.life"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>
        </form>
      </motion.div>
    </main>
  );
}
