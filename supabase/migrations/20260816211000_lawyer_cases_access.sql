-- Logged-in lawyers (including unpublished portal accounts) can read open
-- cases and send proposals. Suspended lawyers stay out.

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
      and not coalesce(suspended, false)
  );
$$;
