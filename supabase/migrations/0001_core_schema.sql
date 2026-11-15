-- SEEN core schema (ENG-E2). Region: AWS ca-central-1. Roles anon/authenticated and
-- auth.users/auth.uid() are provided by Supabase; supabase/tests/stub_auth.sql mimics them locally.
-- Principles: RLS on every table, no client-supplied ids or roles, limits enforced in the database.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  role text not null default 'viewer' check (role in ('viewer','creator','moderator','admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy profiles_read on public.profiles for select using (true);
create policy profiles_insert_self on public.profiles for insert to authenticated
  with check (id = auth.uid() and role = 'viewer');
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
-- Column-level protection: clients can never write role.
revoke insert, update on public.profiles from anon, authenticated;
grant insert (id, display_name) on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

create function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator','admin'));
$$;

-- ----------------------------------------------------------------- stories
create table public.stories (
  id text primary key default ('db_' || gen_random_uuid()::text) check (id like 'db\_%'),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 140),
  summary text not null default '' check (char_length(summary) <= 600),
  cover_url text,
  languages text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published','removed')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index stories_feed_idx on public.stories (published_at desc, id) where status = 'published';
create index stories_lang_idx on public.stories using gin (languages);
alter table public.stories enable row level security;
create policy stories_read on public.stories for select
  using (status = 'published' or author_id = auth.uid() or public.is_staff());
create policy stories_insert on public.stories for insert to authenticated
  with check (author_id = auth.uid() and status in ('draft','published'));
create policy stories_update_own on public.stories for update to authenticated
  using (author_id = auth.uid() and status <> 'removed') with check (author_id = auth.uid() and status <> 'removed');
revoke insert, update on public.stories from anon, authenticated;
grant insert (author_id, title, summary, cover_url, languages, status, published_at) on public.stories to authenticated;
grant update (title, summary, cover_url, languages, status, published_at) on public.stories to authenticated;

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references public.stories(id) on delete cascade,
  position int not null check (position >= 1),
  title text not null default '' check (char_length(title) <= 140),
  body text not null default '',
  unique (story_id, position)
);
alter table public.chapters enable row level security;
create policy chapters_read on public.chapters for select using (
  exists (select 1 from public.stories s where s.id = story_id
          and (s.status = 'published' or s.author_id = auth.uid() or public.is_staff())));
create policy chapters_write on public.chapters for all to authenticated
  using (exists (select 1 from public.stories s where s.id = story_id and s.author_id = auth.uid() and s.status <> 'removed'))
  with check (exists (select 1 from public.stories s where s.id = story_id and s.author_id = auth.uid() and s.status <> 'removed'));

-- Public view for share previews (E4). Only published stories, only preview columns.
create view public.public_stories with (security_invoker = true) as
  select id, title, summary, cover_url, languages, published_at from public.stories where status = 'published';
grant select on public.public_stories to anon, authenticated;

-- ------------------------------------------------------------------ blocks
create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
alter table public.blocks enable row level security;
create policy blocks_own on public.blocks for all to authenticated
  using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- ------------------------------------------------------------------- notes
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references public.stories(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 500 and body !~ '[\x00-\x08\x0B\x0C\x0E-\x1F]'),
  hour_bucket timestamptz not null,
  created_at timestamptz not null default now(),
  unique (sender_id, story_id, hour_bucket)
);
create index notes_creator_idx on public.notes (creator_id, created_at desc);
alter table public.notes enable row level security;
create policy notes_read on public.notes for select to authenticated
  using (sender_id = auth.uid() or creator_id = auth.uid());
create policy notes_insert on public.notes for insert to authenticated with check (sender_id = auth.uid());
create policy notes_delete_creator on public.notes for delete to authenticated using (creator_id = auth.uid());
revoke insert, update, delete on public.notes from anon, authenticated;
grant insert (story_id, sender_id, body) on public.notes to authenticated;
grant delete on public.notes to authenticated;

