import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { fetchBlogPost } from '../services/api';
import { blogPosts as fbPosts } from '../data/mock';
import { KenteDivider } from '../components/portfolio/About';

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

  if (loading) return <div className="py-32 text-center font-mono text-[13px]" style={{ color: 'rgba(242,239,232,0.3)' }}>Loading...</div>;
  if (!post) return (
    <section className="py-32"><div className="max-w-[1160px] mx-auto px-8 text-center">
      <h1 className="font-display text-[36px] font-extrabold mb-4">Post not found</h1>
      <button onClick={() => navigate('/writing')} className="font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer" style={{ background: '#E8A020', color: '#07070F', border: 'none', borderRadius: 0 }}>Back to Blog</button>
    </div></section>
  );

  const readTime = post.read_time || post.readTime;

  return (
    <>
      <section className="pt-16 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[720px] mx-auto px-8">
          <button onClick={() => navigate('/writing')} className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase mb-10 cursor-pointer bg-transparent border-none transition-colors duration-200 hover:text-[#E8A020]" style={{ color: 'rgba(242,239,232,0.55)' }}><ArrowLeft size={14} /> Back to Writing</button>
          <div className="flex items-center gap-3 mb-4">{post.tags.map((tag, j) => <span key={j} className="font-mono text-[10px] px-2 py-[2px]" style={{ background: 'rgba(232,160,32,0.15)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 0 }}>{tag}</span>)}</div>
          <h1 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>{post.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.3)' }}>{post.date}</span>
            <span className="flex items-center gap-1 font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.3)' }}><Clock size={11} /> {readTime}</span>
          </div>
          <p className="font-body text-[16px] leading-[1.7] mb-8" style={{ color: 'rgba(242,239,232,0.65)' }}>{post.excerpt}</p>
        </div>
      </section>
      <KenteDivider />
      <section className="py-12">
        <div className="max-w-[720px] mx-auto px-8">
          {post.body.split('\n\n').map((paragraph, i) => (
            <p key={i} className="font-body text-[15px] leading-[1.8] mb-6" style={{ color: 'rgba(242,239,232,0.6)' }}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-[720px] mx-auto px-8">
          <div className="w-full h-[1px] mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <button onClick={() => navigate('/writing')} className="inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer" style={{ background: 'transparent', color: '#F2EFE8', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0 }}><ArrowLeft size={14} /> All Articles</button>
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;
