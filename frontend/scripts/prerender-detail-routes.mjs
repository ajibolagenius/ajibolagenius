/**
 * After `vite build`, emit static HTML for /writing/:slug and /work/:slug with full OG + JSON-LD
 * so crawlers that do not run JS still see correct meta.
 *
 * Requires: VITE_SITE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (or SUPABASE_*).
 * Writes: dist/writing/<slug>/index.html, dist/work/<slug>/index.html, dist/_redirects (Netlify-style).
 * Set SKIP_PRERENDER_DETAIL=1 to skip (e.g. local build without DB).
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
const siteUrl = (process.env.VITE_SITE_URL || '').replace(/\/$/, '');
const distDir = path.join(frontendDir, 'dist');
const indexPath = path.join(distDir, 'index.html');

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
    .replace(/<meta property="og:image:width" content="[^"]*"\s*\/?>/i, `<meta property="og:image:width" content="${String(OG_IMAGE_WIDTH)}" />`)
    .replace(/<meta property="og:image:height" content="[^"]*"\s*\/?>/i, `<meta property="og:image:height" content="${String(OG_IMAGE_HEIGHT)}" />`);

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

function writeRedirects() {
  const lines = [
    '# Detail prerender (first); SPA fallback last (Netlify-style). Tune for your host if needed.',
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

  if (!supabaseUrl || !anonKey) {
    console.warn('[prerender] No Supabase env — skipping (set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY).');
    process.exit(0);
  }

  if (!siteUrl) {
    console.warn('[prerender] VITE_SITE_URL unset — og:url / JSON-LD may be relative; set for production.');
  }

  const supabase = createClient(supabaseUrl, anonKey);
  const baseHtml = fs.readFileSync(indexPath, 'utf8');

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
