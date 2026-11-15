# Data model (target schema)

Conventions: `uuid` primary keys (`gen_random_uuid()`), `created_at`/`updated_at timestamptz default now()`, soft delete only where recovery matters (`deleted_at` on stories, collections), `org_id uuid null` on tenant-scoped rows, RLS enabled on every table.

```sql
organizations(id, name, kind text check (kind in ('collective','institution','funder','platform')), created_at)
memberships(org_id → organizations, user_id → auth.users, role text check (role in ('member','editor','owner')), primary key(org_id,user_id))
profiles(user_id pk → auth.users, display_name, language text check (language in ('en','fr','es')), intent, a11y jsonb, created_at, updated_at)
role_grants(user_id pk → auth.users, role text check (role in ('viewer','creator','moderator','admin')), granted_by, granted_at)
role_requests(id, user_id, requested_role, reason, status check (status in ('pending','approved','rejected')), decided_by, decided_at, created_at)

stories(id, slug unique, org_id null, creator_user_id null, title jsonb, description jsonb, cover_path, languages text[], themes text[],
        visibility check (visibility in ('public','institutional','private')), status check (status in ('draft','in_review','published','archived')),
        published_at, deleted_at, created_at, updated_at)
chapters(id, story_id → stories on delete cascade, position int, title jsonb, body jsonb, media jsonb, unique(story_id, position))
progress(user_id, story_id, chapter_id, percent int check (percent between 0 and 100), completed_at, updated_at, primary key(user_id, story_id))

follows(user_id, creator_key text, created_at, primary key(user_id, creator_key))
collections(id, slug unique, kind check (kind in ('thematic','institutional')), org_id null, title, description, curator, cover_story_id, deleted_at, …)
collection_items(collection_id, story_id, position, primary key(collection_id, story_id))
saved_collections(user_id, collection_id, created_at, primary key(user_id, collection_id))

opportunities(id, slug unique, org_id → organizations (funder), title, type, amount_min null, amount_max null, amount_note, currency char(3),
              availability check (availability in ('deadline','rolling','upcoming','tba')), deadline timestamptz null, opens_at null, deadline_tz, deadline_note,
              region, apply_url, source_urls text[], verified_at,
              summary, eligibility text[], disciplines text[], languages text[], steps text[], apply_url, is_demo bool default false, status, …)
applications(user_id, opportunity_id, status check (status in ('saved','in-progress','applied')), completed_steps int[], updated_at,
             primary key(user_id, opportunity_id))

notifications(id, user_id, type check (type in ('story','funding','money','moderation')), title, body, target jsonb, read_at, created_at)
moderation_items(id, org_id null, subject_type, subject_id, reason, status, created_at)
moderation_actions(id, item_id, actor_id, action, note, created_at)   -- append-only audit
audit_log(id, actor_id, action, entity, entity_id, org_id, at, meta jsonb)  -- append-only
```

Indexes: `stories(status, visibility, published_at desc)`, `stories using gin(themes)`, `chapters(story_id, position)`, `notifications(user_id, read_at, created_at desc)`, `applications(user_id, updated_at desc)`, `opportunities(deadline) where status='open'`.

Retention: notifications 180 days; audit_log and moderation_actions indefinitely; analytics events 13 months, no user identifiers beyond a random session id.

Demo/test data: seeds live in `supabase/seed.sql` (to be written) generated from `services/demo/catalog.ts`; funding listings are imported from `services/data/fundingListings.ts` (real data, `is_demo = false`). Any future test-only listing must set `is_demo = true` so it can be filtered out of production with one predicate.
