import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/**
 * The shared code (story catalogue, drafts, published stories) was written for a browser and keeps its data in
 * `localStorage`. The phone has none, so this provides one: reads are instant (memory) and every write is copied to
 * AsyncStorage, which is loaded back at start (`hydrateLocalStorage`). So drafts and published stories survive closing the app.
 */
const PREFIX = 'ls:';
const mem = new Map<string, string>();
const shim = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => {
    mem.set(k, String(v));
    AsyncStorage.setItem(PREFIX + k, String(v)).catch(() => {});
  },
  removeItem: (k: string) => {
    mem.delete(k);
    AsyncStorage.removeItem(PREFIX + k).catch(() => {});
  },
  clear: () => {
    const keys = [...mem.keys()];
    mem.clear();
    AsyncStorage.multiRemove(keys.map(k => PREFIX + k)).catch(() => {});
  },
  key: (i: number) => [...mem.keys()][i] ?? null,
  get length() {
    return mem.size;
  },
};

const g = globalThis as unknown as { localStorage?: unknown; crypto?: { randomUUID?: () => string } };
if (!g.localStorage) g.localStorage = shim;
// Publishing uses crypto.randomUUID(), which React Native does not have.
if (!g.crypto) g.crypto = {};
if (!g.crypto.randomUUID) g.crypto.randomUUID = () => Crypto.randomUUID();

/** Loads what was saved last time. Call once before the app shows saved data. */
export async function hydrateLocalStorage() {
  try {
    const keys = (await AsyncStorage.getAllKeys()).filter(k => k.startsWith(PREFIX));
    const pairs = await AsyncStorage.multiGet(keys);
    pairs.forEach(([k, v]) => v != null && mem.set(k.slice(PREFIX.length), v));
  } catch {
    /* start empty */
  }
}
