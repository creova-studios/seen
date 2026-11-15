import { beforeEach, describe, expect, it } from "vitest";
import { activeFilterCount, applyFilters, emptyFilters, facetsOf, lengthBucket } from "../data/searchFilters";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "../data/recentSearches";
import type { ContentItem } from "../data/types";

const item = (id: string, language: string[], tags: string[]) => ({ id, language, tags } as unknown as ContentItem);
const items = [item("a", ["en"], ["Memory"]), item("b", ["en", "fr"], ["Migration"]), item("c", ["es"], ["Memory", "Music"])];
const mins: Record<string, number> = { a: 10, b: 30, c: 60 };
const m = (id: string) => mins[id];

describe("search filters", () => {
  it("buckets length", () => {
    expect([lengthBucket(10), lengthBucket(15), lengthBucket(45), lengthBucket(46)]).toEqual(["short", "medium", "medium", "long"]);
  });
  it("filters by language, theme and length together", () => {
    expect(applyFilters(items, { ...emptyFilters(), languages: ["fr"] }, m).map(i => i.id)).toEqual(["b"]);
    expect(applyFilters(items, { ...emptyFilters(), themes: ["Memory"] }, m).map(i => i.id)).toEqual(["a", "c"]);
    expect(applyFilters(items, { languages: ["en"], themes: ["Memory"], length: "short" }, m).map(i => i.id)).toEqual(["a"]);
    expect(applyFilters(items, emptyFilters(), m)).toHaveLength(3);
  });
  it("counts active filters and lists real facets", () => {
    expect(activeFilterCount({ languages: ["en", "fr"], length: "long", themes: [] })).toBe(3);
    const f = facetsOf(items, m);
    expect(f.languages).toEqual(["en", "es", "fr"]);
    expect(f.lengths).toEqual(["short", "medium", "long"]);
  });
});

describe("recent searches", () => {
  beforeEach(() => localStorage.clear());
  it("keeps five, newest first, no duplicates, ignores tiny queries", () => {
    for (const q of ["africville", "jazz", "memory", "music", "home", "africville", "x"]) addRecentSearch(q);
    expect(getRecentSearches()).toEqual(["africville", "home", "music", "memory", "jazz"]);
    clearRecentSearches();
    expect(getRecentSearches()).toEqual([]);
  });
});
