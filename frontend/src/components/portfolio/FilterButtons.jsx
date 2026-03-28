import React from 'react';

/**
 * Filter button group — Design System: active = sungold tint, inactive = subtle.
 * @param {{ value: string, label: string }[]} options - e.g. [{ value: 'all', label: 'All' }, ...]
 * @param {string} value - Current selected value
 * @param {(value: string) => void} onChange
 * @param {string} [label] - Optional label before buttons (e.g. "Filter", "Category", "Type")
 * @param {'default'|'workV2'} [variant] - `workV2` = solid accent active state (use inside `.work-ui-scope`)
 */
const FilterButtons = ({ options, value, onChange, label, variant = 'default' }) => {
  const v2 = variant === 'workV2';
  return (
  <div className="flex items-center gap-2 flex-wrap" role="group" aria-label={label || 'Filter options'}>
    {label && (
      <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--subtle)]">
        {label}
      </span>
    )}
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => {
        const active = value === opt.value;
        const style = v2
          ? {
              background: active ? 'var(--work-accent)' : 'transparent',
              color: active ? 'var(--work-accent-on)' : 'var(--subtle)',
              border: `1px solid ${active ? 'var(--work-accent)' : 'var(--border)'}`,
            }
          : {
              background: active ? 'rgba(232,160,32,0.15)' : 'transparent',
              color: active ? 'var(--sungold)' : 'var(--subtle)',
              border: `1px solid ${active ? 'rgba(232,160,32,0.3)' : 'var(--border)'}`,
            };
        return (
        <button
          key={opt.value}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(opt.value)}
          className={`font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] ${v2 ? 'focus-visible:ring-[var(--work-accent)]' : 'focus-visible:ring-[var(--sungold)]'}`}
          style={style}
        >
          {opt.label}
        </button>
        );
      })}
    </div>
  </div>
  );
};

export default FilterButtons;
