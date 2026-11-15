-- Artist Onboarding, Story Intake, Rights Grants, Editorial Review & Media Asset Ownership (Phase 3 & 5).
-- Enforces:
--   1. Single-use, expiring artist invitations (SHA-256 token hash) granting 'creator' role.
--   2. Append-only creator rights & consent grants (copyright attestation, non-exclusive license, translation/narration flags).
--   3. Full editorial state machine on public.stories:
--        draft -> submitted -> in_review -> changes_requested -> approved -> published
--        plus rejected, unpublished, withdrawn, removed.
--   4. Prevents unapproved direct publication (SEC-01): clients can never write status = 'published' directly.
--   5. Private media asset ownership & publication boundary enforcement.

-- ----------------------------------------------------------------- 1. Invitations
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (char_length(token_hash) = 64),
  invited_email text not null check (char_length(btrim(invited_email)) between 1 and 254),
  granted_role text not null default 'creator' check (granted_role in ('creator', 'moderator')),
  invited_by uuid references public.profiles(id) on delete set null,
  expires_at timestamptz not null,
  redeemed_by uuid references public.profiles(id) on delete set null,
  redeemed_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.invitations enable row level security;
create policy invitations_staff_read on public.invitations for select to authenticated using (public.is_staff());
revoke all on public.invitations from anon, authenticated;
grant select on public.invitations to authenticated;

create function public.create_artist_invitation(
  raw_token text,
  target_email text default '*',
  role_to_grant text default 'creator',
  valid_days int default 14
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  inv_id uuid;
  cleaned_token text := btrim(coalesce(raw_token, ''));
  cleaned_email text := lower(btrim(coalesce(target_email, '*')));
begin
  if not public.is_staff() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if char_length(cleaned_token) < 12 then
    raise exception 'invitation token too short' using errcode = '22023';
  end if;
  if role_to_grant not in ('creator', 'moderator') then
    raise exception 'invalid role' using errcode = '22023';
  end if;
  if valid_days < 1 or valid_days > 90 then
    raise exception 'invalid expiry window' using errcode = '22023';
  end if;

  insert into public.invitations (token_hash, invited_email, granted_role, invited_by, expires_at)
  values (
    encode(digest(cleaned_token, 'sha256'), 'hex'),
    cleaned_email,
    role_to_grant,
    auth.uid(),
    now() + make_interval(days => valid_days)
  )
  returning id into inv_id;

  insert into public.audit_log (actor_id, action, target)
  values (auth.uid(), 'invitation.created', inv_id::text);

  return inv_id;
end $$;
revoke execute on function public.create_artist_invitation(text, text, text, int) from public, anon;
grant execute on function public.create_artist_invitation(text, text, text, int) to authenticated;

create function public.redeem_artist_invitation(raw_token text) returns text
language plpgsql security definer set search_path = public, auth as $$
declare
  uid uuid := auth.uid();
  caller_email text;
  inv record;
  hashed text := encode(digest(btrim(coalesce(raw_token, '')), 'sha256'), 'hex');
begin
  if uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;

  select * into inv
  from public.invitations
  where token_hash = hashed
  for update;

  if not found then
    raise exception 'invalid invitation' using errcode = '22023';
  end if;
  if inv.revoked_at is not null then
    raise exception 'invitation revoked' using errcode = '42501';
  end if;
  if inv.redeemed_at is not null then
    raise exception 'invitation already used' using errcode = '23505';
  end if;
  if inv.expires_at <= now() then
    raise exception 'invitation expired' using errcode = '22023';
  end if;

  select lower(btrim(email)) into caller_email from auth.users where id = uid;
  if inv.invited_email <> '*' and coalesce(caller_email, '') <> inv.invited_email then
    raise exception 'invitation email mismatch' using errcode = '42501';
  end if;

  update public.invitations
  set redeemed_by = uid, redeemed_at = now()
  where id = inv.id;

  update public.profiles
  set role = case when role in ('admin', 'moderator') then role else inv.granted_role end
  where id = uid;

  insert into public.audit_log (actor_id, action, target)
  values (uid, 'invitation.redeemed.' || inv.granted_role, inv.id::text);

  return inv.granted_role;
end $$;
revoke execute on function public.redeem_artist_invitation(text) from public, anon;
grant execute on function public.redeem_artist_invitation(text) to authenticated;

-- ----------------------------------------- 2. Stories Editorial State Machine (SEC-01)
alter table public.stories drop constraint if exists stories_status_check;
alter table public.stories add constraint stories_status_check check (
  status in (
    'draft',
    'submitted',
    'in_review',
    'changes_requested',
    'approved',
    'published',
    'rejected',
    'unpublished',
    'withdrawn',
    'removed'
  )
);

alter table public.stories add column if not exists themes text[] not null default '{}';
alter table public.stories add column if not exists intended_audience text not null default '' check (char_length(intended_audience) <= 120);
alter table public.stories add column if not exists content_warnings text[] not null default '{}';
alter table public.stories add column if not exists submitted_at timestamptz;
alter table public.stories add column if not exists reviewed_at timestamptz;
alter table public.stories add column if not exists reviewed_by uuid references public.profiles(id) on delete set null;
alter table public.stories add column if not exists review_notes text check (char_length(review_notes) <= 2000);
alter table public.stories add column if not exists version int not null default 1 check (version >= 1);

-- Lock down direct client insert/update on stories:
-- Clients can only insert 'draft' stories, and can only directly update their own stories while in 'draft' or 'changes_requested'.
-- They can NEVER directly set status = 'published', 'approved', 'in_review', etc.
drop policy if exists stories_insert on public.stories;
drop policy if exists stories_update_own on public.stories;

create policy stories_insert on public.stories for insert to authenticated
  with check (author_id = auth.uid() and status = 'draft' and published_at is null);

create policy stories_update_own on public.stories for update to authenticated
  using (author_id = auth.uid() and status in ('draft', 'changes_requested'))
  with check (author_id = auth.uid() and status in ('draft', 'changes_requested') and published_at is null);

revoke insert, update on public.stories from anon, authenticated;
grant insert (author_id, title, summary, cover_url, languages, themes, intended_audience, content_warnings) on public.stories to authenticated;
grant update (title, summary, cover_url, languages, themes, intended_audience, content_warnings) on public.stories to authenticated;

-- Chapters can only be edited while the parent story is in 'draft' or 'changes_requested'
drop policy if exists chapters_write on public.chapters;
create policy chapters_write on public.chapters for all to authenticated
  using (exists (
    select 1 from public.stories s
    where s.id = story_id and s.author_id = auth.uid() and s.status in ('draft', 'changes_requested')
  ))
  with check (exists (
    select 1 from public.stories s
    where s.id = story_id and s.author_id = auth.uid() and s.status in ('draft', 'changes_requested')
  ));
grant insert, update, delete on public.chapters to authenticated;

-- ------------------------------------------------------- 3. Creator Rights Grants (SEC-03)
create table public.rights_grants (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references public.stories(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  terms_version text not null default '2026-11-v1' check (char_length(btrim(terms_version)) between 1 and 40),
  confirms_original_work boolean not null check (confirms_original_work = true),
  grants_non_exclusive_license boolean not null check (grants_non_exclusive_license = true),
  confirms_third_party_consents boolean not null check (confirms_third_party_consents = true),
  allow_translation boolean not null default false,
  allow_audio_narration boolean not null default false,
  attribution_name text not null check (char_length(btrim(attribution_name)) between 1 and 120),
  created_at timestamptz not null default now()
);
create index rights_grants_story_idx on public.rights_grants (story_id, created_at desc);
alter table public.rights_grants enable row level security;

create policy rights_grants_read on public.rights_grants for select to authenticated
  using (author_id = auth.uid() or public.is_staff());

create policy rights_grants_insert on public.rights_grants for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.stories s
      where s.id = story_id and s.author_id = auth.uid() and s.status in ('draft', 'changes_requested')
    )
  );

