import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      } else {
        const currentUser = data.session?.user ?? null;
        setUser(currentUser);

        if (currentUser && location.pathname === "/login") {
          navigate("/dashboard", { replace: true });
        }
      }

      setLoading(false);
    };

    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null;
        setUser(nextUser);

        if (nextUser && location.pathname === "/login") {
          navigate("/dashboard", { replace: true });
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [navigate, location]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return { user, logout, loading };
}
