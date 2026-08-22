-- Lawyers may clear their own submission history after approval,
-- including when they remove the published listing from the site.

drop policy if exists "requests: lawyer withdraws pending" on public.change_requests;
create policy "requests: lawyer withdraws own" on public.change_requests
  for delete using (lawyer_id = public.current_lawyer_id());
