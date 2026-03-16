import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { fetchProjects } from '../../services/api';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { ProjectsSkeleton } from './SkeletonLayouts';
import Badge from './Badge';
import { BADGE_VARIANTS } from '../../constants';

const ProjectCard = ({ project, index, visible }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="group relative cursor-pointer bg-[var(--elevated)] border border-[var(--border)] overflow-hidden rounded-none transition-all duration-300 hover:border-[var(--sungold)]/30"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(30px)',
        transitionDelay: visible ? `${index * 120}ms` : '0ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/work/${project.slug || project.id}`)}
    >
      {/* Technical hover line */}
      <div className="absolute left-0 top-0 w-0.5 h-0 bg-[var(--sungold)] transition-all duration-300 group-hover:h-full z-20" />

      <div
        className="h-[180px] flex items-center justify-center relative overflow-hidden bg-[var(--surface)]"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/40 to-transparent" />
        
        <span className="relative z-10 font-display text-[10px] tracking-[0.2em] uppercase px-4 py-2 bg-[var(--void)]/80 backdrop-blur-md text-[var(--white)] border border-[var(--border)] transition-colors group-hover:border-[var(--sungold)]/40 group-hover:text-[var(--sungold)]">
          {project.label || 'Project'}
        </span>
        {project.featured && (
          <span className="absolute top-3 right-3 z-10 scale-90">
            <Badge variant="gold">◆ Featured</Badge>
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="font-mono text-[10px] tracking-[0.15em] uppercase mb-3 text-[var(--sungold)] opacity-60 group-hover:opacity-100 transition-opacity">
          {project.category}
        </div>
        <h3 className="font-display text-[18px] font-bold leading-[1.2] mb-3 text-[var(--white)] group-hover:text-[var(--sungold)] transition-colors">
          {project.name}
        </h3>
        <p className="font-body text-[13px] leading-[1.7] mb-6 text-[var(--muted)] line-clamp-2 group-hover:text-[var(--subtle)] transition-colors">
          {project.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="flex gap-2 flex-wrap">
            {(project.tags || []).slice(0, 2).map((tag, j) => (
              <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                {tag}
              </Badge>
            ))}
          </div>
          <ArrowUpRight
            size={18}
            className="text-[var(--sungold)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </div>
  );
};

const Projects = ({ featuredOnly = false }) => {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);
  const { data, loading, error, refetch } = useRealtimeQuery('projects', fetchProjects);
  const projects = Array.isArray(data) ? data : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const featured = projects.filter(p => p.featured);
  const displayProjects = featuredOnly
    ? (featured.length > 0 ? featured.slice(0, 3) : projects.slice(0, 3))
    : (filter === 'all'
      ? (featured.length > 0 ? featured : projects.slice(0, 3))
      : projects.filter((p) => p.type === filter));

  const filters = [
    { label: 'Featured', value: 'all' },
    { label: 'Development', value: 'dev' },
    { label: 'Design', value: 'design' }
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-12 md:py-20 border-b border-[var(--border)]">
      <div className="max-w-[1160px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-px bg-[var(--sungold)]" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
            {featuredOnly ? '02 — Featured Work' : '02 — Selected Work'}
          </span>
        </div>
        <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
          {featuredOnly ? 'Featured Projects' : 'Selected Projects'}
        </h2>
        <p className="font-body text-[15px] leading-[1.7] mb-8 max-w-[520px] text-[var(--muted)]">
          A selection of products and experiments I&apos;ve built — from social platforms to creative coding explorations.
        </p>
        {!featuredOnly && (
          <div className="flex gap-2 mb-10" role="group" aria-label="Filter by type">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
                style={{
                  background: filter === f.value ? 'rgba(232,160,32,0.15)' : 'transparent',
                  color: filter === f.value ? 'var(--sungold)' : 'var(--subtle)',
                  border: `1px solid ${filter === f.value ? 'rgba(232,160,32,0.3)' : 'var(--border)'}`
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
        {loading && projects.length === 0 ? (
          <ProjectsSkeleton count={3} />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, i) => (
            <ProjectCard key={project.slug || project.id} project={project} index={i} visible={visible} />
          ))}
        </div>
        )}
        {featuredOnly && (
          <div className="mt-10 flex justify-start">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] border border-[var(--border-md)] text-[var(--white)] no-underline transition-all duration-200 btn-ghost hover:border-[var(--border-hi)] hover:bg-[var(--elevated)]"
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
