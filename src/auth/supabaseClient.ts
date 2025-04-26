import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isCypress = typeof window !== "undefined" && "Cypress" in window;

type Ok = Promise<{ data: unknown; error: null }>;
type AuthSub = {
  data: { subscription: { unsubscribe: () => void } };
  error: null;
};

export interface SupabaseLike {
  auth: {
    getSession: () => Promise<{ data: { session: null }; error: null }>;
    onAuthStateChange: (
      callback: (event: string, session: unknown) => void
    ) => AuthSub;
    signInWithOAuth: (params: unknown) => Ok;
    signOut: () => Ok;
  };
  from: (table: string) => {
    select: (query?: string) => Ok;
    insert: (rows: unknown) => Ok;
    update: (patch: unknown) => Ok;
    delete: () => Ok;
  };
  rpc: (fn: string, args?: Record<string, unknown>) => Ok;
}

function createMock(): SupabaseLike {
  const ok: Ok = Promise.resolve({ data: null, error: null });
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback) => {
        try {
          callback("INITIAL", null);
        } catch {
          void 0;
        }
        return {
          data: {
            subscription: {
              unsubscribe() {},
            },
          },
          error: null,
        };
      },
      signInWithOAuth: (params) => {
        void params;
        return ok;
      },
      signOut: () => ok,
    },
    from: (table: string) => {
      void table;
      return {
        select: (query?: string) => {
          void query;
          return ok;
        },
        insert: (rows: unknown) => {
          void rows;
          return ok;
        },
        update: (patch: unknown) => {
          void patch;
          return ok;
        },
        delete: () => ok,
      };
    },
    rpc: (fn: string, args?: Record<string, unknown>) => {
      void fn;
      void args;
      return ok;
    },
  };
}

const useReal = !!url && !!anon && !isCypress;

export const supabase: SupabaseLike = useReal
  ? (createClient(url!, anon!) as unknown as SupabaseLike)
  : createMock();

if (!useReal && !isCypress) {
  console.warn(
    "[supabaseClient] Supabase env vars missing. Using mock client (no network calls)."
  );
}
