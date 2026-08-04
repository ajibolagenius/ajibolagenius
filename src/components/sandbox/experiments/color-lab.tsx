"use client";

import { useId, useState } from "react";

function hexToRgb(hex: string): [number, number, number] | null {
  const cleaned = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  return [
    parseInt(cleaned.slice(0, 2), 16),
    parseInt(cleaned.slice(2, 4), 16),
    parseInt(cleaned.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]: [number, number, number]) {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(fg: string, bg: string) {
  const a = hexToRgb(fg);
  const b = hexToRgb(bg);
  if (!a || !b) return null;
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function grade(ratio: number | null) {
  if (ratio == null) return { label: "—", detail: "Enter two valid hex colors" };
  if (ratio >= 7) return { label: "AAA", detail: "Passes WCAG AAA for normal text" };
  if (ratio >= 4.5) return { label: "AA", detail: "Passes WCAG AA for normal text" };
  if (ratio >= 3) return { label: "AA Large", detail: "Passes AA for large text only" };
  return { label: "Fail", detail: "Below WCAG AA for large text" };
}

const PRESETS: { label: string; fg: string; bg: string }[] = [
  { label: "Site", fg: "#1a0a06", bg: "#fbf5ef" },
  { label: "Invert", fg: "#f5ede6", bg: "#17120f" },
  { label: "Accent", fg: "#fbf5ef", bg: "#e64301" },
  { label: "Muted", fg: "#6b5348", bg: "#fbf5ef" },
];

export function ColorLabExperiment() {
  const fgId = useId();
  const bgId = useId();
  const [fg, setFg] = useState("#1a0a06");
  const [bg, setBg] = useState("#fbf5ef");

  const ratio = contrastRatio(fg, bg);
  const result = grade(ratio);
  const ratioLabel = ratio != null ? ratio.toFixed(2) : "—";

  return (
    <div className="border border-ink/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
        <p className="font-mono text-body-xs uppercase tracking-wide text-ink/50">
          Contrast playground
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setFg(preset.fg);
                setBg(preset.bg);
              }}
              className="bg-ink/5 px-2.5 py-1 font-mono text-[11px] text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-12 text-center transition-colors"
        style={{ backgroundColor: bg, color: fg }}
      >
        <p className="text-h2 font-normal tracking-tight">Can you read this?</p>
        <p className="max-w-sm text-body-m opacity-80">
          Drag the swatches or type hex values. The ratio updates as you go.
        </p>
        <p className="font-mono text-body-xs uppercase tracking-wide opacity-60">
          {ratioLabel}:1 · {result.label}
        </p>
      </div>

      <div className="grid gap-4 border-t border-ink/10 p-4 sm:grid-cols-[1fr_1fr_auto]">
        <label className="flex flex-col gap-1.5 text-body-s" htmlFor={fgId}>
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50">
            Foreground
          </span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hexToRgb(fg) ? fg : "#1a0a06"}
              onChange={(e) => setFg(e.target.value)}
              className="h-10 w-12 cursor-pointer border border-ink/15 bg-transparent p-1"
              aria-label="Foreground color picker"
            />
            <input
              id={fgId}
              type="text"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              spellCheck={false}
              className="min-w-0 flex-1 border border-ink/15 bg-transparent px-3 py-2 font-mono text-body-s outline-none focus:border-ink"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5 text-body-s" htmlFor={bgId}>
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50">
            Background
          </span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hexToRgb(bg) ? bg : "#fbf5ef"}
              onChange={(e) => setBg(e.target.value)}
              className="h-10 w-12 cursor-pointer border border-ink/15 bg-transparent p-1"
              aria-label="Background color picker"
            />
            <input
              id={bgId}
              type="text"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              spellCheck={false}
              className="min-w-0 flex-1 border border-ink/15 bg-transparent px-3 py-2 font-mono text-body-s outline-none focus:border-ink"
            />
          </div>
        </label>

        <div className="flex flex-col justify-end gap-1 sm:min-w-36">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink/50">
            Result
          </p>
          <p className="text-h3 font-normal text-ink">
            {ratioLabel}
            <span className="text-body-s text-ink/50">:1</span>
          </p>
          <p className="text-body-xs text-ink/60">{result.detail}</p>
        </div>
      </div>
    </div>
  );
}
