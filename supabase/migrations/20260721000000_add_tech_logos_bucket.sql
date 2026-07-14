-- Bucket for tech-stack icon assets used when picking skill/tech icons in
-- the admin console (docs/tech-logos).

insert into storage.buckets (id, name, public)
values ('tech-logos', 'tech-logos', true)
on conflict (id) do nothing;

create policy "public read tech-logos"
  on storage.objects
  for select
  using (bucket_id = 'tech-logos');

create policy "owner write tech-logos"
  on storage.objects
  for insert
  with check (
    bucket_id = 'tech-logos'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

create policy "owner update tech-logos"
  on storage.objects
  for update
  using (
    bucket_id = 'tech-logos'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

create policy "owner delete tech-logos"
  on storage.objects
  for delete
  using (
    bucket_id = 'tech-logos'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );
