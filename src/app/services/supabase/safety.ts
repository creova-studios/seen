/**
 * Supabase implementation of reports, blocks, notes and preferences.
 * Row-level security on the server is the real enforcement; this layer only maps rows to the
 * contract types and database errors to ServiceError codes. The signed-in user id comes from
 * the session, and the database re-checks it (`reporter_id = auth.uid()`), so a forged id fails.
 */
import { MAX_NOTE_LENGTH, type Note, type Report, type SeenApi } from "../contracts";
import type { ServiceErrorCode } from "../contracts/common";
import { ServiceError } from "../runtime";
import { DbError, type ReportRow, type SafetyDb } from "./db";

const MAX_DETAILS = 500;

export function toServiceError(e: unknown): ServiceError {
  if (e instanceof ServiceError) return e;
  const code = e instanceof DbError ? e.code : "";
  const map: Record<string, [ServiceErrorCode, string]> = {
    "23505": ["conflict", "You already reported this. We're reviewing it."],
    "54000": ["rate_limited", "You've reached the limit for now. Try again later."],
    "23514": ["invalid", "That input isn't valid."],
    "22023": ["invalid", "That isn't available."],
    "42501": ["forbidden", "You don't have permission to do that."],
    P0002: ["not_found", "Not found."],
    PGRST116: ["not_found", "Not found."],
    NETWORK: ["offline", "You appear to be offline."],
  };
  const [c, msg] = map[code] ?? ["unavailable", "The service is temporarily unavailable."];
  return new ServiceError(msg, c);
}

const toReport = (r: ReportRow, me: string | null): Report => ({
  id: r.id,
  targetType: r.target_type,
  targetId: r.target_id,
  targetTitle: r.target_title,
  reason: r.reason as Report["reason"],
  details: r.details ?? undefined,
  createdAt: r.created_at,
  status: r.status,
  reviewedAt: r.reviewed_at ?? undefined,
  // Only other people's reports reach a moderator; the reporter never sees their own id echoed back.
  reporterId: r.reporter_id && r.reporter_id !== me ? r.reporter_id : undefined,
});

export function createSupabaseSafety(db: SafetyDb): Pick<SeenApi, "reports" | "blocks" | "notes" | "preferences"> {
  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (e) {
      throw toServiceError(e);
    }
  };
  const me = async () => {
    const id = await db.userId();
    if (!id) throw new ServiceError("Sign in to continue.", "forbidden");
    return id;
  };

  return {
    reports: {
      submit: input =>
        run(async () => {
          const uid = await me();
          const details = input.details?.trim() || null;
          if (details && details.length > MAX_DETAILS) throw new ServiceError("Details are too long.", "invalid");
          const row = await db.insertReport({
            reporter_id: uid,
            target_type: input.targetType,
            target_id: input.targetId,
            target_title: input.targetTitle.slice(0, 140),
            reason: input.reason,
            details,
          });
          return toReport(row, uid);
        }),
      list: () =>
        run(async () => {
          const uid = await db.userId();
          return (await db.listReports()).map(r => toReport(r, uid));
        }),
      resolve: (id, status) => run(() => db.resolveReport(id, status)),
    },

    blocks: {
      list: () => run(async () => db.listBlocks(await me())),
      block: userId =>
        run(async () => {
          const uid = await me();
          if (userId === uid) throw new ServiceError("You can't block yourself.", "invalid");
          await db.addBlock(uid, userId);
        }),
      unblock: userId => run(async () => db.removeBlock(await me(), userId)),
    },

    notes: {
      send: (storyId, body, opts) =>
        run(async () => {
          const uid = await me();
          const text = body.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
          if (!text || text.length > MAX_NOTE_LENGTH) throw new ServiceError("Notes are 1 to 500 characters.", "invalid");
          try {
            await db.insertNote({ story_id: storyId, sender_id: uid, body: text, sender_named: !!opts?.named });
          } catch (e) {
            // The one-per-story-per-hour rule is a unique index, which Postgres reports as a duplicate.
            if (e instanceof DbError && e.code === "23505") throw new ServiceError("You already sent a note on this story. Try again in an hour.", "rate_limited");
            throw e;
          }
        }),
      received: () =>
        run(async () => {
          const rows = await db.listReceivedNotes(await me());
          return rows.map<Note>(r => ({ id: r.id, storyId: r.story_id, body: r.body, createdAt: r.created_at, senderName: r.sender_name ?? undefined }));
        }),
      remove: id => run(async () => { await me(); await db.deleteNote(id); }),
      blockSender: id => run(async () => { await me(); await db.blockNoteSender(id); }),
    },

    preferences: {
      get: () =>
        run(async () => {
          const row = await db.getPrefs(await me());
          return { newStories: row?.stories ?? true, fundingDeadlines: row?.funding ?? true, replies: row?.replies ?? true, reminders: row?.reminders ?? true };
        }),
      set: prefs =>
        run(async () => {
          await db.upsertPrefs(await me(), { stories: prefs.newStories, funding: prefs.fundingDeadlines, replies: prefs.replies, reminders: prefs.reminders });
          return prefs;
        }),
    },
  };
}
