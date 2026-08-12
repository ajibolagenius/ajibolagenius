"use client";

import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { FilterOption } from "@/components/filter-pills";

/**
 * Squared select styled to sit inline with FilterPills — same height, same
 * mono micro-label, same hairline border.
 *
 * A native <select> on purpose: it gets the platform's own listbox, keyboard
 * handling, type-ahead and mobile wheel for free, which a custom dropdown
 * would have to reimplement. `color-scheme` is already set on :root/.dark, so
 * the OS-rendered options follow the theme.
 */
export function FilterSelect({
  options,
  value,
  onChange,
  label,
  placeholder = "All categories",
  className = "",
}: {
  options: FilterOption[];
  value: string;
  onChange: (next: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
}) {
  // "All" is the placeholder here rather than a listed option.
  const [allOption, ...rest] = options;
  const isFiltered = value !== allOption?.value;

  return (
    <div className={`relative ${className}`}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-filtered={isFiltered}
        className="w-full appearance-none border border-ink/15 bg-transparent py-1.5 pl-3 pr-8 font-mono text-body-xs text-ink/60 transition-colors duration-[var(--dur-2)] hover:border-ink/30 hover:text-ink data-[filtered=true]:border-ink data-[filtered=true]:text-ink sm:w-auto"
      >
        <option value={allOption?.value ?? "all"}>{placeholder}</option>
        {rest.map((option) => (
          // Single interpolated child: two children would make React emit
          // <!-- --> text separators inside every <option>.
          <option key={option.value} value={option.value}>
            {option.count != null
              ? `${option.label} (${option.count})`
              : option.label}
          </option>
        ))}
      </select>
      <CaretDown
        weight="bold"
        size={12}
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
      />
    </div>
  );
}
