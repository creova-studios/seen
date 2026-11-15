import type {
  ApplicationState,
  Collection,
  CollectionKind,
  Creator,
  SeenApi,
  SeenNotification,
} from "../contracts";
import { ServiceError, call, readStore, writeStore } from "../runtime";
import { isApplyable, opportunityStatus } from "../funding";
import { demoSafety } from "./safety";
import { buildCollections, buildCreators, seedNotifications } from "./catalog";
import { FUNDING_LISTINGS as FUNDING_SEED } from "../data/fundingListings";

// Derived once per session; the story catalog is static.
let creatorsCache: Creator[] | null = null;
let collectionsCache: Collection[] | null = null;
const creators = () => (creatorsCache ??= buildCreators());
const collections = () => (collectionsCache ??= buildCollections());

function toggle(list: string[], id: string, on: boolean): string[] {
  const set = new Set(list);
  if (on) set.add(id);
  else set.delete(id);
  return [...set];
}

function notificationsStore(): SeenNotification[] {
  let list = readStore<SeenNotification[] | null>("notifications", null);
  if (!list) {
    list = seedNotifications(new Date());
    writeStore("notifications", list);
  }
  // Drop seeded funding notices whose listing has since closed (earlier sessions stored a fixed date).
  const now = new Date();
  return list.filter(n => {
    if (!n.id.startsWith("n-funding-")) return true;
    const o = FUNDING_SEED.find(f => n.id === `n-funding-${f.id}` || n.id === "n-funding-cmf-dcpp" && f.id === n.target?.id);
    return !o || ["open", "closing-soon", "rolling", "upcoming"].includes(opportunityStatus(o, now));
  });
}

/** Push a notification from elsewhere in the app (e.g. after publishing). */
export function pushNotification(n: Omit<SeenNotification, "id" | "createdAt" | "read">) {
  const list = notificationsStore();
  writeStore("notifications", [
    { ...n, id: `n-${Date.now().toString(36)}`, createdAt: new Date().toISOString(), read: false },
    ...list,
  ]);
}

export const demoAdapter: SeenApi = {
  creators: {
    list: () => call(() => creators()),
    get: id =>
      call(() => {
        const c = creators().find(x => x.id === id);
        if (!c) throw new ServiceError("Creator not found.", "not_found");
        return c;
      }),
    listFollowing: () => call(() => readStore<string[]>("following", [])),
    setFollowing: (id, following) =>
      call(() => {
        if (!creators().some(c => c.id === id)) throw new ServiceError("Creator not found.", "not_found");
        writeStore("following", toggle(readStore<string[]>("following", []), id, following));
      }),
  },

  collections: {
    list: (kind?: CollectionKind) => call(() => collections().filter(c => !kind || c.kind === kind)),
    get: id =>
      call(() => {
        const c = collections().find(x => x.id === id);
        if (!c) throw new ServiceError("Collection not found.", "not_found");
        return c;
      }),
    listSaved: () => call(() => readStore<string[]>("savedCollections", [])),
    setSaved: (id, saved) =>
      call(() => {
        if (!collections().some(c => c.id === id)) throw new ServiceError("Collection not found.", "not_found");
        writeStore("savedCollections", toggle(readStore<string[]>("savedCollections", []), id, saved));
      }),
  },

  funding: {
    list: () => call(() => FUNDING_SEED),
    get: id =>
      call(() => {
        const o = FUNDING_SEED.find(x => x.id === id);
        if (!o) throw new ServiceError("Opportunity not found.", "not_found");
        return o;
      }),
    listApplications: () => call(() => Object.values(readStore<Record<string, ApplicationState>>("applications", {}))),
    getApplication: id =>
      call(() => {
        const apps = readStore<Record<string, ApplicationState>>("applications", {});
        return apps[id] ?? { opportunityId: id, status: "none", completedSteps: [], updatedAt: new Date(0).toISOString() };
      }),
    updateApplication: (id, patch) =>
      call(() => {
        const opp = FUNDING_SEED.find(x => x.id === id);
        if (!opp) throw new ServiceError("Opportunity not found.", "not_found");
        const apps = readStore<Record<string, ApplicationState>>("applications", {});
        const prev = apps[id] ?? { opportunityId: id, status: "none" as const, completedSteps: [], updatedAt: "" };
        const completedSteps = (patch.completedSteps ?? prev.completedSteps).filter(i => i >= 0 && i < opp.steps.length);
        if (patch.status === "applied" && !isApplyable(opportunityStatus(opp))) {
          throw new ServiceError("This intake isn't open, so it can't be marked as applied yet.", "invalid");
        }
        if (patch.status === "applied" && completedSteps.length < opp.steps.length) {
          throw new ServiceError("Complete every checklist step before marking as applied.", "invalid");
        }
        const status = patch.status ?? prev.status;
        let outcome = status === "applied" ? (patch.outcome !== undefined ? patch.outcome : prev.outcome ?? null) : null;
        if (patch.outcome && prev.status !== "applied") {
          throw new ServiceError("Mark the application as applied before recording an outcome.", "invalid");
        }
        const next: ApplicationState = {
          opportunityId: id,
          status,
          outcome,
          eligibilityAnswers: patch.eligibilityAnswers ?? prev.eligibilityAnswers,
          notes: patch.notes !== undefined ? patch.notes.slice(0, 1000) : prev.notes,
          completedSteps: [...new Set(completedSteps)].sort((a, b) => a - b),
          updatedAt: new Date().toISOString(),
        };
        apps[id] = next;
        writeStore("applications", apps);
        return next;
      }),
  },

  notifications: {
    list: () => call(() => [...notificationsStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
    markRead: id =>
      call(() => {
        writeStore(
          "notifications",
          notificationsStore().map(n => (n.id === id ? { ...n, read: true } : n)),
        );
      }),
    markAllRead: () =>
      call(() => {
        writeStore(
          "notifications",
          notificationsStore().map(n => ({ ...n, read: true })),
        );
      }),
    unreadCount: () => call(() => notificationsStore().filter(n => !n.read).length),
  },
  ...demoSafety,
};