revoke all on public.rights_grants from anon, authenticated;
grant select on public.rights_grants to authenticated;
grant insert (
  story_id,
  author_id,
  terms_version,
  confirms_original_work,
  grants_non_exclusive_license,
  confirms_third_party_consents,
  allow_translation,
  allow_audio_narration,
  attribution_name
) on public.rights_grants to authenticated;

-- ------------------------------------------------------- 4. Editorial Reviews & Revisions
create table public.story_reviews (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references public.stories(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete set null,
  from_status text not null,
  to_status text not null check (to_status in ('in_review', 'changes_requested', 'approved', 'published', 'rejected', 'unpublished', 'removed')),
  editorial_notes text not null default '' check (char_length(editorial_notes) <= 2000),
  created_at timestamptz not null default now()
);
create index story_reviews_story_idx on public.story_reviews (story_id, created_at desc);
alter table public.story_reviews enable row level security;

create policy story_reviews_read on public.story_reviews for select to authenticated
  using (
    public.is_staff()
    or exists (select 1 from public.stories s where s.id = story_id and s.author_id = auth.uid())
  );

revoke all on public.story_reviews from anon, authenticated;
grant select on public.story_reviews to authenticated;

-- ------------------------------------------------------- 5. Media Assets & Access Boundary
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  story_id text not null references public.stories(id) on delete cascade,
  kind text not null check (kind in ('cover', 'image', 'audio')),
  object_path text not null unique check (char_length(btrim(object_path)) between 3 and 500),
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp4', 'audio/wav')),
  byte_size int not null check (byte_size > 0 and byte_size <= 52428800),
  alt_or_caption text not null default '' check (char_length(alt_or_caption) <= 500),
  created_at timestamptz not null default now()
);
alter table public.media_assets enable row level security;

