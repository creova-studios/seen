import { useSyncExternalStore } from "react";
import { track } from "../observability";

/**
 * Limited guest mode (D2): a visitor can browse and read chapter 1 without an account; saving, following,
 * the Library, Profile and Create ask them to sign in, then finish what they started.
 *
 * Module-level store (like the offline cache) so the sheet, banner, tabs and screens agree without a provider.
 * "Is this person a guest" is always `!isAuthenticated` at the point of use; the stored flag only records that
 * they chose "Explore without an account", so a reload skips onboarding.
 */
export type GuestReason = "save" | "follow" | "library" | "profile" | "create" | "continue" | "page";

export interface GuestPrompt {
  reason: GuestReason;
  /** The story title or creator name shown in the sheet, when there is one. */
  subject?: string;
}

interface Snapshot {
  prompt: GuestPrompt | null;
  authOpen: boolean;
  authMode: "signup" | "signin";
  bannerDismissed: boolean;
}

const GUEST_KEY = "seen.v1.guest";
const BANNER_KEY = "seen.v1.guestBannerDismissed";

function read(storage: "local" | "session", key: string): boolean {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key) === "true";
  } catch {
    return false;
  }
}

function write(storage: "local" | "session", key: string, on: boolean) {
  try {
    const s = storage === "local" ? localStorage : sessionStorage;
    if (on) s.setItem(key, "true");
    else s.removeItem(key);
  } catch {
    /* storage unavailable: the flag lasts until reload */
  }
}

let snap: Snapshot = { prompt: null, authOpen: false, authMode: "signup", bannerDismissed: read("session", BANNER_KEY) };
let pending: (() => void) | null = null;
const listeners = new Set<() => void>();

function set(next: Partial<Snapshot>) {
  snap = { ...snap, ...next };
  listeners.forEach(l => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

export const useGuestStore = () => useSyncExternalStore(subscribe, () => snap);

/** True once someone chose to explore without an account on this device. */
export const hasChosenGuest = () => read("local", GUEST_KEY);
export const enterGuestMode = () => write("local", GUEST_KEY, true);
export const leaveGuestMode = () => {
  write("local", GUEST_KEY, false);
  write("session", BANNER_KEY, false);
  set({ bannerDismissed: false });
};

export function dismissGuestBanner() {
  write("session", BANNER_KEY, true);
  set({ bannerDismissed: true });
}

/** Shows the sign-in sheet. `then` runs after the person signs in or signs up, so nothing they tapped is lost. */
export function openGuestPrompt(prompt: GuestPrompt, then?: () => void) {
  pending = then ?? null;
  track("guest_prompted", { reason: prompt.reason });
  set({ prompt });
}

/** "Not now": close the sheet and forget the interrupted action. */
export function dismissGuestPrompt() {
  pending = null;
  set({ prompt: null, authOpen: false });
}

export function openGuestAuth(mode: "signup" | "signin") {
  set({ prompt: null, authOpen: true, authMode: mode });
}

export function closeGuestAuth() {
  // Backing out of the form keeps the sheet's interrupted action only until the next prompt replaces it.
  pending = null;
  set({ authOpen: false });
}

/** Called once the account exists: closes everything and completes the interrupted action. */
export function finishGuestAuth() {
  const run = pending;
  pending = null;
  track("guest_converted");
  set({ prompt: null, authOpen: false });
  leaveGuestMode();
  run?.();
}

export const hasPendingAction = () => pending !== null;
