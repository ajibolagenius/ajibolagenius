-- Additional CV content tables to support the Figma single-page resume design:
-- Experience (job history), Languages, and Recommendations.
-- These don't map cleanly onto the existing generic `timeline_entries` table.

create table if not exists public.experience_entries (
  id uuid primary key default gen_random_uuid(),
  role_title text not null,
  company text not null,
  employment_type text not null default 'Full-Time',
  start_date text not null,
  end_date text not null default 'Present',
  body text not null default '',
  bullets text[] not null default '{}',
  icon_shape text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  proficiency text not null default '',
  flag_code text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_title text not null,
  quote text not null default '',
  avatar_url text,
  link_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.experience_entries enable row level security;
alter table public.languages enable row level security;
alter table public.recommendations enable row level security;

create policy "anon select experience_entries"
  on public.experience_entries for select using (true);
create policy "owner all experience_entries"
  on public.experience_entries for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');

create policy "anon select languages"
  on public.languages for select using (true);
create policy "owner all languages"
  on public.languages for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');

create policy "anon select recommendations"
  on public.recommendations for select using (true);
create policy "owner all recommendations"
  on public.recommendations for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');

-- Seed with the content shown in the Figma design.
insert into public.experience_entries (role_title, company, employment_type, start_date, end_date, body, bullets, sort_order) values
  ('Senior Full Stack Developer', 'Northstack', 'Full-Time', 'Jan 2025', 'Present',
   'Leading full-stack development for scalable web applications and reliable digital products across teams.',
   array['Improved platform performance and stability', 'Built frontend and backend product features', 'Collaborated with product and engineering teams'], 0),
  ('Full Stack Developer', 'Northstack', 'Full-Time', 'Jan 2023', 'Dec 2024',
   'Worked on responsive web applications, API integrations, and backend systems using modern frameworks.',
   '{}', 1),
  ('Frontend Developer', 'Pixelbase', 'Full-Time', 'Apr 2021', 'Dec 2022',
   'Developed responsive user interfaces and interactive web experiences for client and internal digital products, focusing on usability, accessibility, and performance.',
   '{}', 2),
  ('Junior Web Developer', 'CloudCore', 'Part-Time', 'Aug 2020', 'May 2021',
   'Supported frontend and backend development tasks while contributing to modern web projects, maintaining internal systems, and improving workflow efficiency.',
   array['Assisted in developing responsive website interfaces', 'Worked with REST APIs and backend integrations'], 3)
on conflict do nothing;

insert into public.languages (name, proficiency, flag_code, sort_order) values
  ('English', 'Professional working proficiency', 'us', 0),
  ('Yoruba', 'Native or bilingual proficiency', 'ng', 1)
on conflict do nothing;

insert into public.recommendations (name, role_title, quote, sort_order) values
  ('Maya Chen', 'Product Manager at Northstack',
   'Oliver brings a strong balance of technical skill, clear communication, and reliable execution. He consistently delivered thoughtful, effective solutions across frontend and backend development tasks.', 0),
  ('Daniel Foster', 'Engineering Lead at BrightLayer',
   'Oliver consistently approached projects with strong technical understanding and attention to detail. His ability to solve complex problems and collaborate effectively made him a valuable part of the development team.', 1)
on conflict do nothing;
