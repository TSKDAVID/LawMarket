-- Admin moderation flags on lawyer profiles.
-- `suspended` hides the listing and blocks portal login; `published` and
-- `verified` stay independently toggleable from the admin roster.

alter table public.lawyers
  add column if not exists suspended boolean not null default false;

create index if not exists lawyers_suspended_idx on public.lawyers (suspended);

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
  new.suspended := old.suspended;
  new.profile_id := old.profile_id;
  new.slug := old.slug;
  new.sort_order := old.sort_order;
  return new;
end;
$$;
