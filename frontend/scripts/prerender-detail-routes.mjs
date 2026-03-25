/**
 * After `vite build`, emit static HTML so WhatsApp / Facebook / Slack / OG checkers see correct
 * <meta> without running React (SPA shell is not enough for non-root URLs).
 *
 * 1) Listing routes (always): dist/work/index.html, dist/writing/index.html, etc. — no DB required.
 * 2) Detail routes (optional): dist/writing/<slug>/index.html, dist/work/<slug>/index.html — needs Supabase.
 *
 * Env: VITE_SITE_URL or URL = canonical site (best). On Vercel, VERCEL_URL is used automatically if unset.
 * VITE_SUPABASE_* required only for blog/work *detail* prerender.
 * Writes dist/_redirects (Netlify). Vercel: static files in dist/ are served before SPA fallback when
 * Output Directory is dist — ensure project Root Directory points at frontend if monorepo.
 * Set SKIP_PRERENDER_DETAIL=1 to skip this entire script.
 *
 * Keep pageTitle + description in sync with *Page.jsx usePageMeta.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SITE_NAME,
  SITE_TAGLINE,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  STATIC_DEFAULT_OG_IMAGE_HEIGHT,
  STATIC_DEFAULT_OG_IMAGE_WIDTH,
} from '../src/lib/siteBrand.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(dir) {
  for (const name of ['.env.local', '.env']) {
    try {
      const content = fs.readFileSync(path.join(dir, name), 'utf8');
      for (const line of content.split('\n')) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (m && !process.env[m[1]]) {
          let val = m[2].trim();
          const comment = val.indexOf('#');
          if (comment !== -1) val = val.slice(0, comment).trim();
          process.env[m[1]] = val.replace(/^["']|["']$/g, '');
        }
      }
      return true;
    } catch (_) {}
  }
  return false;
}

const frontendDir = path.join(__dirname, '..');
loadEnvFile(frontendDir) || loadEnvFile(process.cwd());

if (process.env.SKIP_PRERENDER_DETAIL === '1') {
  console.log('[prerender] SKIP_PRERENDER_DETAIL=1 — skipping detail prerender.');
  process.exit(0);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

/**
 * Absolute origin for OG/canonical in emitted HTML. Many crawlers (WhatsApp, FB) ignore relative og:image.
 * Order: VITE_SITE_URL → URL (Netlify etc.) → https://VERCEL_URL (set on Vercel builds).
 */
function resolvePublicSiteUrl() {
  const a = (process.env.VITE_SITE_URL || process.env.URL || '').trim().replace(/\/$/, '');
  if (a) return a;
  const v = (process.env.VERCEL_URL || '').trim();
  if (v) return `https://${v.replace(/^https?:\/\//i, '').replace(/\/$/, '')}`;
  return '';
}

const siteUrl = resolvePublicSiteUrl();
const distDir = path.join(frontendDir, 'dist');
const indexPath = path.join(distDir, 'index.html');

/** Listing paths — titles match usePageMeta `title` (before " — SITE_NAME" suffix). */
const STATIC_LIST_ROUTES = [
  {
    path: '/work',
    pageTitle: 'Selected Work',
    description:
      'A collection of products and experiments — from social platforms to creative coding explorations.',
  },
  {
    path: '/writing',
    pageTitle: 'Blog & Thoughts',
    description:
      'Writing about design, development, teaching, and the intersection of African identity and technology.',
  },
  {
    path: '/teach',
    pageTitle: 'Courses & Mentorship',
    description:
      'I teach what I know and share what I learn. Remote courses designed for the Nigerian developer ready to level up.',
  },
  {
    path: '/gallery',
    pageTitle: 'Gallery',
    description: 'Images and videos: UI, 3D, and graphic work.',
  },
  {
    path: '/contact',
    pageTitle: 'Contact',
    description: 'Get in touch — design and engineering inquiries, collaboration, or just say hello.',
  },
  {
    path: '/cv',
    pageTitle: 'CV',
    description: 'Experience, education, and skills — design and engineering.',
  },
  {
    path: '/search',
    pageTitle: 'Search',
    description: 'Search blog posts, projects, and courses.',
  },
  {
    path: '/assets',
    pageTitle: 'Assets & Downloads',
    description: 'Design files, resources, and links shared by Ajibola Akelebe.',
  },
];

