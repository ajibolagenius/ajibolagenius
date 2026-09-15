/**
 * Resolves Apple 30-second preview + store URLs for the vintage radio crate.
 *
 * We never host these recordings: the player hotlinks Apple's preview CDN and
 * always renders the accompanying store link as attribution. Run this whenever
 * the curation changes, or if a preview URL rots (the player's `error` handler
 * falls the track back to the local ambience loop until then).
 *
 *   node scripts/resolve-radio-previews.mjs [--dry]
 */
import { readFile, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import assert from "node:assert/strict";

const SRC = new URL("../src/lib/vintage-radio-tracks.ts", import.meta.url);
const OUT = new URL("../src/lib/vintage-radio-previews.ts", import.meta.url);
const dry = process.argv.includes("--dry");

/**
 * Reads the two fields we need straight out of the curation source. Node's ESM
 * resolver can't follow that file's extensionless imports, and pulling in a TS
 * loader to read two string literals is not worth it.
 */
function readCuration(source) {
  const ids = [...source.matchAll(/^\s+id: "([^"]+)"/gm)].map((m) => m[1]);
  const queries = [...source.matchAll(/^\s+appleQuery: "([^"]+)"/gm)].map((m) => m[1]);
  const titles = [...source.matchAll(/^\s+title: "([^"]+)"/gm)].map((m) => m[1]);
  assert.equal(ids.length, queries.length, "every curated track needs an appleQuery");
  assert.equal(ids.length, titles.length, "every curated track needs a title");
  assert.ok(ids.length > 0, "found no curated tracks - did the file format change?");
  return ids.map((id, i) => ({ id, appleQuery: queries[i], title: titles[i] }));
}

function readCurationFields(source, field) {
  return [...source.matchAll(new RegExp(`^\\s+${field}: "([^"]+)"`, "gm"))].map((m) => m[1]);
}

/**
 * No-network self-check. The invariant that actually matters: a hotlinked Apple
 * preview must never ship without the store link that makes it attributable.
 */
async function check() {
  const source = await readFile(SRC, "utf8");
  const curated = readCuration(source);
  const ids = new Set(curated.map((t) => t.id));

  assert.equal(
    readCurationFields(source, "wikiUrl").length,
    curated.length,
    "every curated track needs a wikiUrl citation"
  );

  const generated = await readFile(OUT, "utf8");
  const json = generated.slice(generated.indexOf("= {") + 2, generated.lastIndexOf("}") + 1);
  const previews = JSON.parse(json);

  for (const [id, entry] of Object.entries(previews)) {
    assert.ok(ids.has(id), `preview "${id}" has no matching curated track`);
    assert.ok(entry.previewUrl, `preview "${id}" is missing previewUrl`);
    assert.ok(entry.listenUrl, `preview "${id}" plays audio with no attribution link`);
  }

  console.log(`ok - ${curated.length} curated, ${Object.keys(previews).length} attributed previews`);
}

if (process.argv.includes("--check")) {
  await check();
  process.exit(0);
}

const VINTAGE_TRACKS = readCuration(await readFile(SRC, "utf8"));

async function lookup({ id, appleQuery }) {
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", appleQuery);
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", "1");

  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);

  const [hit] = (await res.json()).results ?? [];
  if (!hit?.previewUrl || !hit?.trackViewUrl) return null;

  return {
    previewUrl: hit.previewUrl,
    listenUrl: hit.trackViewUrl,
    matchedTitle: hit.trackName,
    matchedArtist: hit.artistName,
    releaseDate: hit.releaseDate,
  };
}

const resolved = {};
for (const track of VINTAGE_TRACKS) {
  try {
    const hit = await lookup(track);
    if (hit) {
      const { releaseDate, ...entry } = hit;
      resolved[track.id] = entry;
      const drift = hit.matchedTitle.toLowerCase().includes(track.title.toLowerCase().split("(")[0].trim());
      console.log(
        `${drift ? "ok  " : "CHECK"} ${track.id.padEnd(20)} ${hit.matchedTitle.slice(0, 32).padEnd(32)} ${hit.matchedArtist.slice(0, 24).padEnd(24)} ${(releaseDate ?? "").slice(0, 4)}`
      );
    } else {
      console.log(`miss ${track.id.padEnd(20)} no preview — falls back to ambience loop`);
    }
  } catch (err) {
    console.log(`fail ${track.id.padEnd(20)} ${err.message}`);
  }
  await sleep(400); // iTunes Search is rate limited (~20 req/min)
}

const body = `/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/resolve-radio-previews.mjs
 *
 * Apple 30-second preview + store URLs for the curated crate. Previews are
 * hotlinked from Apple's CDN, never redistributed: no audio is stored in this
 * repo, and every preview is paired with its \`listenUrl\` as attribution.
 */
export interface RadioPreview {
  previewUrl: string;
  listenUrl: string;
  matchedTitle: string;
  matchedArtist: string;
}

export const RADIO_PREVIEWS: Record<string, RadioPreview | undefined> = ${JSON.stringify(resolved, null, 2)};
`;

console.log(`\n${Object.keys(resolved).length}/${VINTAGE_TRACKS.length} resolved`);
if (dry) process.exit(0);
await writeFile(OUT, body);
console.log(`wrote ${OUT.pathname.split("/").slice(-3).join("/")}`);
