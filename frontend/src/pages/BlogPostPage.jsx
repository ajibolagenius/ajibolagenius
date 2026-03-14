import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { fetchBlogPost } from '../services/api';
import { blogPosts as fbPosts } from '../data/mock';
import Badge from '../components/portfolio/Badge';
import { BADGE_VARIANTS } from '../constants';
import { usePageMeta } from '../hooks/usePageMeta';

/** Render body text: paragraphs (split by \n\n) and simple numbered lists (lines like "1. ...") */
function ArticleBody({ body }) {
  if (!body || typeof body !== 'string') return null;

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

  return <div className="article-body">{elements}</div>;
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
          description: post.excerpt || post.description || 'Article by Ajibola Akelebe.',
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
            <p className="font-body text-[16px] leading-[1.7] mb-10 text-[var(--muted)]">
              {post.excerpt}
            </p>
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
