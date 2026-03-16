import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FileText, Briefcase, BookOpen } from 'lucide-react';
import { fetchBlogPosts, fetchProjects, fetchCourses } from '../services/api';
import SectionKicker from '../components/portfolio/SectionKicker';
import { usePageMeta } from '../hooks/usePageMeta';
import { track } from '../services/analytics';
import { Skeleton } from '../components/ui/skeleton';

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
      fetchBlogPosts().catch(() => []),
      fetchProjects().catch(() => []),
      fetchCourses().catch(() => []),
    ]).then(([p, pr, c]) => {
      if (!cancelled) {
        setPosts(Array.isArray(p) ? p : []);
        setProjects(Array.isArray(pr) ? pr : []);
        setCourses(Array.isArray(c) ? c : []);
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
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 border-b border-[var(--border)] overflow-hidden">
        {/* Nebula Glow Backdrop */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[var(--nebula)] opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[55%] bg-[var(--stardust)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionKicker label="Search" accent="stardust" />
            <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-[var(--white)] max-w-[800px]" style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>
              Search
            </h1>
            <form onSubmit={handleSubmit} className="max-w-xl" role="search" aria-label="Site search">
              <label htmlFor="search-query" className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--subtle)] block mb-2">
                Search blog, work, courses
              </label>
              <div className="flex gap-2">
                <input
                  id="search-query"
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
          </motion.div>
        </div>

        {/* Technical Scanline effect */}
        <motion.div 
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--stardust)]/10 to-transparent pointer-events-none z-0"
        />
      </section>

      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Subtle grid accent */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : !searchTerm ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 border border-[var(--border-md)] flex items-center justify-center">
                <Search size={20} className="text-[var(--stardust)] opacity-60" />
              </div>
              <p className="font-body text-[15px] text-[var(--muted)]">Enter a term above to search blog posts, projects, and courses.</p>
            </div>
          ) : totalCount === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 border border-[var(--border-md)] flex items-center justify-center relative">
                <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--stardust)] opacity-40" />
                <Search size={20} className="text-[var(--muted)] opacity-40" />
              </div>
              <p className="font-body text-[15px] text-[var(--muted)]">No results for &ldquo;{searchTerm}&rdquo;. Try another term.</p>
            </div>
          ) : (
            <motion.div
              className="space-y-12"
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
            >
              {results.posts.length > 0 && (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <h2 className="flex items-center gap-3 font-display text-[18px] font-bold text-[var(--white)] mb-4">
                    <FileText size={18} className="text-[var(--sungold)]" />
                    Blog
                    <span className="font-mono text-[11px] font-normal text-[var(--muted)]">({results.posts.length})</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </h2>
                  <ul className="list-none p-0 m-0 space-y-3">
                    {results.posts.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/writing/${p.slug || p.id}`}
                          className="block p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--sungold)]/30 hover:bg-[var(--elevated)] transition-all duration-200 no-underline relative group"
                        >
                          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--sungold)] opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                          <span className="font-display text-[15px] font-semibold text-[var(--white)] group-hover:text-[var(--sungold)] transition-colors">{p.title}</span>
                          {p.excerpt && <p className="font-body text-[13px] text-[var(--muted)] mt-1 line-clamp-2">{p.excerpt}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {results.projects.length > 0 && (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <h2 className="flex items-center gap-3 font-display text-[18px] font-bold text-[var(--white)] mb-4">
                    <Briefcase size={18} className="text-[var(--sungold)]" />
                    Work
                    <span className="font-mono text-[11px] font-normal text-[var(--muted)]">({results.projects.length})</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </h2>
                  <ul className="list-none p-0 m-0 space-y-3">
                    {results.projects.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/work/${p.slug}`}
                          className="block p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--sungold)]/30 hover:bg-[var(--elevated)] transition-all duration-200 no-underline relative group"
                        >
                          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--sungold)] opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                          <span className="font-display text-[15px] font-semibold text-[var(--white)] group-hover:text-[var(--sungold)] transition-colors">{p.name}</span>
                          {p.description && <p className="font-body text-[13px] text-[var(--muted)] mt-1 line-clamp-2">{p.description}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {results.courses.length > 0 && (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <h2 className="flex items-center gap-3 font-display text-[18px] font-bold text-[var(--white)] mb-4">
                    <BookOpen size={18} className="text-[var(--sungold)]" />
                    Courses
                    <span className="font-mono text-[11px] font-normal text-[var(--muted)]">({results.courses.length})</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </h2>
                  <ul className="list-none p-0 m-0 space-y-3">
                    {results.courses.map((p) => (
                      <li key={p.id}>
                        <Link
                          to="/teach"
                          className="block p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--sungold)]/30 hover:bg-[var(--elevated)] transition-all duration-200 no-underline relative group"
                        >
                          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--sungold)] opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                          <span className="font-display text-[15px] font-semibold text-[var(--white)] group-hover:text-[var(--sungold)] transition-colors">{p.name}</span>
                          {p.description && <p className="font-body text-[13px] text-[var(--muted)] mt-1 line-clamp-2">{p.description}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
