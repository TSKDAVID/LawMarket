-- Promote admin@lawmarket.ge to super admin.
-- Also lets the SQL editor (postgres) change roles; the API still cannot
-- self-promote because PostgREST connects as authenticator, not postgres.

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and not public.is_admin()
     and session_user not in ('postgres', 'supabase_admin')
  then
    raise exception 'only admins can change a role';
  end if;
  return new;
end;
$$;

insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), 'Law Market Admin'),
  'admin'::public.user_role
from auth.users u
where lower(u.email) = 'admin@lawmarket.ge'
on conflict (id) do update
  set role = 'admin',
      email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name);
