-- Bootstrap: the first profile is super admin if none exists yet.
-- Re-runnable. Safe after an admin already exists.

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
