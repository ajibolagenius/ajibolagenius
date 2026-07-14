-- Some tech-logos have separate light/dark-theme-optimized variants
-- (e.g. react_light.svg vs react_dark.svg). Store the dark-theme variant
-- separately so the site can swap icons when the theme toggle flips.

alter table public.skills
  add column if not exists icon_url_dark text;