function escapeAttr(text) {
  return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function absolutize(href, base) {
  const b = (base || '').replace(/\/$/, '');
  if (!href) return b ? `${b}${DEFAULT_OG_IMAGE_PATH}` : DEFAULT_OG_IMAGE_PATH;
  if (href.startsWith('http')) return href;
  if (!b) return href.startsWith('/') ? href : `/${href}`;
  return `${b}${href.startsWith('/') ? '' : '/'}${href}`;
}

function buildOgImageFnUrl(title, category) {
  const base = (supabaseUrl || '').trim().replace(/\/$/, '');
  if (!base || base.includes('placeholder')) return null;
  const u = new URL(`${base}/functions/v1/og-image`);
  u.searchParams.set('title', title || SITE_TAGLINE);
  u.searchParams.set('category', String(category || 'Thought'));
  return u.toString();
}

function blogOgImage(post) {
  if (post.og_image) return absolutize(post.og_image, siteUrl);
  const dynamic = buildOgImageFnUrl(post.title, post.category || 'Thought');
  if (dynamic) return dynamic;
  return absolutize(DEFAULT_OG_IMAGE_PATH, siteUrl);
}

function projectOgImage(project) {
  const shots = (project.screenshots || [])
    .map((s) => (typeof s === 'string' ? s : s?.url))
    .filter(Boolean);
  const hero = shots[0];
  if (hero) return absolutize(hero, siteUrl);
  const dynamic = buildOgImageFnUrl(project.name, 'Project');
  if (dynamic) return dynamic;
  return absolutize(DEFAULT_OG_IMAGE_PATH, siteUrl);
}

function blogJsonLd(post, imageUrl) {
  const base = siteUrl.replace(/\/$/, '');
  const path = `/writing/${post.slug || ''}`;
  const url = base ? `${base}${path}` : path;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt || post.description || post.title,
    image: imageUrl,
    url,
    datePublished: post.date || post.published_at,
    dateModified: post.updated_at || post.date || post.published_at,
    author: { '@type': 'Person', name: SITE_NAME },
    publisher: { '@type': 'Person', name: SITE_NAME, image: absolutize(DEFAULT_OG_IMAGE_PATH, base) },
  };
}

function ogDimensionsForUrl(imageUrl) {
  const u = imageUrl || '';
  if (u.includes('/functions/v1/og-image')) return [OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT];
  if (u.endsWith('og-image.png')) return [STATIC_DEFAULT_OG_IMAGE_WIDTH, STATIC_DEFAULT_OG_IMAGE_HEIGHT];
  return [OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT];
}

