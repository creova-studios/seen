/**
 * The few database operations the safety adapter needs. The real implementation
 * (client.ts) talks to Supabase; tests use an in-memory fake with the same rules.
 * Errors carry the Postgres SQLSTATE so the adapter can map them to ServiceError codes.
 */
export class DbError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "DbError";
  }
}

export interface ReportRow {
  id: string;
  reporter_id: string | null;
  target_type: "story" | "creator" | "collection";
  target_id: string;
  target_title: string;
  reason: string;
  details: string | null;
  status: "open" | "action_taken" | "dismissed";
  reviewed_at: string | null;
  created_at: string;
}

export interface NoteRow {
  id: string;
  story_id: string;
  body: string;
  created_at: string;
  sender_name: string | null;
}

export interface PrefsRow {
  stories: boolean;
  funding: boolean;
  replies: boolean;
  reminders: boolean;
}

export interface SafetyDb {
  /** The signed-in user's id from the session, or null. Never taken from the client's own claims. */
  userId(): Promise<string | null>;
  insertReport(input: { reporter_id: string; target_type: string; target_id: string; target_title: string; reason: string; details: string | null }): Promise<ReportRow>;
  listReports(): Promise<ReportRow[]>;
  resolveReport(id: string, status: "action_taken" | "dismissed"): Promise<void>;
  listBlocks(blocker: string): Promise<string[]>;
  addBlock(blocker: string, blocked: string): Promise<void>;
  removeBlock(blocker: string, blocked: string): Promise<void>;
  insertNote(input: { story_id: string; sender_id: string; body: string; sender_named: boolean }): Promise<void>;
  listReceivedNotes(creator: string): Promise<NoteRow[]>;
  deleteNote(id: string): Promise<void>;
  blockNoteSender(id: string): Promise<void>;
  getPrefs(user: string): Promise<PrefsRow | null>;
  upsertPrefs(user: string, row: PrefsRow): Promise<void>;
}
