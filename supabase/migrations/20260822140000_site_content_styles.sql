-- Optional per-field typography overrides for CMS site_content rows.
alter table public.site_content
  add column if not exists style_en jsonb not null default '{}'::jsonb,
  add column if not exists style_ka jsonb not null default '{}'::jsonb;
