import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchProjects } from '../services/api';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { projects as mockFallback } from '../data/mock';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildStaticPageMeta } from '../lib/routeMeta';
import WorkProjectCard from '../components/portfolio/WorkProjectCard';
import ListPagination from '../components/portfolio/ListPagination';
import { paginate } from '../lib/paginate';

const WORK_PAGE_SIZE = 9;

const WorkPage = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('year-desc');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  const { data } = useRealtimeQuery('projects', fetchProjects, mockFallback);
  const projects = Array.isArray(data) && data.length > 0 ? data : mockFallback;

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  usePageMeta(buildStaticPageMeta('/work'));

  // Filtering
  const filteredProjects = useMemo(() => {
    const list = filter === 'all' ? projects : projects.filter((p) => p.type === filter);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        (p.name || p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }, [projects, filter, searchQuery]);

  // Sorting
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    return list.sort((a, b) => {
      if (sortBy === 'year-desc') {
        return (b.year || 0) - (a.year || 0);
      }
      if (sortBy === 'year-asc') {
        return (a.year || 0) - (b.year || 0);
      }
      const nameA = (a.name || a.title || '').toLowerCase();
      const nameB = (b.name || b.title || '').toLowerCase();
      if (sortBy === 'name-asc') {
        return nameA.localeCompare(nameB);
      }
      return nameB.localeCompare(nameA);
    });
  }, [filteredProjects, sortBy]);

  // Pagination
  const { items: paginatedProjects, totalPages, start, end, total } = useMemo(
    () => paginate(sortedProjects, page, WORK_PAGE_SIZE),
    [sortedProjects, page]
  );

  const filterOptions = [
    { label: 'All Projects', value: 'all' },
    { label: 'Development', value: 'dev' },
    { label: 'Design', value: 'design' },
  ];

  return (
    <div className="page-content">
      {/* Editorial Page Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 40px' }}>
        <div className={`reveal ${revealed ? 'in' : ''}`}>
          <div className="hero-kicker">
            <span className="hero-kicker-dot"></span>
            Archive &amp; Index
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9 }}>
            Selected <em>Work</em>
          </h1>
          <div className="hero-rule" style={{ margin: '24px 0 20px' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">DON_GENIUS — PROJECTS</span>
            <div className="hero-rule-line"></div>
          </div>
          <p className="hero-desc" style={{ maxWidth: '620px' }}>
            A curated record of production-grade software applications, generative experiments, and digital visual systems built since 2018.
          </p>
        </div>
      </section>

      {/* stark editorial controls */}
      <section style={{ borderBottom: 'var(--rule)', padding: '24px 0' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* filter tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilter(opt.value);
                  setPage(1);
                }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  border: '1px solid var(--ink)',
                  background: filter === opt.value ? 'var(--ink)' : 'transparent',
                  color: filter === opt.value ? 'var(--cream)' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* search & sort controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid var(--ink)',
                padding: '6px 12px',
                background: 'transparent',
              }}
            >
              <Search size={12} style={{ color: 'var(--ink)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ink)',
                  width: '140px',
                }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '6px 12px',
                border: '1px solid var(--ink)',
                background: 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="year-desc">Newest First</option>
              <option value="year-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>
      </section>

      {/* stark collection grid */}
      <section style={{ padding: '48px 0 64px' }}>
        {sortedProjects.length === 0 ? (
          <div
            style={{
              padding: '60px 0',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--muted)',
              border: '1px dashed var(--ink)',
            }}
          >
            No archives match the specified parameters.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProjects.map((project, idx) => (
                <WorkProjectCard key={project.id || idx} project={project} />
              ))}
            </div>

            <div style={{ marginTop: '48px' }}>
              <ListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                range={{ start, end, total }}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default WorkPage;
