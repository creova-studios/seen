import { describe, expect, it } from "vitest";
import { createOfflineCache, memoryStore, MAX_OFFLINE_STORIES, OFFLINE_TTL_MS } from "../services/offline/offlineCache";

const story = (id: string, extra = {}) => ({ id, title: id, body: "text", ...extra });

describe("offline cache rules", () => {
  it("caps at 20 stories but allows updating an existing one", async () => {
    const c = createOfflineCache(memoryStore());
    for (let i = 0; i < MAX_OFFLINE_STORIES; i++) expect(await c.save(story("s" + i))).toBe("saved");
    expect(await c.save(story("s20"))).toBe("limit");
    expect(await c.save(story("s0"))).toBe("saved");
  });
  it("reports a full device instead of failing silently", async () => {
    expect(await createOfflineCache(memoryStore({ failPut: true })).save(story("a"))).toBe("quota");
  });
  it("expires after 14 days offline and revalidates online", async () => {
    let t = 0;
    const c = createOfflineCache(memoryStore(), () => t);
    await c.save(story("a"));
    t = OFFLINE_TTL_MS + 1;
    expect((await c.read("a")).state).toBe("expired");
    await c.sync(async () => true);
    expect((await c.read("a")).state).toBe("ok");
  });
  it("purges stories removed upstream on sync", async () => {
    const c = createOfflineCache(memoryStore());
    await c.save(story("a")); await c.save(story("b"));
    expect(await c.sync(async (id) => id !== "b")).toEqual(["b"]);
    expect((await c.read("b")).state).toBe("unavailable");
  });
  it("drops oversized covers and clears everything on sign-out", async () => {
    const c = createOfflineCache(memoryStore());
    await c.save(story("a", { cover: "data", coverBytes: 999999 }));
    const r = await c.read("a");
    expect(r.state === "ok" && r.entry.cover).toBeNull();
    await c.clearAll();
    expect((await c.read("a")).state).toBe("unavailable");
  });
});
