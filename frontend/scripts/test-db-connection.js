/**
 * Test Supabase database connection and print table contents.
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in frontend/.env');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

async function checkTable(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(3);
    if (error) {
      console.log(`❌ Table "${tableName}": ${error.message} (${error.code})`);
      return false;
    }
    console.log(`✅ Table "${tableName}": success, returned ${data.length} rows.`);
    if (data.length > 0) {
      console.log('   Sample row:', JSON.stringify(data[0]).slice(0, 120) + '...');
    }
    return true;
  } catch (err) {
    console.log(`❌ Table "${tableName}": Exception:`, err.message);
    return false;
  }
}

async function main() {
  console.log('Testing Supabase Client Connection...');
  console.log('URL:', url);

  const tables = [
    'personal_info',
    'projects',
    'courses',
    'blog_posts',
    'gallery_items',
    'timeline_entries',
    'testimonials',
    'contact_messages',
    'newsletter_subscribers'
  ];

  for (const table of tables) {
    await checkTable(table);
  }
}

main().catch(console.error);
