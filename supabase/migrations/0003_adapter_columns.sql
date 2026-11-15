-- Columns the client adapter needs, and stronger anonymity for notes.

-- Reports keep a short title of the target so moderators see what was reported.
alter table public.reports add column target_title text not null default '' check (char_length(target_title) <= 140);
grant insert (target_title) on public.reports to authenticated;

-- Notes: the sender is anonymous unless they chose to include their name (snapshot at send time).
alter table public.notes add column sender_named boolean not null default false;
alter table public.notes add column sender_name text check (char_length(sender_name) <= 80);
grant insert (sender_named) on public.notes to authenticated;
-- Nobody can read who sent a note through the API, including the creator. RLS still uses sender_id internally.
revoke select on public.notes from authenticated;
grant select (id, story_id, creator_id, body, created_at, sender_named, sender_name) on public.notes to authenticated;

create or replace function public.notes_before_insert() returns trigger language plpgsql security definer set search_path = public as $$
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
  new.sender_name := case when new.sender_named then (select display_name from public.profiles where id = new.sender_id) else null end;
  return new;
end $$;

-- Preferences: replies toggle.
alter table public.notification_prefs add column replies boolean not null default true;
