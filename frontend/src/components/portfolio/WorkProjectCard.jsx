import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const getHeroUrl = (project) => {
  const first = project.screenshots?.[0];
  return first ? (typeof first === 'string' ? first : first.url) : null;
};

const TYPE_LABEL = {
  dev: 'Dev',
  design: 'Design',
};

function projectMetrics(project) {
  return [
    { k: 'Year', v: project.year ? String(project.year) : '—' },
    { k: 'Focus', v: TYPE_LABEL[project.type] || project.type || '—' },
    { k: 'Span', v: project.duration?.trim() ? project.duration : '—' },
    { k: 'Tags', v: project.tags?.length != null ? String(project.tags.length) : '—' },
  ];
}

/**
 * High-density project card — Design System v2 (work-ui-scope).
 * Uses existing project fields only (no new API shape).
 */
export default function WorkProjectCard({ project, revealIndex = null, visible = true }) {
  const href = `/work/${project.slug || project.id}`;
  const heroUrl = getHeroUrl(project);
  const metrics = projectMetrics(project);
  const animationStyle =
    revealIndex != null
      ? {
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0px)' : 'translateY(24px)',
          transition: 'opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out)',
          transitionDelay: visible ? `${revealIndex * 90}ms` : '0ms',
        }
      : undefined;

  const topLabel = project.category || project.label || 'Project';

  return (
    <Link
      to={href}
      style={animationStyle}
      className="group relative flex flex-col min-h-[320px] bg-[var(--elevated)] border border-[var(--border)] overflow-hidden rounded-none transition-[border-color,box-shadow] duration-300 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] hover:border-[var(--work-accent-border)] hover:shadow-[0_0_0_1px_var(--work-accent-muted)]"
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 border-b border-[var(--border)] bg-[var(--surface)]/40">
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--work-accent)] truncate">
          {topLabel}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {project.featured && (
            <span className="font-mono text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 bg-[var(--work-accent)] text-[var(--work-accent-on)]">
              Featured
            </span>
          )}
          <span
            className="w-8 h-8 flex items-center justify-center border border-[var(--border)] text-[var(--work-accent)] transition-colors group-hover:bg-[var(--work-accent-muted)] group-hover:border-[var(--work-accent-border)]"
            aria-hidden
          >
            <ChevronRight size={16} strokeWidth={2.25} />
          </span>
        </div>
      </div>

      <div className="relative flex-1 min-h-[120px] flex items-center justify-center bg-[var(--surface)] overflow-hidden">
        {heroUrl ? (
          <OptimizedImage
            src={heroUrl}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-contain p-5 sm:p-6 opacity-[0.92] group-hover:opacity-100 transition-opacity duration-500"
          />
        ) : (
          <span
            className="relative z-[1] font-work-pixel text-[clamp(1.25rem,3.5vw,2rem)] text-[var(--muted)] select-none"
            aria-hidden
          >
            {(project.name || '?').slice(0, 3).toUpperCase()}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--void)]/30 pointer-events-none" />
      </div>

      <div className="flex flex-col flex-1 border-t border-[var(--border)]">
        <div className="px-4 pt-3 pb-2">
          <h3 className="font-display text-[16px] sm:text-[17px] font-bold leading-[1.2] text-[var(--white)] group-hover:text-[var(--work-accent)] transition-colors line-clamp-2">
            {project.name}
          </h3>
          <p className="font-body text-[12px] leading-[1.55] text-[var(--muted)] line-clamp-2 mt-1.5">
            {project.description}
          </p>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-px bg-[var(--border)]">
          {metrics.map((m) => (
            <div key={m.k} className="bg-[var(--elevated)] px-2 py-2 sm:py-2.5 text-center min-w-0">
              <div className="font-mono text-[7px] sm:text-[8px] tracking-[0.08em] uppercase text-[var(--dim)] mb-0.5">
                {m.k}
              </div>
              <div className="font-display text-[11px] sm:text-[12px] font-bold text-[var(--white)] truncate" title={m.v}>
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
