-- 20261110000000_commonground_redesign.sql
-- Additive migration for CommonGround redesign foundations.
-- Extends public.projects with date, sector, service, and facts.
-- Extends public.contact_messages with phone and reason.

-- 1. projects: Add date column and backfill from year or created_at
alter table public.projects
  add column if not exists date date default date_trunc('month', now())::date;

update public.projects
set date = make_date(substring(year from '\d{4}')::int, 1, 1)
where substring(year from '\d{4}') is not null;

update public.projects
set date = date_trunc('month', coalesce(created_at, now()))::date
where date is null;

alter table public.projects
  alter column date set not null;

alter table public.projects
  drop constraint if exists projects_date_month_precision;

alter table public.projects
  add constraint projects_date_month_precision
  check (extract(day from date) = 1);

-- 2. projects: sector, service, facts columns with bounded constraints
alter table public.projects
  add column if not exists sector text not null default '';

alter table public.projects
  drop constraint if exists projects_sector_length;

alter table public.projects
  add constraint projects_sector_length
  check (char_length(sector) <= 40);

alter table public.projects
  add column if not exists service text not null default '';

alter table public.projects
  drop constraint if exists projects_service_length;

alter table public.projects
  add constraint projects_service_length
  check (char_length(service) <= 40);

alter table public.projects
  add column if not exists facts jsonb not null default '[]'::jsonb;

alter table public.projects
  drop constraint if exists projects_facts_bounded_array;

alter table public.projects
  add constraint projects_facts_bounded_array
  check (
    case
      when jsonb_typeof(facts) = 'array' then jsonb_array_length(facts) <= 8
      else false
    end
  );

-- 3. contact_messages: phone and reason columns with check constraints
alter table public.contact_messages
  add column if not exists phone text;

alter table public.contact_messages
  drop constraint if exists contact_messages_phone_format;

alter table public.contact_messages
  add constraint contact_messages_phone_format
  check (
    phone is null or (
      char_length(phone) between 5 and 32
      and phone ~ '^[0-9+()\s.-]+$'
    )
  );

alter table public.contact_messages
  add column if not exists reason text;

alter table public.contact_messages
  drop constraint if exists contact_messages_reason_allowed;

alter table public.contact_messages
  add constraint contact_messages_reason_allowed
  check (
    reason is null or reason in (
      'full-time',
      'freelance',
      'collaboration',
      'mentoring',
      'other'
    )
  );
