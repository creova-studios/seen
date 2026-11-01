# Observability

## What exists

- **Error capture** (`src/app/observability.ts`): `ErrorBoundary` render crashes, `window.error`, `unhandledrejection` → `reportError` with a correlation id shown to the user on the error screen.
- **Product analytics** via `track()` with an allow-list:

| Event | Properties (ids/enums only) |
|---|---|
| `onboarding_completed` | role, intent |
| `story_opened` | storyId |
| `search_performed` | results (count — the query is never recorded) |
| `creator_followed` / `creator_unfollowed` | creatorId |
| `collection_saved` | collectionId |
| `funding_tracked` / `funding_marked_applied` | opportunityId |
| `notification_opened` | type |
| `access_denied` | screen, role |

Keys matching `email|name|password|card|cvc|token|phone|address|query|text` are dropped before recording (unit-tested). A random 8-char session id is the only identifier.

- New events (enums and ids only): `report_submitted` (target, reason), `note_sent` (attributed), `note_deleted`, `account_data_exported`, `account_deleted`, `password_reset_completed`.
- **Sink:** in-memory ring buffer (`window.__seen.events`, `window.__seen.errors`) for moderated sessions; set `VITE_TELEMETRY_ENDPOINT` to also `sendBeacon` each envelope.
- **Deploy health:** Vercel deployment status + runtime logs (static site: no server logs).

## Next

1. Point `VITE_TELEMETRY_ENDPOINT` at a small Supabase Edge Function that writes to an `events` table (13-month retention), or a privacy-first vendor.
2. Add Web Vitals (LCP, INP, CLS) via `web-vitals` → same sink.
3. When the backend lands: Edge Function error logging with request ids echoed to the client, auth failure counters, p50/p95 latency per contract method.

## Telemetry endpoint check

The website's privacy notice says the demo app sends nothing to CREOVA, which holds only while `VITE_TELEMETRY_ENDPOINT` is unset in the production build. Verify after every production deploy:

```bash
node scripts/check-live-telemetry.mjs [https://seen-sigma-eight.vercel.app]   # exit 0 = unset, 1 = set or unreadable
```

It reads the deployed JavaScript: Vite inlines `VITE_*` values at build time, so a set endpoint shows up as a string value. **Verified unset on production on 2026-10-29**: the bundle compiles `import.meta.env` to an empty object, and a recorded browser session across seven screens plus an error page made 19 requests, all `GET`, only to the app, Google Fonts and Unsplash. If you ever set the endpoint, update the website privacy notice first (`site/src/legal.mjs`).
