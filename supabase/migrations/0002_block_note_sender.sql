-- Lets a creator block the sender of a note without ever seeing who they are.
create function public.block_note_sender(note_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare sender uuid;
begin
  select n.sender_id into sender from public.notes n where n.id = note_id and n.creator_id = auth.uid();
  if sender is null then raise exception 'note not found' using errcode = 'P0002'; end if;
  insert into public.blocks (blocker_id, blocked_id) values (auth.uid(), sender) on conflict do nothing;
end $$;
revoke execute on function public.block_note_sender(uuid) from public, anon;
grant execute on function public.block_note_sender(uuid) to authenticated;
