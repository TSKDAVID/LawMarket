-- Services can be a single price, a starting-from floor, or a min–max band
-- when the work depends on complexity. `price` is always the floor.

create type public.service_pricing_mode as enum ('fixed', 'from', 'range');

alter table public.services
  add column if not exists pricing_mode public.service_pricing_mode not null default 'fixed',
  add column if not exists price_max numeric(10, 2);

alter table public.services
  drop constraint if exists services_price_max_check;

alter table public.services
  add constraint services_price_max_check check (
    (
      pricing_mode in ('fixed', 'from')
      and price_max is null
    )
    or (
      pricing_mode = 'range'
      and price_max is not null
      and price_max >= price
    )
  );
