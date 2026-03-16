import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { fetchBlogPosts, subscribeNewsletter } from '../services/api';
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
import { WritingSkeleton } from '../components/portfolio/SkeletonLayouts';

const WRITING_SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
];

const WRITING_PAGE_SIZE = 9;

const WritingPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [nlEmail, setNlEmail] = useState('');
  const [nlMsg, setNlMsg] = useState('');
  const [nlSubmitting, setNlSubmitting] = useState(false);
  const { data: posts, loading: postsLoading, error: postsError, refetch: refetchPosts } = useRealtimeQuery('blog_posts', fetchBlogPosts);

  const displayPosts = Array.isArray(posts) && posts.length > 0 ? posts : [];
  const categoryList = ['All', ...[...new Set(displayPosts.map(p => (p.category || '').trim()).filter(Boolean))].sort()];
  const categoryOptions = categoryList.map((c) => ({ label: c, value: c }));
  const filtered = filter === 'All' ? displayPosts : displayPosts.filter((p) => (p.category || '').trim() === filter);
  const featured = filtered[0] ?? null;
  const listPostsUnsorted = filtered.filter((p) => (p.slug || p.id) !== (featured?.slug || featured?.id));

  const listPosts = useMemo(() => {
    const comp = sortBy === 'date-desc' ? byDate('date', 'desc')
      : sortBy === 'date-asc' ? byDate('date', 'asc')
      : sortBy === 'title-asc' ? byString('title', 'asc')
      : byString('title', 'desc');
    return applySort(listPostsUnsorted, comp);
  }, [listPostsUnsorted, sortBy]);

  const { items: paginatedPosts, totalPages, start, end, total } = useMemo(
    () => paginate(listPosts, page, WRITING_PAGE_SIZE),
    [listPosts, page]
  );

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!nlEmail || nlSubmitting) return;
    setNlSubmitting(true);
    setNlMsg('');
    try {
      const res = await subscribeNewsletter(nlEmail.trim());
      setNlMsg(res?.message || 'Subscribed! You\'ll hear from me soon.');
      setNlEmail('');
    } catch {
      setNlMsg('Something went wrong. Try again.');
    } finally {
      setNlSubmitting(false);
    }
    setTimeout(() => setNlMsg(''), 4000);
  };

  usePageMeta({
    title: 'Blog & Thoughts',
    description: 'Writing about design, development, teaching, and the intersection of African identity and technology.',
    canonical: '/writing',
  });

  if (postsLoading && displayPosts.length === 0) {
    return (
      <div className="py-32 px-4 max-w-[1160px] mx-auto">
        <WritingSkeleton count={5} />
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 border-b border-[var(--border)] overflow-hidden">
        {/* Nebula Glow Backdrop */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[var(--nebula)] opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[55%] bg-[var(--sungold)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
          <SectionKicker label="Writing" accent="sungold" />
          <h1 className="font-display font-extrabold leading-[0.95] tracking-[-0.04em] mb-6 text-[var(--white)] max-w-[800px]" style={{ fontSize: 'clamp(44px, 10vw, 84px)' }}>
            Blog & Thoughts
          </h1>
          <p className="font-body text-[19px] leading-[1.6] max-w-[600px] text-[var(--muted)]">
            Exploring the intersection of <span className="text-[var(--white)] font-medium">African identity</span>, <span className="text-[var(--white)] font-medium">design systems</span>, and the future of <span className="text-[var(--white)] font-medium">software engineering</span>.
          </p>
        </div>
      </section>


      {/* Featured post hero */}
      {featured && (
        <section className="py-12 md:py-24 border-b border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[var(--sungold)] opacity-[0.02] blur-[140px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.04]" />
          
          <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
            <div
              className="relative p-8 md:p-14 cursor-pointer transition-all duration-500 border border-[var(--border-md)] bg-[var(--surface)]/50 backdrop-blur-sm hover:border-[var(--sungold)]/40 hover:bg-[var(--elevated)]/60 group/card"
              onClick={() => navigate(`/writing/${featured.slug || featured.id}`)}
            >
              {/* Technical corner accents */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--sungold)] opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--sungold)] opacity-0 group-hover/card:opacity-100 transition-all duration-500 -translate-x-1 translate-y-1" />

              <div className="flex items-center gap-3 mb-6">
                <Badge variant="gold">◆ Featured</Badge>
                <div className="h-px w-12 bg-[var(--border-hi)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--stardust)]">{featured.category}</span>
              </div>
              
              <h2 className="font-display text-[32px] md:text-[48px] font-extrabold leading-[1.0] tracking-tight mb-6 text-[var(--white)] group-hover/card:text-[var(--sungold)] transition-colors duration-300">
                {featured.title}
              </h2>
              <p className="font-body text-[17px] leading-[1.75] mb-8 max-w-[720px] text-[var(--muted)] group-hover/card:text-[var(--subtle)] transition-colors">
                {featured.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-[var(--border)]">
                <div className="flex flex-wrap items-center gap-3">
                  {(featured.tags || []).map((tag, j) => (
                    <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-widest text-[var(--subtle)]">
                  <span>{featured.date}</span>
                  <div className="w-1 h-1 rounded-full bg-[var(--border-hi)]" />
                  <span className="flex items-center gap-2">
                    <Clock size={12} className="text-[var(--sungold)]" /> {featured.read_time || featured.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category filter + Post list with tags */}
      <section className="py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <FilterButtons options={categoryOptions} value={filter} onChange={(v) => { setFilter(v); setPage(1); }} label="Category" />
            <SortSelect options={WRITING_SORT_OPTIONS} value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} label="Sort" />
          </div>

          <div className="flex flex-col gap-4">
            {listPosts.length === 0 && featured && filter !== 'All' && (
              <p className="font-body text-[15px] text-[var(--muted)]">No other posts match this filter.</p>
            )}
            {listPosts.length === 0 && !featured && (
              <p className="font-body text-[15px] text-[var(--muted)]">No posts yet.</p>
            )}
            {paginatedPosts.map(post => (
              <Link
                key={post.slug || post.id}
                to={`/writing/${post.slug || post.id}`}
                className="group relative block p-6 no-underline transition-all duration-300 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--elevated)] hover:border-[var(--sungold)]/30"
              >
                {/* Technical hover line */}
                <div className="absolute left-0 top-0 w-0.5 h-0 bg-[var(--sungold)] transition-all duration-300 group-hover:h-full" />
                
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--sungold)] opacity-60 group-hover:opacity-100 transition-opacity">
                        {post.category}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-[var(--border-md)]" />
                      {(post.tags || []).slice(0, 2).map((tag, j) => (
                        <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="font-display text-[20px] font-bold leading-[1.2] mb-3 text-[var(--white)] group-hover:text-[var(--sungold)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-body text-[14px] leading-[1.7] text-[var(--muted)] line-clamp-2 mb-4 group-hover:text-[var(--subtle)] transition-colors">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-6 font-mono text-[11px] text-[var(--dim)] decoration-[var(--border-hi)] decoration-dashed underline-offset-4">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-2">
                        <Clock size={12} className="text-[var(--stardust)]" /> {post.read_time || post.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex-shrink-0 w-10 h-10 border border-[var(--border)] flex items-center justify-center bg-[var(--deep)] text-[var(--subtle)] transition-all duration-300 group-hover:bg-[var(--sungold)] group-hover:text-[var(--void)] group-hover:border-[var(--sungold)]">
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {listPosts.length > 0 && (
            <ListPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              range={{ start, end, total }}
            />
          )}
        </div>
      </section>

      {/* Newsletter subscribe */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="relative p-8 md:p-16 border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--violet)] opacity-[0.03] blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-px bg-[var(--violet)]" />
                  <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--violet)]">
                    Newsletter
                  </span>
                </div>
                <h3 className="font-display text-[32px] md:text-[40px] font-extrabold mb-4 text-[var(--white)] leading-tight">
                  Join the technical <br/><span className="text-[var(--violet)]">inner circle.</span>
                </h3>
                <p className="font-body text-[16px] leading-[1.7] text-[var(--muted)] max-w-[480px]">
                  Bimonthly thoughts on design, code, and culture. No noise, just the craft. Unsubscribe anytime.
                </p>
              </div>

              <div className="w-full max-w-[520px]">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0 border border-[var(--border-md)] p-1 bg-[var(--deep)]/50 backdrop-blur-sm shadow-2xl" aria-label="Newsletter signup">
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Engineering focus? Enter email..."
                    value={nlEmail}
                    onChange={(e) => setNlEmail(e.target.value)}
                    disabled={nlSubmitting}
                    className="flex-1 font-body text-[14px] px-6 py-[15px] outline-none bg-transparent text-[var(--white)] placeholder:text-[var(--subtle)] focus:ring-0 transition-all disabled:opacity-60"
                    required
                    aria-describedby={nlMsg ? 'newsletter-msg' : undefined}
                  />
                  <button
                    type="submit"
                    disabled={nlSubmitting}
                    className="inline-flex items-center justify-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.15em] px-10 py-[15px] bg-[var(--violet)] text-[var(--white)] border-0 rounded-none transition-all hover:bg-[#9d89f5] hover:shadow-[0_0_20px_rgba(139,114,240,0.3)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {nlSubmitting ? 'Subscribing…' : 'Join Now'}
                  </button>
                </form>
                {nlMsg && (
                  <div id="newsletter-msg" className="font-mono text-[11px] mt-4 flex items-center gap-2 text-[var(--violet)]" role="status" aria-live="polite">
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {nlMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WritingPage;
