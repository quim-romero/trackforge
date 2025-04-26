import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isCypress =
  typeof window !== "undefined" &&
  typeof (window as any).Cypress !== "undefined";

function createMock() {
  const ok = Promise.resolve({ data: null, error: null });
  return {
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: (_cb: any) => ({
        data: { subscription: { unsubscribe() {} } },
        error: null,
      }),
      signInWithOAuth: () => ok,
      signOut: () => ok,
    },
    from: (_table: string) => ({
      select: () => ok,
      insert: () => ok,
      update: () => ok,
      delete: () => ok,
    }),
    rpc: () => ok,
  };
}

const useReal = !!url && !!anon && !isCypress;

export const supabase = useReal ? createClient(url!, anon!) : createMock();

if (!useReal && !isCypress) {
  console.warn(
    "[supabaseClient] Supabase env vars missing. Using mock client (no network calls)."
  );
}
