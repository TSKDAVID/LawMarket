-- Law Market — lawyer portal and approval queue
--
-- Adds past cases, the change-request inbox, and the policies that let a
-- lawyer maintain their own profile without being able to publish or verify
-- themselves. Re-runnable, like 0001.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$
begin
  create type public.change_request_kind as enum ('service', 'case');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.change_request_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Who is the current user, as a lawyer?
-- ---------------------------------------------------------------------------

/*
 * Resolves the signed-in user to their lawyer row. SECURITY DEFINER for the
 * same reason as is_admin(): policies on `lawyers` would otherwise recurse
 * when this looked the row up.
 */
create or replace function public.current_lawyer_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.lawyers where profile_id = auth.uid() limit 1;
$$;

-- Public contact lives on the lawyer row so visitors can see it without
-- reading the private profiles table.
alter table public.lawyers add column if not exists phone text;
alter table public.lawyers add column if not exists contact_email text;

-- ---------------------------------------------------------------------------
-- Past cases
-- ---------------------------------------------------------------------------

create table if not exists public.lawyer_cases (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references public.lawyers(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  -- Georgian is required; English falls back to it when left blank.
  title_ka text not null,
  title_en text not null default '',
  description_ka text not null default '',
  description_en text not null default '',
  year integer,
  outcome_ka text not null default '',
  outcome_en text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger lawyer_cases_updated_at
  before update on public.lawyer_cases
  for each row execute function public.set_updated_at();

create index if not exists lawyer_cases_lawyer_idx
  on public.lawyer_cases (lawyer_id, sort_order);

-- ---------------------------------------------------------------------------
-- Change requests — the super admin's inbox
--
-- Creations only. A lawyer editing their own already-approved profile or
-- service writes straight through; additions queue here until reviewed, so the
-- live site never changes shape without a decision.
-- ---------------------------------------------------------------------------

create table if not exists public.change_requests (
  id uuid primary key default gen_random_uuid(),
  kind public.change_request_kind not null,
  lawyer_id uuid not null references public.lawyers(id) on delete cascade,
  submitted_by uuid references public.profiles(id) on delete set null,
  -- Proposed row, shaped like the destination table.
  payload jsonb not null,
  status public.change_request_status not null default 'pending',
  review_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  -- Set once approved, so the admin can jump to what was created.
  created_record_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger change_requests_updated_at
  before update on public.change_requests
  for each row execute function public.set_updated_at();

create index if not exists change_requests_pending_idx
  on public.change_requests (status, created_at desc);
create index if not exists change_requests_lawyer_idx
  on public.change_requests (lawyer_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Lawyers may maintain their own row — but not their standing
-- ---------------------------------------------------------------------------

/*
 * `verified`, `published`, `profile_id` and `slug` are the site's promises to
 * visitors, not the lawyer's to make. Anyone but an admin editing their own
 * row silently keeps the old values rather than being rejected, so the portal
 * form can post the whole row without having to know which fields are locked.
 */
create or replace function public.guard_lawyer_self_edit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  new.verified := old.verified;
  new.published := old.published;
  new.profile_id := old.profile_id;
  new.slug := old.slug;
  new.sort_order := old.sort_order;
  return new;
end;
$$;

create or replace trigger lawyers_guard_self_edit
  before update on public.lawyers
  for each row execute function public.guard_lawyer_self_edit();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.lawyer_cases enable row level security;
alter table public.change_requests enable row level security;

-- Past cases: public sees published ones; a lawyer sees all of their own.
drop policy if exists "cases: public read published" on public.lawyer_cases;
create policy "cases: public read published" on public.lawyer_cases
  for select using (published);
drop policy if exists "cases: lawyer reads own" on public.lawyer_cases;
create policy "cases: lawyer reads own" on public.lawyer_cases
  for select using (lawyer_id = public.current_lawyer_id());
drop policy if exists "cases: lawyer edits own" on public.lawyer_cases;
create policy "cases: lawyer edits own" on public.lawyer_cases
  for update using (lawyer_id = public.current_lawyer_id())
  with check (lawyer_id = public.current_lawyer_id());
drop policy if exists "cases: lawyer deletes own" on public.lawyer_cases;
create policy "cases: lawyer deletes own" on public.lawyer_cases
  for delete using (lawyer_id = public.current_lawyer_id());
-- Note: no insert policy for lawyers. New cases arrive through approval.
drop policy if exists "cases: admin write" on public.lawyer_cases;
create policy "cases: admin write" on public.lawyer_cases
  for all using (public.is_admin()) with check (public.is_admin());

-- Change requests: a lawyer files and watches their own; admins see everything.
drop policy if exists "requests: lawyer creates own" on public.change_requests;
create policy "requests: lawyer creates own" on public.change_requests
  for insert with check (
    lawyer_id = public.current_lawyer_id()
    and submitted_by = auth.uid()
    and status = 'pending'
  );
drop policy if exists "requests: lawyer reads own" on public.change_requests;
create policy "requests: lawyer reads own" on public.change_requests
  for select using (lawyer_id = public.current_lawyer_id());
drop policy if exists "requests: lawyer withdraws pending" on public.change_requests;
create policy "requests: lawyer withdraws pending" on public.change_requests
  for delete using (
    lawyer_id = public.current_lawyer_id() and status = 'pending'
  );
drop policy if exists "requests: admin read" on public.change_requests;
create policy "requests: admin read" on public.change_requests
  for select using (public.is_admin());
drop policy if exists "requests: admin write" on public.change_requests;
create policy "requests: admin write" on public.change_requests
  for all using (public.is_admin()) with check (public.is_admin());

-- Lawyers: maintain your own row (the guard trigger pins the locked columns).
drop policy if exists "lawyers: read own row" on public.lawyers;
create policy "lawyers: read own row" on public.lawyers
  for select using (profile_id = auth.uid());
drop policy if exists "lawyers: update own row" on public.lawyers;
create policy "lawyers: update own row" on public.lawyers
  for update using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Services: a lawyer may revise their own listings; new ones need approval.
drop policy if exists "services: lawyer reads own" on public.services;
create policy "services: lawyer reads own" on public.services
  for select using (lawyer_id = public.current_lawyer_id());
drop policy if exists "services: lawyer updates own" on public.services;
create policy "services: lawyer updates own" on public.services
  for update using (lawyer_id = public.current_lawyer_id())
  with check (lawyer_id = public.current_lawyer_id());

/*
 * Same reasoning as the lawyer guard: `published`, `popular` and `slug` decide
 * how a service is presented on the site, so they stay with the admin.
 */
create or replace function public.guard_service_self_edit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  new.published := old.published;
  new.popular := old.popular;
  new.slug := old.slug;
  new.lawyer_id := old.lawyer_id;
  new.sort_order := old.sort_order;
  return new;
end;
$$;

create or replace trigger services_guard_self_edit
  before update on public.services
  for each row execute function public.guard_service_self_edit();

-- Bookings and orders addressed to a lawyer should be visible to that lawyer.
drop policy if exists "bookings: lawyer reads own" on public.bookings;
create policy "bookings: lawyer reads own" on public.bookings
  for select using (lawyer_id = public.current_lawyer_id());
drop policy if exists "orders: lawyer reads own" on public.orders;
create policy "orders: lawyer reads own" on public.orders
  for select using (lawyer_id = public.current_lawyer_id());

-- ---------------------------------------------------------------------------
-- First account is the super admin
--
-- Nobody can self-promote afterwards (guard_profile_role). This only fires
-- when the profiles table has no admin yet — empty database, first signup.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.user_role := 'client';
begin
  if not exists (select 1 from public.profiles where role = 'admin') then
    assigned_role := 'admin';
  end if;

  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    assigned_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

update public.profiles
set role = 'admin'
where id = (
  select id from public.profiles order by created_at asc limit 1
)
and not exists (select 1 from public.profiles p2 where p2.role = 'admin');
