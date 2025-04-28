import {
  createClient,
  type Session,
  type AuthChangeEvent,
} from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isCypress = typeof window !== "undefined" && "Cypress" in window;

type ApiError = { message: string };

type OkResult<T> = { data: T | null; error: ApiError | null };
type OkPromise<T> = Promise<OkResult<T>>;
type AuthSub = {
  data: { subscription: { unsubscribe: () => void } };
  error: null;
};

interface QueryListChain<T = unknown> extends PromiseLike<OkResult<T[]>> {
  select: (query?: string) => QueryListChain<T>;
  insert: (rows: unknown) => QueryListChain<T>;
  update: (patch: unknown) => QueryListChain<T>;
  upsert: (rows: unknown) => QueryListChain<T>;
  delete: () => QueryListChain<T>;
  eq: (column: string, value: unknown) => QueryListChain<T>;
  order: (
    column: string,
    opts?: { ascending?: boolean; nullsFirst?: boolean }
  ) => QueryListChain<T>;
  limit: (n: number) => QueryListChain<T>;
  single: () => PromiseLike<OkResult<T>>;
}

export type VerifyOtpParamsLite = {
  type: "magiclink" | "recovery" | "invite" | "email_change";
  token_hash?: string;
  email?: string;
  phone?: string;
  token?: string;
  captchaToken?: string;
};

export interface SupabaseLike {
  auth: {
    getSession: () => Promise<{
      data: { session: Session | null };
      error: null;
    }>;
    onAuthStateChange: (
      callback: (event: AuthChangeEvent, session: Session | null) => void
    ) => AuthSub;
    signInWithOAuth: (params: unknown) => OkPromise<unknown>;
    signInWithOtp: (params: {
      email: string;
      options?: Record<string, unknown>;
    }) => OkPromise<unknown>;
    verifyOtp: (
      params: VerifyOtpParamsLite
    ) => OkPromise<{ session: Session | null }>;
    signOut: () => OkPromise<unknown>;
  };
  from: <T = unknown>(table: string) => QueryListChain<T>;
  rpc: <T = unknown>(
    fn: string,
    args?: Record<string, unknown>
  ) => OkPromise<T>;
}

function createListChain<T = unknown>(): QueryListChain<T> {
  const okList: OkResult<T[]> = { data: null, error: null };
  const okSingle: OkResult<T> = { data: null, error: null };

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
      return {
        then<TResult1 = OkResult<T>, TResult2 = never>(
          onfulfilled?:
            | ((value: OkResult<T>) => TResult1 | PromiseLike<TResult1>)
            | null,
          onrejected?:
            | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
            | null
        ): PromiseLike<TResult1 | TResult2> {
          return Promise.resolve(okSingle).then(
            onfulfilled === null ? undefined : onfulfilled,
            onrejected === null ? undefined : onrejected
          );
        },
      };
    },
    then<TResult1 = OkResult<T[]>, TResult2 = never>(
      onfulfilled?:
        | ((value: OkResult<T[]>) => TResult1 | PromiseLike<TResult1>)
        | null,
      onrejected?:
        | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
        | null
    ): PromiseLike<TResult1 | TResult2> {
      return Promise.resolve(okList).then(
        onfulfilled === null ? undefined : onfulfilled,
        onrejected === null ? undefined : onrejected
      );
    },
  } as QueryListChain<T>;

  return chain;
}

function createMock(): SupabaseLike {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (_callback) => {
        void _callback;
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
        return Promise.resolve({ data: null, error: null });
      },
      signInWithOtp: (_params) => {
        void _params;
        return Promise.resolve({ data: null, error: null });
      },
      verifyOtp: (_params) => {
        void _params;
        return Promise.resolve({ data: { session: null }, error: null });
      },
      signOut: () => Promise.resolve({ data: null, error: null }),
    },
    from: <T = unknown>(_table: string) => {
      void _table;
      return createListChain<T>();
    },
    rpc: <T = unknown>(_fn: string, _args?: Record<string, unknown>) => {
      void _fn;
      void _args;
      return Promise.resolve({ data: null as T | null, error: null });
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
