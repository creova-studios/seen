-- Profile bio (Edit profile). Clients may update their own bio like their display name, never role.
alter table public.profiles add column bio text check (char_length(bio) <= 280);
grant update (bio) on public.profiles to authenticated;
