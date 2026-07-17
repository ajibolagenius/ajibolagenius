-- Add showcase_type column to public.projects table to support database-driven interactive showcases
alter table public.projects
  add column if not exists showcase_type text;
