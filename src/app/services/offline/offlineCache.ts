/**
 * Offline story cache rules (E6, D19 + eng review).
 * - at most 20 stories (text and capped cover), no automatic eviction
 * - an entry is valid for 14 days offline, then must be revalidated online
 * - cleared on sign-out; upstream-removed stories are purged on sync
 * Storage is injected so rules are testable without IndexedDB; the browser
 * implementation can wrap IndexedDB behind the same interface.
 */
export const MAX_OFFLINE_STORIES = 20;
export const OFFLINE_TTL_MS = 14 * 24 * 60 * 60 * 1000;
export const MAX_COVER_BYTES = 300 * 1024;

export interface OfflineEntry {
  id: string;
  savedAt: number;
  title: string;
  body: string;
  cover?: Blob | string | null;
  coverBytes?: number;
}

export interface OfflineStore {
  all(): Promise<OfflineEntry[]>;
  put(entry: OfflineEntry): Promise<void>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

export type SaveResult = "saved" | "limit" | "quota";
export type ReadResult = { state: "ok"; entry: OfflineEntry } | { state: "unavailable" | "expired" };

export function createOfflineCache(store: OfflineStore, now: () => number = Date.now) {
  return {
    async save(entry: Omit<OfflineEntry, "savedAt">): Promise<SaveResult> {
      const existing = await store.all();
      const isUpdate = existing.some((e) => e.id === entry.id);
      if (!isUpdate && existing.length >= MAX_OFFLINE_STORIES) return "limit";
      const cover = (entry.coverBytes ?? 0) > MAX_COVER_BYTES ? null : entry.cover;
      try {
        await store.put({ ...entry, cover, savedAt: now() });
        return "saved";
      } catch {
        return "quota"; // device full or storage evicted: visible error, never silent
      }
    },
    async read(id: string): Promise<ReadResult> {
      const entry = (await store.all()).find((e) => e.id === id);
      if (!entry) return { state: "unavailable" };
      if (now() - entry.savedAt > OFFLINE_TTL_MS) return { state: "expired" };
      return { state: "ok", entry };
    },
    /** Called when online: drops entries whose story is no longer public. Returns purged ids. */
    async sync(stillAvailable: (id: string) => Promise<boolean>): Promise<string[]> {
      const purged: string[] = [];
      for (const e of await store.all()) {
        if (!(await stillAvailable(e.id))) {
          await store.remove(e.id);
          purged.push(e.id);
        } else if (now() - e.savedAt > OFFLINE_TTL_MS) {
          await store.put({ ...e, savedAt: now() }); // revalidated online
        }
      }
      return purged;
    },
    remove: (id: string) => store.remove(id),
    /** Sign-out and account deletion. */
    clearAll: () => store.clear(),
  };
}

export function memoryStore(opts: { failPut?: boolean } = {}): OfflineStore {
  const m = new Map<string, OfflineEntry>();
  return {
    async all() { return [...m.values()]; },
    async put(e) { if (opts.failPut) throw new DOMException("full", "QuotaExceededError"); m.set(e.id, e); },
    async remove(id) { m.delete(id); },
    async clear() { m.clear(); },
  };
}
