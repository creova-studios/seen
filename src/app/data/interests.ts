import { getPublicStories } from "./storyDatabase";
import { searchByTheme } from "./searchService";
import type { Language } from "./storyDatabase";
import type { ContentItem } from "./types";

/** Topics people can pick during onboarding: the cultural themes that public stories actually carry, most common first. */
export function availableInterests(): string[] {
  const counts = new Map<string, number>();
  for (const s of getPublicStories()) for (const t of s.culturalThemes) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}

/** Public stories that match any chosen interest, de-duplicated, in catalogue order. */
export function storiesForInterests(interests: string[], language: Language): ContentItem[] {
  const seen = new Set<string>();
  const out: ContentItem[] = [];
  for (const theme of interests) {
    for (const item of searchByTheme(theme, language)) {
      if (item.institutional || seen.has(item.id)) continue;
      seen.add(item.id);
      out.push(item);
    }
  }
  return out;
}
