-- Add the Sabaoth Tech Ltd role (started 2026-11-23, held alongside Bema).
-- Newest, so it takes sort_order 0 and pushes every row down by one. Guarded
-- on company: sort_order has no unique constraint, so a second run would
-- silently shift the whole list again.
-- Role-only on purpose: the employment agreement and NDA cover clients,
-- stack and architecture. Add bullets once there is cleared, shipped work.
do $$
begin
  if exists (select 1 from public.experience_entries where company = 'Sabaoth Tech Ltd') then
    return;
  end if;

  update public.experience_entries set sort_order = sort_order + 1;

  insert into public.experience_entries (
    role_title,
    company,
    company_url,
    employment_type,
    start_date,
    end_date,
    body,
    bullets,
    sort_order
  ) values (
    'Full-Stack Engineer',
    'Sabaoth Tech Ltd',
    'https://sabaothcloud.com',
    'Full-Time (Remote)',
    '2026',
    'Present',
    'Full-stack engineering in a remote engineering team, delivering across the product from the interface to production.',
    '{}',
    0
  );
end $$;
