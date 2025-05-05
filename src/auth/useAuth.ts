import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "./supabaseClient";
import { ensureDemoSeed } from "../lib/ensureDemoSeed";
import { useBusinessStore } from "../store/useBusinessStore";
import type { User as AuthUser, Session } from "@supabase/supabase-js";

const DEMO_HYDRATED_KEY = "demo-hydrated";

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

          const alreadyHydrated =
            localStorage.getItem(DEMO_HYDRATED_KEY) === "1";
          if (!alreadyHydrated) {
            const nowIso = new Date().toISOString();
            const inDays = (d: number) =>
              new Date(Date.now() + d * 86400000).toISOString();

            useBusinessStore.setState({
              clients: [
                {
                  id: "demo-c1",
                  name: "Acme Corp",
                  email: "hola@acme.com",
                  company: "Acme",
                  notes: "Enterprise",
                  createdAt: nowIso,
                },
                {
                  id: "demo-c2",
                  name: "Jane Doe",
                  email: "jane@startup.io",
                  company: "StartupIO",
                  notes: "Early-stage",
                  createdAt: nowIso,
                },
              ],
              projects: [
                {
                  id: "demo-p1",
                  title: "Rebrand Landing",
                  clientId: "demo-c1",
                  value: 8500,
                  stage: "in-progress",
                  priority: "high",
                  dueDate: inDays(5),
                  createdAt: nowIso,
                },
                {
                  id: "demo-p2",
                  title: "Pitch Deck",
                  clientId: "demo-c2",
                  value: 2400,
                  stage: "review",
                  priority: "medium",
                  dueDate: inDays(2),
                  createdAt: nowIso,
                },
              ],
              businessMode: true,
            });

            localStorage.setItem(DEMO_HYDRATED_KEY, "1");
          }
        } catch {
          localStorage.removeItem("demo-user");
          localStorage.removeItem(DEMO_HYDRATED_KEY);
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
        localStorage.removeItem(DEMO_HYDRATED_KEY);
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
          localStorage.removeItem(DEMO_HYDRATED_KEY);
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
    localStorage.removeItem(DEMO_HYDRATED_KEY);

    try {
      const reset = (useBusinessStore.getState() as { reset?: () => void }).reset
      if (typeof reset === "function") {
        reset();
      } else {
        useBusinessStore.setState({ clients: [], projects: [] });
      }
    } catch {
      // ignore
    }

    setUser(null);
  };

  return { user, loading: user === undefined, logout, setUser };
}
