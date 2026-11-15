import { describe, expect, it } from "vitest";
import { buildShareResponse, escapeHtml, isValidStoryId, type ShareDeps } from "../../../api/_share";
import { buildCuratedPreviews } from "../../../scripts/curatedPreviews";
import curatedJson from "../../../api/_curated-previews.json";

const deps = (over: Partial<ShareDeps> = {}): ShareDeps => ({
  curated: { "story-1": { title: "A <b>bold</b> \"title\"", description: "It's & more", image: "https://img.test/c.jpg", locale: "fr_CA" } },
  fetchPublic: async (id) => (id === "db_ok" ? { title: "DB story", description: "d", image: null, locale: "en_CA" } : null),
  ...over,
});

describe("E4 share preview", () => {
  it("escapes every user-controlled value", async () => {
    const r = await buildShareResponse("story-1", "https://seen.test", deps());
    expect(r.status).toBe(200);
    expect(r.html).not.toContain("<b>bold</b>");
    expect(r.html).toContain("&lt;b&gt;bold&lt;/b&gt;");
    expect(r.html).toContain('og:locale" content="fr_CA"');
    expect(r.html).toContain("#/story/story-1");
  });
  it("returns 404 without metadata for unknown, unpublished or malformed ids", async () => {
    for (const id of ["nope", "db_missing", "../x", "a b", undefined, "x".repeat(200)]) {
      const r = await buildShareResponse(id, "https://seen.test", deps());
      expect(r.status).toBe(404);
      expect(r.html).not.toContain("og:title");
    }
  });
  it("serves public database stories and treats lookup errors as not found", async () => {
    expect((await buildShareResponse("db_ok", "https://seen.test", deps())).status).toBe(200);
    const broken = deps({ fetchPublic: async () => { throw new Error("down"); } });
    expect((await buildShareResponse("db_ok", "https://seen.test", broken)).status).toBe(404);
  });
  it("never lets a client-looking id reach the database path unless it starts with db_", async () => {
    let called = false;
    await buildShareResponse("curated-x", "https://seen.test", deps({ fetchPublic: async () => { called = true; return null; } }));
    expect(called).toBe(false);
  });
  it("drops non-https cover images and uses short cache for 404", async () => {
    const d = deps({ curated: { s: { title: "t", description: "d", image: "javascript:alert(1)", locale: "en_CA" } } });
    expect((await buildShareResponse("s", "https://seen.test", d)).html).not.toContain("og:image");
    expect((await buildShareResponse("zzz", "https://seen.test", d)).cache).toContain("s-maxage=60");
  });
  it("helpers", () => {
    expect(escapeHtml(`<&>"'`)).toBe("&lt;&amp;&gt;&quot;&#39;");
    expect(isValidStoryId("db_abc-123")).toBe(true);
    expect(isValidStoryId("a/b")).toBe(false);
  });
  it("the committed curated previews match the catalogue (run npm run gen:share)", () => {
    expect(curatedJson).toEqual(JSON.parse(JSON.stringify(buildCuratedPreviews())));
  });
});
