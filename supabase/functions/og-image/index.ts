/// <reference path="../notify-course-open/deno.d.ts" />
// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno module
import { Resvg, initWasm } from "https://esm.sh/@resvg/resvg-wasm@2.6.2";

const SITE_NAME = Deno.env.get("OG_SITE_BRAND_NAME") || "Ajibola Akelebe";

let wasmInitialized = false;
async function initializeWasm() {
  if (wasmInitialized) return;
  const wasmRes = await fetch("https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm");
  const wasmBuffer = await wasmRes.arrayBuffer();
  await initWasm(wasmBuffer);
  wasmInitialized = true;
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") || "Design & Engineering";
  const category = (url.searchParams.get("category") || "Thought").toUpperCase();

  // Escape XML special characters
  const escape = (str: string) => 
    str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    }[m] || m));

  const escapedTitle = escape(title);
  const escapedCategory = escape(category);

  // Pure SVG Template - Nebula Style with Grid
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Grid Pattern (40x40 matching the site) -->
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(232, 160, 32, 0.04)" stroke-width="1"/>
        </pattern>

        <!-- Nebula Hero Gradients -->
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
        
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&amp;family=DM+Sans:wght@700&amp;display=swap');
          .title { font-family: 'Syne', sans-serif; font-weight: 800; fill: #F2EFE8; font-size: 80px; text-transform: uppercase; }
          .category { font-family: 'DM Sans', sans-serif; font-weight: 700; fill: #E8A020; font-size: 18px; letter-spacing: 0.35em; }
          .brand { font-family: 'DM Sans', sans-serif; font-weight: 700; fill: #F2EFE8; font-size: 32px; letter-spacing: -0.02em; }
          .tagline { font-family: 'DM Sans', sans-serif; font-weight: 400; fill: rgba(242, 239, 232, 0.4); font-size: 20px; letter-spacing: 0.15em; }
        </style>
      </defs>

      <!-- Background Architecture -->
      <rect width="1200" height="630" fill="#07070F" />
      
      <!-- Grid Layer -->
      <rect width="1200" height="630" fill="url(#grid)" />

      <!-- Nebula Layer -->
      <rect width="1200" height="630" fill="url(#nebulaCore)" />
      <rect width="1200" height="630" fill="url(#sunGlow)" />
      <rect width="1200" height="630" fill="url(#topGlow)" />

      <!-- Content Container (Safe Margins) -->
      <g transform="translate(100, 0)">
        <!-- Kicker -->
        <g transform="translate(0, 180)">
          <rect width="24" height="2" fill="#E8A020" />
          <text x="40" y="7" class="category">${escapedCategory}</text>
        </g>

        <!-- Title Section (Stricter Wrapping) -->
        <g transform="translate(0, 305)">
          ${renderWrappedTitle(escapedTitle, 0, 0, 950, 95)}
        </g>

        <!-- Footer -->
        <g transform="translate(0, 545)">
          <text class="brand">${escape(SITE_NAME)}</text>
          <text x="280" y="-2" class="tagline" opacity="0.6">//</text>
          <text x="335" y="-2" class="tagline">DESIGN &amp; ENGINEERING</text>
        </g>
      </g>
      
      <!-- Border Accent -->
      <rect x="0" y="0" width="1200" height="630" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
    </svg>
  `.trim();

  try {
    await initializeWasm();
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
      font: {
        loadSystemFonts: false,
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Resvg conversion error:", err);
    // Fall back to returning SVG if PNG generation fails, or 500 error
    return new Response("Internal Server Error generating PNG", { status: 500 });
  }
});

/** Manual line wrapping for SVG with tight constraints */
function renderWrappedTitle(text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLineArr: string[] = [];

  // Syne is wide. 12-14 chars is safer for 80px font.
  const MAX_LINE_CHARS = 13; 

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

  // Ensure we don't overflow vertically
  const displayLines = lines.slice(0, 3);

  return displayLines.map((line, i) => 
    `<text x="${x}" y="${y + i * lineHeight}" class="title">${line}</text>`
  ).join("");
}
