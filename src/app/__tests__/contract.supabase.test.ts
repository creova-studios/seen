import { describe, expect, it } from "vitest";
import { demoAdapter } from "../services/demo/adapter";
import { createSupabaseSafety } from "../services/supabase/safety";
import { setLatency } from "../services/runtime";
import { runContractSuite } from "./contract.shared";
import { createFakeSafetyDb } from "./fakeSafetyDb";

setLatency(0);
// The same behavioural suite as the demo adapter, against the Supabase mapping layer.
runContractSuite("supabase adapter (fake database)", () => ({ ...demoAdapter, ...createSupabaseSafety(createFakeSafetyDb()) }));

describe("supabase adapter: mapping", () => {
  it("is forbidden when signed out", async () => {
    const db = createFakeSafetyDb();
    db.signOut();
    const api = createSupabaseSafety(db);
    await expect(api.notes.send("s", "hi")).rejects.toMatchObject({ code: "forbidden" });
    await expect(api.reports.submit({ targetType: "story", targetId: "s", targetTitle: "S", reason: "spam" })).rejects.toMatchObject({ code: "forbidden" });
    await expect(api.blocks.list()).rejects.toMatchObject({ code: "forbidden" });
  });
  it("never echoes the reporter's own id and hides notes' sender", async () => {
    const api = createSupabaseSafety(createFakeSafetyDb());
    const r = await api.reports.submit({ targetType: "creator", targetId: "kira", targetTitle: "Kira", reason: "spam" });
    expect(r.reporterId).toBeUndefined();
    await api.notes.send("s1", "hello", { named: false });
    const [note] = await api.notes.received();
    expect(Object.keys(note)).not.toContain("senderId");
    expect(note.senderName).toBeUndefined();
  });
  it("maps database errors to typed service errors", async () => {
    const db = createFakeSafetyDb();
    db.upsertPrefs = async () => { throw new Error("boom"); };
    await expect(createSupabaseSafety(db).preferences.set({ newStories: true, fundingDeadlines: true, replies: true, reminders: true })).rejects.toMatchObject({ code: "unavailable" });
  });
  it("blockSender on an unknown note is not_found", async () => {
    await expect(createSupabaseSafety(createFakeSafetyDb()).notes.blockSender("x")).rejects.toMatchObject({ code: "not_found" });
  });
});
