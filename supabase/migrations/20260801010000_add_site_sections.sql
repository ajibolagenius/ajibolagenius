-- Homepage section visibility and ordering, managed from the admin console.
-- The homepage renders sections in sort_order and skips hidden ones; the
-- fixed set of keys maps to components, so rows are never created or
-- deleted from the admin UI.

create table if not exists public.site_sections (
  key text primary key,
  label text not null,
  visible boolean not null default true,
  sort_order integer not null default 0
);

alter table public.site_sections enable row level security;

create policy "public read site_sections"
  on public.site_sections
  for select
  using (true);

create policy "owner all site_sections"
  on public.site_sections
  for all
  using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');

insert into public.site_sections (key, label, visible, sort_order)
values
  ('featured-work', 'Featured Work', true, 10),
  ('about', 'About', true, 20),
  ('experience', 'Experience', true, 30),
  ('education', 'Education', true, 40),
  ('certifications', 'Certifications', true, 50),
  ('skills', 'Skills', true, 60),
  ('languages', 'Languages', true, 70),
  ('recommendations', 'Recommendations', true, 80),
  ('connect', 'Connect', true, 90)
on conflict (key) do nothing;
