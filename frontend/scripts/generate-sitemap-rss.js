/**
 * Generate public/sitemap.xml and public/rss.xml from Supabase (blog posts, projects).
 * Run from frontend directory: node scripts/generate-sitemap-rss.js
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL + SUPABASE_ANON_KEY).
 * Optional: VITE_SITE_URL for absolute URLs (default https://ajibolagenius.pro).
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

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

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = process.env.VITE_SITE_URL || process.env.URL || 'http://localhost:3000';
const baseUrl = SITE_URL.replace(/\/$/, '');

if (!url || !anonKey) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_*).');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const STATIC_PATHS = ['/', '/work', '/teach', '/writing', '/gallery', '/cv', '/contact', '/search'];

function escapeXml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toISODate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function main() {
  const [postsRes, projectsRes] = await Promise.all([
    supabase.from('blog_posts').select('slug, title, excerpt, date, updated_at').eq('published', true).order('date', { ascending: false }),
    supabase.from('projects').select('slug, updated_at, created_at').order('created_at', { ascending: false }),
  ]);

  const posts = (postsRes.data || []).filter((p) => p.slug);
  const projects = (projectsRes.data || []).filter((p) => p.slug);

  const sitemapUrls = [
    ...STATIC_PATHS.map((p) => ({ loc: `${baseUrl}${p}`, lastmod: null })),
    ...posts.map((p) => ({ loc: `${baseUrl}/writing/${p.slug}`, lastmod: p.updated_at || p.date })),
    ...projects.map((p) => ({ loc: `${baseUrl}/work/${p.slug}`, lastmod: p.updated_at || p.created_at })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (u) =>
      `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${toISODate(u.lastmod).slice(0, 10)}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const rssItems = posts.slice(0, 50).map((p) => ({
    title: p.title || p.slug,
    link: `${baseUrl}/writing/${p.slug}`,
    pubDate: toISODate(p.date),
    description: p.excerpt || '',
  }));

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ajibola Akelebe — Design &amp; Engineering</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Blog and writing about design, development, and technology.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
    <atom:link href="${escapeXml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;

  const publicDir = path.join(frontendDir, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
  console.log('Wrote public/sitemap.xml');
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss, 'utf8');
  console.log('Wrote public/rss.xml');
}

main()
  .then(() => {})
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
