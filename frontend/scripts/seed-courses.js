/**
 * Populate the Supabase courses table from frontend/src/data/mock.js.
 *
 * Usage (from frontend directory):
 *   node scripts/seed-courses.js
 *
 * Requires env (or set in frontend/.env):
 *   VITE_SUPABASE_URL (or SUPABASE_URL) — project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (bypasses RLS for insert)
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load .env from frontend dir or cwd (no dotenv dependency)
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
  console.error('Get the service role key in Supabase Dashboard → Settings → API (use only server-side, never in client).');
  process.exit(1);
}

// Load courses from mock.js by reading the file and extracting the courses array
function loadCoursesFromMock() {
  const mockPath = path.join(__dirname, '../src/data/mock.js');
  const content = fs.readFileSync(mockPath, 'utf8');
  // Find the start of "export const courses = ["
  const start = content.indexOf('export const courses = [');
  if (start === -1) throw new Error('Could not find "export const courses =" in mock.js');
  let depth = 0;
  let begin = content.indexOf('[', start);
  let end = begin;
  for (let i = begin; i < content.length; i++) {
    const c = content[i];
    if (c === '[') depth++;
    if (c === ']') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const arrayStr = content.slice(begin, end);
  // Use Function to evaluate the array (same shape as JSON but with unquoted keys)
  const fn = new Function('return ' + arrayStr);
  return fn();
}

function mapCourseToRow(course) {
  return {
    slug: course.id,
    name: course.name,
    duration: course.duration || '',
    price: course.price || '',
    badge: course.badge || '',
    description: course.description || '',
    curriculum: Array.isArray(course.curriculum) ? course.curriculum : [],
  };
}

async function main() {
  const courses = loadCoursesFromMock();
  if (!Array.isArray(courses) || courses.length === 0) {
    console.error('No courses found in mock.js');
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey);
  const rows = courses.map(mapCourseToRow);

  const { error: deleteError } = await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Delete existing courses failed:', deleteError.message);
    process.exit(1);
  }

  const { error } = await supabase.from('courses').insert(rows);
  if (error) {
    console.error('Insert error:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} courses (slug: ${rows.map((r) => r.slug).join(', ')})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
