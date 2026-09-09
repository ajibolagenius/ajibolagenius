-- Update personal_info role and description to Full Stack Engineer

update public.personal_info
set
  role = 'Full Stack Engineer',
  description = 'A full-stack engineer and designer based in Nigeria, creating for a global audience. I teach what I know and share what I learn.',
  updated_at = now()
where id = 1;
