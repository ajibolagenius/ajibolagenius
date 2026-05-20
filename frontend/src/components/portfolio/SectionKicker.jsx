import React from 'react';

const ACCENT = {
  sungold: { line: 'bg-[var(--sungold)]', text: 'text-[var(--sungold)]' },
  stardust: { line: 'bg-[var(--stardust)]', text: 'text-[var(--stardust)]' },
  violet: { line: 'bg-[var(--violet)]', text: 'text-[var(--violet)]' },
  terracotta: { line: 'bg-[#E07060]', text: 'text-[#E07060]' },
  spectrum: { line: 'bg-[var(--work-accent)]', text: 'text-[var(--work-accent)]' },
};

/**
 * Section kicker — Design System: line + mono uppercase label.
 * @param {string} label - Uppercase label (e.g. "Work", "Featured case study")
 * @param {'sungold'|'stardust'|'violet'|'terracotta'|'spectrum'} [accent] - Color accent (default: sungold). `spectrum` expects `.work-ui-scope` ancestor.
 */
const SectionKicker = ({ label, accent = 'sungold' }) => {
  const { line, text } = ACCENT[accent] || ACCENT.sungold;
  return (
    <div className="editorial-kicker">
      <div className={`editorial-kicker-line ${line}`} />
      <span className={`editorial-kicker-label ${text}`}>
        {label}
      </span>
    </div>
  );
};

export default SectionKicker;
