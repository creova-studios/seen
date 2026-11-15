/**
 * Return-to-route after sign-in (guest-first journey, ENG-E6).
 * The target is stored before an OAuth or email-link redirect and validated
 * on return: only internal hash routes are accepted, so it cannot become an
 * open redirect.
 */
const KEY = "seen.v1.returnTo";
const SAFE = /^#\/[A-Za-z0-9_\-./%]{0,200}$/;

export function isSafeReturn(target: unknown): target is string {
  return typeof target === "string" && SAFE.test(target) && !target.includes("//") && !target.includes("..");
}

export function rememberReturn(hash: string) {
  try {
    if (isSafeReturn(hash)) sessionStorage.setItem(KEY, hash);
  } catch {
    /* storage unavailable: user lands on the default screen */
  }
}

/** Reads and clears the stored route; returns null when absent or unsafe. */
export function takeReturn(): string | null {
  try {
    const v = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return isSafeReturn(v) ? v : null;
  } catch {
    return null;
  }
}
