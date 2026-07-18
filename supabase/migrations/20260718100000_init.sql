-- LawMarket initial schema
-- Legal-services marketplace for Georgia: providers, verified cases,
-- bookings, messaging, expat-consultation track.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Private schema for security-definer helpers (never exposed via the Data API)
-- ---------------------------------------------------------------------------
create schema if not exists private;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('client', 'provider', 'admin');
create type public.case_status as enum ('pending', 'approved', 'rejected');
create type public.application_status as enum ('pending', 'accepted', 'rejected');
create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.subscription_status as enum ('trial', 'active', 'past_due', 'inactive');

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text not null default '',
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Public directory needs provider names/avatars; profiles hold no secrets.
create policy "profiles are publicly readable"
  on public.profiles for select using (true);

create policy "users update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id and role <> 'admin');

-- Created via trigger on auth.users; role restricted to client/provider there.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when new.raw_user_meta_data ->> 'role' = 'provider'
      then 'provider'::public.user_role
      else 'client'::public.user_role
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Taxonomy: practice areas & programs
-- ---------------------------------------------------------------------------
create table public.practice_areas (
  id serial primary key,
  slug text not null unique,
  name_ka text not null,
  name_en text not null
);

alter table public.practice_areas enable row level security;
create policy "practice areas are publicly readable"
  on public.practice_areas for select using (true);

create table public.programs (
  id serial primary key,
  slug text not null unique,
  name_ka text not null,
  name_en text not null,
  description_ka text not null default '',
  description_en text not null default ''
);

alter table public.programs enable row level security;
create policy "programs are publicly readable"
  on public.programs for select using (true);

-- ---------------------------------------------------------------------------
-- provider_profiles: public marketplace profile for provider users
-- ---------------------------------------------------------------------------
create table public.provider_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  slug text not null unique,
  headline_ka text not null default '',
  headline_en text not null default '',
  bio_ka text not null default '',
  bio_en text not null default '',
  city text not null default '',
  languages text[] not null default '{}',
  years_experience int not null default 0,
  website text,
  is_published boolean not null default false,
  accepts_expat boolean not null default false,
  subscription_status public.subscription_status not null default 'trial',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.provider_profiles enable row level security;

create policy "published provider profiles are publicly readable"
  on public.provider_profiles for select
  using (is_published or (select auth.uid()) = id or private.is_admin());

create policy "providers insert own provider profile"
  on public.provider_profiles for insert
  with check ((select auth.uid()) = id);

create policy "providers update own provider profile"
  on public.provider_profiles for update
  using ((select auth.uid()) = id or private.is_admin());

create trigger provider_profiles_updated_at
  before update on public.provider_profiles
  for each row execute function private.set_updated_at();

create table public.provider_practice_areas (
  provider_id uuid not null references public.provider_profiles (id) on delete cascade,
  practice_area_id int not null references public.practice_areas (id) on delete cascade,
  primary key (provider_id, practice_area_id)
);

alter table public.provider_practice_areas enable row level security;

create policy "provider practice areas are publicly readable"
  on public.provider_practice_areas for select using (true);

create policy "providers manage own practice areas"
  on public.provider_practice_areas for all
  using ((select auth.uid()) = provider_id)
  with check ((select auth.uid()) = provider_id);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles (id) on delete cascade,
  program_id int not null references public.programs (id),
  title_ka text not null,
  title_en text not null default '',
  description_ka text not null default '',
  description_en text not null default '',
  price_gel numeric(10, 2) not null check (price_gel >= 0),
  duration_min int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_provider_idx on public.services (provider_id);

alter table public.services enable row level security;

create policy "active services are publicly readable"
  on public.services for select
  using (is_active or (select auth.uid()) = provider_id or private.is_admin());

create policy "providers manage own services"
  on public.services for all
  using ((select auth.uid()) = provider_id)
  with check ((select auth.uid()) = provider_id);

create trigger services_updated_at
  before update on public.services
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- cases: submitted by providers, verified by admins; only approved are public
-- ---------------------------------------------------------------------------
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles (id) on delete cascade,
  case_number text not null,
  title_ka text not null,
  title_en text not null default '',
  summary_ka text not null default '',
  summary_en text not null default '',
  practice_area_id int references public.practice_areas (id),
  year int,
  registry_url text,
  evidence_path text,
  consent_path text,
  status public.case_status not null default 'pending',
  rejection_reason text,
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cases_provider_idx on public.cases (provider_id);
create index cases_status_idx on public.cases (status);

alter table public.cases enable row level security;

create policy "approved cases are publicly readable"
  on public.cases for select
  using (status = 'approved' or (select auth.uid()) = provider_id or private.is_admin());

create policy "providers submit own cases"
  on public.cases for insert
  with check ((select auth.uid()) = provider_id and status = 'pending');

create policy "providers update own pending cases"
  on public.cases for update
  using (((select auth.uid()) = provider_id and status = 'pending') or private.is_admin());

create policy "providers delete own pending cases"
  on public.cases for delete
  using ((select auth.uid()) = provider_id and status = 'pending');

create trigger cases_updated_at
  before update on public.cases
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- expat applications
-- ---------------------------------------------------------------------------
create table public.expat_applications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  country text not null,
  topic text not null,
  details text not null default '',
  status public.application_status not null default 'pending',
  decision_note text,
  decided_by uuid references public.profiles (id),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index expat_applications_client_idx on public.expat_applications (client_id);

alter table public.expat_applications enable row level security;

create policy "clients read own applications"
  on public.expat_applications for select
  using ((select auth.uid()) = client_id or private.is_admin());

create policy "clients submit applications"
  on public.expat_applications for insert
  with check ((select auth.uid()) = client_id and status = 'pending');

create policy "admins update applications"
  on public.expat_applications for update
  using (private.is_admin());

create trigger expat_applications_updated_at
  before update on public.expat_applications
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- bookings & payments (payments stubbed until BOG iPay integration)
-- ---------------------------------------------------------------------------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  provider_id uuid not null references public.provider_profiles (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  expat_application_id uuid references public.expat_applications (id) on delete set null,
  scheduled_at timestamptz,
  status public.booking_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  amount_gel numeric(10, 2) not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_client_idx on public.bookings (client_id);
create index bookings_provider_idx on public.bookings (provider_id);

alter table public.bookings enable row level security;

create policy "participants read bookings"
  on public.bookings for select
  using (
    (select auth.uid()) in (client_id, provider_id) or private.is_admin()
  );

create policy "clients create bookings"
  on public.bookings for insert
  with check ((select auth.uid()) = client_id);

create policy "participants update bookings"
  on public.bookings for update
  using ((select auth.uid()) in (client_id, provider_id) or private.is_admin());

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function private.set_updated_at();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  amount_gel numeric(10, 2) not null,
  currency text not null default 'GEL',
  gateway text not null default 'bog_ipay_stub',
  external_id text,
  status public.payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index payments_booking_idx on public.payments (booking_id);

alter table public.payments enable row level security;

create policy "booking participants read payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and (select auth.uid()) in (b.client_id, b.provider_id)
    )
    or private.is_admin()
  );

create policy "clients create payments for own bookings"
  on public.payments for insert
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.client_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- messaging
-- ---------------------------------------------------------------------------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  provider_id uuid not null references public.provider_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, provider_id)
);

alter table public.conversations enable row level security;

create policy "participants read conversations"
  on public.conversations for select
  using ((select auth.uid()) in (client_id, provider_id));

create policy "clients start conversations"
  on public.conversations for insert
  with check ((select auth.uid()) = client_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);

alter table public.messages enable row level security;

create policy "participants read messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.client_id, c.provider_id)
    )
  );

create policy "participants send messages"
  on public.messages for insert
  with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.client_id, c.provider_id)
    )
  );

create policy "participants mark messages read"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (select auth.uid()) in (c.client_id, c.provider_id)
    )
  );

alter publication supabase_realtime add table public.messages;

-- ---------------------------------------------------------------------------
-- Storage buckets & policies
-- avatars: public; case-evidence / case-consent: private, admin + owner only
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('case-evidence', 'case-evidence', false),
  ('case-consent', 'case-consent', false)
on conflict (id) do nothing;

-- Note: no SELECT policy on the public avatars bucket — public URL access
-- does not require RLS, and omitting it prevents bucket listing.

create policy "users upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "owners and admins read private case files"
  on storage.objects for select
  using (
    bucket_id in ('case-evidence', 'case-consent')
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or private.is_admin()
    )
  );

create policy "providers upload own case files"
  on storage.objects for insert
  with check (
    bucket_id in ('case-evidence', 'case-consent')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
