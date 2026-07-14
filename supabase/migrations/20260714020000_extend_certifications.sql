-- The CV design's Certifications section shows issuer, issue date, and an
-- external link per entry; the existing table only has title + order.

alter table public.certifications
  add column if not exists issuer text not null default '',
  add column if not exists issued_date text not null default '',
  add column if not exists link_url text;

-- Tighten write access on certifications (public read policy already exists).
drop policy if exists "auth all certifications" on public.certifications;
create policy "owner all certifications"
  on public.certifications
  for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');

-- Same over-permissive "any authenticated user can write" gap exists on
-- skills, personal_info, and education_entries; tighten those too.
drop policy if exists "Allow auth full access" on public.skills;
create policy "owner all skills"
  on public.skills
  for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');

drop policy if exists "auth all personal_info" on public.personal_info;
create policy "owner all personal_info"
  on public.personal_info
  for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');

drop policy if exists "auth all education_entries" on public.education_entries;
create policy "owner all education_entries"
  on public.education_entries
  for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');

update public.certifications set
  title = 'Advanced Web Development', issuer = 'Codebridge Academy', issued_date = 'Issued May 2023'
where title = 'Advanced Web Development';

insert into public.certifications (title, issuer, issued_date, "order")
select 'Scalable Backend Systems', 'BrightLayer', 'Issued Sep 2022', 1
where not exists (select 1 from public.certifications where title = 'Scalable Backend Systems');

insert into public.certifications (title, issuer, issued_date, "order")
select 'Full-Stack JavaScript Certification', 'Devlane School', 'Issued Jul 2022', 2
where not exists (select 1 from public.certifications where title = 'Full-Stack JavaScript Certification');
