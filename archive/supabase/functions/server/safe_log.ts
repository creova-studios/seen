/**
 * Structured, PII-free logging for the SEEN edge function server (CRE-167).
 *
 * Every server log line goes through `log.*` so it is one JSON object with an
 * event name plus ids, statuses and error names. Never pass request bodies,
 * passwords, emails, names, phone numbers, tokens or auth headers. As a second
 * line of defence, fields whose key looks sensitive are dropped at runtime, and
 * values that look like an email or a bearer token are redacted.
 *
 * scripts/server-log-guard.mjs fails the build if a console call outside this
 * file, or a log.* call, references a sensitive identifier.
 */

export type LogValue = string | number | boolean | null | undefined | string[];
export type LogFields = Record<string, LogValue>;

const SENSITIVE_KEY = /pass(word)?|email|phone|token|authorization|auth_header|secret|cookie|body|^name$|full_?name|user_?metadata/i;
const EMAIL_LIKE = /[^\s@"]+@[^\s@"]+\.[^\s@"]+/g;
const BEARER_LIKE = /bearer\s+[a-z0-9._~+/=-]+/gi;
const JWT_LIKE = /\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;

function scrubString(value: string): string {
  return value
    .replace(EMAIL_LIKE, "[redacted-email]")
    .replace(BEARER_LIKE, "[redacted-token]")
    .replace(JWT_LIKE, "[redacted-token]");
}

export function sanitizeFields(fields: LogFields = {}): Record<string, LogValue> {
  const out: Record<string, LogValue> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (SENSITIVE_KEY.test(key)) continue;
    if (typeof value === "string") out[key] = scrubString(value);
    else if (Array.isArray(value)) out[key] = value.map((v) => scrubString(String(v)));
    else out[key] = value;
  }
  return out;
}

/**
 * Reduce an unknown thrown value or Supabase error to fields that are safe to
 * log: the error class name, the error code and the HTTP status. The message is
 * deliberately not included because auth/storage messages can echo user input.
 */
export function errInfo(error: unknown): LogFields {
  if (!error || typeof error !== "object") {
    return { errorName: error === undefined || error === null ? "none" : typeof error };
  }
  const e = error as { name?: unknown; code?: unknown; status?: unknown };
  return {
    errorName: typeof e.name === "string" ? e.name : "Error",
    errorCode: typeof e.code === "string" || typeof e.code === "number" ? String(e.code) : undefined,
    errorStatus: typeof e.status === "number" ? e.status : undefined,
  };
}

function emit(level: "info" | "warn" | "error", event: string, fields?: LogFields) {
  const line = JSON.stringify({ level, event, ...sanitizeFields(fields) });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event: string, fields?: LogFields) => emit("info", event, fields),
  warn: (event: string, fields?: LogFields) => emit("warn", event, fields),
  error: (event: string, fields?: LogFields) => emit("error", event, fields),
};
