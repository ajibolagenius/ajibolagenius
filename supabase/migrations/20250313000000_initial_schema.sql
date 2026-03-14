-- Portfolio schema for Supabase (replaces FastAPI + MongoDB).
-- Run in Supabase SQL Editor or via Supabase CLI.

-- Personal info (singleton row)
create table if not exists personal_info (
  id int primary key default 1 check (id = 1),
  name text not null default '',
  tagline text not null default '',
  tagline_suffix text not null default '',
  description text not null default '',
  role text not null default '',
  email text not null default '',
  location text not null default '',
  availability text not null default '',
  social jsonb not null default '{"github":"","twitter":"","linkedin":"","whatsapp":""}'::jsonb,
  updated_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default '',
  label text not null default '',
  description text not null default '',
  tags jsonb not null default '[]'::jsonb,
  type text not null default 'dev',
  featured boolean not null default false,
  live_url text not null default '#',
  github_url text not null default '#',
  problem text not null default '',
  solution text not null default '',
  role_title text not null default '',
  duration text not null default '',
  year text not null default '',
  tech_details jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Courses
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  duration text not null default '',
  price text not null default '',
  badge text not null default '',
  description text not null default '',
  curriculum jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Blog posts
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  date text not null,
  tags jsonb not null default '[]'::jsonb,
  category text not null default '',
  excerpt text not null default '',
  body text not null default '',
  read_time text not null default '',
  created_at timestamptz default now()
);

-- Gallery
create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default '',
  color text not null default '',
  created_at timestamptz default now()
);

-- Timeline
create table if not exists timeline_entries (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  body text not null default '',
  accent text not null default 'sungold',
  "order" int not null default 0,
  created_at timestamptz default now()
);

-- Testimonials
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  text text not null default '',
  created_at timestamptz default now()
);

-- Contact messages (public insert, admin read)
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now()
);

-- Newsletter subscribers (public insert, admin read)
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

-- Indexes for common lookups
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_created_at on projects(created_at desc);
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_date on blog_posts(date desc);
create index if not exists idx_timeline_order on timeline_entries("order");
create index if not exists idx_contact_messages_created_at on contact_messages(created_at desc);
create index if not exists idx_newsletter_created_at on newsletter_subscribers(created_at desc);

-- RLS
alter table personal_info enable row level security;
alter table projects enable row level security;
alter table courses enable row level security;
alter table blog_posts enable row level security;
alter table gallery_items enable row level security;
alter table timeline_entries enable row level security;
alter table testimonials enable row level security;
alter table contact_messages enable row level security;
alter table newsletter_subscribers enable row level security;

-- Public read for portfolio content
create policy "anon select personal_info" on personal_info for select using (true);
create policy "anon select projects" on projects for select using (true);
create policy "anon select courses" on courses for select using (true);
create policy "anon select blog_posts" on blog_posts for select using (true);
create policy "anon select gallery_items" on gallery_items for select using (true);
create policy "anon select timeline_entries" on timeline_entries for select using (true);
create policy "anon select testimonials" on testimonials for select using (true);

-- Authenticated full access for content + personal_info update
create policy "auth all personal_info" on personal_info for all using (auth.role() = 'authenticated');
create policy "auth all projects" on projects for all using (auth.role() = 'authenticated');
create policy "auth all courses" on courses for all using (auth.role() = 'authenticated');
create policy "auth all blog_posts" on blog_posts for all using (auth.role() = 'authenticated');
create policy "auth all gallery_items" on gallery_items for all using (auth.role() = 'authenticated');
create policy "auth all timeline_entries" on timeline_entries for all using (auth.role() = 'authenticated');
create policy "auth all testimonials" on testimonials for all using (auth.role() = 'authenticated');

-- Contact: anon insert, auth read/update/delete
create policy "anon insert contact_messages" on contact_messages for insert with check (true);
create policy "auth all contact_messages" on contact_messages for all using (auth.role() = 'authenticated');

-- Newsletter: anon insert, auth select (no delete needed for subscribers list)
create policy "anon insert newsletter_subscribers" on newsletter_subscribers for insert with check (true);
create policy "auth select newsletter_subscribers" on newsletter_subscribers for select using (auth.role() = 'authenticated');

-- Seed personal_info if empty (run once)
insert into personal_info (id, name, tagline, tagline_suffix, description, role, email, location, availability, social)
values (
  1,
  'Ajibola Akelebe',
  'Design & Engineering,',
  'No boundaries.',
  'Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn.',
  '// FULL-STACK · UI DESIGN · EDUCATOR · CREATOR',
  'hello@ajibolagenius.com',
  'Lagos, Nigeria',
  'Available for projects',
  '{"github":"https://github.com/ajibolagenius","twitter":"https://twitter.com/ajibolagenius","linkedin":"https://linkedin.com/in/ajibolagenius","whatsapp":"https://wa.me/2348000000000"}'::jsonb
)
on conflict (id) do nothing;
