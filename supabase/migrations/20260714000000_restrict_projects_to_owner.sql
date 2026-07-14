-- Restrict write access on public.projects to the site owner only.
-- The previous "auth all projects" policy allowed ANY authenticated user
-- full CRUD, which is too broad for a single-owner admin console.

drop policy if exists "auth all projects" on public.projects;

create policy "owner all projects"
  on public.projects
  for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');

-- Public (anon) read access is preserved via the existing
-- "anon select projects" policy.

-- Storage bucket for project cover/gallery images.
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "public read project-images"
  on storage.objects
  for select
  using (bucket_id = 'project-images');

create policy "owner write project-images"
  on storage.objects
  for insert
  with check (
    bucket_id = 'project-images'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

create policy "owner update project-images"
  on storage.objects
  for update
  using (
    bucket_id = 'project-images'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

create policy "owner delete project-images"
  on storage.objects
  for delete
  using (
    bucket_id = 'project-images'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );
