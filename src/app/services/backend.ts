/**
 * Which data layer the app uses. Demo (localStorage) is the default and needs no
 * server, so the app can be shown to anyone while the Supabase project is paused.
 * Supabase is used only when VITE_BACKEND=supabase AND both VITE_SUPABASE_URL and
 * VITE_SUPABASE_ANON_KEY are set; anything missing falls back to demo.
 */
export type BackendMode = "demo" | "supabase";

export interface BackendEnv {
  VITE_BACKEND?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

export function resolveBackend(env: BackendEnv): { mode: BackendMode; reason: string } {
  if (env.VITE_BACKEND !== "supabase") return { mode: "demo", reason: "VITE_BACKEND is not 'supabase'" };
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) return { mode: "demo", reason: "Supabase URL or anon key missing" };
  if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(env.VITE_SUPABASE_URL)) return { mode: "demo", reason: "Supabase URL looks wrong" };
  return { mode: "supabase", reason: "configured" };
}

export const backend = resolveBackend((import.meta.env ?? {}) as BackendEnv);
