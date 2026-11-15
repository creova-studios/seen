import { describe, expect, it } from "vitest";
import { GUEST_SCREENS, SCREENS, canAccess, canGuestAccess, fromHash, toHash, type AppScreen } from "../navigation/routes";

describe("hash routes", () => {
  it("round-trips id routes", () => {
    for (const [screen, id] of [
      ["creator-profile", "kira-chen"],
      ["collection-detail", "theme-migration-diaspora"],
      ["opportunity", "cca-explore-create-research-creation"],
      ["story-preview", "midnight-resonance"],
    ] as [AppScreen, string][]) {
      const hash = toHash(screen, { id });
      expect(fromHash(hash)).toEqual({ screen, params: { id } });
    }
  });

  it("round-trips explore tabs and plain screens", () => {
    expect(fromHash(toHash("explore", { tab: "creators" }))).toEqual({ screen: "explore", params: { tab: "creators" } });
    expect(fromHash(toHash("funding"))).toEqual({ screen: "funding", params: {} });
  });

  it("rejects unknown and onboarding routes", () => {
    expect(fromHash("#/does-not-exist")).toBeNull();
    expect(fromHash("#/onboarding")).toBeNull();
    expect(fromHash("")).toBeNull();
  });

  it("encodes ids safely", () => {
    const hash = toHash("creator-profile", { id: "a b/c" });
    expect(fromHash(hash)?.params.id).toBe("a b/c");
  });
});

describe("malformed links", () => {
  it("ignores a bad percent-escape instead of throwing", () => {
    expect(() => fromHash("#/creator/50%")).not.toThrow();
    expect(fromHash("#/creator/50%")).toBeNull();
  });
});

describe("screen permissions", () => {
  it("restricts admin to admins", () => {
    expect(canAccess("admin-dashboard", "admin")).toBe(true);
    expect(canAccess("admin-dashboard", "moderator")).toBe(false);
    expect(canAccess("admin-dashboard", "creator")).toBe(false);
    expect(canAccess("admin-dashboard", "viewer")).toBe(false);
  });

  it("does not let moderators into creator money screens (allow-list, not hierarchy)", () => {
    expect(canAccess("creator-earnings", "moderator")).toBe(false);
    expect(canAccess("creator-earnings", "creator")).toBe(true);
    expect(canAccess("moderation-governance", "creator")).toBe(false);
    expect(canAccess("moderation-governance", "moderator")).toBe(true);
  });

  // The whole role-by-route matrix, written out by hand so any change to who can open what fails here
  // (D14 regression contract). Screens not listed below are open to all four signed-in roles.
  const ROLES = ["viewer", "creator", "moderator", "admin"] as const;
  const RESTRICTED: Partial<Record<AppScreen, readonly (typeof ROLES)[number][]>> = {
    "creator-monetization": ["creator", "admin"],
    "creator-earnings": ["creator", "admin"],
    "creator-stories": ["creator", "admin"],
    notes: ["creator", "admin"],
    "moderation-governance": ["moderator", "admin"],
    "admin-dashboard": ["admin"],
  };

  it("matches the written matrix for every screen and every role", () => {
    const wrong: string[] = [];
    for (const screen of SCREENS) {
      for (const role of ROLES) {
        const expected = RESTRICTED[screen] ? RESTRICTED[screen]!.includes(role) : true;
        if (canAccess(screen, role) !== expected) wrong.push(`${role} -> ${screen}: expected ${expected}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it("lets a signed-in viewer open the publish flow (becoming a creator happens on first publish)", () => {
    expect(canAccess("creator-publish", "viewer")).toBe(true);
  });

  // Limited guest mode (D2): a guest browses; anything private or creator/staff is behind an account.
  it("a guest can open For You, Explore, Search and a story preview", () => {
    for (const s of ["for-you", "explore", "search", "story-preview", "story-chapter", "creator-profile", "funding"] as AppScreen[]) {
      expect(canGuestAccess(s), s).toBe(true);
    }
  });

  it("a guest opening Library, Profile, Create or any private screen is stopped, even by typing the URL", () => {
    for (const s of ["library", "profile", "creator-publish", "creator-intro", "notifications", "settings", "account", "edit-profile", "change-password", "chapter-index"] as AppScreen[]) {
      expect(canGuestAccess(s), s).toBe(false);
    }
  });

  it("a guest can never open creator, moderator or admin screens", () => {
    for (const s of ["creator-monetization", "creator-earnings", "creator-stories", "notes", "moderation-governance", "admin-dashboard", "subscription-management"] as AppScreen[]) {
      expect(canGuestAccess(s), s).toBe(false);
    }
  });

  it("only lists screens that exist, and every restricted-role screen stays out of the guest list", () => {
    for (const s of GUEST_SCREENS) expect(SCREENS).toContain(s);
    for (const s of Object.keys(RESTRICTED) as AppScreen[]) expect(GUEST_SCREENS).not.toContain(s);
  });

  it("keeps every public screen open to viewers", () => {
    const restricted = new Set(["creator-stories", "admin-dashboard", "moderation-governance", "creator-earnings", "creator-monetization", "notes"]);
    for (const s of SCREENS) {
      if (!restricted.has(s)) expect(canAccess(s, "viewer")).toBe(true);
    }
  });
});
