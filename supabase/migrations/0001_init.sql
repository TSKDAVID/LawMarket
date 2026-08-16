-- Law Market — initial schema
--
-- Run against a fresh Supabase project (SQL Editor, or `supabase db push` if
-- you link the CLI). Every statement is guarded, so a failed run can simply be
-- re-run from the top without dropping anything that already succeeded.
--
-- Bilingual convention: every user-facing string has `_en` and `_ka` columns,
-- matching the shape the app's localize helpers already expect.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

-- Wrapped so a partially applied run can be repeated without erroring.
do $$
begin
  create type public.user_role as enum ('client', 'lawyer', 'admin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum ('pending', 'awaiting_payment', 'paid', 'cancelled', 'completed');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.post_status as enum ('draft', 'published');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles — one row per auth user
--
-- Defined before the is_admin() helper below, because a `language sql` body is
-- parsed and validated at creation time and would not find the table yet.
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role public.user_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

/*
 * Admin check used by nearly every write policy.
 *
 * SECURITY DEFINER is required: a policy on `profiles` that queried `profiles`
 * directly would recurse. Running as the owner sidesteps RLS for this lookup
 * only, and the fixed search_path keeps it from resolving a shadowed table.
 */
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

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'lawyer')
  );
$$;

/*
 * Mirror every new auth user into profiles. Role is always 'client' here —
 * promotion to admin or lawyer is a deliberate act, never something a signup
 * payload can ask for.
 */
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ka text not null,
  icon text not null default 'briefcase',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create table if not exists public.lawyers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  slug text not null unique,
  name text not null,
  initials text not null,
  avatar_color text not null default '#1c1210',
  photo_url text,
  headline_en text not null default '',
  headline_ka text not null default '',
  bio_en text not null default '',
  bio_ka text not null default '',
  city text not null default 'Tbilisi',
  languages text[] not null default '{}',
  years_experience integer not null default 0,
  verified boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger lawyers_updated_at
  before update on public.lawyers
  for each row execute function public.set_updated_at();

create index if not exists lawyers_published_idx on public.lawyers (published, sort_order);