create function public.notes_before_insert() returns trigger language plpgsql security definer set search_path = public as $$
declare author uuid;
begin
  select author_id into author from public.stories where id = new.story_id and status = 'published';
  if author is null then raise exception 'story not available' using errcode = '22023'; end if;
  if exists (select 1 from public.blocks where blocker_id = author and blocked_id = new.sender_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if (select count(*) from public.notes where sender_id = new.sender_id and created_at > now() - interval '24 hours') >= 20 then
    raise exception 'daily note limit reached' using errcode = '54000';
  end if;
  new.creator_id := author;
  new.hour_bucket := date_trunc('hour', now());
  new.body := btrim(new.body);
  return new;
end $$;
create trigger notes_before_insert before insert on public.notes for each row execute function public.notes_before_insert();

-- ----------------------------------------------------------------- reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null, -- retained as evidence after deletion, anonymised
  target_type text not null check (target_type in ('story','creator','collection')),
  target_id text not null check (char_length(target_id) <= 120),
  reason text not null check (reason in ('harassment','misinformation','rights','sensitive','spam','other')),
  details text check (char_length(details) <= 500 and details !~ '[\x00-\x08\x0B\x0C\x0E-\x1F]'),
  status text not null default 'open' check (status in ('open','action_taken','dismissed')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index reports_one_open_idx on public.reports (reporter_id, target_type, target_id) where status = 'open';
alter table public.reports enable row level security;
-- The reported creator can never read reports (no policy for them); reporters see only their own.
create policy reports_read on public.reports for select to authenticated using (reporter_id = auth.uid() or public.is_staff());
create policy reports_insert on public.reports for insert to authenticated with check (reporter_id = auth.uid() and status = 'open');
revoke insert, update, delete on public.reports from anon, authenticated;
grant insert (reporter_id, target_type, target_id, reason, details) on public.reports to authenticated;

create function public.reports_before_insert() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.reports where reporter_id = new.reporter_id and created_at > now() - interval '24 hours') >= 20 then
    raise exception 'daily report limit reached' using errcode = '54000';
  end if;
  return new;
end $$;
create trigger reports_before_insert before insert on public.reports for each row execute function public.reports_before_insert();

-- ------------------------------------------------------------- audit + staff
create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target text not null,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create policy audit_read on public.audit_log for select to authenticated using (public.is_staff());
revoke all on public.audit_log from anon, authenticated;
grant select on public.audit_log to authenticated;

create function public.resolve_report(report_id uuid, new_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then raise exception 'not allowed' using errcode = '42501'; end if;
  if new_status not in ('action_taken','dismissed') then raise exception 'invalid status' using errcode = '22023'; end if;
  update public.reports set status = new_status, reviewed_by = auth.uid(), reviewed_at = now() where id = report_id and status = 'open';
  insert into public.audit_log (actor_id, action, target) values (auth.uid(), 'report.' || new_status, report_id::text);
end $$;
revoke execute on function public.resolve_report(uuid, text) from public, anon;
grant execute on function public.resolve_report(uuid, text) to authenticated;

-- --------------------------------------------------------- notification prefs
create table public.notification_prefs (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  stories boolean not null default true,
  funding boolean not null default true,
  reminders boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.notification_prefs enable row level security;
create policy prefs_own on public.notification_prefs for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ----------------------------------------------------------- account deletion
-- Idempotent. Matrix: docs/security/DATA_RETENTION_MATRIX.md.
create function public.delete_my_account() returns void language plpgsql security definer set search_path = public, auth as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in' using errcode = '42501'; end if;
  delete from auth.users where id = uid; -- cascades profiles, stories, chapters, notes, blocks, prefs; reports/audit anonymised
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Public read access to data goes through RLS; everything above is deny-by-default for anon except where a policy says otherwise.
grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.stories, public.chapters to anon, authenticated;
grant select, insert, update, delete on public.blocks to authenticated;
grant select on public.notes, public.reports to authenticated;
grant select, insert, update on public.notification_prefs to authenticated;
