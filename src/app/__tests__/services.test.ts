import { describe, expect, it } from "vitest";
import { api, deadlineState, formatAmount, formatDeadline, isApplyable, opportunityStatus, ServiceError } from "../services";
import { setSimulation } from "../services/runtime";
import { getStoryWorldById } from "../data/storyDatabase";
import { seedNotifications } from "../services/demo/catalog";
import { FUNDING_LISTINGS } from "../services/data/fundingListings";

describe("funding rules", () => {
  const now = new Date("2026-09-24T12:00:00Z");
  it("computes fixed-deadline state", () => {
    expect(deadlineState("2026-09-01T00:00:00Z", now)).toBe("closed");
    expect(deadlineState("2026-10-01T00:00:00Z", now)).toBe("closing-soon");
    expect(deadlineState("2026-12-01T00:00:00Z", now)).toBe("open");
  });
  it("handles rolling, upcoming and not-yet-announced intakes", () => {
    expect(opportunityStatus({ availability: "rolling", deadline: null }, now)).toBe("rolling");
    expect(opportunityStatus({ availability: "upcoming", deadline: null }, now)).toBe("upcoming");
    expect(opportunityStatus({ availability: "tba", deadline: null }, now)).toBe("tba");
    expect(opportunityStatus({ availability: "deadline", deadline: "2026-12-01T00:00:00Z", opensAt: "2026-10-15T00:00:00Z" }, now)).toBe("upcoming");
    expect(isApplyable("rolling")).toBe(true);
    expect(isApplyable("tba")).toBe(false);
    expect(isApplyable("closed")).toBe(false);
  });
  it("formats amounts without inventing figures", () => {
    expect(formatAmount({ amountMin: 15000, amountMax: 60000, currency: "CAD" })).toBe("$15,000–$60,000 CAD");
    expect(formatAmount({ amountMin: null, amountMax: 40000, currency: "CAD" })).toBe("Up to $40,000 CAD");
    expect(formatAmount({ amountMin: null, amountMax: null, currency: "CAD", amountNote: "See guidelines" })).toBe("See guidelines");
    expect(formatDeadline("2026-09-25T12:00:00Z", now)).toBe("Closes tomorrow");
    expect(formatDeadline("2026-09-01T00:00:00Z", now)).toMatch(/^Closed /);
  });
});

describe("creators (derived from the story catalog)", () => {
  it("every creator's stories resolve to real stories", async () => {
    const creators = await api.creators.list();
    expect(creators.length).toBeGreaterThan(5);
    for (const c of creators) {
      expect(c.storyIds.length).toBeGreaterThan(0);
      for (const id of c.storyIds) expect(getStoryWorldById(id)).toBeDefined();
    }
    expect(new Set(creators.map(c => c.id)).size).toBe(creators.length);
  });

  it("persists follow state", async () => {
    const [first] = await api.creators.list();
    await api.creators.setFollowing(first.id, true);
    expect(await api.creators.listFollowing()).toEqual([first.id]);
    await api.creators.setFollowing(first.id, false);
    expect(await api.creators.listFollowing()).toEqual([]);
  });

  it("rejects unknown creators", async () => {
    await expect(api.creators.get("nope")).rejects.toMatchObject({ code: "not_found" });
    await expect(api.creators.setFollowing("nope", true)).rejects.toBeInstanceOf(ServiceError);
  });
});

describe("collections", () => {
  it("has thematic collections whose stories all exist", async () => {
    const list = await api.collections.list("thematic");
    expect(list.length).toBeGreaterThan(0);
    list.forEach(c => c.storyIds.forEach(id => expect(getStoryWorldById(id)).toBeDefined()));
  });

  it("saves and unsaves", async () => {
    const [c] = await api.collections.list();
    await api.collections.setSaved(c.id, true);
    expect(await api.collections.listSaved()).toContain(c.id);
    await api.collections.setSaved(c.id, false);
    expect(await api.collections.listSaved()).not.toContain(c.id);
  });
});

