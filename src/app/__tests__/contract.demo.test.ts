import { beforeEach } from "vitest";
import { demoAdapter } from "../services/demo/adapter";
import { setLatency, setSimulation } from "../services/runtime";
import { runContractSuite } from "./contract.shared";

beforeEach(() => { localStorage.clear(); localStorage.setItem("seenos_auth_session", JSON.stringify({ accessToken: "t", userId: "u1" })); setSimulation("none"); setLatency(0); });
runContractSuite("demo adapter", () => demoAdapter);

import { describe, expect, it } from "vitest";
describe("demo adapter: signed out", () => {
  it("writes are forbidden without a session", async () => {
    localStorage.clear();
    await expect(demoAdapter.notes.send("s", "hi")).rejects.toMatchObject({ code: "forbidden" });
    await expect(demoAdapter.reports.submit({ targetType: "story", targetId: "s", targetTitle: "S", reason: "spam" })).rejects.toMatchObject({ code: "forbidden" });
  });
  it("the demo inbox returns notes without sender or creator ids", async () => {
    await demoAdapter.notes.send("s9", "Hello", { named: false });
    const [n] = await demoAdapter.notes.received();
    expect(Object.keys(n)).not.toContain("senderId");
  });
});

describe("demo adapter: blocking a note sender", () => {
  it("refuses new notes from a blocked sender, keeps old ones, and unblock restores", async () => {
    await demoAdapter.notes.send("s1", "first");
    const [note] = await demoAdapter.notes.received();
    await demoAdapter.notes.blockSender(note.id);
    expect(await demoAdapter.blocks.list()).toHaveLength(1);
    await expect(demoAdapter.notes.send("s2", "second")).rejects.toMatchObject({ code: "forbidden" });
    expect(await demoAdapter.notes.received()).toHaveLength(1);
    const [id] = await demoAdapter.blocks.list();
    await demoAdapter.blocks.unblock(id);
    await demoAdapter.notes.send("s2", "second");
  });
  it("blockSender on an unknown note is not_found", async () => {
    await expect(demoAdapter.notes.blockSender("nope")).rejects.toMatchObject({ code: "not_found" });
  });
});
