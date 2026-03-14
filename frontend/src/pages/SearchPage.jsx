import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FileText, Briefcase, BookOpen } from 'lucide-react';
import { fetchBlogPosts, fetchProjects, fetchCourses } from '../services/api';
import { blogPosts as fbPosts } from '../data/mock';
import { projects as fbProjects } from '../data/mock';
import { courses as fbCourses } from '../data/mock';
import SectionKicker from '../components/portfolio/SectionKicker';
import { usePageMeta } from '../hooks/usePageMeta';
import { track } from '../services/analytics';

function matchQuery(str, q) {
  if (!str || typeof str !== 'string') return false;
  return str.toLowerCase().includes(q.toLowerCase());
}

function matchQueryList(list, q) {
  if (!Array.isArray(list)) return false;
  return list.some((item) => matchQuery(typeof item === 'string' ? item : item?.name ?? item?.title, q));
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchBlogPosts().catch(() => fbPosts),
      fetchProjects().catch(() => fbProjects),
      fetchCourses().catch(() => fbCourses),
    ]).then(([p, pr, c]) => {
      if (!cancelled) {
        setPosts(Array.isArray(p) ? p : fbPosts);
        setProjects(Array.isArray(pr) ? pr : fbProjects);
        setCourses(Array.isArray(c) ? c : fbCourses);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const searchTerm = (query || '').trim();
  const results = useMemo(() => {
    if (!searchTerm) return { posts: [], projects: [], courses: [] };
    return {
      posts: posts.filter(
        (p) =>
          matchQuery(p.title, searchTerm) ||
          matchQuery(p.excerpt, searchTerm) ||
          matchQuery(p.slug, searchTerm) ||
          matchQueryList(p.tags, searchTerm) ||
          matchQuery(p.category, searchTerm)
      ),
      projects: projects.filter(
        (p) =>
          matchQuery(p.name, searchTerm) ||
          matchQuery(p.description, searchTerm) ||
          matchQuery(p.slug, searchTerm) ||
          matchQuery(p.label, searchTerm) ||
          matchQuery(p.category, searchTerm)
      ),
      courses: courses.filter(
        (p) =>
          matchQuery(p.name, searchTerm) ||
          matchQuery(p.description, searchTerm) ||
          matchQuery(p.slug || p.id, searchTerm)
      ),
    };
  }, [searchTerm, posts, projects, courses]);

  const totalCount = results.posts.length + results.projects.length + results.courses.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = (e.target?.query?.value || query).trim();
    setSearchParams(v ? { q: v } : {});
    if (v) track('search', { query: v });
  };

  usePageMeta({
    title: 'Search',
    description: 'Search blog posts, projects, and courses.',
    canonical: '/search',
  });

  return (
    <div className="min-h-[60vh]">
      <section className="pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <SectionKicker label="Search" accent="stardust" />
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            Search
          </h1>
          <form onSubmit={handleSubmit} className="max-w-xl">
            <div className="flex gap-2">
              <input
                type="search"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blog, work, courses…"
                className="flex-1 bg-[var(--elevated)] border border-[var(--border-md)] px-4 py-3 font-body text-[14px] text-[var(--white)] placeholder:text-[var(--subtle)] outline-none focus:border-[var(--stardust)]"
                aria-label="Search"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[var(--stardust)] text-[var(--void)] font-display font-semibold text-[13px] border-0 cursor-pointer hover:opacity-90 transition-opacity"
                aria-label="Submit search"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          {loading ? (
            <p className="font-mono text-[13px] text-[var(--muted)]">Loading…</p>
          ) : !searchTerm ? (
            <p className="font-body text-[15px] text-[var(--muted)]">Enter a term above to search blog posts, projects, and courses.</p>
          ) : totalCount === 0 ? (
            <p className="font-body text-[15px] text-[var(--muted)]">No results for “{searchTerm}”. Try another term.</p>
          ) : (
            <div className="space-y-12">
              {results.posts.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 font-display text-[18px] font-bold text-[var(--white)] mb-4">
                    <FileText size={18} className="text-[var(--sungold)]" />
                    Blog ({results.posts.length})
                  </h2>
                  <ul className="list-none p-0 m-0 space-y-3">
                    {results.posts.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/writing/${p.slug || p.id}`}
                          className="block p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-md)] transition-colors no-underline"
                        >
                          <span className="font-display text-[15px] font-semibold text-[var(--white)]">{p.title}</span>
                          {p.excerpt && <p className="font-body text-[13px] text-[var(--muted)] mt-1 line-clamp-2">{p.excerpt}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.projects.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 font-display text-[18px] font-bold text-[var(--white)] mb-4">
                    <Briefcase size={18} className="text-[var(--sungold)]" />
                    Work ({results.projects.length})
                  </h2>
                  <ul className="list-none p-0 m-0 space-y-3">
                    {results.projects.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/work/${p.slug}`}
                          className="block p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-md)] transition-colors no-underline"
                        >
                          <span className="font-display text-[15px] font-semibold text-[var(--white)]">{p.name}</span>
                          {p.description && <p className="font-body text-[13px] text-[var(--muted)] mt-1 line-clamp-2">{p.description}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.courses.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 font-display text-[18px] font-bold text-[var(--white)] mb-4">
                    <BookOpen size={18} className="text-[var(--sungold)]" />
                    Courses ({results.courses.length})
                  </h2>
                  <ul className="list-none p-0 m-0 space-y-3">
                    {results.courses.map((p) => (
                      <li key={p.id}>
                        <Link
                          to="/teach"
                          className="block p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-md)] transition-colors no-underline"
                        >
                          <span className="font-display text-[15px] font-semibold text-[var(--white)]">{p.name}</span>
                          {p.description && <p className="font-body text-[13px] text-[var(--muted)] mt-1 line-clamp-2">{p.description}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
