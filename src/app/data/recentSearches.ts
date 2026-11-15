/** Recent searches live on this device only: never sent anywhere, never in analytics (query text is free text). */
const KEY = "seen.v1.recentSearches";
const MAX = 5;

export function getRecentSearches(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  const q = query.trim().slice(0, 80);
  if (q.length < 2) return;
  try {
    const next = [q, ...getRecentSearches().filter(x => x.toLowerCase() !== q.toLowerCase())].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: recents are a convenience only */
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
