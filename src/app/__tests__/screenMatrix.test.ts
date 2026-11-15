import { describe, expect, it } from "vitest";
import frames from "../../../docs/design/figma-frames.json";
import matrix from "../../../docs/design/screen-matrix.json";

type Row = { id: string; name: string; status: string; note: string };
const rows = matrix as Row[];
const frameList = (frames as [string, string][]).map(([id]) => ({ id }));

describe("Figma screen coverage matrix", () => {
  it("accounts for every Figma frame", () => {
    const ids = new Set(rows.map(r => r.id));
    const missing = frameList.filter(f => !ids.has(f.id)).map(f => f.id);
    expect(missing).toEqual([]);
  });

  it("has no MISSING rows", () => {
    expect(rows.filter(r => r.status === "MISSING").map(r => r.name)).toEqual([]);
  });

  it("explains every excluded, outdated, duplicate and partial row", () => {
    const needs = new Set(["EXCLUDED", "OUTDATED", "DUPLICATE", "PARTIAL"]);
    const bare = rows.filter(r => needs.has(r.status) && !(r.note && r.note.trim().length > 8)).map(r => r.name);
    expect(bare).toEqual([]);
  });
});
