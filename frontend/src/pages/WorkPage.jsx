import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ExternalLink, Search } from 'lucide-react';
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
import { DEFAULT_OG_IMAGE_PATH } from '../lib/siteConfig';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { ProjectsSkeleton } from '../components/portfolio/SkeletonLayouts';
import OptimizedImage from '../components/portfolio/OptimizedImage';
import WorkProjectCard from '../components/portfolio/WorkProjectCard';

const getHeroUrl = (project) => {
  const first = project.screenshots?.[0];
  return first ? (typeof first === 'string' ? first : first.url) : null;
};

const FeaturedSpotlight = ({ project }) => {
  const navigate = useNavigate();
  const problem = project.problem || '';
  const excerpt = problem.length > 120 ? problem.slice(0, 120) + '…' : problem;
  const heroUrl = getHeroUrl(project);
  const href = `/work/${project.slug || project.id}`;

  return (
    <div className="relative py-6 md:py-10 border-b border-[var(--border)] overflow-hidden group/section">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[var(--work-accent)] opacity-[0.04] blur-[140px] rounded-full pointer-events-none transition-opacity duration-700 group-hover/section:opacity-[0.07]" />

      <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8">
        <div
          className="relative grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-0 border border-[var(--border-md)] bg-[var(--surface)]/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-500 hover:border-[var(--work-accent-border)] hover:bg-[var(--elevated)]/70 group/card"
          onClick={() => navigate(href)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(href);
            }
          }}
          role="link"
          tabIndex={0}
        >
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--work-accent)] opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--work-accent)] opacity-0 group-hover/card:opacity-100 transition-all duration-500 -translate-x-px translate-y-px" />

          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="font-mono text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-1 bg-[var(--work-accent)] text-[var(--work-accent-on)]">
                Featured
              </span>
              <div className="h-px w-10 bg-[var(--border-hi)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--stardust)]">
                {project.category}
              </span>
            </div>

            <h2
              className="font-display font-extrabold leading-[1.05] tracking-tight mb-5 text-[var(--white)] group-hover/card:text-[var(--work-accent)] transition-colors duration-300"
              style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}
            >
              {project.name}
            </h2>

            <p className="font-body text-[15px] leading-[1.65] mb-6 text-[var(--muted)] group-hover/card:text-[var(--subtle)] transition-colors line-clamp-3">
              {project.description}
            </p>

            {excerpt && (
              <p className="font-body text-[13px] leading-[1.6] mb-8 text-[var(--dim)] italic border-l-2 border-[var(--work-accent-border)] pl-4">
                &ldquo;{excerpt}&rdquo;
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {(project.tags || []).slice(0, 4).map((tag, j) => (
                <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                  {tag}
                </Badge>
              ))}
            </div>

            <span className="inline-flex items-center gap-3 font-display text-[11px] font-bold tracking-[0.2em] text-[var(--work-accent)] uppercase group/btn">
              Explore case study
              <ExternalLink size={14} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
            </span>
          </div>

          <div className="min-h-[240px] lg:min-h-full relative overflow-hidden bg-[var(--elevated)] border-t lg:border-t-0 lg:border-l border-[var(--border)]">
            {heroUrl ? (
              <OptimizedImage
                src={heroUrl}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface)] to-[var(--deep)] flex items-center justify-center">
                <span className="font-work-pixel text-[clamp(2rem,5vw,3rem)] text-[var(--muted)]" aria-hidden>
                  {(project.name || '?').slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/50 to-transparent" />
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
  const [searchQuery, setSearchQuery] = useState('');
  const { data, loading } = useRealtimeQuery('projects', fetchProjects);
  const projects = Array.isArray(data) ? data : [];

  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => p.type === filter);

  const searchFiltered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredProjects;
    return filteredProjects.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.label || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => String(t).toLowerCase().includes(q))
    );
  }, [filteredProjects, searchQuery]);

  const sortedProjects = useMemo(() => {
    const comp =
      sortBy === 'year-desc'
        ? byDate('year', 'desc')
        : sortBy === 'year-asc'
          ? byDate('year', 'asc')
          : sortBy === 'name-asc'
            ? byString('name', 'asc')
            : byString('name', 'desc');
    return applySort(searchFiltered, comp);
  }, [searchFiltered, sortBy]);

  const { items: paginatedProjects, totalPages, start, end, total } = useMemo(
    () => paginate(sortedProjects, page, WORK_PAGE_SIZE),
    [sortedProjects, page]
  );

  const featuredForSpotlight = projects.find((p) => p.featured);
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Dev', value: 'dev' },
    { label: 'Design', value: 'design' },
  ];

  const projectCountLabel = String(projects.length).padStart(2, '0');

  usePageMeta({
    title: 'Selected Work',
    description:
      'A collection of products and experiments — from social platforms to creative coding explorations.',
    image: DEFAULT_OG_IMAGE_PATH,
    canonical: '/work',
  });

  return (
    <div className="work-ui-scope">
      <section className="relative pt-10 pb-10 md:pt-24 md:pb-16 border-b border-[var(--border)] overflow-hidden work-v2-hero-grid">
        <div className="absolute top-[-15%] right-[-8%] w-[40%] h-[50%] bg-[var(--work-accent)] opacity-[0.06] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12"
          >
            <div className="flex-1 min-w-0">
              <SectionKicker label="Projects" accent="spectrum" />
              <h1
                className="font-work-pixel text-[var(--white)] leading-[0.95] mb-6 uppercase"
                style={{ fontSize: 'clamp(2rem, 8vw, 4.25rem)' }}
              >
                Selected_Work
              </h1>
              <p className="font-body text-[16px] md:text-[17px] leading-[1.7] max-w-[560px] text-[var(--muted)]">
                Architectural products and experiments—engineering precision woven with African design identity. Grid-native
                layout, sharp type, spectrum accent.
              </p>
            </div>
            <div className="shrink-0 w-full max-w-[200px] border border-[var(--border-md)] bg-[var(--surface)]/80 p-5 md:p-6">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--subtle)] mb-2">Index</div>
              <div className="font-work-pixel text-[2.5rem] md:text-[3rem] leading-none text-[var(--white)]">
                {projectCountLabel}
              </div>
              <div className="font-mono text-[11px] text-[var(--work-accent)] mt-2 tracking-wide">Projects catalogued</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--work-accent)]/25 to-transparent pointer-events-none z-0"
        />
      </section>

      <section className="py-10 md:py-14">
        {featuredForSpotlight && (
          <div className="mb-12 md:mb-16">
            <FeaturedSpotlight project={featuredForSpotlight} />
          </div>
        )}

        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-4 mb-8 p-4 border border-[var(--border-md)] bg-[var(--surface)]/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <FilterButtons
                options={filterOptions}
                value={filter}
                onChange={(v) => {
                  setFilter(v);
                  setPage(1);
                }}
                label="Filter"
                variant="workV2"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 lg:max-w-md lg:ml-auto">
                <label className="relative flex-1 min-w-0 flex items-center gap-2 border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 focus-within:border-[var(--work-accent-border)] transition-colors">
                  <Search size={16} className="text-[var(--subtle)] shrink-0" aria-hidden />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search projects"
                    className="w-full min-w-0 bg-transparent border-0 outline-none font-body text-[14px] text-[var(--white)] placeholder:text-[var(--dim)]"
                    autoComplete="off"
                  />
                </label>
                <SortSelect
                  options={WORK_SORT_OPTIONS}
                  value={sortBy}
                  onChange={(v) => {
                    setSortBy(v);
                    setPage(1);
                  }}
                  label="Sort"
                  variant="workV2"
                />
              </div>
            </div>
          </div>

          {loading && projects.length === 0 ? (
            <ProjectsSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {paginatedProjects.map((project) => (
                <WorkProjectCard key={project.slug || project.id} project={project} />
              ))}
            </div>
          )}

          {!loading && sortedProjects.length === 0 && (
            <div className="font-body text-[15px] py-14 text-center text-[var(--muted)] border border-dashed border-[var(--border-md)]">
              No projects match this view. Try another filter or search term.
            </div>
          )}

          {!loading && sortedProjects.length > 0 && (
            <ListPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              range={{ start, end, total }}
              variant="workV2"
            />
          )}
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-10 md:py-12 bg-[var(--surface)]/35">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="font-work-pixel text-[clamp(1rem,2.5vw,1.35rem)] text-[var(--white)] uppercase tracking-wide max-w-[320px] leading-snug">
            Ready_to_build?
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center font-mono text-[11px] font-bold tracking-[0.12em] uppercase px-6 py-3 bg-[var(--work-accent)] text-[var(--work-accent-on)] no-underline border border-[var(--work-accent)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
            >
              Start a conversation
            </Link>
            <Link
              to="/cv"
              className="inline-flex items-center justify-center font-mono text-[11px] font-bold tracking-[0.12em] uppercase px-6 py-3 bg-transparent text-[var(--white)] no-underline border border-[var(--border-md)] transition-colors hover:border-[var(--work-accent-border)] hover:text-[var(--work-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
            >
              View CV
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkPage;
