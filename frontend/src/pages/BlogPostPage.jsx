import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Copy, Share2, Check, Twitter, MessageCircle, List, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchBlogPost, fetchBlogPosts } from '../services/api';
import Badge from '../components/portfolio/Badge';
import { BADGE_VARIANTS } from '../constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { track } from '../services/analytics';
import { buildBlogPostingSchema } from '../lib/structuredData';
import { WritingSkeleton } from '../components/portfolio/SkeletonLayouts';
import SectionKicker from '../components/portfolio/SectionKicker';

/** Detect if body is HTML from WYSIWYG (e.g. starts with <p> or contains tags). */
function isHtmlBody(body) {
  if (!body || typeof body !== 'string') return false;
  const t = body.trim();
  return t.startsWith('<') || /<[a-z][\s\S]*>/i.test(t);
}

/** Prose styles for WYSIWYG HTML output (headings, lists, blockquote, links). */
const articleProseClass = [
  'article-body font-body text-[16px] leading-[1.8] text-[var(--muted)] max-w-full break-words',
  '[&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[var(--white)] [&_h1]:mt-12 [&_h1]:mb-6 [&_h1]:tracking-tight',
  '[&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--white)] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight',
  '[&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--white)] [&_h3]:mt-8 [&_h3]:mb-3',
  '[&_p]:mb-6',
  '[&_ul]:list-none [&_ul]:pl-0 [&_ul]:my-6 [&_ul]:space-y-3 [&_ul]:[&_li]:flex [&_ul]:[&_li]:items-start [&_ul]:[&_li]:gap-3',
  '[&_ol]:list-none [&_ol]:pl-0 [&_ol]:my-6 [&_ol]:space-y-3 [&_ol]:[&_li]:flex [&_ol]:[&_li]:items-start [&_ol]:[&_li]:gap-3',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-[var(--sungold)] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-[var(--white)] [&_blockquote]:bg-[var(--overlay)] [&_blockquote]:py-4 [&_blockquote]:my-8',
  '[&_a]:text-[var(--sungold)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-[var(--stardust)] [&_a]:transition-colors',
  '[&_pre]:bg-[var(--surface)] [&_pre]:p-6 [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:my-8 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-[13px] [&_code]:leading-normal',
].join(' ');

