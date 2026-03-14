import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { fetchBlogPost } from '../services/api';
import { blogPosts as fbPosts } from '../data/mock';
import Badge from '../components/portfolio/Badge';
import { BADGE_VARIANTS } from '../constants';
import { usePageMeta } from '../hooks/usePageMeta';

/** Detect if body is HTML from WYSIWYG (e.g. starts with <p> or contains tags). */
function isHtmlBody(body) {
  if (!body || typeof body !== 'string') return false;
  const t = body.trim();
  return t.startsWith('<') || /<[a-z][\s\S]*>/i.test(t);
}

/** Prose styles for WYSIWYG HTML output (headings, lists, blockquote, links). */
const articleProseClass = [
  'article-body font-body text-[15px] leading-[1.8] text-[var(--muted)] max-w-full break-words',
  '[&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--white)] [&_h1]:mt-8 [&_h1]:mb-4',
  '[&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--white)] [&_h2]:mt-6 [&_h2]:mb-3',
  '[&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--white)] [&_h3]:mt-4 [&_h3]:mb-2',
  '[&_p]:mb-6',
  '[&_ul]:list-none [&_ul]:pl-0 [&_ul]:my-6 [&_ul]:space-y-2 [&_ul]:[&_li]:flex [&_ul]:[&_li]:items-start [&_ul]:[&_li]:gap-2',
  '[&_ol]:list-none [&_ol]:pl-0 [&_ol]:my-6 [&_ol]:space-y-2 [&_ol]:[&_li]:flex [&_ol]:[&_li]:items-start [&_ol]:[&_li]:gap-2',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-[var(--sungold)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--subtle)] [&_blockquote]:my-6',
  '[&_a]:text-[var(--sungold)] [&_a]:underline [&_a]:hover:no-underline',
  '[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_code]:break-words',
].join(' ');

/** Render body: HTML from WYSIWYG or plain text (paragraphs + numbered lists). */
function ArticleBody({ body }) {
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

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPost(slug)
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => {
        const fb = fbPosts.find(p => p.id === slug || p.slug === slug);
        setPost(fb || null);
        setLoading(false);
      });
  }, [slug]);

  usePageMeta(
    post
      ? {
          title: post.title,
          description: post.meta_description || post.excerpt || post.description || 'Article by Ajibola Akelebe.',
          image: post.og_image || undefined,
          canonical: `/writing/${post.slug || slug}`,
          ogType: 'article',
        }
      : { title: 'Article', description: 'Article by Ajibola Akelebe.', canonical: slug ? `/writing/${slug}` : '/writing' }
  );

  if (loading) {
    return (
      <div className="py-32 text-center font-mono text-[13px] text-[var(--subtle)]">
        Loading…
      </div>
    );
  }

  if (!post) {
    return (
      <section className="py-16 md:py-32">
        <div className="max-w-[720px] mx-auto px-4 md:px-8 text-center">
          <h1 className="font-display text-[36px] font-extrabold mb-4 text-[var(--white)]">Post not found</h1>
          <button
            onClick={() => navigate('/writing')}
            className="btn-primary font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none"
          >
            Back to Blog
          </button>
        </div>
      </section>
    );
  }

  const readTime = post.read_time || post.readTime;

  return (
    <>
      {/* Post title + meta + tags / category */}
      <section className="pt-12 pb-8 md:pt-16 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[720px] mx-auto px-4 md:px-8">
          <div className="mb-10">
            <button
              onClick={() => navigate('/writing')}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none text-[var(--muted)] hover:text-[var(--sungold)] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Writing
            </button>
          </div>

          {post.category && (
            <Badge variant="cosmic" className="mb-4 block w-fit">
              {post.category}
            </Badge>
          )}

          <h1 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6 font-mono text-[11px] text-[var(--subtle)]">
            <span>{post.date}</span>
            {readTime && (
              <span className="flex items-center gap-1">
                <Clock size={11} /> {readTime}
              </span>
            )}
          </div>

          {(post.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, j) => (
                <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article body */}
      <section className="py-12 md:py-16">
        <div className="max-w-[720px] mx-auto px-4 md:px-8">
          {post.excerpt && (
            <div className="mb-10 pl-4 border-l-4 border-[var(--sungold)]">
              <p className="font-body text-[17px] leading-[1.75] text-[var(--white)] font-medium">
                {post.excerpt}
              </p>
            </div>
          )}
          <ArticleBody body={post.body} />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 border-t border-[var(--border)]">
        <div className="max-w-[720px] mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate('/writing')}
            className="btn-ghost inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer bg-transparent text-[var(--white)] border border-[var(--border-md)] rounded-none"
          >
            <ArrowLeft size={14} /> All Articles
          </button>
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;
