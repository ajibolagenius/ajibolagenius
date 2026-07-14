-- The printable /cv (Resume A4) design includes a phone number in the
-- contact block, which personal_info didn't previously store.

alter table public.personal_info
  add column if not exists phone text;
