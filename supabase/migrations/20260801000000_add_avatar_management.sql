-- Let the owner manage the site avatar from the admin console instead of
-- committing a new image to the repo. The avatar is stored in a public
-- 'avatars' bucket and referenced from personal_info.avatar_url; the
-- frontend falls back to the bundled /avatar_3d.png when unset.

alter table public.personal_info
  add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "public read avatars"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "owner write avatars"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );

create policy "owner update avatars"
  on storage.objects
  for update
  using (
    bucket_id = 'avatars'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );

create policy "owner delete avatars"
  on storage.objects
  for delete
  using (
    bucket_id = 'avatars'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );
