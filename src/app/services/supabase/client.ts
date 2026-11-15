/**
 * Real Supabase database access. Loaded lazily (dynamic import) so the demo build never ships it.
 * Uses only the public anon key; the signed-in user's JWT is attached by supabase-js and Postgres
 * row-level security decides what is allowed.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { backend } from "../backend";
import { DbError, type NoteRow, type PrefsRow, type ReportRow, type SafetyDb } from "./db";

export function createSafetyDb(client: SupabaseClient): SafetyDb {
  const ok = <T,>(res: { data: T | null; error: { code?: string; message: string } | null }): T => {
    if (res.error) throw new DbError(res.error.message, res.error.code ?? (/fetch|network/i.test(res.error.message) ? "NETWORK" : ""));
    return res.data as T;
  };
  const cols = "id, reporter_id, target_type, target_id, target_title, reason, details, status, reviewed_at, created_at";
  return {
    async userId() {
      const { data } = await client.auth.getUser();
      return data.user?.id ?? null;
    },
    async insertReport(input) {
      return ok(await client.from("reports").insert(input).select(cols).single()) as ReportRow;
    },
    async listReports() {
      return ok(await client.from("reports").select(cols).order("created_at", { ascending: false })) as ReportRow[];
    },
    async resolveReport(id, status) {
      ok(await client.rpc("resolve_report", { report_id: id, new_status: status }));
    },
    async listBlocks(blocker) {
      return (ok(await client.from("blocks").select("blocked_id").eq("blocker_id", blocker)) as { blocked_id: string }[]).map(r => r.blocked_id);
    },
    async addBlock(blocker, blocked) {
      ok(await client.from("blocks").upsert({ blocker_id: blocker, blocked_id: blocked }));
    },
    async removeBlock(blocker, blocked) {
      ok(await client.from("blocks").delete().eq("blocker_id", blocker).eq("blocked_id", blocked));
    },
    async insertNote(input) {
      ok(await client.from("notes").insert(input));
    },
    async listReceivedNotes(creator) {
      return ok(
        await client.from("notes").select("id, story_id, body, created_at, sender_name").eq("creator_id", creator).order("created_at", { ascending: false }),
      ) as NoteRow[];
    },
    async deleteNote(id) {
      ok(await client.from("notes").delete().eq("id", id));
    },
    async blockNoteSender(id) {
      ok(await client.rpc("block_note_sender", { note_id: id }));
    },
    async getPrefs(user) {
      return ok(await client.from("notification_prefs").select("stories, funding, replies, reminders").eq("user_id", user).maybeSingle()) as PrefsRow | null;
    },
    async upsertPrefs(user, row) {
      ok(await client.from("notification_prefs").upsert({ user_id: user, ...row, updated_at: new Date().toISOString() }));
    },
  };
}

let clientPromise: Promise<SupabaseClient> | null = null;

/** One shared client. PKCE keeps auth codes in the query string so they never collide with the #/ routes. */
export function getSupabaseClient(): Promise<SupabaseClient> {
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) => {
    const env = import.meta.env as Record<string, string | undefined>;
    if (backend.mode !== "supabase") throw new Error("Supabase is not configured");
    return createClient(env.VITE_SUPABASE_URL!, env.VITE_SUPABASE_ANON_KEY!, {
      auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true },
    });
  });
  return clientPromise;
}

/** SafetyDb that creates the client on first use. */
export function lazySafetyDb(): SafetyDb {
  let real: Promise<SafetyDb> | null = null;
  const db = () => (real ??= getSupabaseClient().then(createSafetyDb));
  return new Proxy({} as SafetyDb, {
    get: (_t, name: string) => async (...args: unknown[]) => ((await db()) as unknown as Record<string, (...a: unknown[]) => unknown>)[name](...args),
  });
}
