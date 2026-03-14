import React from 'react';

/**
 * Inline loading skeleton (design-system: sharp, no radius).
 * Use while data is loading to avoid layout shift.
 */
export function DataLoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-[var(--elevated)] border border-[var(--border)]"
          style={{
            width: i === lines - 1 && lines > 1 ? '70%' : '100%',
            borderRadius: 0,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Inline error message with retry. Shown when fetch fails but fallback data is displayed.
 * Design-system: subtle text, sharp button.
 */
export function DataErrorBanner({ error, onRetry, className = '' }) {
  if (!error) return null;
  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center gap-2 py-2 px-3 border border-[var(--border-md)] bg-[var(--elevated)] font-body text-[13px] text-[var(--muted)] ${className}`}
      style={{ borderRadius: 0 }}
    >
      <span>Couldn&apos;t load latest; showing cached content.</span>
      {typeof onRetry === 'function' && (
        <button
          type="button"
          onClick={onRetry}
          className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--sungold)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
        >
          Retry
        </button>
      )}
    </div>
  );
}
