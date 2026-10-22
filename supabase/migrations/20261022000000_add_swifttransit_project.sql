-- Insert SwiftTransit side project entry into public.projects
--
-- In progress since October 2026. Foundations and the customer booking slice
-- are built; the courier side, live tracking, wallet and push are still to
-- come. No public build yet, so live_url is the "#" placeholder. Screenshots
-- are 1440x900 WebP files in the project-screenshots bucket, three iPhone
-- screens each, captured from the iOS dev build in the simulator.
insert into public.projects (
  slug,
  name,
  category,
  label,
  description,
  kind,
  status,
  tags,
  type,
  featured,
  live_url,
  github_url,
  problem,
  solution,
  role_title,
  duration,
  year,
  tech_details,
  screenshots,
  showcase_type
) values (
  'swifttransit',
  'SwiftTransit',
  'Mobile App, On-demand Delivery, Logistics',
  'On-demand courier app for Nigeria',
  'An on-demand courier app for Lagos, built in Expo for iOS and Android with two roles in one app. Customers book a pickup and drop-off for documents, parcels, food or groceries, see the price before paying and track the order; couriers go online, accept nearby jobs and deliver them.',
  'side',
  'in-progress',
  '["Expo", "React Native", "TypeScript", "Supabase", "Postgres RLS", "Edge Functions", "MapLibre", "NativeWind", "TanStack Query", "iOS", "Android"]'::jsonb,
  'dev',
  false,
  '#',
  'https://github.com/ajibolagenius/SwiftTransit',
  'Sending a parcel across Lagos usually means a phone call, a haggled price and no idea where the rider is. Addresses are often landmark-based, map data is patchy off the main roads, mobile data is expensive and networks drop. A courier app here has to quote an honest price up front, work with a dropped pin and free-text directions, stay useful offline, and keep money and order status out of the client''s hands.',
  'One Expo codebase serves both roles, with the role chosen at sign-up and enforced by a route gate. Supabase carries the backend: Postgres with row-level security on every table, tested so one user cannot read another''s orders, an order status machine and wallet ledger that only change through SQL and Edge Functions, and private storage for package photos. Sign-in works by phone or email OTP (SMS through a Send SMS hook), Google or Apple. The six-step booking wizard (type, pickup, drop-off, receiver, package, schedule) takes a map pin, an address search or a saved address, prices the trip in SQL from Geoapify routing, and confirms with a tracking number after a mocked payment. The orders tab pages, filters and searches by tracking number, and each order shows a status timeline with honest refund copy on cancel. Money is integer kobo throughout, phone numbers default to +234 in E.164, all copy runs through i18n for Pidgin, Yoruba, Hausa and Igbo later, and every screen supports light and dark mode, Reduce Motion and font scaling. CI runs typecheck, lint, format and over 300 tests on every PR. Next up: the courier application, delivery requests, live tracking, chat, wallet and push notifications.',
  'Solo Developer',
  'Ongoing',
  '2026',
  '[{"name":"Expo"},{"name":"React Native"},{"name":"TypeScript"},{"name":"Expo Router"},{"name":"NativeWind"},{"name":"Reanimated"},{"name":"MapLibre"},{"name":"Supabase"},{"name":"PostgreSQL"},{"name":"TanStack Query"},{"name":"Zustand"},{"name":"Zod"},{"name":"i18next"},{"name":"Jest"},{"name":"GitHub Actions"}]'::jsonb,
  '[
    "https://peincqeqcufbkoccyneo.supabase.co/storage/v1/object/public/project-screenshots/ee656c8e-1d5b-42b8-8169-db5ce99eb08d.webp",
    "https://peincqeqcufbkoccyneo.supabase.co/storage/v1/object/public/project-screenshots/dc8e2c4f-baba-4a2f-b2d5-9e78ef7f015d.webp",
    "https://peincqeqcufbkoccyneo.supabase.co/storage/v1/object/public/project-screenshots/7ad3b39f-c234-4c72-8d67-f67aefd2ec4e.webp"
  ]'::jsonb,
  null
) on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  label = excluded.label,
  description = excluded.description,
  kind = excluded.kind,
  status = excluded.status,
  tags = excluded.tags,
  type = excluded.type,
  featured = excluded.featured,
  live_url = excluded.live_url,
  github_url = excluded.github_url,
  problem = excluded.problem,
  solution = excluded.solution,
  role_title = excluded.role_title,
  duration = excluded.duration,
  year = excluded.year,
  tech_details = excluded.tech_details,
  screenshots = excluded.screenshots,
  showcase_type = excluded.showcase_type;
