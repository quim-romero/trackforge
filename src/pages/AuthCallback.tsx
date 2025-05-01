import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, type VerifyOtpParamsLite } from "../auth/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import type { Session, User as AuthUser } from "@supabase/supabase-js";

type VerifyType = "magiclink" | "recovery" | "invite" | "email_change";

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const {
          data: { session: s1 },
        } = await supabase.auth.getSession();
        let session: Session | null = s1;

        if (!session) {
          const params = new URLSearchParams(window.location.search);
          const token_hash = params.get("token_hash");
          const type = (params.get("type") as VerifyType) ?? "magiclink";

          if (token_hash) {
            const verifyParams: VerifyOtpParamsLite = { type, token_hash };
            const result = await supabase.auth.verifyOtp(verifyParams);

            if (!result || ("error" in result && result.error)) {
              throw new Error("No se pudo verificar el enlace.");
            }

            session = result.data?.session ?? null;
          }
        }

        if (!session && window.location.hash.includes("access_token")) {
          const {
            data: { session: s2 },
          } = await supabase.auth.getSession();
          session = s2;
        }

        if (session?.user) {
          if (!alive) return;
          localStorage.removeItem("demo-user");
          setUser(session.user as AuthUser);
          navigate("/tasks", { replace: true });
        } else {
          throw new Error("No se pudo iniciar sesión.");
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error iniciando sesión.";
        if (alive) setError(msg);
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate, setUser]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <div className="text-sm text-gray-600">Signing you in…</div>
      )}
    </main>
  );
}
