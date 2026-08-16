-- Client-posted problems: lawyers send priced proposals; clients can book a
-- 15-minute consult without accepting an offer. Cases are private to the
-- client, active lawyers, and admins.

alter table public.lawyers
  add column if not exists suspended boolean not null default false;

do $$
begin
  create type public.client_case_status as enum ('open', 'closed', 'matched');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.proposal_status as enum ('pending', 'withdrawn', 'accepted', 'declined');
exception when duplicate_object then null;
end $$;

create or replace function public.is_active_lawyer()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.lawyers
    where profile_id = auth.uid()
      and published
      and not coalesce(suspended, false)
  );
$$;

create table if not exists public.client_cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text not null,
  city text,
  status public.client_case_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_cases_title_len check (char_length(trim(title)) between 8 and 160),
  constraint client_cases_description_len check (char_length(trim(description)) between 40 and 8000)
);

create or replace trigger client_cases_updated_at
  before update on public.client_cases
  for each row execute function public.set_updated_at();

create index if not exists client_cases_open_idx
  on public.client_cases (created_at desc)
  where status = 'open';

create index if not exists client_cases_client_idx
  on public.client_cases (client_id, created_at desc);

create table if not exists public.case_proposals (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.client_cases(id) on delete cascade,
  lawyer_id uuid not null references public.lawyers(id) on delete cascade,
  price numeric(10, 2) not null check (price >= 0),
  currency text not null default 'GEL',
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  message text not null default '',
  status public.proposal_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger case_proposals_updated_at
  before update on public.case_proposals
  for each row execute function public.set_updated_at();

create unique index if not exists case_proposals_one_pending
  on public.case_proposals (case_id, lawyer_id)
  where status = 'pending';

create index if not exists case_proposals_case_idx
  on public.case_proposals (case_id, created_at desc);

create index if not exists case_proposals_lawyer_idx
  on public.case_proposals (lawyer_id, created_at desc);

alter table public.bookings
  add column if not exists client_case_id uuid references public.client_cases(id) on delete set null;

create index if not exists bookings_client_case_idx
  on public.bookings (client_case_id)
  where client_case_id is not null;

-- Body edits only for two hours; closing / matching a case is always allowed.
create or replace function public.guard_client_case_edit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.client_id is distinct from old.client_id then
    raise exception 'cannot reassign a case';
  end if;
  if new.title is not distinct from old.title
     and new.description is not distinct from old.description
     and new.category_id is not distinct from old.category_id
     and new.city is not distinct from old.city then
    return new;
  end if;
  if now() > old.created_at + interval '2 hours' then
    raise exception 'case can only be edited for 2 hours after posting';
  end if;
  return new;
end;
$$;

drop trigger if exists client_cases_guard_edit on public.client_cases;
create trigger client_cases_guard_edit
  before update on public.client_cases
  for each row execute function public.guard_client_case_edit();

alter table public.client_cases enable row level security;
alter table public.case_proposals enable row level security;

drop policy if exists "client_cases: owner reads" on public.client_cases;
create policy "client_cases: owner reads" on public.client_cases
  for select using (client_id = auth.uid());

drop policy if exists "client_cases: lawyers read open" on public.client_cases;
create policy "client_cases: lawyers read open" on public.client_cases
  for select using (status = 'open' and public.is_active_lawyer());

drop policy if exists "client_cases: admin reads" on public.client_cases;
create policy "client_cases: admin reads" on public.client_cases
  for select using (public.is_admin());

drop policy if exists "client_cases: client inserts" on public.client_cases;
create policy "client_cases: client inserts" on public.client_cases
  for insert with check (
    client_id = auth.uid()
    and (not public.is_active_lawyer() or public.is_admin())
  );

drop policy if exists "client_cases: owner updates" on public.client_cases;
create policy "client_cases: owner updates" on public.client_cases
  for update using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists "client_cases: admin updates" on public.client_cases;
create policy "client_cases: admin updates" on public.client_cases
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "proposals: owner or author reads" on public.case_proposals;
create policy "proposals: owner or author reads" on public.case_proposals
  for select using (
    lawyer_id = public.current_lawyer_id()
    or exists (
      select 1 from public.client_cases c
      where c.id = case_id and c.client_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "proposals: lawyer inserts" on public.case_proposals;
create policy "proposals: lawyer inserts" on public.case_proposals
  for insert with check (
    lawyer_id = public.current_lawyer_id()
    and public.is_active_lawyer()
    and exists (
      select 1 from public.client_cases c
      where c.id = case_id and c.status = 'open'
    )
  );

drop policy if exists "proposals: lawyer updates own" on public.case_proposals;
create policy "proposals: lawyer updates own" on public.case_proposals
  for update using (lawyer_id = public.current_lawyer_id())
  with check (lawyer_id = public.current_lawyer_id());

drop policy if exists "proposals: client updates on own case" on public.case_proposals;
create policy "proposals: client updates on own case" on public.case_proposals
  for update using (
    exists (
      select 1 from public.client_cases c
      where c.id = case_id and c.client_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.client_cases c
      where c.id = case_id and c.client_id = auth.uid()
    )
  );

drop policy if exists "proposals: admin writes" on public.case_proposals;
create policy "proposals: admin writes" on public.case_proposals
  for all using (public.is_admin()) with check (public.is_admin());
