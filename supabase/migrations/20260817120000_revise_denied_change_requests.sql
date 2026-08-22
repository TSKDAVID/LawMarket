-- Lawyers may revise a pending or rejected submission and send it back
-- to the inbox. Admins already have full write access, so they can still
-- approve a request after it was denied.

drop policy if exists "requests: lawyer revises own queue" on public.change_requests;
create policy "requests: lawyer revises own queue" on public.change_requests
  for update
  using (
    lawyer_id = public.current_lawyer_id()
    and status in ('pending', 'rejected')
  )
  with check (
    lawyer_id = public.current_lawyer_id()
    and status = 'pending'
  );

drop policy if exists "requests: lawyer withdraws pending" on public.change_requests;
create policy "requests: lawyer withdraws pending" on public.change_requests
  for delete using (
    lawyer_id = public.current_lawyer_id()
    and status in ('pending', 'rejected')
  );

create or replace function public.guard_change_request_self_edit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if old.status not in ('pending', 'rejected') then
    raise exception 'only pending or rejected requests can be edited';
  end if;

  new.lawyer_id := old.lawyer_id;
  new.kind := old.kind;
  new.submitted_by := old.submitted_by;
  new.created_record_id := old.created_record_id;
  new.status := 'pending';
  new.review_note := null;
  new.reviewed_by := null;
  new.reviewed_at := null;
  return new;
end;
$$;

drop trigger if exists change_requests_guard_self_edit on public.change_requests;
create trigger change_requests_guard_self_edit
  before update on public.change_requests
  for each row execute function public.guard_change_request_self_edit();