function patchHtmlForPage({
  html,
  title,
  description,
  canonicalPath,
  ogImage,
  ogType,
  articleMeta,
  jsonLd,
}) {
  const absoluteUrl = siteUrl ? `${siteUrl}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}` : canonicalPath;
  const absOg = ogImage;
  const [ogW, ogH] = ogDimensionsForUrl(absOg);

  let next = html
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeAttr(description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeAttr(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeAttr(description)}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${escapeAttr(absOg)}" />`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${escapeAttr(ogType)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeAttr(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeAttr(description)}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${escapeAttr(absOg)}" />`)
    .replace(/<meta property="og:image:width" content="[^"]*"\s*\/?>/i, `<meta property="og:image:width" content="${String(ogW)}" />`)
    .replace(/<meta property="og:image:height" content="[^"]*"\s*\/?>/i, `<meta property="og:image:height" content="${String(ogH)}" />`);

  next = next.replace(/<meta property="article:[^>]+>\s*/gi, '');
  next = next.replace(/<script id="page-structured-data"[^>]*>[\s\S]*?<\/script>\s*/gi, '');

  const inject = [];
  inject.push(`<link rel="canonical" href="${escapeAttr(absoluteUrl)}" />`);
  inject.push(`<meta property="og:url" content="${escapeAttr(absoluteUrl)}" />`);
  inject.push(`<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`);

  if (articleMeta?.publishedTime) {
    inject.push(`<meta property="article:published_time" content="${escapeAttr(articleMeta.publishedTime)}" />`);
    if (articleMeta.modifiedTime) {
      inject.push(`<meta property="article:modified_time" content="${escapeAttr(articleMeta.modifiedTime)}" />`);
    }
    if (articleMeta.section) {
      inject.push(`<meta property="article:section" content="${escapeAttr(articleMeta.section)}" />`);
    }
  }

  if (jsonLd) {
    inject.push(
      `<script type="application/ld+json" id="page-structured-data">${JSON.stringify(jsonLd)}<\/script>`
    );
  }

  next = next.replace(/<\/head>/i, `    ${inject.join('\n    ')}\n</head>`);

  return next;
}

function writeStaticListingHtml(baseHtml) {
  const defaultOgAbs = absolutize(DEFAULT_OG_IMAGE_PATH, siteUrl);
  let n = 0;
  for (const route of STATIC_LIST_ROUTES) {
    const title = `${route.pageTitle} — ${SITE_NAME}`;
    const html = patchHtmlForPage({
      html: baseHtml,
      title,
      description: route.description,
      canonicalPath: route.path,
      ogImage: defaultOgAbs,
      ogType: 'website',
      articleMeta: null,
      jsonLd: null,
    });
    const segments = route.path.replace(/^\//, '').split('/').filter(Boolean);
    const dir = path.join(distDir, ...segments);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    n += 1;
  }
  return n;
}

function writeRedirects() {
  const exact = STATIC_LIST_ROUTES.map(
    (r) => `${r.path}  ${r.path}/index.html  200`
  );
  const lines = [
    '# Prerendered listings (exact paths first), then detail slugs, then SPA fallback (Netlify).',
    ...exact,
    '/writing/*  /writing/:splat/index.html  200',
    '/work/*     /work/:splat/index.html     200',
    '/*          /index.html                 200',
  ];
  fs.writeFileSync(path.join(distDir, '_redirects'), `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  if (!fs.existsSync(indexPath)) {
    console.error('[prerender] dist/index.html missing. Run vite build first.');
    process.exit(1);
  }

  if (!siteUrl) {
    console.warn(
      '[prerender] No public URL (set VITE_SITE_URL or deploy on Vercel with VERCEL_URL) — og:image / og:url will be RELATIVE; WhatsApp and many checkers will skip og:image.'
    );
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf8');
  const listCount = writeStaticListingHtml(baseHtml);
  console.log(`[prerender] Wrote ${listCount} listing HTML files (${STATIC_LIST_ROUTES.map((r) => r.path).join(', ')})`);

  if (!supabaseUrl || !anonKey) {
    console.warn('[prerender] No Supabase env — skipping blog/work detail prerender (set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY).');
    writeRedirects();
    return;
  }

  const supabase = createClient(supabaseUrl, anonKey);

  const [{ data: posts, error: pe }, { data: projects, error: re }] = await Promise.all([
    supabase.from('blog_posts').select('*').eq('published', true),
    supabase.from('projects').select('*'),
  ]);

  if (pe) {
    console.warn('[prerender] blog_posts:', pe.message);
  }
  if (re) {
    console.warn('[prerender] projects:', re.message);
  }

  let count = 0;
  for (const post of posts || []) {
    const slug = post.slug;
    if (!slug) continue;
    const title = `${post.title} — ${SITE_NAME}`;
    const description = post.meta_description || post.excerpt || post.description || DEFAULT_META_DESCRIPTION;
    const image = blogOgImage(post);
    const html = patchHtmlForPage({
      html: baseHtml,
      title,
      description,
      canonicalPath: `/writing/${slug}`,
      ogImage: image,
      ogType: 'article',
      articleMeta: {
        publishedTime: post.published_at || post.date || undefined,
        modifiedTime: post.updated_at || post.published_at || post.date || undefined,
        section: post.category || undefined,
      },
      jsonLd: blogJsonLd(post, image),
    });
    const dir = path.join(distDir, 'writing', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    count += 1;
  }

  for (const project of projects || []) {
    const slug = project.slug;
    if (!slug) continue;
    const title = `${project.name} — ${SITE_NAME}`;
    const description = project.description || DEFAULT_META_DESCRIPTION;
    const image = projectOgImage(project);
    const html = patchHtmlForPage({
      html: baseHtml,
      title,
      description,
      canonicalPath: `/work/${slug}`,
      ogImage: image,
      ogType: 'website',
      articleMeta: null,
      jsonLd: null,
    });
    const dir = path.join(distDir, 'work', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    count += 1;
  }

  writeRedirects();
  console.log(`[prerender] Wrote ${count} detail HTML files + dist/_redirects`);
}

main().catch((e) => {
  console.error('[prerender]', e);
  process.exit(1);
});
