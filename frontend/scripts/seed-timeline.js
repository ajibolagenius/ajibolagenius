/**
 * Populate the Supabase timeline_entries table from data extracted from
 * docs/AJIBOLA AKELEBE - Design and Engineering -.pdf (see timeline-entries-from-cv.json).
 *
 * Usage (from frontend directory):
 *   node scripts/seed-timeline.js
 *
 * Requires env (or set in frontend/.env):
 *   VITE_SUPABASE_URL (or SUPABASE_URL) — project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (bypasses RLS for insert)
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
  console.error('Missing required env. Add to frontend/.env (or frontend/.env.local):');
  console.error('  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

function loadTimelineEntries() {
  const jsonPath = path.join(__dirname, 'timeline-entries-from-cv.json');
  const content = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(content);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No timeline entries in timeline-entries-from-cv.json');
  }
  return data;
}

function mapEntryToRow(entry) {
  return {
    year: String(entry.year ?? ''),
    title: String(entry.title ?? ''),
    body: String(entry.body ?? ''),
    accent: String(entry.accent ?? 'sungold'),
    order: Number(entry.order) ?? 0,
  };
}

async function main() {
  const entries = loadTimelineEntries();
  const rows = entries.map(mapEntryToRow);

  const supabase = createClient(url, serviceRoleKey);

  const { error: deleteError } = await supabase
    .from('timeline_entries')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Delete existing timeline_entries failed:', deleteError.message);
    process.exit(1);
  }

  const { error } = await supabase.from('timeline_entries').insert(rows);
  if (error) {
    console.error('Insert error:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} timeline entries (from CV PDF).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
