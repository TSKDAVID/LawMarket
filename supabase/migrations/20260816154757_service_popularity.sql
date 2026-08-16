-- Rank published services by real demand: purchases first, then page views.
-- Counters live on `services` so the public catalog can order without reading
-- the orders table (which is not publicly selectable).

alter table public.services
  add column if not exists view_count integer not null default 0;

alter table public.services
  add column if not exists purchase_count integer not null default 0;

create or replace function public.record_service_view(p_service_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.services
  set view_count = view_count + 1
  where id = p_service_id and published = true;
end;
$$;

revoke all on function public.record_service_view(uuid) from public;
grant execute on function public.record_service_view(uuid) to anon, authenticated;

create or replace function public.sync_service_purchase_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sid uuid;
begin
  sid := coalesce(new.service_id, old.service_id);
  if sid is null then
    return coalesce(new, old);
  end if;

  update public.services
  set purchase_count = (
    select count(*)::integer
    from public.orders
    where service_id = sid
      and status is distinct from 'cancelled'
  )
  where id = sid;

  return coalesce(new, old);
end;
$$;

drop trigger if exists orders_sync_purchase_count on public.orders;
create trigger orders_sync_purchase_count
  after insert or update of service_id, status or delete on public.orders
  for each row execute function public.sync_service_purchase_count();

update public.services s
set purchase_count = coalesce(c.n, 0)
from (
  select service_id, count(*)::integer as n
  from public.orders
  where service_id is not null
    and status is distinct from 'cancelled'
  group by service_id
) c
where s.id = c.service_id;

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
  new.view_count := old.view_count;
  new.purchase_count := old.purchase_count;
  return new;
end;
$$;
