-- Security hardening pass.
--
-- 1. Drop the leftover baseline RLS policies that granted the *authenticated*
--    role (i.e. ANY signed-up user) full access. Later migrations restricted
--    projects / cv tables to the owner but never dropped the permissive
--    counterparts on these tables/buckets, so both policies were live and the
--    owner-only ones were effectively bypassed.
-- 2. Unify the owner identity on a single canonical email (the one already used
--    by every project / cv / contact policy). The avatars bucket previously
--    referenced a different address.
-- 3. Add length check constraints on contact_messages so the bounds hold even
--    for direct inserts via the public anon key (bypassing the server action).

-- ----------------------------------------------------------------------------
-- 1. Remove permissive "authenticated role" table policies
-- ----------------------------------------------------------------------------
drop policy if exists "auth all contact_messages"        on public.contact_messages;
drop policy if exists "auth all blog_posts"              on public.blog_posts;
drop policy if exists "auth all courses"                 on public.courses;
drop policy if exists "auth all course_waitlist"         on public.course_waitlist;
drop policy if exists "auth all newsletter_subscribers"  on public.newsletter_subscribers;
drop policy if exists "auth all gallery_items"           on public.gallery_items;
drop policy if exists "auth all timeline_entries"        on public.timeline_entries;
drop policy if exists "auth select analytics_events"     on public.analytics_events;

-- ----------------------------------------------------------------------------
-- 1b. Remove permissive "authenticated role" storage policies and replace the
--     actively-used bucket (project-screenshots) with owner-only write access.
-- ----------------------------------------------------------------------------
drop policy if exists "Auth insert project-screenshots" on storage.objects;
drop policy if exists "Auth update project-screenshots" on storage.objects;
drop policy if exists "Auth delete project-screenshots" on storage.objects;
drop policy if exists "Auth insert gallery-media"       on storage.objects;
drop policy if exists "Auth update gallery-media"       on storage.objects;
drop policy if exists "Auth delete gallery-media"       on storage.objects;
drop policy if exists "Authenticated upload asset files" on storage.objects;
drop policy if exists "Authenticated update asset files" on storage.objects;
drop policy if exists "Authenticated delete asset files" on storage.objects;

create policy "owner write project-screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'project-screenshots'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

create policy "owner update project-screenshots"
  on storage.objects for update
  using (
    bucket_id = 'project-screenshots'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

create policy "owner delete project-screenshots"
  on storage.objects for delete
  using (
    bucket_id = 'project-screenshots'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

-- ----------------------------------------------------------------------------
-- 2. Unify owner identity for the avatars bucket onto the canonical email.
-- ----------------------------------------------------------------------------
drop policy if exists "owner write avatars"  on storage.objects;
drop policy if exists "owner update avatars" on storage.objects;
drop policy if exists "owner delete avatars" on storage.objects;

create policy "owner write avatars"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

create policy "owner update avatars"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

create policy "owner delete avatars"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.jwt() ->> 'email' = 'ajiboladolapogenius@gmail.com'
  );

-- ----------------------------------------------------------------------------
-- 3. Enforce contact_messages length bounds at the database layer so they
--    apply to direct anon inserts, not just the server action.
-- ----------------------------------------------------------------------------
alter table public.contact_messages
  drop constraint if exists contact_messages_length_bounds;

alter table public.contact_messages
  add constraint contact_messages_length_bounds check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 320
    and char_length(message) between 1 and 5000
  );
