-- Lets the admin pick a tech-logo icon (from the tech-logos bucket) per skill,
-- replacing the previously hardcoded "Technologies & tools" badge list.

alter table public.skills
  add column if not exists icon_url text;
