import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../../services/api';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { ProjectsSkeleton } from './SkeletonLayouts';
import WorkProjectCard from './WorkProjectCard';

const Projects = ({ featuredOnly = false }) => {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);
  const { data, loading } = useRealtimeQuery('projects', fetchProjects);
  const projects = Array.isArray(data) ? data : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const featured = projects.filter((p) => p.featured);
  const displayProjects = featuredOnly
    ? featured.length > 0
      ? featured.slice(0, 3)
      : projects.slice(0, 3)
    : filter === 'all'
      ? featured.length > 0
        ? featured
        : projects.slice(0, 3)
      : projects.filter((p) => p.type === filter);

  const filters = [
    { label: 'Featured', value: 'all' },
    { label: 'Development', value: 'dev' },
    { label: 'Design', value: 'design' },
  ];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="work-ui-scope py-12 md:py-20 border-b border-[var(--border)]"
    >
      <div className="max-w-[1160px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-px bg-[var(--work-accent)]" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--work-accent)]">
            {featuredOnly ? '02 — Featured Work' : '02 — Selected Work'}
          </span>
        </div>
        <h2
          className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]"
          style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
        >
          {featuredOnly ? 'Featured Projects' : 'Selected Projects'}
        </h2>
        <p className="font-body text-[15px] leading-[1.7] mb-8 max-w-[520px] text-[var(--muted)]">
          A selection of products and experiments I&apos;ve built — from social platforms to creative coding explorations.
        </p>
        {!featuredOnly && (
          <div className="flex gap-2 mb-10 flex-wrap" role="group" aria-label="Filter by type">
            {filters.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  aria-pressed={active}
                  className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
                  style={{
                    background: active ? 'var(--work-accent)' : 'transparent',
                    color: active ? 'var(--work-accent-on)' : 'var(--subtle)',
                    border: `1px solid ${active ? 'var(--work-accent)' : 'var(--border)'}`,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}
        {loading && projects.length === 0 ? (
          <ProjectsSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {displayProjects.map((project, i) => (
              <WorkProjectCard
                key={project.slug || project.id}
                project={project}
                revealIndex={i}
                visible={visible}
              />
            ))}
          </div>
        )}
        {featuredOnly && (
          <div className="mt-10 flex justify-start">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] border border-[var(--border-md)] text-[var(--white)] no-underline transition-all duration-200 hover:border-[var(--work-accent-border)] hover:text-[var(--work-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
            >
              View all projects →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
