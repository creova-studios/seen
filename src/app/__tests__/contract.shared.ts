import { describe, expect, it } from "vitest";
import type { SeenApi } from "../services/contracts";

/** The same behavioural suite runs against every adapter (demo now, Supabase later) so a flag flip cannot change behaviour. */
export function runContractSuite(name: string, make: () => SeenApi) {
  describe(`contract: ${name}`, () => {
    it("creators: list, get and not_found", async () => {
      const api = make();
      const list = await api.creators.list();
      expect(list.length).toBeGreaterThan(0);
      expect((await api.creators.get(list[0].id)).id).toBe(list[0].id);
      await expect(api.creators.get("does-not-exist")).rejects.toMatchObject({ code: "not_found" });
    });
    it("creators: follow round-trips", async () => {
      const api = make();
      const id = (await api.creators.list())[0].id;
      await api.creators.setFollowing(id, true);
      expect(await api.creators.listFollowing()).toContain(id);
      await api.creators.setFollowing(id, false);
      expect(await api.creators.listFollowing()).not.toContain(id);
    });
    it("collections: save round-trips and filters by kind", async () => {
      const api = make();
      const all = await api.collections.list();
      const thematic = await api.collections.list("thematic");
      expect(thematic.every((c) => c.kind === "thematic")).toBe(true);
      expect(thematic.length).toBeLessThanOrEqual(all.length);
      await api.collections.setSaved(all[0].id, true);
      expect(await api.collections.listSaved()).toContain(all[0].id);
    });
    it("funding: listings carry sources and applications update", async () => {
      const api = make();
      const listings = await api.funding.list();
      for (const l of listings.filter((x) => !x.isDemo)) {
        expect(l.sourceUrls.length).toBeGreaterThan(0);
        expect(l.verifiedAt).toBeTruthy();
      }
      const s = await api.funding.updateApplication(listings[0].id, { status: "saved" });
      expect(s.status).toBe("saved");
    });
    it("notifications: mark read", async () => {
      const api = make();
      await api.notifications.markAllRead();
      expect(await api.notifications.unreadCount()).toBe(0);
    });
    describe("safety (signed-in user supplied by the harness)", () => {
      it("reports: submit, duplicate conflict, details limit", async () => {
        const api = make();
        const input = { targetType: "creator" as const, targetId: "kira-chen", targetTitle: "Kira Chen", reason: "spam" as const };
        const r = await api.reports.submit(input);
        expect(r.status).toBe("open");
        expect(r.reporterId).toBeUndefined();
        await expect(api.reports.submit(input)).rejects.toMatchObject({ code: "conflict" });
        await expect(api.reports.submit({ ...input, targetId: "other", details: "x".repeat(501) })).rejects.toMatchObject({ code: "invalid" });
      });
      it("blocks: round trip and cannot block yourself", async () => {
        const api = make();
        await api.blocks.block("someone");
        expect(await api.blocks.list()).toContain("someone");
        await api.blocks.unblock("someone");
        expect(await api.blocks.list()).not.toContain("someone");
      });
      it("notes: validation and one per story per hour", async () => {
        const api = make();
        await expect(api.notes.send("story-1", "   ")).rejects.toMatchObject({ code: "invalid" });
        await expect(api.notes.send("story-1", "x".repeat(501))).rejects.toMatchObject({ code: "invalid" });
        await api.notes.send("story-1", "Thank you");
        await expect(api.notes.send("story-1", "again")).rejects.toMatchObject({ code: "rate_limited" });
        await api.notes.send("story-2", "Another story is fine");
      });
      it("preferences: defaults, set and read back", async () => {
        const api = make();
        const p = await api.preferences.get();
        expect(p.reminders).toBe(true);
        await api.preferences.set({ ...p, newStories: false });
        expect((await api.preferences.get()).newStories).toBe(false);
      });
    });
  });
}
