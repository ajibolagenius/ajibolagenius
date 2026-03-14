import React from 'react';

/**
 * Admin section header — design system: kicker (Space Mono, sungold) + title (Syne) + optional subtitle.
 */
export default function AdminPageHeader({ kicker, title, subtitle }) {
  return (
    <header className="mb-8">
      {kicker && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-px bg-[var(--sungold)]" aria-hidden />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
            {kicker}
          </span>
        </div>
      )}
      <h1
        className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--white)]"
        style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 font-body text-[15px] leading-[1.7] text-[var(--muted)] max-w-[560px]">
          {subtitle}
        </p>
      )}
    </header>
  );
}
