-- 1. Add the Bema Integrated Services role. Newest, so it takes sort_order 0
-- and pushes every existing row down by one. Guarded on company, same as the
-- EduPoint migration: sort_order has no unique constraint, so a second run
-- would silently shift the whole list again.
do $$
begin
  if exists (select 1 from public.experience_entries where company = 'Bema Integrated Services') then
    return;
  end if;

  update public.experience_entries set sort_order = sort_order + 1;

  insert into public.experience_entries (
    role_title,
    company,
    employment_type,
    start_date,
    end_date,
    body,
    bullets,
    sort_order
  ) values (
    'Full-Stack Software Engineer (Frontend-Strong)',
    'Bema Integrated Services',
    'Full-Time',
    '2026',
    'Present',
    'Building and evolving the user-facing product experience across the company''s platforms, with frontend emphasis and full-stack delivery responsibility.',
    array[
      'Build responsive, production-quality interfaces in React, Next.js and TypeScript, handling loading, error, empty, validation and authenticated states.',
      'Integrate frontend applications with REST APIs and backend services, and make targeted changes across existing WordPress/PHP code, APIs and relational databases.',
      'Support interactive, visual and gamified product experiences, working in Git-based review workflows with documented changes and QA support.'
    ],
    0
  );
end $$;

-- 2. Condense the pre-engineering design roles to a single summary line each.
-- The history stays on the CV, but the bullet detail was outweighing the
-- engineering entries above it. Fidia is deliberately excluded: it is a
-- co-founder product role, not agency design work.
update public.experience_entries
set bullets = '{}'
where company in (
  'Cavemen Agency',
  'Kuwego Global',
  'Quru Lab',
  'Imagine Cinemas',
  'EasyFarm Hub',
  'Google Business Group, Abeokuta'
);
