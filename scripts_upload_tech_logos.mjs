import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

function loadEnv(file) {
  const content = fs.readFileSync(file, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
}

const env = loadEnv(".env.local");
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);
const dir = "docs/tech-logos";
const files = fs.readdirSync(dir);

let uploaded = 0;
let failed = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  const buffer = fs.readFileSync(filePath);
  const destName = file.toLowerCase().replace(/\s+/g, "-");
  const { error } = await supabase.storage
    .from("tech-logos")
    .upload(destName, buffer, {
      contentType: "image/svg+xml",
      upsert: true,
    });
  if (error) {
    console.error(`FAILED ${file}: ${error.message}`);
    failed++;
  } else {
    uploaded++;
  }
}

console.log(`Uploaded: ${uploaded}, Failed: ${failed}`);
