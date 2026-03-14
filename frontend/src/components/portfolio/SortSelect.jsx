import React from 'react';

/**
 * Sort dropdown — Design System: mono label, same border/active style as FilterButtons.
 * @param {{ value: string, label: string }[]} options - e.g. [{ value: 'date-desc', label: 'Newest first' }, ...]
 * @param {string} value - Current selected value
 * @param {(value: string) => void} onChange
 * @param {string} [label] - e.g. "Sort"
 */
const SortSelect = ({ options, value, onChange, label = 'Sort' }) => (
  <div className="flex items-center gap-2 flex-wrap" role="group" aria-label={label}>
    {label && (
      <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--subtle)]">
        {label}
      </span>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer rounded-none bg-transparent border border-[var(--border)] text-[var(--subtle)] hover:border-[var(--border-md)] focus:outline-none focus:ring-2 focus:ring-[var(--sungold)] focus:ring-offset-2 focus:ring-offset-[var(--void)] focus:border-[rgba(232,160,32,0.3)] [&:not([value=''])]:text-[var(--white)]"
      style={{
        minWidth: '140px',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SortSelect;
