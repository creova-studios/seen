-- Creates the profile row when someone signs up (email or Google). Roles are never taken from the client
-- beyond viewer/creator; moderator and admin are granted only by staff with the service role.
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare picked text := coalesce(new.raw_user_meta_data ->> 'role', 'viewer');
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)), 80),
    case when picked in ('viewer', 'creator') then picked else 'viewer' end
  )
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