/** Render body: HTML from WYSIWYG (with optional pre-injected heading ids) or plain text. */
function ArticleBody({ body, htmlWithIds }) {
  if (htmlWithIds !== undefined && htmlWithIds !== '') {
    return (
      <div
        className={articleProseClass}
        dangerouslySetInnerHTML={{ __html: htmlWithIds }}
      />
    );
  }
  if (!body || typeof body !== 'string') return null;

  if (isHtmlBody(body)) {
    return (
      <div
        className={articleProseClass}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  const blocks = body.split(/\n\n+/);
  const elements = [];

  blocks.forEach((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    const lines = trimmed.split('\n');
    const isNumberedList = lines.length >= 1 && lines.every(line => /^\d+\.\s+/.test(line.trim()));

    if (isNumberedList) {
      elements.push(
        <ul key={i} className="list-none pl-0 my-6 space-y-2">
          {lines.map((line, j) => {
            const text = line.replace(/^\d+\.\s+/, '').trim();
            return (
              <li key={j} className="flex items-start gap-2 font-body text-[15px] leading-[1.8] text-[var(--muted)]">
                <span className="text-[var(--sungold)] font-mono text-[12px] mt-0.5">{j + 1}.</span>
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
      );
    } else {
      elements.push(
        <p key={i} className="font-body text-[15px] leading-[1.8] mb-6 text-[var(--muted)]">
          {trimmed}
        </p>
      );
    }
  });

  return <div className="article-body max-w-full break-words">{elements}</div>;
}

function slugify(text) {
  return (text || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

/** Inject ids into h1/h2/h3 in HTML and return { html, tocEntries }. */
function injectHeadingIds(html) {
  if (!html || typeof html !== 'string') return { html: '', tocEntries: [] };
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3');
  const seen = new Map();
  const tocEntries = [];
  headings.forEach((h) => {
    const text = h.textContent?.trim() || '';
    let id = slugify(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id += `-${count}`;
    h.id = id;
    tocEntries.push({ id, text, level: parseInt(h.tagName.slice(1), 10) });
  });
  const serializer = new XMLSerializer();
  const bodyEl = doc.body;
  const htmlWithIds = bodyEl ? Array.from(bodyEl.childNodes).map((n) => serializer.serializeToString(n)).join('') : html;
  return { html: htmlWithIds, tocEntries };
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const articleRef = React.useRef(null);

  const [nextPost, setNextPost] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBlogPost(slug)
      .then(async (data) => {
        setPost(data);
        setLoading(false);
        // Fetch sibling posts for navigation
        try {
          const allPosts = await fetchBlogPosts();
          const currentIndex = allPosts.findIndex(p => p.id === data.id);
          if (currentIndex !== -1 && currentIndex < allPosts.length - 1) {
            setNextPost(allPosts[currentIndex + 1]);
          } else if (allPosts.length > 1) {
            setNextPost(allPosts[0]); // Wrap to first
          }
        } catch (e) {
          console.warn('Failed to fetch next post', e);
        }
      })
      .catch(() => {
        setPost(null);
        setLoading(false);
      });
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Reading "${post?.title}" by @ajibola_akelebe`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  usePageMeta(
    post
      ? {
          title: post.title,
          description: post.excerpt || post.description || 'Read this article by Ajibola Akelebe.',
          image: `https://peincqeqcufbkoccyneo.supabase.co/functions/v1/og-image?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category || 'Thought')}`,
          ogType: 'article',
          canonical: `/writing/${post.slug || slug}`,
          structuredData: buildBlogPostingSchema(post),
        }
      : { 
          title: 'Article', 
          description: 'Technical writing by Ajibola Akelebe.', 
          canonical: `/writing/${slug}` 
        }
  );

  const handleWhatsAppShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${post?.title} - `);
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
  };

  useEffect(() => {
    if (post?.slug || post?.title) {
      track('blog_post_view', { slug: post.slug || slug, title: post.title, path: `/writing/${post.slug || slug}` });
    }
  }, [post?.slug, post?.title, slug]);

  usePageMeta(
    post
      ? {
          title: post.title,
          description: post.meta_description || post.excerpt || post.description || 'Article by Ajibola Akelebe.',
          image: post.og_image || undefined,
          canonical: `/writing/${post.slug || slug}`,
          ogType: 'article',
          structuredData: buildBlogPostingSchema(post),
        }
      : { title: 'Article', description: 'Article by Ajibola Akelebe.', canonical: slug ? `/writing/${slug}` : '/writing' }
  );

  const { html: bodyWithIds, tocEntries } = React.useMemo(() => {
    if (!post?.body) return { html: '', tocEntries: [] };
    if (isHtmlBody(post.body)) return injectHeadingIds(post.body);
    return { html: post.body, tocEntries: [] };
  }, [post?.body]);

  useEffect(() => {
    const onScroll = () => {
      if (!articleRef.current) return;
      const rect = articleRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrollable = articleHeight - vh;
      if (scrollable <= 0) {
        setReadProgress(1);
        return;
      }
      const scrolled = window.scrollY - articleTop;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setReadProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  if (loading) {
    return (
      <div className="py-32 px-4 max-w-[720px] mx-auto">
        <WritingSkeleton count={1} />
      </div>
    );
  }

  if (!post) {
    return (
      <section className="py-16 md:py-32">
        <div className="max-w-[720px] mx-auto px-4 md:px-8 text-center">
          <h1 className="font-display text-[36px] font-extrabold mb-4 text-[var(--white)]">Post not found</h1>
          <Link
            to="/writing"
            className="btn-primary inline-flex items-center font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const readTime = post.read_time || post.readTime;

  return (
    <>
      {/* Reading progress bar — article scroll */}
      <div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--sungold)] z-[998] pointer-events-none transition-all duration-300"
        style={{
          width: `${readProgress * 100}%`,
          boxShadow: readProgress > 0 ? '0 0 8px var(--sungold)' : 'none'
        }}
        aria-hidden
      />

      {/* Post title + meta + tags / category */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 border-b border-[var(--border)] overflow-hidden">
        {/* Nebula Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
          <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] bg-[var(--nebula)] blur-[100px] rounded-full" />
          <div className="absolute bottom-[-5%] right-[-10%] w-[40%] h-[50%] bg-[var(--violet)] blur-[80px] rounded-full opacity-50" />
        </div>

        <div className="max-w-[720px] mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-12">
            <Link
              to="/writing"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase no-underline text-[var(--muted)] hover:text-[var(--sungold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
            >
              <ArrowLeft size={14} /> Back to Writing
            </Link>
          </div>

          {post.category && (
            <SectionKicker label={post.category} accent="sungold" />
          )}

          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-[var(--white)]" style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}>
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-8 border-b border-[var(--border-md)]">
            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[var(--subtle)]">
              <span className="bg-[var(--overlay)] px-2 py-1 border border-[var(--border)]">{post.date}</span>
              {readTime && (
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-[var(--sungold)]" /> {readTime}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="p-2 text-[var(--muted)] hover:text-[var(--sungold)] transition-colors bg-[var(--surface)] border border-[var(--border)] rounded-full group relative"
                title="Copy link"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--void)] text-[var(--white)] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[var(--border)]">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-[var(--muted)] hover:text-[var(--sungold)] transition-colors bg-[var(--surface)] border border-[var(--border)] rounded-full group relative"
                title="Share on X"
              >
                <Twitter size={14} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--void)] text-[var(--white)] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[var(--border)]">
                  Share on X
                </span>
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="p-2 text-[var(--muted)] hover:text-green-500 transition-colors bg-[var(--surface)] border border-[var(--border)] rounded-full group relative"
                title="Share on WhatsApp"
              >
                <MessageCircle size={14} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--void)] text-[var(--white)] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[var(--border)]">
                  WhatsApp
                </span>
              </button>
            </div>
          </div>

          {(post.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, j) => (
                <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]} className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article body + TOC: article first so body isn't constrained; TOC right on desktop, collapsible on mobile */}
      <section className="py-12 md:py-16">
        <div className="max-w-[720px] md:max-w-[960px] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-start md:gap-16">
          <div ref={articleRef} className="min-w-0 flex-1">
            {post.excerpt && (
              <div className="mb-10 pl-4 border-l-4 border-[var(--sungold)]">
                <p className="font-body text-[17px] leading-[1.75] text-[var(--white)] font-medium">
                  {post.excerpt}
                </p>
              </div>
            )}
            <ArticleBody body={post.body} htmlWithIds={isHtmlBody(post.body) ? bodyWithIds : undefined} />
          </div>

          {tocEntries.length > 0 && (
            <nav
              className="md:w-52 md:flex-shrink-0 md:sticky md:top-24 border border-[var(--border)] bg-[var(--surface)] md:bg-transparent md:border-0"
              aria-label="Table of contents"
            >
              {/* Mobile: collapsible so body is not pushed down */}
              <button
                type="button"
                onClick={() => setTocOpen((o) => !o)}
                className="md:hidden w-full flex items-center justify-between gap-2 py-3 px-4 font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--subtle)] hover:text-[var(--sungold)] transition-colors border-0 bg-transparent cursor-pointer"
                aria-expanded={tocOpen}
                aria-controls="toc-list"
              >
                <span className="flex items-center gap-2">
                  <List size={14} aria-hidden /> On this page
                </span>
                {tocOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <div id="toc-list" className={tocOpen ? 'block' : 'hidden md:block'}>
                <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--subtle)] mb-3 pt-0 md:pt-0 px-4 md:px-0 pb-2 md:pb-3 border-b border-[var(--border)] md:border-0">
                  On this page
                </p>
                <ul className="list-none p-0 m-0 space-y-2 py-4 md:py-0 md:pt-0 px-4 md:px-0">
                  {tocEntries.map(({ id, text, level }) => (
                    <li key={id} style={{ paddingLeft: level > 2 ? 12 : 0 }}>
                      <a
                        href={`#${id}`}
                        onClick={() => setTocOpen(false)}
                        className="font-mono text-[12px] text-[var(--muted)] hover:text-[var(--sungold)] no-underline block py-0.5"
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}
        </div>
      </section>

      {/* Footer CTA & Next Post */}
      <section className="py-20 border-t border-[var(--border)] bg-[var(--surface)]/10">
        <div className="max-w-[720px] mx-auto px-4 md:px-8">
          {nextPost && (
            <div className="mb-16">
              <SectionKicker label="Continue Reading" accent="stardust" />
              <Link
                to={`/writing/${nextPost.slug || nextPost.id}`}
                className="group block p-8 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--stardust)] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--stardust)]/5 blur-[40px] rounded-full group-hover:bg-[var(--stardust)]/10 transition-all" />
                <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--white)] group-hover:text-[var(--sungold)] transition-colors mb-2">
                  {nextPost.title}
                </h3>
                <p className="font-body text-[14px] text-[var(--muted)] line-clamp-2">
                  {nextPost.excerpt || nextPost.description}
                </p>
              </Link>
            </div>
          )}

          <Link
            to="/writing"
            className="btn-ghost inline-flex items-center gap-3 font-display text-[13px] font-bold px-[24px] py-[12px] no-underline cursor-pointer bg-transparent text-[var(--white)] border border-[var(--border-md)] rounded-none hover:bg-[var(--overlay)] transition-all uppercase tracking-[0.05em]"
          >
            <ArrowLeft size={16} /> All Articles
          </Link>
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;
