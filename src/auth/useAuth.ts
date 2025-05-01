import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "./supabaseClient";
import { ensureDemoSeed } from "../lib/ensureDemoSeed";
import type { User as AuthUser, Session } from "@supabase/supabase-js";

export function useAuth() {
  const user = useAuthStore((s) => s.user as AuthUser | null | undefined);
  const setUser = useAuthStore(
    (s) => s.setUser as (u: AuthUser | null) => void
  );

  useEffect(() => {
    if (user == null) {
      const raw = localStorage.getItem("demo-user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as unknown;
          setUser(parsed as AuthUser);
          ensureDemoSeed();
        } catch {
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
        if (localStorage.getItem("demo-user")) {
          localStorage.removeItem("demo-user");
        }
        setUser(session.user as AuthUser);
      }
    })().catch(() => {
      void 0;
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        const hasDemo = !!localStorage.getItem("demo-user");

        if (session?.user) {
          if (hasDemo) localStorage.removeItem("demo-user");
          setUser(session.user as AuthUser);
          return;
        }

        if (
          hasDemo &&
          (event === "INITIAL_SESSION" || event === "SIGNED_OUT")
        ) {
          return;
        }

        setUser(null);
      }
    );

    return () => {
      try {
        subscription.unsubscribe();
      } catch {
        void 0;
      }
    };
  }, [setUser]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      void 0;
    }
    localStorage.removeItem("demo-user");
    setUser(null);
  };

  return { user, loading: user === undefined, logout, setUser };
}
