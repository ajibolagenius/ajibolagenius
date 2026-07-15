-- Contact form submissions from the public site.
-- Anyone can insert (submit the form); only the site owner can read/manage.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "anon insert contact_messages"
  on public.contact_messages
  for insert
  with check (true);

create policy "owner all contact_messages"
  on public.contact_messages
  for all
  using (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com')
  with check (auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com');
