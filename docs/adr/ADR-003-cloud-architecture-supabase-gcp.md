# ADR-003: Cloud Architecture Selection — Supabase vs. GCP vs. Hybrid

- **Status:** Proposed (Provisional Execution Approved for M1–M2)
- **Date:** 2026-11-15
- **Related:** [ADR-001](file:///Users/justinmafie/seen-v1/docs/adr/ADR-001-frontend-consolidation.md), [ADR-002](file:///Users/justinmafie/seen-v1/docs/adr/ADR-002-backend-adapter-boundary.md)

---

## 1. Context

SEEN by CREOVA requires a secure, maintainable backend for:
1. Immediate **Artist Onboarding & Story Intake** (`Invite → Register → Submit → Editorial Review → Publish`).
2. **Closed Native Mobile Beta** on iOS and Android (`mobile/`) plus the **Web Creator Studio** (`src/`).
3. **Canadian Data Residency & Privacy Compliance** (PIPEDA / Quebec Law 25).
4. **Responsible FinOps:** CREOVA has access to Google Cloud credits (exact balance and expiration pending founder confirmation) and must avoid high fixed monthly infrastructure costs after credits expire.

The repository already contains:
- Five PostgreSQL migrations ([0001_core_schema.sql](file:///Users/justinmafie/seen-v1/supabase/migrations/0001_core_schema.sql)–[0005_profile_bio.sql](file:///Users/justinmafie/seen-v1/supabase/migrations/0005_profile_bio.sql)) using Supabase's `auth.users` and `auth.uid()` RLS primitives, targeted at `ca-central-1` (Montreal).
- A working `@supabase/supabase-js` client and safety adapter ([src/app/services/supabase/client.ts](file:///Users/justinmafie/seen-v1/src/app/services/supabase/client.ts), [safety.ts](file:///Users/justinmafie/seen-v1/src/app/services/supabase/safety.ts)).

---

## 2. Options Evaluated

### Option A: Supabase-First (`ca-central-1` Montreal)
- **Stack:** Supabase Auth + Supabase PostgreSQL (with RLS & `security definer` RPCs) + Supabase Storage (S3-backed in `ca-central-1`).
- **Pros:** Zero migration rewrite; 100% compatible with existing `0001`–`0005` SQL migrations and client adapters; lowest operational overhead; predictable \$0 (Free) to \$25/mo (Pro) base cost.
- **Cons:** Cannot pay Supabase invoices directly with GCP credits; high-bandwidth audio/video egress above Pro tier quotas incurs per-GB overages (\$0.09/GB).

### Option B: GCP-First (`northamerica-northeast1` Montreal)
- **Stack:** Google Identity Platform (Firebase Auth) + Cloud SQL for PostgreSQL + Cloud Run (FastAPI) + Cloud Storage (GCS) + Cloud CDN.
- **Pros:** 100% of compute, database, storage, and CDN bills are covered by eligible GCP credits while credits remain active.
- **Cons:**
  - **High Rewrite Cost:** Cloud SQL does not natively provide `auth.uid()` or PostgREST; requires either building a custom FastAPI/Cloud Run API for every table or custom JWT session-variable middleware, invalidating existing client adapters.
  - **Post-Credit Cliff:** Even a small HA Cloud SQL PostgreSQL instance + VPC connector costs **\$70–\$140+/month minimum** when completely idle once credits expire.

### Option C: Pragmatic Hybrid — Supabase Core (Auth + Postgres/RLS) + Optional GCP Media & Compute (`northamerica-northeast1`)
- **Stack:**
  - **Identity & Authoritative Structured Data:** Supabase Auth + Supabase PostgreSQL with RLS (`ca-central-1` Montreal).
  - **Media Storage & Delivery (Audio, High-Res Cover Art) & Custom Workers:** Supabase Storage for small beta files, shifting to **GCP Cloud Storage + Cloud CDN (`northamerica-northeast1`)** and **GCP Cloud Run** (scale-to-zero FastAPI workers for audio transcoding, TTS generation, and media scanning) once GCP credits are confirmed.
- **Pros:**
  - Zero rewrite of existing schema, RLS policies, or `@supabase/supabase-js` adapters.
  - Uses GCP credits for the highest variable-cost workloads (media storage, CDN egress, audio/AI processing) where scale-to-zero Cloud Run and GCS have **near-\$0 idle cost** after credits expire.
- **Cons:** Requires verifying a Supabase JWT inside the Cloud Run upload-signer endpoint when GCS is enabled (~40 lines of Python/TypeScript).

---

## 3. Transparent Cost Scenarios (USD / Month)

### Workload Assumptions
- **Text Story Payload:** ~25 KB per multi-chapter story; **Cover Art:** ~400 KB WebP/JPEG; **Audio Narration Clip:** ~8 MB MP3/AAC per 8-minute chapter.
- **Scenarios:**
  1. **Internal Dev (<10 users, 50 stories):** <1 GB DB, <5 GB storage, <10 GB bandwidth/mo.
  2. **100 Beta Users (25 invited artists, 100 stories, 30% audio):** ~1 GB DB, ~10 GB media, ~30 GB egress/mo.
  3. **1,000 Beta Users (150 artists, 500 stories, 50% audio):** ~4 GB DB, ~50 GB media, ~300 GB egress/mo.
  4. **10,000 Active Users (1,000 stories, regular audio streaming):** ~15 GB DB, ~200 GB media, ~3 TB egress/mo.
  5. **Media-Heavy Usage (10,000 users + rich audio/video chapters):** ~25 GB DB, ~1 TB media, ~10 TB egress/mo.

| Scenario | Option A: Supabase-First | Option B: GCP-First (Gross Cost Before Credits) | Option C: Hybrid (Supabase DB/Auth + GCP Media/Cloud Run) |
|---|---|---|---|
| **1. Internal Dev** | **\$0/mo** (Supabase Free tier) | ~\$15–\$55/mo (Cloud SQL `db-f1-micro` / `db-custom-1-3840`) | **\$0/mo** (Supabase Free + GCP Free/Credits) |
| **2. 100 Beta Users** | **\$25/mo** (Supabase Pro; within 100 GB storage / 250 GB egress quota) | ~\$75–\$120/mo (Cloud SQL + Cloud Run + GCS) | **\$25/mo** Supabase + **\$0/mo** GCP (covered by credits / free tier; ~\$3/mo without credits) |
| **3. 1,000 Beta Users** | **~\$30/mo** (\$25 Pro + ~\$5 egress overage) | ~\$130–\$200/mo (Cloud SQL HA + GCS + CDN) | **\$25/mo** Supabase + **~\$25/mo** GCP (covered by credits) |
| **4. 10,000 Active Users** | **~\$285/mo** (\$25 Pro + ~\$250 media egress overage + storage) | ~\$350–\$500/mo (Cloud SQL + Cloud CDN + Cloud Run) | **\$25–\$50/mo** Supabase + **~\$180/mo** GCP CDN/GCS (covered by credits) |
| **5. Media-Heavy (10 TB egress)** | **~\$925/mo** (dominated by \$0.09/GB un-cached storage egress) | ~\$650–\$850/mo (Cloud SQL + Cloud CDN egress) | **\$50/mo** Supabase + **~\$550/mo** GCP Cloud CDN/GCS (covered by credits) |

---

## 4. Decision

1. **Adopt Option A (Supabase-First in `ca-central-1`) immediately for M1–M2 (Auth, PostgreSQL, RLS, Artist Intake, Editorial Moderation)** so artist recruitment is not blocked by infrastructure rewrites.
2. **Evolve to Option C (Hybrid: Supabase Auth/DB + GCP Cloud Storage/CDN & Cloud Run in `northamerica-northeast1`)** for media-heavy audio/image delivery and background processing once CREOVA's GCP credit balance and expiry are confirmed.
