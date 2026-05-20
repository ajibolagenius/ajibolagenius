import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Copy, Share2, Check, Twitter, MessageCircle, X } from 'lucide-react';
import { fetchBlogPost, fetchBlogPosts } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { track } from '../services/analytics';
import { buildBlogPostingSchema } from '../lib/structuredData';
import { buildOgImageUrl, DEFAULT_OG_IMAGE_PATH } from '../lib/siteConfig';
import { getBlogReadTimeDisplay } from '../lib/blogReadTime';
import { DataLoadingSkeleton, DataErrorBanner } from '../components/portfolio/DataStateMessage';

function isHtmlBody(body) {
  if (!body || typeof body !== 'string') return false;
  const t = body.trim();
  return t.startsWith('<') || /<[a-z][\s\S]*>/i.test(t);
}

/**
 * Parses and processes HTML post body to extract headings and inject matching anchors.
 */
function processPostBody(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') return { headings: [], processedHtml: '' };
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3');
    const headings = [];
    
    headingElements.forEach((el, index) => {
      const text = el.textContent || '';
      const id = `heading-${index}`;
      el.setAttribute('id', id);
      headings.push({
        text,
        id,
        level: el.tagName.toLowerCase()
      });
    });
    
    return {
      headings,
      processedHtml: doc.body.innerHTML
    };
  } catch (e) {
    console.error('Failed to parse blog post headings:', e);
    return { headings: [], processedHtml: htmlContent };
  }
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readProgress, setReadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [nextPost, setNextPost] = useState(null);
  
  // Interactive TOC states
  const [activeId, setActiveId] = useState('');
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const articleRef = useRef(null);

  const loadPost = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchBlogPost(slug)
      .then(async (data) => {
        if (!data) {
          throw new Error('Article not found');
        }
        setPost(data);
        setLoading(false);
        try {
          const allPosts = await fetchBlogPosts();
          const idx = allPosts.findIndex((p) => p.id === data.id);
          if (idx !== -1 && idx < allPosts.length - 1) {
            setNextPost(allPosts[idx + 1]);
          } else if (allPosts.length > 1) {
            setNextPost(allPosts[0]);
          }
        } catch {
          // Quietly fallback
        }
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  useEffect(() => {
    if (post?.slug || post?.title) {
      track('blog_post_view', { slug: post.slug || slug, title: post.title, path: `/writing/${post.slug || slug}` });
    }
  }, [post, slug]);

  // Scroll Progress
  useEffect(() => {
    const onScroll = () => {
      if (!articleRef.current) return;
      const rect = articleRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = window.scrollY;
      const totalH = rect.height - vh;
      if (totalH <= 0) {
        setReadProgress(1);
        return;
      }
      const progress = Math.max(0, Math.min(1, scrolled / totalH));
      setReadProgress(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  // Parse headings and process the body HTML
  const { headings, processedHtml } = useMemo(() => {
    if (!post?.body) return { headings: [], processedHtml: '' };
    return processPostBody(post.body);
  }, [post?.body]);

  // ScrollSpy to track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScrollSpy = () => {
      const yOffset = 120; // Navbar offset safety margin
      const scrollPosition = window.scrollY + yOffset;

      let currentActive = '';
      for (let i = 0; i < headings.length; i++) {
        const el = document.getElementById(headings[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            currentActive = headings[i].id;
          } else {
            break;
          }
        }
      }

      if (currentActive) {
        setActiveId(currentActive);
      } else {
        setActiveId('');
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    // Run initially
    handleScrollSpy();

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [headings]);

  usePageMeta(
    post
      ? {
          title: post.title,
          description: post.excerpt || 'Technical writing by Ajibola Akelebe.',
          image: DEFAULT_OG_IMAGE_PATH,
          ogType: 'article',
          canonical: `/writing/${post.slug || slug}`,
          structuredData: buildBlogPostingSchema(post),
        }
      : {
          title: 'Article',
          description: 'Technical writing by Ajibola Akelebe.',
          canonical: `/writing/${slug}`,
        }
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Reading "${post?.title}"`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleShareWA = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check this out: ${post?.title} — `);
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // Align heading cleanly under fixed Navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 32px' }}>
          <div
            style={{
              width: '120px',
              height: '14px',
              background: 'var(--elevated)',
              marginBottom: '28px',
            }}
            className="animate-pulse"
          />
          <div>
            <div
              style={{
                width: '80px',
                height: '12px',
                background: 'var(--elevated)',
                marginBottom: '16px',
              }}
              className="animate-pulse"
            />
            <div
              style={{
                width: '60%',
                height: '40px',
                background: 'var(--elevated)',
                marginBottom: '24px',
              }}
              className="animate-pulse"
            />
            <div className="hero-rule" style={{ margin: '24px 0' }}>
              <div className="hero-rule-line"></div>
              <div style={{ width: '120px', height: '10px', background: 'var(--elevated)', margin: '0 16px' }} className="animate-pulse" />
              <div className="hero-rule-line"></div>
            </div>
          </div>
        </section>
        <section style={{ borderBottom: 'var(--rule-thin)', padding: '16px 0' }}>
          <div style={{ width: '100px', height: '12px', background: 'var(--elevated)' }} className="animate-pulse" />
        </section>
        <section style={{ padding: '40px 0 80px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <DataLoadingSkeleton lines={8} />
            <div style={{ margin: '32px 0' }} />
            <DataLoadingSkeleton lines={6} />
          </div>
        </section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-content" style={{ padding: '80px 0' }}>
        <button
          onClick={() => navigate('/writing')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '28px',
          }}
        >
          <ArrowLeft size={10} /> Back to Journal
        </button>
        <DataErrorBanner error={error || new Error('Article not found')} onRetry={loadPost} />
      </div>
    );
  }

  return (
    <div className="page-content" ref={articleRef}>
      {/* Scroll indicator */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          background: 'var(--red)',
          width: `${readProgress * 100}%`,
          zIndex: 1000,
          transition: 'width 0.1s ease-out',
        }}
      />

      {/* Editorial Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 32px' }}>
        <button
          onClick={() => navigate('/writing')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '28px',
          }}
        >
          <ArrowLeft size={10} /> Back to Journal
        </button>

        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            § {post.category || 'General'}
          </span>
          <h1 className="hero-title" style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', lineHeight: 1.0, marginBottom: '24px' }}>
            {post.title}
          </h1>

          <div className="hero-rule" style={{ margin: '24px 0' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">{post.date} // JOURNAL</span>
            <div className="hero-rule-line"></div>
          </div>
        </div>
      </section>

      {/* Share / Read Metadata bar */}
      <section style={{ borderBottom: 'var(--rule-thin)', padding: '16px 0' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Clock size={12} />
            <span>
              {(() => {
                const display = getBlogReadTimeDisplay(post);
                if (!display) return '5 MIN READ';
                if (display.toUpperCase().endsWith('READ')) return display.toUpperCase();
                return `${display.toUpperCase()} READ`;
              })()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                padding: '6px 12px',
                border: '1.5px solid var(--ink)',
                background: 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {copied ? <Check size={10} style={{ color: 'var(--red)' }} /> : <Copy size={10} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleShareX}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                padding: '6px 12px',
                border: '1.5px solid var(--ink)',
                background: 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Twitter size={10} />
              <span>Share X</span>
            </button>
            <button
              onClick={handleShareWA}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                padding: '6px 12px',
                border: '1.5px solid var(--ink)',
                background: 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <MessageCircle size={10} />
              <span>Share WA</span>
            </button>
          </div>
        </div>
      </section>

      {/* long form reader container */}
      <section style={{ padding: '48px 0 80px' }}>
        <div 
          style={{ 
            maxWidth: '1140px', 
            margin: '0 auto', 
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '64px'
          }}
          className="relative"
        >
          {/* Centered Main Column */}
          <div style={{ flex: 1, maxWidth: '720px', minWidth: 0 }}>
            {post.excerpt && (
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  lineHeight: 1.5,
                  fontWeight: 'bold',
                  marginBottom: '40px',
                  fontStyle: 'italic',
                  borderLeft: '2px solid var(--red)',
                  paddingLeft: '24px',
                }}
              >
                {post.excerpt}
              </p>
            )}

            {isHtmlBody(post.body) ? (
              <div
                className="article-rendered-html"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: 'var(--ink)',
                }}
              />
            ) : (
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: 'var(--ink)',
                  whiteSpace: 'pre-line',
                }}
              >
                {post.body}
              </div>
            )}
          </div>

          {/* Desktop Table of Contents Sidebar */}
          <div
            className="hidden lg:block sticky top-[100px] transition-all duration-300 self-start"
            style={{
              width: tocCollapsed ? '40px' : '260px',
              borderLeft: 'var(--rule-thin)',
              paddingLeft: tocCollapsed ? '12px' : '24px',
              maxHeight: 'calc(100vh - 140px)',
              overflowY: 'auto',
            }}
          >
            {tocCollapsed ? (
              <button
                onClick={() => setTocCollapsed(false)}
                title="Expand Outline"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  writingMode: 'vertical-rl',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  padding: '10px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Expand Outline</span>
                <span style={{ transform: 'rotate(90deg)', fontFamily: 'var(--font-mono)' }}>[+]</span>
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'var(--rule-thin)', paddingBottom: '12px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--muted)',
                      fontWeight: '600',
                    }}
                  >
                    Outline
                  </span>
                  <button
                    onClick={() => setTocCollapsed(true)}
                    style={{
                      background: 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      padding: '2px 6px',
                      border: '0.35px solid rgba(17, 17, 17, 0.15)',
                    }}
                  >
                    Collapse [−]
                  </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {headings.length === 0 ? (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>
                      No major headings found.
                    </span>
                  ) : (
                    headings.map((h, i) => {
                      const num = String(i + 1).padStart(2, '0');
                      const isActive = activeId === h.id;
                      return (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToHeading(h.id);
                          }}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-start',
                            fontFamily: h.level === 'h2' ? 'var(--font-display)' : 'var(--font-body)',
                            fontWeight: h.level === 'h2' ? 'bold' : 'normal',
                            fontSize: h.level === 'h2' ? '13px' : '12px',
                            lineHeight: '1.4',
                            color: isActive ? 'var(--red)' : 'var(--ink-light)',
                            textDecoration: 'none',
                            paddingLeft: h.level === 'h3' ? '16px' : '0px',
                            transition: 'color 0.2s ease, transform 0.2s ease',
                            transform: isActive ? 'translateX(4px)' : 'none',
                          }}
                        >
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: isActive ? 'var(--red)' : 'var(--muted)' }}>
                            {num}
                          </span>
                          <span>{h.text}</span>
                        </a>
                      );
                    })
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sibling CTA */}
      {nextPost && (
        <section style={{ borderTop: 'var(--rule)', padding: '56px 0 80px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                display: 'block',
                marginBottom: '20px',
              }}
            >
              Next Journal Entry
            </span>
            <div
              onClick={() => navigate(`/writing/${nextPost.slug || nextPost.id}`)}
              style={{
                border: '1.5px solid var(--ink)',
                padding: '32px',
                background: 'var(--surface)',
                cursor: 'pointer',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                {nextPost.title}
              </h4>
              <p className="hero-desc" style={{ fontSize: '14px' }}>
                {nextPost.excerpt}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Mobile FAB and Drawer for Outline */}
      {headings.length > 0 && (
        <div className="lg:hidden">
          {/* Floating Action Button */}
          <button
            onClick={() => setMobileTocOpen(true)}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'var(--ink)',
              color: 'var(--cream)',
              border: 'var(--rule)',
              borderRadius: '50px',
              padding: '12px 20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              zIndex: 990,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.25s var(--spring)',
            }}
          >
            <span>§ Outline</span>
          </button>

          {/* Bottom Drawer Overlay */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 1010,
              opacity: mobileTocOpen ? 1 : 0,
              visibility: mobileTocOpen ? 'visible' : 'hidden',
              transition: 'opacity 0.3s ease, visibility 0.3s',
            }}
            onClick={() => setMobileTocOpen(false)}
          >
            {/* Slide up Drawer Panel */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'var(--cream)',
                borderTop: 'var(--rule)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                padding: '24px 24px 40px',
                maxHeight: '70vh',
                overflowY: 'auto',
                transform: mobileTocOpen ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.4s var(--ease-out)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'var(--rule-thin)', paddingBottom: '16px', marginBottom: '20px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--muted)',
                    fontWeight: '600',
                  }}
                >
                  Article Outline
                </span>
                <button
                  onClick={() => setMobileTocOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--ink)',
                    padding: '4px',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {headings.map((h, i) => {
                  const num = String(i + 1).padStart(2, '0');
                  const isActive = activeId === h.id;
                  return (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHeading(h.id);
                        setMobileTocOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        fontFamily: h.level === 'h2' ? 'var(--font-display)' : 'var(--font-body)',
                        fontWeight: h.level === 'h2' ? 'bold' : 'normal',
                        fontSize: h.level === 'h2' ? '15px' : '14px',
                        lineHeight: '1.4',
                        color: isActive ? 'var(--red)' : 'var(--ink)',
                        textDecoration: 'none',
                        paddingLeft: h.level === 'h3' ? '16px' : '0px',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: isActive ? 'var(--red)' : 'var(--muted)' }}>
                        {num}
                      </span>
                      <span>{h.text}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;
