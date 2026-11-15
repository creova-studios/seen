import type { ISODate } from "./common";

// ----------------------------------------------------------------- Reports
export type ReportReason = "harassment" | "misinformation" | "rights" | "sensitive" | "spam" | "other";
export type ReportTarget = "story" | "creator" | "collection";
export type ReportStatus = "open" | "action_taken" | "dismissed";

export interface Report {
  id: string;
  targetType: ReportTarget;
  targetId: string;
  targetTitle: string;
  reason: ReportReason;
  details?: string;
  createdAt: ISODate;
  status: ReportStatus;
  reviewedAt?: ISODate;
  /** Only present for moderators. Never shown to the reported person. */
  reporterId?: string;
}

export interface NewReport {
  targetType: ReportTarget;
  targetId: string;
  targetTitle: string;
  reason: ReportReason;
  /** At most 500 characters, plain text. */
  details?: string;
}

/**
 * submit: forbidden when signed out; `invalid` when details are too long;
 * `conflict` when the same person already has an open report on the target.
 * list/resolve: moderators and admins only (forbidden otherwise).
 */
export interface ReportsApi {
  submit(input: NewReport): Promise<Report>;
  list(): Promise<Report[]>;
  resolve(id: string, status: Exclude<ReportStatus, "open">): Promise<void>;
}

// ------------------------------------------------------------------ Blocks
export interface BlocksApi {
  /** Opaque ids of accounts you blocked (never names or emails). */
  list(): Promise<string[]>;
  block(userId: string): Promise<void>;
  unblock(userId: string): Promise<void>;
}

// ------------------------------------------------------------------- Notes
/** A private one-way note from a reader to a story's creator. No public counts. */
export interface Note {
  id: string;
  storyId: string;
  body: string;
  createdAt: ISODate;
  /** Set only for the creator who receives the note, and only when the sender chose to be named. */
  senderName?: string;
}

export const MAX_NOTE_LENGTH = 500;

/**
 * send: forbidden when signed out or blocked by the creator; `invalid` when empty
 * or over 500 characters; `rate_limited` for a second note on a story in the same hour
 * or more than 20 notes in 24 hours.
 * received: the creator's inbox. remove: the creator deletes a note.
 */
export interface NotesApi {
  send(storyId: string, body: string, opts?: { named?: boolean }): Promise<void>;
  received(): Promise<Note[]>;
  remove(id: string): Promise<void>;
  /**
   * Blocks whoever sent this note without revealing who they are. Earlier notes stay;
   * new notes from them are refused (`forbidden`). Reversible with `blocks.unblock`.
   */
  blockSender(noteId: string): Promise<void>;
}

// ------------------------------------------------------------- Preferences
export interface NotificationPrefs {
  newStories: boolean;
  fundingDeadlines: boolean;
  replies: boolean;
  /** Opt-in reminders before a published funding deadline (E5). */
  reminders: boolean;
}

export interface PreferencesApi {
  get(): Promise<NotificationPrefs>;
  /** Persists the full set; rejects when the write fails so the UI can roll back. */
  set(prefs: NotificationPrefs): Promise<NotificationPrefs>;
}
