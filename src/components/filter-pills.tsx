"use client";

import type { CSSProperties } from "react";
import { useIndicator } from "@/hooks/use-indicator";

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
  tone?: "ink" | "accent";
};

/**
 * Squared filter pills with one sliding block behind the active option,
 * instead of each pill toggling its own background.
 *
 * State lives on `data-active` rather than in conditional class strings, so a
 * single CSS rule can drive several properties at different delays — which is
 * what the choreography below needs.
 */
export function FilterPills({
  options,
  value,
  onChange,
  label,
  className = "",
}: {
  options: FilterOption[];
  value: string;
  onChange: (next: string) => void;
  label: string;
  className?: string;
}) {
  const { containerRef, box } = useIndicator<HTMLDivElement>(value);
  const active = options.find((o) => o.value === value);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={label}
      className={`relative flex flex-wrap gap-2 ${className}`}
    >
      <span
        aria-hidden
        data-ready={box ? "true" : undefined}
        data-tone={active?.tone ?? "ink"}
        className="indicator bg-ink data-[tone=accent]:bg-accent"
        style={
          box
            ? ({
                "--ix": `${box.x}px`,
                "--iy": `${box.y}px`,
                "--iw": `${box.w}px`,
                "--ih": `${box.h}px`,
              } as CSSProperties)
            : undefined
        }
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          data-active={value === option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          // The delay on the active state is the detail that sells it: the
          // label turns cream as the block arrives under it, not before.
          className="relative z-10 px-3 py-1.5 font-mono text-body-xs text-ink/60 transition-colors duration-[var(--dur-2)] hover:bg-ink/10 hover:text-ink data-[active=true]:bg-transparent data-[active=true]:text-cream data-[active=true]:delay-[90ms] data-[active=true]:hover:bg-transparent"
        >
          {option.label}
          {option.count != null && (
            <span className="ml-1.5 tabular-nums text-current/50">
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
