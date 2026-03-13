import React from 'react';

/**
 * Filter button group — Design System: active = sungold tint, inactive = subtle.
 * @param {{ value: string, label: string }[]} options - e.g. [{ value: 'all', label: 'All' }, ...]
 * @param {string} value - Current selected value
 * @param {(value: string) => void} onChange
 * @param {string} [label] - Optional label before buttons (e.g. "Filter", "Category", "Type")
 */
const FilterButtons = ({ options, value, onChange, label }) => (
  <div className="flex items-center gap-2 flex-wrap">
    {label && (
      <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--subtle)]">
        {label}
      </span>
    )}
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 rounded-none"
          style={{
            background: value === opt.value ? 'rgba(232,160,32,0.15)' : 'transparent',
            color: value === opt.value ? 'var(--sungold)' : 'var(--subtle)',
            border: `1px solid ${value === opt.value ? 'rgba(232,160,32,0.3)' : 'var(--border)'}`,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export default FilterButtons;
