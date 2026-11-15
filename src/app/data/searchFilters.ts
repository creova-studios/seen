/**
 * Search filters over real facets only: language (languagesAvailable), length (sum of chapter minutes)
 * and cultural theme. Figma's Format and Mi'kmaw/Michif options have no data behind them and are not offered.
 */
import type { ContentItem } from "./types";
import { getStoryWorldById } from "./storyDatabase";

export type LengthBucket = "short" | "medium" | "long";
export interface SearchFilters {
  languages: string[];
  length: LengthBucket | null;
  themes: string[];
}

export const emptyFilters = (): SearchFilters => ({ languages: [], length: null, themes: [] });
export const activeFilterCount = (f: SearchFilters) => f.languages.length + (f.length ? 1 : 0) + f.themes.length;

/** Total minutes across chapters; 0 when the story is unknown. */
export function storyMinutes(storyId: string): number {
  const s = getStoryWorldById(storyId);
  return s ? s.chapters.reduce((n, c) => n + (c.estimatedDuration || 0), 0) : 0;
}

export function lengthBucket(minutes: number): LengthBucket {
  return minutes < 15 ? "short" : minutes <= 45 ? "medium" : "long";
}

export function applyFilters(items: ContentItem[], f: SearchFilters, minutes: (id: string) => number = storyMinutes): ContentItem[] {
  return items.filter(i => {
    if (f.languages.length && !f.languages.some(l => (i.language as string[]).includes(l))) return false;
    if (f.themes.length && !f.themes.some(t => i.tags.includes(t))) return false;
    if (f.length && lengthBucket(minutes(i.id)) !== f.length) return false;
    return true;
  });
}

/** Options that exist in the current result set, so a filter can never lead to an empty list by itself being offered blindly. */
export function facetsOf(items: ContentItem[], minutes: (id: string) => number = storyMinutes) {
  const languages = new Set<string>();
  const themes = new Set<string>();
  const lengths = new Set<LengthBucket>();
  for (const i of items) {
    (i.language as string[]).forEach(l => languages.add(l));
    i.tags.forEach(t => themes.add(t));
    lengths.add(lengthBucket(minutes(i.id)));
  }
  return { languages: [...languages].sort(), themes: [...themes].sort(), lengths: (["short", "medium", "long"] as const).filter(b => lengths.has(b)) };
}
