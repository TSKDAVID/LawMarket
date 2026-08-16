-- Lawyers may delete their own service listings. New listings still go
-- through change_requests; this only covers rows they already own.

drop policy if exists "services: lawyer deletes own" on public.services;
create policy "services: lawyer deletes own" on public.services
  for delete using (lawyer_id = public.current_lawyer_id());
