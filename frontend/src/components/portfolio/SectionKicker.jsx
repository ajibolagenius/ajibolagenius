import React from 'react';

const ACCENT = {
  sungold: { line: 'bg-[var(--sungold)]', text: 'text-[var(--sungold)]' },
  stardust: { line: 'bg-[var(--stardust)]', text: 'text-[var(--stardust)]' },
  violet: { line: 'bg-[var(--violet)]', text: 'text-[var(--violet)]' },
  terracotta: { line: 'bg-[#E07060]', text: 'text-[#E07060]' },
};

/**
 * Section kicker — Design System: line + mono uppercase label.
 * @param {string} label - Uppercase label (e.g. "Work", "Featured case study")
 * @param {'sungold'|'stardust'|'violet'|'terracotta'} [accent] - Color accent (default: sungold)
 */
const SectionKicker = ({ label, accent = 'sungold' }) => {
  const { line, text } = ACCENT[accent] || ACCENT.sungold;
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-5 h-px ${line}`} />
      <span className={`font-mono text-[11px] tracking-[0.2em] uppercase ${text}`}>
        {label}
      </span>
    </div>
  );
};

export default SectionKicker;
