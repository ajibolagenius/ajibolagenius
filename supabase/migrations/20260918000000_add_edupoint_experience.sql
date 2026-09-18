-- Add EduPoint Software Engineering Trainer (Full-Stack) experience entry.
-- Newest role, so it takes sort_order 0 and pushes every existing row down by
-- one. Guarded on company so a re-run cannot shift the rest a second time
-- (sort_order has no unique constraint, so the shift is not self-correcting).

do $$
begin
  if exists (select 1 from public.experience_entries where company = 'EduPoint') then
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
    'Software Engineering Trainer (Full-Stack)',
    'EduPoint',
    'Part-Time',
    '2026',
    'Present',
    'Leading delivery of practical, industry-relevant full-stack software engineering and mobile development training for the Trinity University Skills Programme.',
    array[
      'Deliver hands-on software engineering and mobile development modules covering modern languages, frameworks and development tooling.',
      'Prepare lesson plans, coding exercises, practical labs and assessments aligned to the programme''s learning outcomes.',
      'Supervise student software projects and capstone activities, grading submissions and giving constructive technical feedback.'
    ],
    0
  );
end $$;
