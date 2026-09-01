-- Add Lagos Data School Software Developer Instructor experience entry

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
  'Software Developer Instructor',
  'Lagos Data School',
  'Part-Time',
  '2026',
  'Present',
  'Delivering software development instruction and technical mentorship to students, covering programming fundamentals, modern web technologies, and practical software engineering workflows.',
  array[
    'Instruct students in software development principles, modern web technologies, and practical programming techniques.',
    'Design structured lesson plans, hands-on coding exercises, and real-world project assignments.',
    'Provide direct mentorship and code reviews to accelerate learners'' technical problem-solving and software development skills.'
  ],
  0
) on conflict do nothing;
