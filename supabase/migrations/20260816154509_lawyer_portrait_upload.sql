-- Lawyers may upload a portrait into their own folder in the public media
-- bucket. Upsert needs INSERT + UPDATE + SELECT; public read already exists.

drop policy if exists "media: lawyer insert own portrait" on storage.objects;
create policy "media: lawyer insert own portrait" on storage.objects
  for insert
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'portraits'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "media: lawyer update own portrait" on storage.objects;
create policy "media: lawyer update own portrait" on storage.objects
  for update
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'portraits'
    and (storage.foldername(name))[2] = auth.uid()::text
  )
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'portraits'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "media: lawyer delete own portrait" on storage.objects;
create policy "media: lawyer delete own portrait" on storage.objects
  for delete
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'portraits'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
