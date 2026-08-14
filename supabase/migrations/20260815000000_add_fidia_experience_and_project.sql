-- Add Fidia Co-founder & Design Lead experience entry and project case study

-- 1. Insert Fidia into experience_entries
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
  'Co-founder & Design Lead',
  'Fidia',
  'Co-founder',
  '2020',
  '2023',
  'Co-founded and led product design for a creator platform empowering African creators to accept direct financial support, sell digital products, and crowdfund their creative projects.',
  array[
    'Spearheaded end-to-end product design, brand identity, and design system from 0 to 1 across web apps and creator tools.',
    'Designed self-service creator profiles, multi-currency payment checkout flows, campaign fundraising pages, and analytics dashboards.',
    'Led user research and collaborated closely with engineering to scale creator onboarding and payment monetization features.'
  ],
  2
) on conflict do nothing;

-- 2. Insert Fidia into projects
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
  'fidia',
  'Fidia',
  'Creator Economy, Fintech',
  'Creator Monetization & Crowdfunding Platform',
  'A creator monetization and crowdfunding platform built to empower African creators to monetize their craft through tips, digital products, and community funding.',
  'client',
  'archived',
  '["Co-founder", "Product Design", "Design Systems", "Fintech", "Creator Economy", "User Research"]'::jsonb,
  'product',
  true,
  'https://techcabal.com/2022/05/11/fidia-the-unwavering-bridge-for-african-creators-crowdfunding/',
  '#',
  'African content creators historically faced high friction receiving direct financial support, collecting global payments, and accessing crowdfunding tools tailored to local payment methods and creative workflows.',
  'Designed and launched an all-in-one platform providing creator link-in-bio profiles, payment links, crowdfunding campaign tooling, and digital product storefronts supporting local & international payment options.',
  'Co-founder & Design Lead',
  '2020 – 2023',
  '2020 – 2023',
  '[{"name":"Figma"},{"name":"Design Systems"},{"name":"UI/UX Design"},{"name":"Product Strategy"},{"name":"User Research"},{"name":"Fintech / Payments"}]'::jsonb,
  '[]'::jsonb,
  'fidia'
) on conflict (slug) do update set
  role_title = excluded.role_title,
  problem = excluded.problem,
  solution = excluded.solution,
  description = excluded.description,
  status = excluded.status,
  live_url = excluded.live_url,
  tags = excluded.tags,
  tech_details = excluded.tech_details,
  screenshots = excluded.screenshots,
  showcase_type = excluded.showcase_type;
