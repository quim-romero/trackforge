import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isCypress = typeof window !== "undefined" && "Cypress" in window;

type OkResult<T = unknown> = { data: T | null; error: null };
type OkPromise<T = unknown> = Promise<OkResult<T>>;
type AuthSub = {
  data: { subscription: { unsubscribe: () => void } };
  error: null;
};

interface QueryChain<T = unknown> extends PromiseLike<OkResult<T>> {
  select: (query?: string) => QueryChain<T>;
  insert: (rows: unknown) => QueryChain<T>;
  update: (patch: unknown) => QueryChain<T>;
  upsert: (rows: unknown) => QueryChain<T>;
  delete: () => QueryChain<T>;
  eq: (column: string, value: unknown) => QueryChain<T>;
  order: (
    column: string,
    opts?: { ascending?: boolean; nullsFirst?: boolean }
  ) => QueryChain<T>;
  limit: (n: number) => QueryChain<T>;
  single: () => PromiseLike<OkResult<T>>;
}

export interface SupabaseLike {
  auth: {
    getSession: () => Promise<{ data: { session: null }; error: null }>;
    onAuthStateChange: (
      callback: (event: string, session: unknown) => void
    ) => AuthSub;
    signInWithOAuth: (params: unknown) => OkPromise;
    signInWithOtp: (params: {
      email: string;
      options?: Record<string, unknown>;
    }) => OkPromise;
    signOut: () => OkPromise;
  };
  from: (table: string) => QueryChain;
  rpc: (fn: string, args?: Record<string, unknown>) => OkPromise;
}

function createChain<T = unknown>(): QueryChain<T> {
  const ok: OkResult<T> = { data: null, error: null };

  const chain = {
    select(_query?: string) {
      void _query;
      return chain;
    },
    insert(_rows: unknown) {
      void _rows;
      return chain;
    },
    update(_patch: unknown) {
      void _patch;
      return chain;
    },
    upsert(_rows: unknown) {
      void _rows;
      return chain;
    },
    delete() {
      return chain;
    },
    eq(_column: string, _value: unknown) {
      void _column;
      void _value;
      return chain;
    },
    order(
      _column: string,
      _opts?: { ascending?: boolean; nullsFirst?: boolean }
    ) {
      void _column;
      void _opts;
      return chain;
    },
    limit(_n: number) {
      void _n;
      return chain;
    },
    single() {
      return Promise.resolve(ok);
    },
    then<TResult1 = OkResult<T>, TResult2 = never>(
      onfulfilled?:
        | ((value: OkResult<T>) => TResult1 | PromiseLike<TResult1>)
        | null,
      onrejected?:
        | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
        | null
    ): PromiseLike<TResult1 | TResult2> {
      return Promise.resolve(ok).then(
        onfulfilled === null ? undefined : onfulfilled,
        onrejected === null ? undefined : onrejected
      );
    },
  } as QueryChain<T>;

  return chain;
}

function createMock(): SupabaseLike {
  const ok: OkPromise = Promise.resolve({ data: null, error: null });
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
      signInWithOAuth: (_params) => {
        void _params;
        return ok;
      },
      signInWithOtp: (_params) => {
        void _params;
        return ok;
      },
      signOut: () => ok,
    },
    from: (_table: string) => {
      void _table;
      return createChain();
    },
    rpc: (_fn: string, _args?: Record<string, unknown>) => {
      void _fn;
      void _args;
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
