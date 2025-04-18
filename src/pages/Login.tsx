import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../auth/supabaseClient";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your inbox. The magic link is on its way.");
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: "demo-user",
      email: "demo@trackforge.app",
    };
    localStorage.setItem("demo-user", JSON.stringify(demoUser));
    setUser(demoUser);
    navigate("/dashboard");
  };

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
          <button
            onClick={handleDemoLogin}
            className="w-full text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            👀 Enter as demo
          </button>
        </div>

        <footer className="text-xs text-gray-400 pt-4 italic">
          Made for focused work.
        </footer>
      </motion.div>
    </main>
  );
}