create table if not exists public.lawyer_practice_areas (
  lawyer_id uuid not null references public.lawyers(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (lawyer_id, category_id)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  lawyer_id uuid not null references public.lawyers(id) on delete restrict,
  title_en text not null,
  title_ka text not null,
  description_en text not null default '',
  description_ka text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  currency text not null default 'GEL',
  duration_minutes integer,
  popular boolean not null default false,
  published boolean not null default true,
  includes_en text[] not null default '{}',
  includes_ka text[] not null default '{}',
  -- Array of { "q": string, "a": string }
  faq_en jsonb not null default '[]'::jsonb,
  faq_ka jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create index if not exists services_category_idx on public.services (category_id);
create index if not exists services_lawyer_idx on public.services (lawyer_id);
create index if not exists services_published_idx on public.services (published, sort_order);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role_en text not null default '',
  author_role_ka text not null default '',
  rating integer not null check (rating between 1 and 5),
  quote_en text not null default '',
  quote_ka text not null default '',
  service_id uuid references public.services(id) on delete set null,
  lawyer_id uuid references public.lawyers(id) on delete set null,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Editable site copy (hero, banner, CTA…)
-- ---------------------------------------------------------------------------

create table if not exists public.site_content (
  key text primary key,
  value_en text not null default '',
  value_ka text not null default '',
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create or replace trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null default '',
  title_ka text not null default '',
  excerpt_en text not null default '',
  excerpt_ka text not null default '',
  body_en text not null default '',
  body_ka text not null default '',
  cover_url text,
  author_id uuid references public.profiles(id) on delete set null,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create index if not exists posts_published_idx on public.posts (status, published_at desc);

-- ---------------------------------------------------------------------------
-- Availability, bookings, orders, contact
-- ---------------------------------------------------------------------------

create table if not exists public.lawyer_availability (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references public.lawyers(id) on delete cascade,
  date date not null,
  -- 24h "HH:mm" strings, ordered as they should render
  slots text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lawyer_id, date)
);

create or replace trigger lawyer_availability_updated_at
  before update on public.lawyer_availability
  for each row execute function public.set_updated_at();

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references public.lawyers(id) on delete restrict,
  service_id uuid references public.services(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  notes text,
  date date not null,
  time text not null,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

create index if not exists bookings_lawyer_date_idx on public.bookings (lawyer_id, date);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete restrict,
  lawyer_id uuid not null references public.lawyers(id) on delete restrict,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  notes text,
  -- Snapshot of the price at purchase time; the service row can change later.
  price numeric(10, 2) not null check (price >= 0),
  currency text not null default 'GEL',
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Default posture: the public may read published content and may create
-- bookings, orders, and contact messages. Everything else is admin-only.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.lawyers enable row level security;
alter table public.lawyer_practice_areas enable row level security;
alter table public.services enable row level security;
alter table public.reviews enable row level security;
alter table public.site_content enable row level security;
alter table public.posts enable row level security;
alter table public.lawyer_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.orders enable row level security;
alter table public.contact_messages enable row level security;

-- Profiles
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid());
drop policy if exists "profiles: admins read all" on public.profiles;
create policy "profiles: admins read all" on public.profiles
  for select using (public.is_admin());
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "profiles: admins update all" on public.profiles;
create policy "profiles: admins update all" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "profiles: admins insert" on public.profiles;
create policy "profiles: admins insert" on public.profiles
  for insert with check (public.is_admin());

/*
 * A user updating their own row must not be able to promote themselves.
 * Postgres has no column-level WITH CHECK, so the guard is a trigger.
 */
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'only admins can change a role';
  end if;
  return new;
end;
$$;

create or replace trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- Public catalog: readable by anyone, writable by admins
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories
  for select using (true);
drop policy if exists "categories: admin write" on public.categories;
create policy "categories: admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "lawyers: public read published" on public.lawyers;
create policy "lawyers: public read published" on public.lawyers
  for select using (published or public.is_admin());
drop policy if exists "lawyers: admin write" on public.lawyers;
create policy "lawyers: admin write" on public.lawyers
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "practice areas: public read" on public.lawyer_practice_areas;
create policy "practice areas: public read" on public.lawyer_practice_areas
  for select using (true);
drop policy if exists "practice areas: admin write" on public.lawyer_practice_areas;
create policy "practice areas: admin write" on public.lawyer_practice_areas
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "services: public read published" on public.services;
create policy "services: public read published" on public.services
  for select using (published or public.is_admin());
drop policy if exists "services: admin write" on public.services;
create policy "services: admin write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reviews: public read published" on public.reviews;
create policy "reviews: public read published" on public.reviews
  for select using (published or public.is_admin());
drop policy if exists "reviews: admin write" on public.reviews;
create policy "reviews: admin write" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "site content: public read" on public.site_content;
create policy "site content: public read" on public.site_content
  for select using (true);
drop policy if exists "site content: admin write" on public.site_content;
create policy "site content: admin write" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "posts: public read published" on public.posts;
create policy "posts: public read published" on public.posts
  for select using (status = 'published' or public.is_admin());
drop policy if exists "posts: admin write" on public.posts;
create policy "posts: admin write" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "availability: public read" on public.lawyer_availability;
create policy "availability: public read" on public.lawyer_availability
  for select using (true);
drop policy if exists "availability: admin write" on public.lawyer_availability;
create policy "availability: admin write" on public.lawyer_availability
  for all using (public.is_admin()) with check (public.is_admin());

-- Transactional: anyone may submit, only the owner or an admin may read back
drop policy if exists "bookings: anyone may create" on public.bookings;
create policy "bookings: anyone may create" on public.bookings
  for insert with check (true);
drop policy if exists "bookings: read own" on public.bookings;
create policy "bookings: read own" on public.bookings
  for select using (user_id = auth.uid());
drop policy if exists "bookings: admin read all" on public.bookings;
create policy "bookings: admin read all" on public.bookings
  for select using (public.is_admin());
drop policy if exists "bookings: admin write" on public.bookings;
create policy "bookings: admin write" on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders: anyone may create" on public.orders;
create policy "orders: anyone may create" on public.orders
  for insert with check (true);
drop policy if exists "orders: read own" on public.orders;
create policy "orders: read own" on public.orders
  for select using (user_id = auth.uid());
drop policy if exists "orders: admin read all" on public.orders;
create policy "orders: admin read all" on public.orders
  for select using (public.is_admin());
drop policy if exists "orders: admin write" on public.orders;
create policy "orders: admin write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contact: anyone may create" on public.contact_messages;
create policy "contact: anyone may create" on public.contact_messages
  for insert with check (true);
drop policy if exists "contact: admin read" on public.contact_messages;
create policy "contact: admin read" on public.contact_messages
  for select using (public.is_admin());
drop policy if exists "contact: admin write" on public.contact_messages;
create policy "contact: admin write" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: lawyer portraits and post covers
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "media: admin write" on storage.objects;
create policy "media: admin write" on storage.objects
  for all using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
