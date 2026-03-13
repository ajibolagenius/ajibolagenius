import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { fetchProjects } from '../services/api';
import { projects as fallbackProjects } from '../data/mock';
import Badge from '../components/portfolio/Badge';
import SectionKicker from '../components/portfolio/SectionKicker';
import FilterButtons from '../components/portfolio/FilterButtons';
import { BADGE_VARIANTS } from '../constants';
import { usePageMeta } from '../hooks/usePageMeta';

const ProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer bg-[var(--elevated)] border overflow-hidden rounded-none transition-all duration-300"
      style={{
        borderColor: hovered ? 'rgba(232,160,32,0.25)' : 'var(--border)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-sharp-lg), 0 0 0 1px rgba(232,160,32,0.2)' : 'none'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/work/${project.slug || project.id}`)}
    >
      <div
        className="h-[200px] flex items-center justify-center relative overflow-hidden bg-[var(--surface)]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)' }}
      >
        <span className="font-display text-[13px] tracking-[0.15em] uppercase text-[var(--subtle)]">
          {project.label}
        </span>
        {project.featured && (
          <span className="absolute top-4 right-4">
            <Badge variant="gold">◆ Featured</Badge>
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--sungold)]">
          {project.category}
        </div>
        <h3 className="font-display text-[20px] font-bold leading-[1.2] mb-2 text-[var(--white)]">
          {project.name}
        </h3>
        <p className="font-body text-[13px] leading-[1.6] mb-5 text-[var(--muted)]">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag, j) => (
              <span
                key={j}
                className="font-mono text-[10px] px-2 py-[3px] bg-[var(--overlay)] text-[var(--subtle)] border border-[var(--border)] rounded-none"
              >
                {tag}
              </span>
            ))}
          </div>
          <ArrowUpRight
            size={18}
            className="transition-transform duration-200 text-[var(--sungold)]"
            style={{ transform: hovered ? 'translate(3px, -3px)' : 'translate(0, 0)' }}
          />
        </div>
      </div>
    </div>
  );
};

const FeaturedSpotlight = ({ project, onView }) => {
  const [hovered, setHovered] = useState(false);
  const problem = project.problem || '';
  const excerpt = problem.length > 120 ? problem.slice(0, 120) + '…' : problem;

  return (
    <div
      className="border border-[var(--border)] bg-[var(--surface)] overflow-hidden rounded-none transition-all duration-300 cursor-pointer"
      style={{
        borderColor: hovered ? 'rgba(232,160,32,0.25)' : undefined,
        boxShadow: hovered ? 'var(--shadow-sharp-lg), 0 0 0 1px rgba(232,160,32,0.2)' : 'none'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(project.slug || project.id)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0">
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-[var(--sungold)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
              Featured case study
            </span>
          </div>
          <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            {project.name}
          </h2>
          <p className="font-body text-[15px] leading-[1.7] mb-4 text-[var(--muted)]">
            {project.description}
          </p>
          {excerpt && (
            <p className="font-body text-[13px] leading-[1.6] mb-6 text-[var(--subtle)]">
              {excerpt}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.slice(0, 4).map((tag, j) => (
              <span
                key={j}
                className="font-mono text-[10px] px-2 py-[3px] bg-[var(--overlay)] text-[var(--subtle)] border border-[var(--border)] rounded-none"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] border-0 cursor-pointer transition-all duration-200 bg-[var(--sungold)] text-[var(--void)] w-fit"
            onClick={(e) => {
              e.stopPropagation();
              onView(project.slug || project.id);
            }}
          >
            View case study
            <ExternalLink size={14} />
          </button>
        </div>
        <div
          className="min-h-[240px] lg:min-h-[320px] flex items-center justify-center bg-[var(--elevated)]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)' }}
        >
          <span className="font-display text-[11px] tracking-[0.15em] uppercase text-[var(--subtle)]">
            {project.label}
          </span>
        </div>
      </div>
    </div>
  );
};

const WorkPage = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects()
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => { setProjects(fallbackProjects); setLoading(false); });
  }, []);

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.type === filter);
  const featuredForSpotlight = projects.find(p => p.featured);
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Dev', value: 'dev' },
    { label: 'Design', value: 'design' },
  ];

  const handleViewCaseStudy = (slug) => {
    navigate(`/work/${slug}`);
  };

  usePageMeta({
    title: 'Selected Work',
    description: 'A collection of products and experiments — from social platforms to creative coding explorations.',
    canonical: '/work',
  });

  return (
    <>
      <section className="pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <SectionKicker label="Projects" accent="sungold" />
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Selected Work
          </h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] text-[var(--muted)]">
            A collection of products and experiments — from social platforms to creative coding explorations.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          {featuredForSpotlight && (
            <div className="mb-12">
              <FeaturedSpotlight project={featuredForSpotlight} onView={handleViewCaseStudy} />
            </div>
          )}

          <FilterButtons options={filterOptions} value={filter} onChange={setFilter} label="Filter" />

          {loading ? (
            <div className="font-mono text-[13px] py-20 text-center text-[var(--subtle)]">
              Loading projects…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug || project.id} project={project} />
              ))}
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="font-body text-[15px] py-12 text-center text-[var(--muted)]">
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WorkPage;
