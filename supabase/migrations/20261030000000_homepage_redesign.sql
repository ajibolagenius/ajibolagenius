-- Homepage redesign: single editorial column, case-study slider.
--
-- Schema
--   experience_entries.company_url — each company in the hero and the
--     experience list links out when this is set. Nullable: several companies
--     have no public site yet, and an empty link is worse than plain text.
--   projects.outcome — the "Result" row of a case study. Empty until a
--     verified outcome exists; every surface hides the row when it is blank.
--
-- Content
--   tagline becomes the hero's one-sentence statement; the old label-style
--   tagline ("FULL-STACK · DESIGN · EDUCATOR") and its slogan suffix are
--   retired. EduPoint is named with the programme it delivers.

alter table public.experience_entries
  add column if not exists company_url text;

alter table public.projects
  add column if not exists outcome text not null default '';

update public.personal_info
set
  tagline = 'I design and build products end to end, from the database to the last hover state, and I teach other engineers to do the same.',
  tagline_suffix = '',
  availability = 'Available for full-time roles, freelance work and collaborations',
  updated_at = now()
where id = 1;

update public.experience_entries
set company = 'EduPoint (Trinity University, Lagos)'
where company = 'EduPoint';

update public.experience_entries
set company_url = 'https://getfidia.com'
where company = 'Fidia';
