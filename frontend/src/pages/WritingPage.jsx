import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { fetchBlogPosts, subscribeNewsletter } from '../services/api';
import { blogPosts as fbPosts } from '../data/mock';
import Badge from '../components/portfolio/Badge';

const BADGE_VARIANTS = ['gold', 'cosmic', 'cyan', 'terra'];

const WritingPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [posts, setPosts] = useState([]);
  const [nlEmail, setNlEmail] = useState('');
  const [nlMsg, setNlMsg] = useState('');

  useEffect(() => {
    fetchBlogPosts().then(setPosts).catch(() => setPosts(fbPosts));
  }, []);

  const displayPosts = posts.length > 0 ? posts : fbPosts;
  const categories = ['All', ...[...new Set(displayPosts.map(p => p.category).filter(Boolean))].sort()];
  const filtered = filter === 'All' ? displayPosts : displayPosts.filter(p => p.category === filter);
  const featured = displayPosts[0];
  const listPosts = filtered.filter(p => (p.slug || p.id) !== (featured?.slug || featured?.id));

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!nlEmail) return;
    try {
      const res = await subscribeNewsletter(nlEmail);
      setNlMsg(res.message || 'Subscribed.');
      setNlEmail('');
    } catch {
      setNlMsg('Something went wrong. Try again.');
    }
    setTimeout(() => setNlMsg(''), 4000);
  };

  if (displayPosts.length === 0) {
    return (
      <div className="py-32 text-center font-mono text-[13px] text-[var(--subtle)]">
        Loading…
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <section className="pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-[var(--sungold)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
              Writing
            </span>
          </div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Blog & Thoughts
          </h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] text-[var(--muted)]">
            Writing about design, development, teaching, and the intersection of African identity and technology.
          </p>
        </div>
      </section>

      {/* Featured post hero */}
      {featured && (
        <section className="py-12 md:py-16 border-b border-[var(--border)]">
          <div className="max-w-[1160px] mx-auto px-4 md:px-8">
            <div
              className="p-8 md:p-10 cursor-pointer transition-all duration-300 border border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(232,160,32,0.25)]"
              onClick={() => navigate(`/writing/${featured.slug || featured.id}`)}
            >
              <Badge variant="gold" className="mb-4">◆ Featured</Badge>
              <h2 className="font-display text-[28px] md:text-[32px] font-extrabold leading-[1.15] mb-3 text-[var(--white)]">
                {featured.title}
              </h2>
              <p className="font-body text-[15px] leading-[1.7] mb-5 max-w-[640px] text-[var(--muted)]">
                {featured.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {(featured.tags || []).map((tag, j) => (
                  <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px] text-[var(--subtle)]">
                <span>{featured.date}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {featured.read_time || featured.readTime}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category filter + Post list with tags */}
      <section className="py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--subtle)]">Category</span>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 rounded-none"
                  style={{
                    background: filter === cat ? 'rgba(232,160,32,0.15)' : 'transparent',
                    color: filter === cat ? 'var(--sungold)' : 'var(--subtle)',
                    border: `1px solid ${filter === cat ? 'rgba(232,160,32,0.3)' : 'var(--border)'}`
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {listPosts.length === 0 && featured && filter !== 'All' && (
              <p className="font-body text-[15px] text-[var(--muted)]">No other posts in this category.</p>
            )}
            {listPosts.length === 0 && !featured && (
              <p className="font-body text-[15px] text-[var(--muted)]">No posts yet.</p>
            )}
            {listPosts.map(post => (
              <div
                key={post.slug || post.id}
                className="p-6 cursor-pointer transition-all duration-200 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--elevated)] hover:border-[rgba(232,160,32,0.2)]"
                onClick={() => navigate(`/writing/${post.slug || post.id}`)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(post.tags || []).map((tag, j) => (
                        <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-display text-[18px] font-bold leading-[1.2] mb-2 text-[var(--white)]">
                      {post.title}
                    </h3>
                    <p className="font-body text-[13px] leading-[1.6] text-[var(--muted)]">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-3 font-mono text-[11px] text-[var(--dim)]">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {post.read_time || post.readTime}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="mt-2 flex-shrink-0 text-[var(--sungold)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter subscribe */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="p-8 md:p-10 border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-[var(--violet)]" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--violet)]">
                Newsletter
              </span>
            </div>
            <h3 className="font-display text-[20px] font-bold mb-2 text-[var(--white)]">Stay in the loop</h3>
            <p className="font-body text-[14px] mb-6 text-[var(--muted)]">
              Get notified when I publish new articles. No spam, unsubscribe anytime.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-[480px]">
              <input
                type="email"
                placeholder="your@email.com"
                value={nlEmail}
                onChange={e => setNlEmail(e.target.value)}
                className="flex-1 font-body text-[14px] px-4 py-[10px] outline-none bg-[var(--elevated)] border border-[var(--border-md)] text-[var(--white)] placeholder:text-[var(--subtle)] focus:border-[var(--sungold)] focus:shadow-[var(--shadow-sharp-ring)] rounded-none transition-all"
                required
              />
              <button
                type="submit"
                className="btn-primary font-display text-[13px] font-semibold px-5 py-[10px] border-0 cursor-pointer bg-[var(--sungold)] text-[var(--void)] rounded-none shrink-0"
              >
                Subscribe
              </button>
            </form>
            {nlMsg && (
              <p className="font-mono text-[12px] mt-3 text-[var(--sungold)]">{nlMsg}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default WritingPage;
