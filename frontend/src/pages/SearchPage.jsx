import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchBlogPosts, fetchProjects, fetchCourses } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildStaticPageMeta } from '../lib/routeMeta';

function matchQuery(str, q) {
  if (!str || typeof str !== 'string') return false;
  return str.toLowerCase().includes(q.toLowerCase());
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
    return () => {
      cancelled = true;
    };
  }, []);

  const searchTerm = (query || '').trim();
  const results = useMemo(() => {
    if (!searchTerm) return { posts: [], projects: [], courses: [] };
    return {
      posts: posts.filter(
        (p) =>
          matchQuery(p.title, searchTerm) ||
          matchQuery(p.excerpt, searchTerm) ||
          matchQuery(p.category, searchTerm)
      ),
      projects: projects.filter(
        (p) =>
          matchQuery(p.name, searchTerm) ||
          matchQuery(p.description, searchTerm) ||
          matchQuery(p.category, searchTerm)
      ),
      courses: courses.filter(
        (p) =>
          matchQuery(p.name, searchTerm) ||
          matchQuery(p.description, searchTerm)
      ),
    };
  }, [searchTerm, posts, projects, courses]);

  const totalCount = results.posts.length + results.projects.length + results.courses.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = query.trim();
    setSearchParams(v ? { q: v } : {});
  };

  usePageMeta(buildStaticPageMeta('/search'));

  return (
    <div className="page-content">
      {/* Page Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 40px' }}>
        <div className={`reveal ${revealed ? 'in' : ''}`}>
          <div className="hero-kicker">
            <span className="hero-kicker-dot"></span>
            Global Index Search
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9 }}>
            The <em>Search</em>
          </h1>
          <div className="hero-rule" style={{ margin: '24px 0 20px' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">DON_GENIUS — QUERY</span>
            <div className="hero-rule-line"></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', border: '1px solid var(--ink)', maxWidth: '520px' }}>
            <input
              type="text"
              placeholder="Query projects, journal, or courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--ink)',
              }}
              required
            />
            <button
              type="submit"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0 24px',
                background: 'var(--ink)',
                color: 'var(--cream)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* Results panel */}
      <section style={{ padding: '48px 0 80px' }}>
        {loading ? (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
            Analyzing Database Registry...
          </div>
        ) : !searchTerm ? (
          <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
            Enter a search term above to analyze records.
          </div>
        ) : totalCount === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
            No visual, academic, or software logs matched query term "{searchTerm}".
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {results.projects.length > 0 && (
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    borderBottom: 'var(--rule-thin)',
                    paddingBottom: '8px',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    color: 'var(--red)',
                  }}
                >
                  Selected Work ({results.projects.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {results.projects.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      onClick={() => navigate(`/work/${p.slug || p.id}`)}
                      style={{ border: '1px solid var(--ink)', padding: '16px', background: 'var(--surface)', cursor: 'pointer' }}
                    >
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 'bold' }}>{p.name}</h4>
                      <p className="hero-desc" style={{ fontSize: '12px', marginTop: '4px' }}>{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.posts.length > 0 && (
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    borderBottom: 'var(--rule-thin)',
                    paddingBottom: '8px',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    color: 'var(--red)',
                  }}
                >
                  Journal Entries ({results.posts.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {results.posts.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      onClick={() => navigate(`/writing/${p.slug || p.id}`)}
                      style={{ border: '1px solid var(--ink)', padding: '16px', background: 'var(--surface)', cursor: 'pointer' }}
                    >
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 'bold' }}>{p.title}</h4>
                      <p className="hero-desc" style={{ fontSize: '12px', marginTop: '4px' }}>{p.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.courses.length > 0 && (
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    borderBottom: 'var(--rule-thin)',
                    paddingBottom: '8px',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    color: 'var(--red)',
                  }}
                >
                  Interactive Courses ({results.courses.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {results.courses.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      onClick={() => navigate('/teach')}
                      style={{ border: '1px solid var(--ink)', padding: '16px', background: 'var(--surface)', cursor: 'pointer' }}
                    >
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 'bold' }}>{p.name}</h4>
                      <p className="hero-desc" style={{ fontSize: '12px', marginTop: '4px' }}>{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
