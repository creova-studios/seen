# DEPLOYMENT_AND_INFRASTRUCTURE_AUDIT.md — SEEN by CREOVA

**Audit Date:** 2026-11-15

---

## 1. Current Hosting & Deployment Topology

| Surface | Config File | Target Host | Current Live Status (Probed 2026-11-15) |
|---|---|---|---|
| **Testing Web / Expo Export** | [vercel.json](file:///Users/justinmafie/seen-v1/vercel.json), [middleware.ts](file:///Users/justinmafie/seen-v1/middleware.ts) | Vercel (`https://seen-sigma-eight.vercel.app`) | **LIVE (`HTTP/2 200`)** — Builds `mobile/` web export + `scripts/pwa-postbuild.mjs` + `api/share-preview.ts`. |
| **Public Website (`site/`)** | [site/build.mjs](file:///Users/justinmafie/seen-v1/site/build.mjs), [site/publish.sh](file:///Users/justinmafie/seen-v1/site/publish.sh) | Cloudflare + GitHub Pages (`https://seen.creova.one`) / `https://seen.verse.one` | `https://seen.creova.one` is **LIVE (`HTTP/2 200`)**. `https://seen.verse.one` currently returns DNS `NXDOMAIN`. |
| **Native Mobile (`mobile/`)** | [mobile/app.json](file:///Users/justinmafie/seen-v1/mobile/app.json), [mobile/eas.json](file:///Users/justinmafie/seen-v1/mobile/eas.json) | Expo EAS Build (`com.creova.seen`) | Configured for `development`, `preview` (internal distribution), and `production` (`autoIncrement: true`). |
| **Database & Auth (`supabase/`)** | [supabase/migrations/](file:///Users/justinmafie/seen-v1/supabase/migrations) | Supabase (`ca-central-1` Montreal) | Schema `0001`–`0005` authored; client falls back to `demo` until `VITE_BACKEND=supabase`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` are set. |

---

## 2. Security Headers & Edge Configuration ([vercel.json](file:///Users/justinmafie/seen-v1/vercel.json))

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `Content-Security-Policy-Report-Only`: restricts `default-src 'self'`, `connect-src 'self' https://*.supabase.co`, `frame-ancestors 'none'`.

---

## 3. Infrastructure Gaps Before Closed Beta

1. **Staging vs. Production Environment Separation:**
   - Need distinct Supabase projects (`seen-staging` and `seen-beta-prod` in `ca-central-1`) with automated migration promotion via GitHub Actions.
2. **Domain Alignment (`seen.creova.one` vs. `seen.verse.one`):**
   - `https://seen.creova.one` resolves and serves HTTP 200 today; `https://seen.verse.one` does not yet have a DNS `A`/`CNAME` record. Both can be supported via a canonical domain environment variable (`SITE_URL` in [site/build.mjs](file:///Users/justinmafie/seen-v1/site/build.mjs)) and a 308 redirect on the secondary domain.
3. **Media Storage Bucket Provisioning:**
   - Cover images and audio narration files require a dedicated private/signed-upload bucket (`story-media`) in either Supabase Storage (`ca-central-1`) or GCP Cloud Storage (`northamerica-northeast1`).
