-- Allow role changes from a signed-in admin session OR the service role.
-- PostgREST always connects as `authenticator`; service_role has no auth.uid(),
-- so is_admin() is false there even though RLS is bypassed.

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and not public.is_admin()
     and coalesce(auth.role(), '') <> 'service_role'
     and session_user not in ('postgres', 'supabase_admin')
  then
    raise exception 'only admins can change a role';
  end if;
  return new;
end;
$$;
