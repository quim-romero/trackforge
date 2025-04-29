import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "./supabaseClient";
import type { User as AuthUser } from "@supabase/supabase-js";
import { ensureDemoSeed } from "../lib/ensureDemoSeed";

const DEMO_SEEDED_KEY = "demo-seeded";

const isPromiseLike = (v: unknown): v is Promise<unknown> =>
  typeof (v as any)?.then === "function";

export function useAuth() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      const raw = localStorage.getItem("demo-user");
      if (raw) {
        try {
          const demoUser = JSON.parse(raw) as AuthUser;
          setUser(demoUser);

          if (!localStorage.getItem(DEMO_SEEDED_KEY)) {
            localStorage.setItem(DEMO_SEEDED_KEY, "pending");
            try {
              const maybe = ensureDemoSeed() as unknown;

              if (isPromiseLike(maybe)) {
                maybe
                  .then(() => {
                    localStorage.setItem(DEMO_SEEDED_KEY, "1");
                  })
                  .catch((_e: unknown) => {
                    localStorage.removeItem(DEMO_SEEDED_KEY);
                  });
              } else {
                localStorage.setItem(DEMO_SEEDED_KEY, "1");
              }
            } catch (_e: unknown) {
              localStorage.removeItem(DEMO_SEEDED_KEY);
            }
          }
        } catch (_e: unknown) {
          localStorage.removeItem("demo-user");
          localStorage.removeItem(DEMO_SEEDED_KEY);
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
    })().catch((_e: unknown) => {
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
      } catch (_e: unknown) {}
    };
  }, [setUser]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_e: unknown) {}
    localStorage.removeItem("demo-user");
    localStorage.removeItem(DEMO_SEEDED_KEY);
    setUser(null);
  };

  return { user, loading: user === undefined, logout, setUser };
}
