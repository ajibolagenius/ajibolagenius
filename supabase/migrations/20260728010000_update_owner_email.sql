-- The actual Supabase Auth account for the site owner is
-- ajibolaakelebe@gmail.com (login identity), distinct from the public
-- contact email shown to visitors (ajiboladolapogenius@gmail.com).
-- Update every RLS policy that gates writes to the owner's identity.

alter policy "owner all projects" on public.projects
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

alter policy "owner all certifications" on public.certifications
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

alter policy "owner all skills" on public.skills
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

alter policy "owner all personal_info" on public.personal_info
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

alter policy "owner all education_entries" on public.education_entries
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

alter policy "owner all experience_entries" on public.experience_entries
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

alter policy "owner all languages" on public.languages
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

alter policy "owner all recommendations" on public.recommendations
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

alter policy "owner write project-images" on storage.objects
  with check (
    bucket_id = 'project-images'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );

alter policy "owner update project-images" on storage.objects
  using (
    bucket_id = 'project-images'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );

alter policy "owner delete project-images" on storage.objects
  using (
    bucket_id = 'project-images'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );

alter policy "owner write tech-logos" on storage.objects
  with check (
    bucket_id = 'tech-logos'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );

alter policy "owner update tech-logos" on storage.objects
  using (
    bucket_id = 'tech-logos'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );

alter policy "owner delete tech-logos" on storage.objects
  using (
    bucket_id = 'tech-logos'
    and auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com'
  );
