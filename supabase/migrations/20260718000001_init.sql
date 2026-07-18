-- LawMarket Phase 1 schema: enums, tables, indexes, RLS, storage, handle_new_user

-- ── Enums ──────────────────────────────────────────────────────
create type public.user_role as enum ('client', 'provider', 'admin');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'inactive');
create type public.verification_status as enum ('pending', 'verified', 'rejected');
create type public.booking_status as enum ('pending_payment', 'confirmed', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');
create type public.payment_purpose as enum ('provider_subscription', 'consultation_booking', 'other');
create type public.pricing_model as enum ('fixed', 'hourly', 'quote');
create type public.application_status as enum ('draft', 'submitted', 'under_review', 'accepted', 'rejected');

-- ── Helpers ─────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── Identity ────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'client',
  public_slug text unique,
  full_name text not null,
  avatar_path text,
  phone text,
  city text,
  bio text,
  is_active boolean not null default true,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.provider_details (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  law_firm text,
  years_experience int,
  languages text[],
  subscription_status public.subscription_status not null default 'inactive',
  subscription_expires_at timestamptz,
  identity_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Taxonomy ────────────────────────────────────────────────────
create table public.practice_areas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  is_active boolean not null default true
);

create table public.provider_practice_areas (
  provider_id uuid not null references public.profiles(id) on delete cascade,
  practice_area_id uuid not null references public.practice_areas(id) on delete cascade,
  primary key (provider_id, practice_area_id)
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb
);

-- ── Marketplace ─────────────────────────────────────────────────
create table public.services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.profiles(id) on delete cascade,
  program_id uuid not null references public.programs(id),
  practice_area_id uuid references public.practice_areas(id),
  title text not null,
  description text,
  pricing_model public.pricing_model not null default 'quote',
  price_gel numeric(10,2),
  is_published boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.profiles(id) on delete cascade,
  practice_area_id uuid references public.practice_areas(id),
  case_number text not null,
  title text not null,
  summary text,
  public_decision_reference text,
  decision_proof_path text,
  requires_client_consent boolean not null default false,
  consent_document_path text,
  verification_status public.verification_status not null default 'pending',
  rejection_reason text,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Communication & transactions ────────────────────────────────
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (client_id, provider_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  attachment_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id),
  client_id uuid not null references public.profiles(id),
  provider_id uuid not null references public.profiles(id),
  service_id uuid not null references public.services(id),
  status public.booking_status not null default 'pending_payment',
  scheduled_at timestamptz,
  price_gel numeric(10,2),
  payment_status public.payment_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id),
  purpose public.payment_purpose not null,
  booking_id uuid references public.bookings(id),
  amount_gel numeric(10,2) not null,
  status text not null default 'pending',
  gateway text not null,
  gateway_ref text,
  created_at timestamptz not null default now()
);

create table public.expat_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  program_id uuid not null references public.programs(id),
  status public.application_status not null default 'draft',
  answers jsonb not null default '{}'::jsonb,
  criteria_snapshot jsonb not null default '[]'::jsonb,
  admin_notes text,
  rejection_reason text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Indexes ─────────────────────────────────────────────────────
create index profiles_public_slug_idx on public.profiles (public_slug);
create index services_provider_id_idx on public.services (provider_id);
create index services_is_published_idx on public.services (is_published);
create index cases_provider_id_idx on public.cases (provider_id);
create index cases_public_verification_idx on public.cases (is_public, verification_status);
create index bookings_client_id_idx on public.bookings (client_id);
create index bookings_provider_id_idx on public.bookings (provider_id);
create index messages_conversation_created_idx on public.messages (conversation_id, created_at);
create index expat_applications_applicant_idx on public.expat_applications (applicant_id);
create index expat_applications_status_idx on public.expat_applications (status);

-- ── Updated_at triggers ─────────────────────────────────────────
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger provider_details_updated_at before update on public.provider_details
  for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();
create trigger cases_updated_at before update on public.cases
  for each row execute function public.set_updated_at();
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
create trigger expat_applications_updated_at before update on public.expat_applications
  for each row execute function public.set_updated_at();

