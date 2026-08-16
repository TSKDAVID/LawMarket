-- Confirm the operator account created from Authentication → Add user.
-- Dashboard users are often left unconfirmed, which makes password login fail.

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

update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where lower(email) = 'admin@lawmarket.ge';

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
      email = excluded.email;
