/**
 * Account data controls (export, delete, notification choices).
 *
 * Everything here works on this device's storage, which is where accounts live
 * until the backend ships (docs/security/). Credentials are never exported:
 * the users table holds a password hash and the session holds an access token,
 * so neither is read here.
 */

const USERS_KEY = "seenos_users_db";
const NOTIFICATION_PREFS_KEY = "seenos_notification_prefs";

/** Keys that hold the signed-in person's own content, safe to hand back to them. */
const EXPORTABLE_KEYS = [
  "seenos_story_state",
  "seenos_user_bookmarks",
  "seenos_user_progress",
  "seenos_user_stories",
  "seenos_creator_drafts",
  NOTIFICATION_PREFS_KEY,
] as const;

/** Keys removed on delete. The shared users table is edited, not removed. */
const CLEARED_PREFIXES = ["seenos_", "seen_", "seen.v1.notes", "seen.v1.blocks"];
const KEPT_ON_DELETE = [USERS_KEY, "seenos_demo_populated"];

type Json = unknown;

function readJson(key: string): Json | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export interface AccountExport {
  exportedAt: string;
  account: { id: string; name: string; email: string; role: string; language?: string } | null;
  data: Record<string, Json>;
}

export function buildAccountExport(user: { id: string; name: string; email: string; role: string; language?: string } | null): AccountExport {
  const data: Record<string, Json> = {};
  for (const key of EXPORTABLE_KEYS) {
    const value = readJson(key);
    if (value !== undefined) data[key] = value;
  }
  return {
    exportedAt: new Date().toISOString(),
    account: user ? { id: user.id, name: user.name, email: user.email, role: user.role, language: user.language } : null,
    data,
  };
}

/** Removes the person's record and every SEEN key they created on this device. */
export function deleteLocalAccount(userId: string): void {
  const db = readJson(USERS_KEY) as Record<string, { id?: string }> | undefined;
  if (db) {
    const next = Object.fromEntries(Object.entries(db).filter(([k, u]) => k !== userId && u?.id !== userId));
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
  }
  for (const key of Object.keys(localStorage)) {
    if (KEPT_ON_DELETE.includes(key)) continue;
    if (CLEARED_PREFIXES.some(p => key.startsWith(p))) localStorage.removeItem(key);
  }
}

export interface NotificationPrefs {
  newStories: boolean;
  fundingDeadlines: boolean;
  replies: boolean;
  /** Opt-in reminders before a published funding deadline. */
  reminders: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = { newStories: true, fundingDeadlines: true, replies: true, reminders: true };

export function loadNotificationPrefs(): NotificationPrefs {
  const saved = readJson(NOTIFICATION_PREFS_KEY) as Partial<NotificationPrefs> | undefined;
  return { ...DEFAULT_NOTIFICATION_PREFS, ...(saved ?? {}) };
}

/** Throws when the device refuses the write, so the caller can roll the toggle back. */
export function saveNotificationPrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
}
