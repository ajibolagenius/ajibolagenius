/**
 * Insert the "How This Portfolio Was Built" story from docs as a single blog post.
 * Run from frontend: node scripts/seed-blog-portfolio-story.js
 * Requires: VITE_SUPABASE_URL (or SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY
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
if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)) {
  loadEnvFile(frontendDir) || loadEnvFile(process.cwd());
}

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing env. Add to frontend/.env or frontend/.env.local:');
  console.error('  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

/** Simple markdown to HTML for the story: # ## ###, **, *, ---, paragraphs */
function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let inParagraph = false;

  function closeParagraph() {
    if (inParagraph) {
      out.push('</p>');
      inParagraph = false;
    }
  }

  function inlineFormat(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '---') {
      closeParagraph();
      out.push('<hr />');
      continue;
    }
    if (trimmed.startsWith('### ')) {
      closeParagraph();
      out.push('<h3>' + inlineFormat(trimmed.slice(4)) + '</h3>');
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeParagraph();
      out.push('<h2>' + inlineFormat(trimmed.slice(3)) + '</h2>');
      continue;
    }
    if (trimmed.startsWith('# ')) {
      closeParagraph();
      out.push('<h1>' + inlineFormat(trimmed.slice(2)) + '</h1>');
      continue;
    }
    if (trimmed === '') {
      closeParagraph();
      continue;
    }
    if (trimmed.startsWith('- ')) {
      closeParagraph();
      out.push('<ul>');
      out.push('<li>' + inlineFormat(trimmed.slice(2)) + '</li>');
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('- ')) {
        out.push('<li>' + inlineFormat(lines[j].trim().slice(2)) + '</li>');
        j++;
      }
      out.push('</ul>');
      i = j - 1;
      continue;
    }
    closeParagraph();
    out.push('<p>' + inlineFormat(trimmed) + '</p>');
  }
  closeParagraph();
  return out.join('\n');
}

function computeReadTime(html) {
  const text = (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').filter(Boolean).length : 0;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min`;
}

async function main() {
  const docPath = path.join(__dirname, '../../docs/PORTFOLIO-STORY.md');
  const md = fs.readFileSync(docPath, 'utf8');
  const bodyHtml = mdToHtml(md);
  const readTime = computeReadTime(bodyHtml);

  const slug = 'how-this-portfolio-was-built';
  const title = 'How This Portfolio Was Built: A Story in Commits';
  const excerpt = 'Design & Engineering, no boundaries — and the repo that proves it. From the first commit to Afrofuturism, Supabase, admin, and 90+ commits.';
  const date = new Date().toISOString().slice(0, 10); // today

  const row = {
    slug,
    title,
    date,
    tags: ['Portfolio', 'Case Study', 'React', 'Supabase', 'Design System'],
    category: 'Case Study',
    excerpt,
    body: bodyHtml,
    read_time: readTime,
    published: true,
    meta_description: excerpt,
    og_image: '',
  };

  const supabase = createClient(url, serviceRoleKey);

  // Upsert by slug so re-running doesn't duplicate
  const { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', slug).maybeSingle();
  if (existing) {
    const { error } = await supabase.from('blog_posts').update(row).eq('id', existing.id);
    if (error) {
      console.error('Update error:', error.message);
      process.exit(1);
    }
    console.log('Updated existing blog post:', slug);
  } else {
    const { error } = await supabase.from('blog_posts').insert(row);
    if (error) {
      console.error('Insert error:', error.message);
      process.exit(1);
    }
    console.log('Seeded blog post:', slug, '→ /writing/' + slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
