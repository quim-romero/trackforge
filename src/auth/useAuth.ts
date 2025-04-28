import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "./supabaseClient";
import type { User as AuthUser } from "@supabase/supabase-js";

export function useAuth() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      const raw = localStorage.getItem("demo-user");
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch (e) {
          void e;
          localStorage.removeItem("demo-user");
        }
      }
    }
  }, [user, setUser]);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user as AuthUser);
      }
    })().catch((e) => {
      void e;
      return undefined;
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = (session?.user ?? null) as AuthUser | null;
      setUser(u);
    });

    return () => {
      try {
        subscription.unsubscribe();
      } catch (e) {
        void e;
      }
    };
  }, [setUser]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      void e;
    }
    localStorage.removeItem("demo-user");
    setUser(null);
  };

  return { user, loading: user === undefined, logout, setUser };
}
