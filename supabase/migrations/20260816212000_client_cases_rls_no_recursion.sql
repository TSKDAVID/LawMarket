-- Break RLS cycles between client_cases and case_proposals.
-- Policies that subquery the other table must go through SECURITY DEFINER
-- helpers, otherwise Postgres raises "infinite recursion detected in policy".

create or replace function public.owns_client_case(p_case_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.client_cases
    where id = p_case_id and client_id = auth.uid()
  );
$$;

create or replace function public.lawyer_proposed_on_case(p_case_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.case_proposals
    where case_id = p_case_id
      and lawyer_id = public.current_lawyer_id()
  );
$$;

create or replace function public.client_case_is_open(p_case_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.client_cases
    where id = p_case_id and status = 'open'
  );
$$;

grant execute on function public.owns_client_case(uuid) to anon, authenticated;
grant execute on function public.lawyer_proposed_on_case(uuid) to anon, authenticated;
grant execute on function public.client_case_is_open(uuid) to anon, authenticated;

drop policy if exists "client_cases: proposing lawyer reads" on public.client_cases;
create policy "client_cases: proposing lawyer reads" on public.client_cases
  for select using (public.lawyer_proposed_on_case(id));

drop policy if exists "proposals: owner or author reads" on public.case_proposals;
create policy "proposals: owner or author reads" on public.case_proposals
  for select using (
    lawyer_id = public.current_lawyer_id()
    or public.owns_client_case(case_id)
    or public.is_admin()
  );

drop policy if exists "proposals: lawyer inserts" on public.case_proposals;
create policy "proposals: lawyer inserts" on public.case_proposals
  for insert with check (
    lawyer_id = public.current_lawyer_id()
    and public.is_active_lawyer()
    and public.client_case_is_open(case_id)
  );

drop policy if exists "proposals: client updates on own case" on public.case_proposals;
create policy "proposals: client updates on own case" on public.case_proposals
  for update using (public.owns_client_case(case_id))
  with check (public.owns_client_case(case_id));

drop policy if exists "bookings: anyone may create" on public.bookings;
create policy "bookings: anyone may create" on public.bookings
  for insert with check (
    client_case_id is null
    or public.owns_client_case(client_case_id)
  );