-- Media assets are readable ONLY if the parent story is published, or by the owner / staff.
create policy media_assets_read on public.media_assets for select
  using (
    owner_id = auth.uid()
    or public.is_staff()
    or exists (select 1 from public.stories s where s.id = story_id and s.status = 'published')
  );

create policy media_assets_write on public.media_assets for insert to authenticated
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.stories s
      where s.id = story_id and s.author_id = auth.uid() and s.status in ('draft', 'changes_requested')
    )
  );

revoke all on public.media_assets from anon, authenticated;
grant select on public.media_assets to anon, authenticated;
grant insert (owner_id, story_id, kind, object_path, mime_type, byte_size, alt_or_caption) on public.media_assets to authenticated;

-- ------------------------------------------------------- 6. Workflow Transition RPCs
create function public.submit_story_for_review(target_story_id text) returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  st record;
  chapter_count int;
  has_rights boolean;
begin
  if uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;

  select * into st from public.stories where id = target_story_id for update;
  if not found then
    raise exception 'story not found' using errcode = 'P0002';
  end if;
  if st.author_id <> uid then
    raise exception 'not story owner' using errcode = '42501';
  end if;
  if st.status not in ('draft', 'changes_requested') then
    raise exception 'story cannot be submitted from status %', st.status using errcode = '22023';
  end if;

  select count(*) into chapter_count
  from public.chapters
  where story_id = target_story_id and char_length(btrim(title)) > 0 and char_length(btrim(body)) > 0;
  if chapter_count < 1 then
    raise exception 'at least one complete chapter is required' using errcode = '22023';
  end if;

  select exists (
    select 1 from public.rights_grants
    where story_id = target_story_id
      and author_id = uid
      and confirms_original_work = true
      and grants_non_exclusive_license = true
      and confirms_third_party_consents = true
  ) into has_rights;
  if not has_rights then
    raise exception 'creator rights grant required before submission' using errcode = '22023';
  end if;

  update public.stories
  set status = 'submitted',
      submitted_at = now(),
      version = case when st.status = 'changes_requested' then st.version + 1 else st.version end
  where id = target_story_id;

  insert into public.audit_log (actor_id, action, target)
  values (uid, 'story.submitted.v' || (case when st.status = 'changes_requested' then st.version + 1 else st.version end)::text, target_story_id);
end $$;
revoke execute on function public.submit_story_for_review(text) from public, anon;
grant execute on function public.submit_story_for_review(text) to authenticated;

create function public.review_story_submission(
  target_story_id text,
  next_status text,
  notes text default ''
) returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  st record;
  clean_notes text := btrim(coalesce(notes, ''));
begin
  if not public.is_staff() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if next_status not in ('in_review', 'changes_requested', 'approved', 'published', 'rejected', 'unpublished', 'removed') then
    raise exception 'invalid review status %', next_status using errcode = '22023';
  end if;

  select * into st from public.stories where id = target_story_id for update;
  if not found then
    raise exception 'story not found' using errcode = 'P0002';
  end if;

  -- Enforce legal editorial transitions: a raw 'draft' or 'withdrawn' story cannot be published by staff without artist submission.
  if st.status in ('draft', 'withdrawn') and next_status in ('in_review', 'changes_requested', 'approved', 'published') then
    raise exception 'cannot review unsubmitted story in status %', st.status using errcode = '22023';
  end if;

  if next_status in ('changes_requested', 'rejected') and char_length(clean_notes) < 1 then
    raise exception 'editorial notes required when requesting changes or rejecting' using errcode = '22023';
  end if;

  update public.stories
  set status = next_status,
      reviewed_by = uid,
      reviewed_at = now(),
      review_notes = clean_notes,
      published_at = case
        when next_status = 'published' then coalesce(published_at, now())
        when next_status in ('unpublished', 'rejected', 'removed') then null
        else published_at
      end
  where id = target_story_id;

  insert into public.story_reviews (story_id, reviewer_id, from_status, to_status, editorial_notes)
  values (target_story_id, uid, st.status, next_status, clean_notes);

  insert into public.audit_log (actor_id, action, target)
  values (uid, 'story.review.' || next_status, target_story_id);
end $$;
revoke execute on function public.review_story_submission(text, text, text) from public, anon;
grant execute on function public.review_story_submission(text, text, text) to authenticated;

create function public.withdraw_story(target_story_id text) returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  st record;
begin
  if uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;

  select * into st from public.stories where id = target_story_id for update;
  if not found then
    raise exception 'story not found' using errcode = 'P0002';
  end if;
  if st.author_id <> uid then
    raise exception 'not story owner' using errcode = '42501';
  end if;
  if st.status = 'removed' then
    raise exception 'removed story cannot be modified' using errcode = '42501';
  end if;

  update public.stories
  set status = 'withdrawn',
      published_at = null
  where id = target_story_id;

  insert into public.audit_log (actor_id, action, target)
  values (uid, 'story.withdrawn', target_story_id);
end $$;
revoke execute on function public.withdraw_story(text) from public, anon;
grant execute on function public.withdraw_story(text) to authenticated;
