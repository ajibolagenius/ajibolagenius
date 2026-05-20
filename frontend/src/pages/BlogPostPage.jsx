import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Copy, Share2, Check, Twitter, MessageCircle, X } from 'lucide-react';
import { fetchBlogPost, fetchBlogPosts } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { track } from '../services/analytics';
import { buildBlogPostingSchema } from '../lib/structuredData';
import { buildOgImageUrl, DEFAULT_OG_IMAGE_PATH } from '../lib/siteConfig';
import { DataLoadingSkeleton, DataErrorBanner } from '../components/portfolio/DataStateMessage';

function isHtmlBody(body) {
  if (!body || typeof body !== 'string') return false;
  const t = body.trim();
  return t.startsWith('<') || /<[a-z][\s\S]*>/i.test(t);
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
            <span>{post.readTime || '5 MIN READ'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                padding: '6px 12px',
                border: '1px solid var(--ink)',
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
                border: '1px solid var(--ink)',
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
                border: '1px solid var(--ink)',
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
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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
              dangerouslySetInnerHTML={{ __html: post.body }}
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
                border: '1px solid var(--ink)',
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
    </div>
  );
};

export default BlogPostPage;
