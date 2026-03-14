-- Enable Postgres Realtime for portfolio tables.
-- Run in Supabase SQL Editor after the initial schema is applied.
-- Then the app can show live updates when admin changes content.

alter publication supabase_realtime add table personal_info;
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table blog_posts;
alter publication supabase_realtime add table courses;
alter publication supabase_realtime add table gallery_items;
alter publication supabase_realtime add table timeline_entries;
alter publication supabase_realtime add table testimonials;