-- ── Profile creation on signup (structural guarantee) ───────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
begin
  display_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(split_part(new.email, '@', 1)), ''),
    'User'
  );

  insert into public.profiles (id, full_name, role)
  values (new.id, display_name, 'client')
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── RLS ─────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.provider_details enable row level security;
alter table public.practice_areas enable row level security;
alter table public.provider_practice_areas enable row level security;
alter table public.programs enable row level security;
alter table public.services enable row level security;
alter table public.cases enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.expat_applications enable row level security;

-- profiles
create policy "public can view provider profiles"
  on public.profiles for select
  using (role = 'provider' and is_active = true);

create policy "users view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- provider_details
create policy "public can view provider details for active providers"
  on public.provider_details for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = provider_details.profile_id
        and p.role = 'provider'
        and p.is_active = true
    )
    or auth.uid() = profile_id
    or public.is_admin()
  );

create policy "providers manage own details"
  on public.provider_details for all
  using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

-- practice_areas & programs (public read of active)
create policy "anyone can view active practice areas"
  on public.practice_areas for select
  using (is_active = true or public.is_admin());

create policy "admins manage practice areas"
  on public.practice_areas for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "anyone can view active programs"
  on public.programs for select
  using (is_active = true or public.is_admin());

create policy "admins manage programs"
  on public.programs for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "providers manage own practice area links"
  on public.provider_practice_areas for all
  using (auth.uid() = provider_id or public.is_admin())
  with check (auth.uid() = provider_id or public.is_admin());

create policy "public can view provider practice areas"
  on public.provider_practice_areas for select
  using (true);

-- services
create policy "public can view published services"
  on public.services for select
  using (is_published = true or auth.uid() = provider_id or public.is_admin());

create policy "providers manage own services"
  on public.services for all
  using (auth.uid() = provider_id or public.is_admin())
  with check (auth.uid() = provider_id or public.is_admin());

-- cases
create policy "public can view verified public cases"
  on public.cases for select
  using (
    (is_public = true and verification_status = 'verified')
    or auth.uid() = provider_id
    or public.is_admin()
  );

create policy "providers manage own cases"
  on public.cases for all
  using (auth.uid() = provider_id or public.is_admin())
  with check (auth.uid() = provider_id or public.is_admin());

-- conversations
create policy "participants view conversations"
  on public.conversations for select
  using (client_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

create policy "participants create conversations"
  on public.conversations for insert
  with check (client_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

create policy "participants update conversations"
  on public.conversations for update
  using (client_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

-- messages
create policy "participants view their messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.client_id = auth.uid() or c.provider_id = auth.uid())
    )
    or public.is_admin()
  );

create policy "participants send messages"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.client_id = auth.uid() or c.provider_id = auth.uid())
    )
  );

create policy "participants update own sent message read state"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.client_id = auth.uid() or c.provider_id = auth.uid())
    )
    or public.is_admin()
  );

-- bookings
create policy "participants view own bookings"
  on public.bookings for select
  using (client_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

create policy "clients create bookings"
  on public.bookings for insert
  with check (client_id = auth.uid() or public.is_admin());

create policy "participants update bookings"
  on public.bookings for update
  using (client_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

-- payments
create policy "users view own payments"
  on public.payments for select
  using (profile_id = auth.uid() or public.is_admin());

create policy "users insert own payments"
  on public.payments for insert
  with check (profile_id = auth.uid() or public.is_admin());

-- expat applications
create policy "applicants view own applications"
  on public.expat_applications for select
  using (applicant_id = auth.uid() or public.is_admin());

create policy "applicants insert own applications"
  on public.expat_applications for insert
  with check (applicant_id = auth.uid());

create policy "applicants update own draft or submitted"
  on public.expat_applications for update
  using (
    (applicant_id = auth.uid() and status in ('draft', 'submitted'))
    or public.is_admin()
  )
  with check (
    (applicant_id = auth.uid() and status in ('draft', 'submitted', 'under_review'))
    or public.is_admin()
  );

-- ── Storage buckets ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('case-evidence', 'case-evidence', false),
  ('case-consent', 'case-consent', false)
on conflict (id) do nothing;

create policy "avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "users upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "providers manage case evidence"
  on storage.objects for all
  using (
    bucket_id = 'case-evidence'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  )
  with check (
    bucket_id = 'case-evidence'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

create policy "providers and admins manage consent docs"
  on storage.objects for all
  using (
    bucket_id = 'case-consent'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  )
  with check (
    bucket_id = 'case-consent'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );
