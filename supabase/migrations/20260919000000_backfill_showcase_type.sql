-- Backfill projects.showcase_type from the hardcoded slug map that lived in
-- src/components/project-showcase.tsx (getShowcaseTypeBySlug).
--
-- That function was a second source of truth: the component read
-- `project.showcase_type || getShowcaseTypeBySlug(project.slug)`, so the
-- column — which the admin form already edits — was empty on every row but
-- mark_me, and the hardcoded map was doing all the work. Once this lands the
-- map can be deleted and the column is the only source.
--
-- Idempotent: only fills rows where the column is still null, so it will not
-- stomp a value set through the admin UI.

update projects set showcase_type = v.showcase_type
from (values
  ('narvo_news',         'audio'),
  ('narvo_intelligence', 'audio'),
  ('narvo_platform',     'api'),
  ('hekaiq',             'duel'),
  ('gorant',             'mood'),
  ('fidia',              'fidia'),
  ('zora-market',        'zora-architecture'),
  ('zora-market-mobile', 'zora-architecture'),
  ('afrograph',          'afrograph-architecture')
) as v(slug, showcase_type)
where projects.slug = v.slug
  and projects.showcase_type is null;
