import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { fetchProjects } from '../services/api';
import Badge from '../components/portfolio/Badge';
import SectionKicker from '../components/portfolio/SectionKicker';
import FilterButtons from '../components/portfolio/FilterButtons';
import SortSelect from '../components/portfolio/SortSelect';
import { BADGE_VARIANTS } from '../constants';
import { byString, byDate, applySort } from '../lib/sortHelpers';
import { paginate } from '../lib/paginate';
import ListPagination from '../components/portfolio/ListPagination';
import { usePageMeta } from '../hooks/usePageMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { ProjectsSkeleton } from '../components/portfolio/SkeletonLayouts';
import OptimizedImage from '../components/portfolio/OptimizedImage';

const getHeroUrl = (project) => {
  const first = project.screenshots?.[0];
  return first ? (typeof first === 'string' ? first : first.url) : null;
};

const ProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const href = `/work/${project.slug || project.id}`;
  const heroUrl = getHeroUrl(project);

  return (
    <Link
      to={href}
      className="group relative block cursor-pointer bg-[var(--elevated)] border border-[var(--border)] overflow-hidden rounded-none transition-all duration-300 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] hover:border-[var(--sungold)]/30"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Technical hover line */}
      <div className="absolute left-0 top-0 w-0.5 h-0 bg-[var(--sungold)] transition-all duration-300 group-hover:h-full z-20" />

      <div className="h-[200px] flex items-center justify-center relative overflow-hidden bg-[var(--surface)]">
        {heroUrl ? (
          <OptimizedImage
            src={heroUrl}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)' }}
          />
        )}
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
    </Link>
  );
};

const FeaturedSpotlight = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const problem = project.problem || '';
  const excerpt = problem.length > 120 ? problem.slice(0, 120) + '…' : problem;
  const heroUrl = getHeroUrl(project);
  const href = `/work/${project.slug || project.id}`;

  return (
    <div
      className="relative py-6 md:py-10 border-b border-[var(--border)] overflow-hidden group/section"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[var(--sungold)] opacity-[0.02] blur-[140px] rounded-full pointer-events-none transition-opacity duration-700 group-hover/section:opacity-[0.04]" />

      <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8">
        <div 
          className="relative grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-0 border border-[var(--border-md)] bg-[var(--surface)]/50 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-500 hover:border-[var(--sungold)]/40 hover:bg-[var(--elevated)]/60 group/card"
          onClick={() => navigate(href)}
        >
          {/* Technical corner accents */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--sungold)] opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-x-1 -translate-y-1" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--sungold)] opacity-0 group-hover/card:opacity-100 transition-all duration-500 -translate-x-1 translate-y-1" />

          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="gold">◆ Featured Case Study</Badge>
              <div className="h-px w-12 bg-[var(--border-hi)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--stardust)]">
                {project.category}
              </span>
            </div>

            <h2 className="font-display font-extrabold leading-[1.05] tracking-tight mb-5 text-[var(--white)] group-hover/card:text-[var(--sungold)] transition-colors duration-300" style={{ fontSize: 'clamp(28px, 4.5vw, 48px)' }}>
              {project.name}
            </h2>
            
            <p className="font-body text-[16px] leading-[1.65] mb-6 text-[var(--muted)] group-hover/card:text-[var(--subtle)] transition-colors line-clamp-3">
              {project.description}
            </p>
            
            {excerpt && (
              <p className="font-body text-[13px] leading-[1.6] mb-8 text-[var(--dim)] italic border-l-2 border-[var(--border-md)] pl-4">
                "{excerpt}"
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {(project.tags || []).slice(0, 4).map((tag, j) => (
                <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                  {tag}
                </Badge>
              ))}
            </div>

            <span className="inline-flex items-center gap-3 font-display text-[11px] font-bold tracking-[0.2em] text-[var(--sungold)] uppercase group/btn">
              Explore Depth
              <ExternalLink size={14} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
            </span>
          </div>

          <div className="min-h-[260px] lg:min-h-full relative overflow-hidden bg-[var(--elevated)] border-l border-[var(--border)]">
            {heroUrl ? (
              <OptimizedImage
                src={heroUrl}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface)] to-[var(--deep)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/40 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

const WORK_SORT_OPTIONS = [
  { value: 'year-desc', label: 'Newest first' },
  { value: 'year-asc', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

const WORK_PAGE_SIZE = 9;

const WorkPage = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('year-desc');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, loading, error } = useRealtimeQuery('projects', fetchProjects);
  const projects = Array.isArray(data) ? data : [];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.type === filter);

  const sortedProjects = useMemo(() => {
    const comp = sortBy === 'year-desc' ? byDate('year', 'desc')
      : sortBy === 'year-asc' ? byDate('year', 'asc')
      : sortBy === 'name-asc' ? byString('name', 'asc')
      : byString('name', 'desc');
    return applySort(filteredProjects, comp);
  }, [filteredProjects, sortBy]);

  const { items: paginatedProjects, totalPages, start, end, total } = useMemo(
    () => paginate(sortedProjects, page, WORK_PAGE_SIZE),
    [sortedProjects, page]
  );

  const featuredForSpotlight = projects.find(p => p.featured);
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Dev', value: 'dev' },
    { label: 'Design', value: 'design' },
  ];

  usePageMeta({
    title: 'Selected Work',
    description: 'A collection of products and experiments — from social platforms to creative coding explorations.',
    canonical: '/work',
  });

  return (
    <>
      <section className="relative pt-12 pb-8 md:pt-28 md:pb-20 border-b border-[var(--border)] overflow-hidden">
        {/* Nebula Glow Backdrop */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[var(--nebula)] opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[55%] bg-[var(--sungold)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionKicker label="Projects" accent="sungold" />
            <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-[var(--white)] max-w-[800px]" style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>
              Selected Work
            </h1>
            <p className="font-body text-[17px] leading-[1.7] max-w-[600px] text-[var(--muted)]">
              A collection of architectural products, creative experiences, and technical experiments—fusing engineering precision with African design identity.
            </p>
          </motion.div>
        </div>

        {/* Technical Scanline effect */}
        <motion.div 
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sungold)]/10 to-transparent pointer-events-none z-0"
        />
      </section>

      <section className="py-12 md:py-16">
        {featuredForSpotlight && (
          <div className="mb-12">
            <FeaturedSpotlight project={featuredForSpotlight} />
          </div>
        )}

        <div className="max-w-[1160px] mx-auto px-4 md:px-8">

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <FilterButtons options={filterOptions} value={filter} onChange={(v) => { setFilter(v); setPage(1); }} label="Filter" />
            <SortSelect options={WORK_SORT_OPTIONS} value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} label="Sort" />
          </div>

          {loading && projects.length === 0 ? (
            <ProjectsSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project.slug || project.id} project={project} />
              ))}
            </div>
          )}

          {!loading && sortedProjects.length === 0 && (
            <div className="font-body text-[15px] py-12 text-center text-[var(--muted)]">
              No projects in this category yet.
            </div>
          )}

          {!loading && sortedProjects.length > 0 && (
            <ListPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              range={{ start, end, total }}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default WorkPage;
