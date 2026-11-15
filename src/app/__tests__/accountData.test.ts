import { beforeEach, describe, expect, it } from "vitest";
import { buildAccountExport, deleteLocalAccount, loadNotificationPrefs, saveNotificationPrefs } from "../data/accountData";

const user = { id: "u1", name: "Kira", email: "kira@example.com", role: "creator", language: "en" };

beforeEach(() => localStorage.clear());

describe("account export", () => {
  it("includes the person's own data and never credentials", () => {
    localStorage.setItem("seenos_user_bookmarks", JSON.stringify(["s1"]));
    localStorage.setItem("seenos_users_db", JSON.stringify({ u1: { id: "u1", passwordHash: "secret" } }));
    localStorage.setItem("seenos_auth_session", JSON.stringify({ accessToken: "tok" }));
    const out = JSON.stringify(buildAccountExport(user));
    expect(out).toContain("seenos_user_bookmarks");
    expect(out).not.toContain("secret");
    expect(out).not.toContain("tok");
  });
});

describe("delete account", () => {
  it("removes the person and their keys but keeps other accounts", () => {
    localStorage.setItem("seenos_users_db", JSON.stringify({ u1: { id: "u1" }, u2: { id: "u2" } }));
    localStorage.setItem("seenos_user_progress", "{}");
    deleteLocalAccount("u1");
    expect(JSON.parse(localStorage.getItem("seenos_users_db")!)).toEqual({ u2: { id: "u2" } });
    expect(localStorage.getItem("seenos_user_progress")).toBeNull();
  });
});

describe("notification choices", () => {
  it("defaults on and persists changes", () => {
    expect(loadNotificationPrefs().newStories).toBe(true);
    saveNotificationPrefs({ newStories: false, fundingDeadlines: true, replies: true, reminders: true });
    expect(loadNotificationPrefs().newStories).toBe(false);
  });
});
