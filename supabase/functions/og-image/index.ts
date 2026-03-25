/// <reference path="../notify-course-open/deno.d.ts" />
// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno module
import { Resvg, initWasm } from "https://esm.sh/@resvg/resvg-wasm@2.6.2";
import { DM_SANS_700_WOFF2_B64, SYNE_800_WOFF2_B64 } from "./bundledFontB64.ts";

const SITE_NAME = Deno.env.get("OG_SITE_BRAND_NAME") || "Ajibola Akelebe";

let wasmInitialized = false;
async function initializeWasm() {
  if (wasmInitialized) return;
  const wasmRes = await fetch("https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm");
  const wasmBuffer = await wasmRes.arrayBuffer();
  await initWasm(wasmBuffer);
  wasmInitialized = true;
}

/** Latin woff2 embedded as base64 so the deploy bundle always includes glyphs (readFile may omit sibling files). */
let embeddedStylesPromise: Promise<string> | null = null;

function getEmbeddedFontStyles(): Promise<string> {
  if (!embeddedStylesPromise) {
    embeddedStylesPromise = Promise.resolve().then(() => {
      const syne = `data:font/woff2;base64,${SYNE_800_WOFF2_B64}`;
      const dm = `data:font/woff2;base64,${DM_SANS_700_WOFF2_B64}`;
      return `
    @font-face {
      font-family: 'Syne';
      font-style: normal;
      font-weight: 800;
      src: url(${syne}) format('woff2');
    }
    @font-face {
      font-family: 'DM Sans';
      font-style: normal;
      font-weight: 700;
      src: url(${dm}) format('woff2');
    }
    .title { font-family: 'Syne', sans-serif; font-weight: 800; fill: #F2EFE8; font-size: 80px; text-transform: uppercase; }
    .category { font-family: 'DM Sans', sans-serif; font-weight: 700; fill: #E8A020; font-size: 18px; letter-spacing: 0.35em; }
    .brand { font-family: 'DM Sans', sans-serif; font-weight: 700; fill: #F2EFE8; font-size: 32px; letter-spacing: -0.02em; }
    .tagline { font-family: 'DM Sans', sans-serif; font-weight: 700; fill: rgba(242, 239, 232, 0.4); font-size: 20px; letter-spacing: 0.15em; }
      `.trim();
    });
  }
  return embeddedStylesPromise;
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") || "Design & Engineering";
  const category = (url.searchParams.get("category") || "Thought").toUpperCase();

  const escape = (str: string) =>
    str.replace(/[&<>"']/g, (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      }[m] || m));

  const escapedTitle = escape(title);
  const escapedCategory = escape(category);

  let fontStyles: string;
  try {
    fontStyles = await getEmbeddedFontStyles();
  } catch (e) {
    console.error("og-image bundled font load error:", e);
    fontStyles = `
    .title { font-family: sans-serif; font-weight: 800; fill: #F2EFE8; font-size: 64px; text-transform: uppercase; }
    .category { font-family: sans-serif; font-weight: 700; fill: #E8A020; font-size: 18px; letter-spacing: 0.35em; }
    .brand { font-family: sans-serif; font-weight: 700; fill: #F2EFE8; font-size: 32px; }
    .tagline { font-family: sans-serif; font-weight: 400; fill: rgba(242, 239, 232, 0.4); font-size: 20px; letter-spacing: 0.15em; }
    `.trim();
  }

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(232, 160, 32, 0.04)" stroke-width="1"/>
        </pattern>
        <radialGradient id="nebulaCore" cx="20%" cy="30%" r="0.6">
          <stop offset="0%" stop-color="#5B4FD8" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#5B4FD8" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="sunGlow" cx="80%" cy="80%" r="0.5">
          <stop offset="0%" stop-color="#E8A020" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#E8A020" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="topGlow" cx="50%" cy="0%" r="0.4">
          <stop offset="0%" stop-color="#8B72F0" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#8B72F0" stop-opacity="0" />
        </radialGradient>
        <style type="text/css"><![CDATA[
${fontStyles}
        ]]></style>
      </defs>
      <rect width="1200" height="630" fill="#07070F" />
      <rect width="1200" height="630" fill="url(#grid)" />
      <rect width="1200" height="630" fill="url(#nebulaCore)" />
      <rect width="1200" height="630" fill="url(#sunGlow)" />
      <rect width="1200" height="630" fill="url(#topGlow)" />
      <g transform="translate(100, 0)">
        <g transform="translate(0, 180)">
          <rect width="24" height="2" fill="#E8A020" />
          <text x="40" y="7" class="category">${escapedCategory}</text>
        </g>
        <g transform="translate(0, 305)">
          ${renderWrappedTitle(escapedTitle, 0, 0, 950, 95)}
        </g>
        <g transform="translate(0, 545)">
          <text class="brand">${escape(SITE_NAME)}</text>
          <text x="280" y="-2" class="tagline" opacity="0.6">//</text>
          <text x="335" y="-2" class="tagline">DESIGN &amp; ENGINEERING</text>
        </g>
      </g>
      <rect x="0" y="0" width="1200" height="630" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
    </svg>
  `.trim();

  try {
    await initializeWasm();
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
      font: {
        loadSystemFonts: true,
        defaultSansSerifFamily: "Liberation Sans",
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("Resvg conversion error:", err);
    return new Response("Internal Server Error generating PNG", { status: 500 });
  }
});

function renderWrappedTitle(text: string, x: number, y: number, _maxWidth: number, lineHeight: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLineArr: string[] = [];
  const MAX_LINE_CHARS = 16;

  for (const word of words) {
    const testLine = [...currentLineArr, word].join(" ");
    if (testLine.length <= MAX_LINE_CHARS || currentLineArr.length === 0) {
      currentLineArr.push(word);
    } else {
      lines.push(currentLineArr.join(" "));
      currentLineArr = [word];
    }
  }
  if (currentLineArr.length > 0) lines.push(currentLineArr.join(" "));
  const displayLines = lines.slice(0, 3);
  return displayLines
    .map((line, i) => `<text x="${x}" y="${y + i * lineHeight}" class="title">${line}</text>`)
    .join("");
}
