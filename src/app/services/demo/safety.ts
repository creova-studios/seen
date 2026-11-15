/**
 * Demo adapter for reports, blocks, notes and preferences.
 * Reports and preferences delegate to the existing local stores so stored data and
 * existing behaviour are unchanged. Identity comes from the demo auth session; the
 * real backend takes it from the signed-in JWT (never from the client).
 * Staff checks here are UX only; RLS enforces them on the backend.
 */
import {
  DuplicateReportError,
  listReports,
  MAX_DETAILS,
  resolveReport,
  submitReport,
} from "../../data/reportService";
import { DEFAULT_NOTIFICATION_PREFS, loadNotificationPrefs, saveNotificationPrefs } from "../../data/accountData";
import { MAX_NOTE_LENGTH, type Note, type SeenApi } from "../contracts";
import { ServiceError, call, readStore, writeStore } from "../runtime";

const SESSION_KEY = "seenos_auth_session";
const USERS_KEY = "seenos_users_db";

interface Actor { id: string; name?: string }

function actor(): Actor | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as { userId?: string; expiresAt?: number };
    if (!s.userId || (s.expiresAt && s.expiresAt < Date.now())) return null;
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}") as Record<string, { id?: string; name?: string }>;
    return { id: s.userId, name: users[s.userId]?.name };
  } catch {
    return null;
  }
}

function requireActor(): Actor {
  const a = actor();
  if (!a) throw new ServiceError("Sign in to continue.", "forbidden");
  return a;
}

// ---- notes (stored locally; sender and creator are both this device in the demo)
interface StoredNote extends Note { senderId: string; creatorId: string }
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const demoSafety: Pick<SeenApi, "reports" | "blocks" | "notes" | "preferences"> = {
  reports: {
    submit: input =>
      call(() => {
        const a = requireActor();
        if ((input.details ?? "").trim().length > MAX_DETAILS) throw new ServiceError("Details are too long.", "invalid");
        try {
          const r = submitReport({ ...input, targetType: input.targetType as "story" | "creator", reporterId: a.id });
          return { ...r, reporterId: undefined };
        } catch (e) {
          if (e instanceof DuplicateReportError) throw new ServiceError(e.message, "conflict");
          throw e;
        }
      }),
    list: () => call(() => listReports().map(r => ({ ...r, targetType: r.targetType }))),
    resolve: (id, status) =>
      call(() => {
        try {
          resolveReport(id, status, actor()?.id ?? "mod-demo");
        } catch {
          throw new ServiceError("Report not found.", "not_found");
        }
      }),
  },

  blocks: {
    list: () => call(() => readStore<string[]>(`blocks.${requireActor().id}`, [])),
    block: userId =>
      call(() => {
        const a = requireActor();
        if (userId === a.id) throw new ServiceError("You can't block yourself.", "invalid");
        const key = `blocks.${a.id}`;
        writeStore(key, [...new Set([...readStore<string[]>(key, []), userId])]);
      }),
    unblock: userId =>
      call(() => {
        const key = `blocks.${requireActor().id}`;
        writeStore(key, readStore<string[]>(key, []).filter(x => x !== userId));
        writeStore("blocked-senders", readStore<string[]>("blocked-senders", []).filter(x => x !== userId));
      }),
  },

  notes: {
    send: (storyId, body, opts) =>
      call(() => {
        const a = requireActor();
        const text = body.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
        if (!text || text.length > MAX_NOTE_LENGTH) throw new ServiceError("Notes are 1 to 500 characters.", "invalid");
        if (readStore<string[]>("blocked-senders", []).includes(a.id)) throw new ServiceError("You can't send a note to this creator.", "forbidden");
        const all = readStore<StoredNote[]>("notes", []);
        const now = Date.now();
        const mine = all.filter(n => n.senderId === a.id);
        if (mine.some(n => n.storyId === storyId && now - Date.parse(n.createdAt) < HOUR)) {
          throw new ServiceError("You already sent a note on this story. Try again in an hour.", "rate_limited");
        }
        if (mine.filter(n => now - Date.parse(n.createdAt) < DAY).length >= 20) {
          throw new ServiceError("Daily note limit reached.", "rate_limited");
        }
        const note: StoredNote = {
          id: `note_${crypto.randomUUID()}`,
          storyId,
          body: text,
          createdAt: new Date(now).toISOString(),
          senderId: a.id,
          creatorId: `creator-of-${storyId}`,
          senderName: opts?.named ? a.name : undefined,
        };
        writeStore("notes", [note, ...all]);
      }),
    // Demo: the signed-in person is shown every note, so the inbox can be exercised end to end.
    received: () =>
      call(() => {
        requireActor();
        return readStore<StoredNote[]>("notes", []).map(({ senderId: _s, creatorId: _c, ...n }) => n);
      }),
    remove: id =>
      call(() => {
        requireActor();
        writeStore("notes", readStore<StoredNote[]>("notes", []).filter(n => n.id !== id));
      }),
    // Demo approximation: one device-wide list of blocked senders (the backend scopes this per creator).
    blockSender: noteId =>
      call(() => {
        const a = requireActor();
        const note = readStore<StoredNote[]>("notes", []).find(n => n.id === noteId);
        if (!note) throw new ServiceError("Note not found.", "not_found");
        writeStore("blocked-senders", [...new Set([...readStore<string[]>("blocked-senders", []), note.senderId])]);
        const key = `blocks.${a.id}`;
        writeStore(key, [...new Set([...readStore<string[]>(key, []), note.senderId])]);
      }),
  },

  preferences: {
    get: () => call(() => ({ ...DEFAULT_NOTIFICATION_PREFS, reminders: true, ...loadNotificationPrefs() })),
    set: prefs =>
      call(() => {
        try {
          saveNotificationPrefs(prefs);
        } catch {
          throw new ServiceError("Couldn't save your choices.", "unavailable");
        }
        return prefs;
      }),
  },
};
