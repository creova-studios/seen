import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** DS8: the copy deck must have EN, FR and ES for every consent/note string, with the same {placeholders}. */
const deck = readFileSync(`${process.cwd()}/docs/design/COPY_DECK.md`, "utf8");
const section = deck.split("## E1 private note")[1].split("## Sign-in states")[0];
const rows = section.split("\n").filter(l => /^\| (note|inbox)\./.test(l)).map(l => l.split("|").slice(1, -1).map(c => c.trim()));
const slots = (s: string) => (s.match(/\{[a-z]+\}/g) ?? []).sort().join(",");

describe("copy deck coverage", () => {
  it("has rows", () => expect(rows.length).toBeGreaterThan(10));
  it("has EN, FR and ES for every note and inbox string", () => {
    for (const [key, en, fr, es] of rows) {
      expect(en, key).toBeTruthy();
      expect(fr, key).toBeTruthy();
      expect(es, key).toBeTruthy();
    }
  });
  it("keeps placeholders identical across languages", () => {
    for (const [key, en, fr, es] of rows) {
      expect(slots(fr), key).toBe(slots(en));
      expect(slots(es), key).toBe(slots(en));
    }
  });
});
