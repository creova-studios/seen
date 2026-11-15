/**
 * Shared runtime for service adapters: typed errors, simulated latency and
 * failure injection, and namespaced persistence.
 *
 * Failure injection lets testers and E2E tests exercise error/offline states
 * without a network: append `?simulate=error` or `?simulate=offline` to the
 * URL (persisted for the session), or call `setSimulation()` directly.
 */

import type { ServiceErrorCode } from "./contracts/common";

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: ServiceErrorCode,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export type Simulation = "none" | "error" | "offline" | "slow";
const SIM_KEY = "seen.v1.simulate";

export function getSimulation(): Simulation {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("simulate");
    if (fromUrl && ["none", "error", "offline", "slow"].includes(fromUrl)) {
      sessionStorage.setItem(SIM_KEY, fromUrl);
      return fromUrl as Simulation;
    }
    return (sessionStorage.getItem(SIM_KEY) as Simulation) || "none";
  } catch {
    return "none";
  }
}

export function setSimulation(sim: Simulation) {
  try {
    sessionStorage.setItem(SIM_KEY, sim);
  } catch {
    /* storage unavailable: simulation stays off */
  }
}

let latencyMs = 250;
/** Tests set this to 0. */
export function setLatency(ms: number) {
  latencyMs = ms;
}

/** Wraps every adapter call so all domains behave like a real network API. */
export async function call<T>(fn: () => T): Promise<T> {
  const sim = getSimulation();
  const offline = sim === "offline" || (typeof navigator !== "undefined" && navigator.onLine === false);
  const delay = sim === "slow" ? 2500 : latencyMs;
  if (delay > 0) await new Promise(r => setTimeout(r, delay));
  if (offline) throw new ServiceError("You appear to be offline.", "offline");
  if (sim === "error") throw new ServiceError("The service is temporarily unavailable.", "unavailable");
  return fn();
}

// ------------------------------------------------------------ persistence
const NS = "seen.v1.";

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* quota / private mode: state stays in memory for this session */
  }
  // Same-tab subscribers (e.g. the unread badge) listen for this.
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("seen:store", { detail: key }));
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
