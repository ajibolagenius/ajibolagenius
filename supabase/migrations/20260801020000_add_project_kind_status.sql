-- Side Projects: personal/experimental work displayed separately from client
-- work (/work). `kind` splits the two surfaces; `status` marks in-progress or
-- archived projects with a badge. Existing rows inherit 'client' / 'live'.

alter table public.projects
  add column if not exists kind text not null default 'client',
  add column if not exists status text not null default 'live';