describe("funding tracker", () => {
  const ROLLING = "cca-explore-create-research-creation";
  const CLOSED = "telefilm-talent-to-watch";

  it("only allows 'applied' once every checklist step is done", async () => {
    const opp = await api.funding.get(ROLLING);
    await api.funding.updateApplication(opp.id, { status: "saved" });
    await expect(api.funding.updateApplication(opp.id, { status: "applied" })).rejects.toMatchObject({ code: "invalid" });
    const all = opp.steps.map((_, i) => i);
    await api.funding.updateApplication(opp.id, { completedSteps: all, status: "in-progress" });
    const done = await api.funding.updateApplication(opp.id, { status: "applied" });
    expect(done.status).toBe("applied");
    expect((await api.funding.listApplications()).map(a => a.opportunityId)).toContain(opp.id);
  });

  it("refuses 'applied' when the intake is not open, but allows preparing", async () => {
    const opp = await api.funding.get(CLOSED);
    await api.funding.updateApplication(opp.id, { status: "saved", completedSteps: opp.steps.map((_, i) => i) });
    await expect(api.funding.updateApplication(opp.id, { status: "applied" })).rejects.toMatchObject({ code: "invalid" });
  });

  it("drops out-of-range and duplicate steps", async () => {
    const app = await api.funding.updateApplication(ROLLING, { completedSteps: [0, 0, 99, -1] });
    expect(app.completedSteps).toEqual([0]);
  });
});

describe("funding listings are real and traceable", () => {
  it("every listing is non-demo, links to its funder and cites sources", async () => {
    const list = await api.funding.list();
    expect(list.length).toBeGreaterThanOrEqual(10);
    for (const o of list) {
      expect(o.isDemo).toBe(false);
      expect(o.applyUrl).toMatch(/^https:\/\//);
      expect(o.sourceUrls.length).toBeGreaterThan(0);
      o.sourceUrls.forEach(u => expect(u).toMatch(/^https:\/\//));
      expect(o.steps.length).toBeGreaterThan(0);
      expect(o.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it("never stores a deadline for rolling, upcoming or unannounced intakes", async () => {
    for (const o of await api.funding.list()) {
      if (o.availability !== "deadline") expect(o.deadline).toBeNull();
      else expect(o.deadline).not.toBeNull();
    }
  });

  it("uses unique ids and contains no fictional funders", async () => {
    const list = await api.funding.list();
    expect(new Set(list.map(o => o.id)).size).toBe(list.length);
    list.forEach(o => expect(o.funder).not.toMatch(/demo/i));
  });
});

describe("notifications", () => {
  it("marks one and all as read", async () => {
    const before = await api.notifications.unreadCount();
    expect(before).toBeGreaterThan(0);
    const [n] = await api.notifications.list();
    await api.notifications.markRead(n.id);
    expect(await api.notifications.unreadCount()).toBe(before - 1);
    await api.notifications.markAllRead();
    expect(await api.notifications.unreadCount()).toBe(0);
  });
});

describe("failure simulation", () => {
  it("surfaces offline and unavailable as typed errors", async () => {
    setSimulation("offline");
    await expect(api.creators.list()).rejects.toMatchObject({ code: "offline" });
    setSimulation("error");
    await expect(api.funding.list()).rejects.toMatchObject({ code: "unavailable" });
    setSimulation("none");
    await expect(api.funding.list()).resolves.toBeInstanceOf(Array);
  });
});

describe("deadline time zones", () => {
  it("shows the date in the funder's zone", async () => {
    const iso = await api.funding.get("iso-marketing-promotion-distribution");
    expect(formatDeadline(iso.deadline!, new Date("2026-09-24T00:00:00Z"), iso.deadlineTimeZone)).toBe("Closes Mar 1, 2027");
  });
});

describe("review fixes", () => {
  it("labels a deadline that passed under a day ago as closed, not 'Closes today'", () => {
    const deadline = "2026-10-02T03:59:00Z";
    const anHourLater = new Date(new Date(deadline).getTime() + 3600_000);
    expect(formatDeadline(deadline, anHourLater)).toMatch(/^Closed /);
    expect(deadlineState(deadline, anHourLater)).toBe("closed");
  });

  it("only alerts about a funding deadline that is still open", () => {
    const now = new Date("2026-10-05T12:00:00Z");
    const alert = seedNotifications(now).find(n => n.type === "funding");
    expect(alert).toBeDefined();
    expect(alert!.target!.id).toBe("cca-creating-knowing-sharing"); // nearest open deadline on that date
    const listing = FUNDING_LISTINGS.find(o => o.id === alert!.target!.id)!;
    expect(new Date(listing.deadline!).getTime()).toBeGreaterThan(now.getTime());
    expect(seedNotifications(new Date("2035-01-01T00:00:00Z")).some(n => n.type === "funding")).toBe(false);
  });
});
