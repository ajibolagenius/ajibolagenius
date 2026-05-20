import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search } from 'lucide-react';
import { fetchBlogPosts, subscribeNewsletter } from '../services/api';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildStaticPageMeta } from '../lib/routeMeta';
import { getBlogReadTimeDisplay } from '../lib/blogReadTime';
import ListPagination from '../components/portfolio/ListPagination';
import { paginate } from '../lib/paginate';
import { DataLoadingSkeleton, DataErrorBanner } from '../components/portfolio/DataStateMessage';

const WRITING_PAGE_SIZE = 9;

const WritingPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [nlEmail, setNlEmail] = useState('');
  const [nlMsg, setNlMsg] = useState('');
  const [nlSubmitting, setNlSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const { data, loading, error, refetch } = useRealtimeQuery('blog_posts', fetchBlogPosts, []);
  const posts = Array.isArray(data) ? data : [];

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  usePageMeta(buildStaticPageMeta('/writing'));

  // Filtering
  const filteredPosts = useMemo(() => {
    const list = filter === 'All' ? posts : posts.filter((p) => (p.category || '').trim() === filter);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }, [posts, filter, searchQuery]);

  // Sorting
  const sortedPosts = useMemo(() => {
    const list = [...filteredPosts];
    return list.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      if (sortBy === 'title-asc') {
        return titleA.localeCompare(titleB);
      }
      return titleB.localeCompare(titleA);
    });
  }, [filteredPosts, sortBy]);

  // Pagination
  const { items: paginatedPosts, totalPages, start, end, total } = useMemo(
    () => paginate(sortedPosts, page, WRITING_PAGE_SIZE),
    [sortedPosts, page]
  );

  const categoryList = useMemo(() => {
    const categories = posts.map((p) => (p.category || '').trim()).filter(Boolean);
    return ['All', ...Array.from(new Set(categories)).sort()];
  }, [posts]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!nlEmail || nlSubmitting) return;
    setNlSubmitting(true);
    setNlMsg('');
    try {
      const res = await subscribeNewsletter(nlEmail.trim());
      setNlMsg(res?.message || "Subscribed! You'll hear from me soon.");
      setNlEmail('');
    } catch {
      setNlMsg('Something went wrong. Try again.');
    } finally {
      setNlSubmitting(false);
    }
    setTimeout(() => setNlMsg(''), 4000);
  };

  return (
    <div className="page-content">
      {/* Editorial Page Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 40px' }}>
        <div className={`reveal ${revealed ? 'in' : ''}`}>
          <div className="hero-kicker">
            <span className="hero-kicker-dot"></span>
            Essays &amp; Logs
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9 }}>
            The <em>Journal</em>
          </h1>
          <div className="hero-rule" style={{ margin: '24px 0 20px' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">DON_GENIUS — WRITING</span>
            <div className="hero-rule-line"></div>
          </div>
          <p className="hero-desc" style={{ maxWidth: '620px' }}>
            Bimonthly thoughts on software craft, system architecture, design theories, and local tech realities.
          </p>
        </div>
      </section>

      {/* Editorial Filters & Search */}
      <section style={{ borderBottom: 'var(--rule)', padding: '24px 0' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setPage(1);
                }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  border: '1px solid var(--ink)',
                  background: filter === cat ? 'var(--ink)' : 'transparent',
                  color: filter === cat ? 'var(--cream)' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

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
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>
      </section>

      {/* Literary Index List */}
      <section style={{ padding: '32px 0 64px' }}>
        <DataErrorBanner error={error} onRetry={refetch} className="mb-6" />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  padding: '32px 0',
                  borderBottom: 'var(--rule-thin)',
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '12px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div style={{ width: '60px', height: '12px', background: 'var(--elevated)' }} className="animate-pulse" />
                  <div style={{ width: '80px', height: '10px', background: 'var(--elevated)' }} className="animate-pulse" />
                </div>
                <div style={{ width: '40%', height: '24px', background: 'var(--elevated)', marginBottom: '8px' }} className="animate-pulse" />
                <DataLoadingSkeleton lines={2} />
              </div>
            ))}
          </div>
        ) : sortedPosts.length === 0 ? (
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
            No journal entries match the specified parameters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {paginatedPosts.map((post, idx) => (
              <div
                key={post.slug || post.id || idx}
                onClick={() => navigate(`/writing/${post.slug || post.id}`)}
                style={{
                  padding: '32px 0',
                  borderBottom: 'var(--rule-thin)',
                  cursor: 'pointer',
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '12px',
                  transition: 'opacity 0.2s',
                }}
                className="group-hover-trigger"
              >
                <div className="flex items-center gap-4">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      color: 'var(--red)',
                      fontWeight: 'bold',
                    }}
                  >
                    {post.category || 'General'}
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                    {post.date}
                  </span>
                </div>

                <h3
                  className="serif-hover"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    lineHeight: 1.15,
                  }}
                >
                  {post.title}
                </h3>

                <p className="hero-desc" style={{ fontSize: '14px', lineHeight: 1.6, maxWidth: '820px' }}>
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
                  <Clock size={10} />
                  <span>
                    {(() => {
                      const display = getBlogReadTimeDisplay(post);
                      if (!display) return '5 min read';
                      if (display.toLowerCase().endsWith('read')) return display.toLowerCase();
                      return `${display.toLowerCase()} read`;
                    })()}
                  </span>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '48px' }}>
              <ListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                range={{ start, end, total }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Newsletter Stark Form */}
      <section style={{ borderTop: 'var(--rule)', padding: '64px 0 80px' }}>
        <div style={{ border: '1px solid var(--ink)', padding: '40px md:80px', background: 'var(--surface)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center px-4 md:px-12">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '16px', height: '1px', background: 'var(--red)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--red)',
                  }}
                >
                  Subscribe
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  marginBottom: '12px',
                }}
              >
                Join the technical <br />
                <em>inner circle.</em>
              </h3>
              <p className="hero-desc" style={{ fontSize: '14px', maxWidth: '440px' }}>
                Occasional write-ups on design systems, code architecture, and Nigerian tech builders. Minimalist, no spam.
              </p>
            </div>

            <div style={{ width: '100%', maxWidth: '440px' }}>
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: 'flex',
                  border: '1px solid var(--ink)',
                  background: 'transparent',
                }}
              >
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  disabled={nlSubmitting}
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
                  disabled={nlSubmitting}
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
                  }}
                >
                  {nlSubmitting ? 'Joining...' : 'Subscribe'}
                </button>
              </form>
              {nlMsg && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: '12px', color: 'var(--red)' }}>
                  {nlMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WritingPage;
