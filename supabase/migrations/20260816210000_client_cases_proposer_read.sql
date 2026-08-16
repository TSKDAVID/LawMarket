-- Lawyers who proposed keep access after a case is matched or closed.
-- Bookings tied to a case must belong to that case's client.

drop policy if exists "client_cases: proposing lawyer reads" on public.client_cases;
create policy "client_cases: proposing lawyer reads" on public.client_cases
  for select using (
    exists (
      select 1 from public.case_proposals p
      where p.case_id = id
        and p.lawyer_id = public.current_lawyer_id()
    )
  );

drop policy if exists "bookings: anyone may create" on public.bookings;
create policy "bookings: anyone may create" on public.bookings
  for insert with check (
    client_case_id is null
    or exists (
      select 1 from public.client_cases c
      where c.id = client_case_id and c.client_id = auth.uid()
    )
  );
