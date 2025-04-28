import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../auth/supabaseClient";
import GuestLoginButton from "../components/GuestLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) setError(error.message);
    else setMessage("Check your inbox. The magic link is on its way.");
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 max-w-5xl w-full py-8 md:py-12"
      >
        <div className="w-full max-w-sm space-y-8">
          <header className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Get back to your flow.
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No friction. No passwords. Just your momentum, waiting.
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
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

            {error && (
              <p className="text-sm text-red-500 text-center" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p
                className="text-sm text-green-600 dark:text-green-400 text-center"
                role="status"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark transition text-sm font-medium"
            >
              Send magic link
            </button>
          </form>

          <div className="pt-2">
            <GuestLoginButton />
          </div>

          <footer className="text-xs text-gray-400 pt-4 italic text-center">
            Made for focused work.
          </footer>
        </div>

        <div className="w-full max-w-sm">
          <img
            src="/assets/login-hero.svg"
            alt="In the zone illustration"
            className="w-full h-auto"
          />
        </div>
      </motion.section>
    </main>
  );
}
