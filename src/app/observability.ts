/**
 * Minimal, privacy-safe observability.
 *
 * - `reportError` captures client errors (render crashes, unhandled
 *   rejections, window errors) with a correlation id.
 * - `track` records product analytics events from the allow-listed catalogue
 *   in docs/operations/OBSERVABILITY.md. Properties are restricted to ids and
 *   enums — never names, emails, free text or payment data.
 *
 * Events are kept in a small in-memory ring buffer (inspect with
 * `window.__seen.events` / `__seen.errors`). When VITE_TELEMETRY_ENDPOINT is
 * set they are also sent with navigator.sendBeacon. No third-party SDK.
 */

export type AnalyticsEvent =
  | "onboarding_completed"
  | "guest_entered"
  | "guest_prompted"
  | "guest_converted"
  | "story_opened"
  | "search_performed"
  | "creator_followed"
  | "creator_unfollowed"
  | "collection_saved"
  | "funding_tracked"
  | "funding_marked_applied"
  | "funding_outcome_recorded"
  | "notification_opened"
  | "access_denied"
  | "report_submitted"
  | "note_sent"
  | "note_deleted"
  | "account_data_exported"
  | "account_deleted"
  | "password_reset_completed";

type Props = Record<string, string | number | boolean | undefined>;

interface Envelope {
  kind: "event" | "error";
  name: string;
  props?: Props;
  at: string;
  session: string;
}

const MAX = 100;
const buffer = { events: [] as Envelope[], errors: [] as Envelope[] };
const session = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : "local";
const endpoint = import.meta.env?.VITE_TELEMETRY_ENDPOINT as string | undefined;

// Keys that must never leave the device, even if a caller passes them by mistake.
const FORBIDDEN = /email|name|password|card|cvc|token|phone|address|query|text/i;

function sanitize(props: Props = {}): Props {
  return Object.fromEntries(Object.entries(props).filter(([k, v]) => !FORBIDDEN.test(k) && v !== undefined));
}

function send(env: Envelope) {
  const list = env.kind === "error" ? buffer.errors : buffer.events;
  list.push(env);
  if (list.length > MAX) list.shift();
  if (endpoint && typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      navigator.sendBeacon(endpoint, JSON.stringify(env));
    } catch {
      /* telemetry must never break the app */
    }
  }
}

export function track(name: AnalyticsEvent, props?: Props) {
  send({ kind: "event", name, props: sanitize(props), at: new Date().toISOString(), session });
}

/** Returns a short correlation id the UI can show so testers can quote it. */
export function reportError(error: unknown, context?: string): string {
  const id = `${session}-${Date.now().toString(36)}`;
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  send({ kind: "error", name: context ?? "error", props: { id, message: message.slice(0, 300) }, at: new Date().toISOString(), session });
  if (import.meta.env?.DEV) console.error(`[SEEN error ${id}]`, error);
  return id;
}

export function installGlobalHandlers() {
  if (typeof window === "undefined") return;
  window.addEventListener("error", e => reportError(e.error ?? e.message, "window.error"));
  window.addEventListener("unhandledrejection", e => reportError(e.reason, "unhandledrejection"));
  (window as unknown as { __seen: typeof buffer }).__seen = buffer;
}

export const __buffer = buffer;
