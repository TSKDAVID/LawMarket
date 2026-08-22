-- Toggle homepage social proof: lawyer cases (default) vs client reviews.
alter table public.site_settings
  add column if not exists home_show_reviews boolean not null default false;
