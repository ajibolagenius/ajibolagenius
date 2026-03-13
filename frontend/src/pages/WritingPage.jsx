import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { fetchBlogPosts, subscribeNewsletter } from '../services/api';
import { blogPosts as fbPosts } from '../data/mock';
import { KenteDivider } from '../components/portfolio/About';

const WritingPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [posts, setPosts] = useState([]);
  const [nlEmail, setNlEmail] = useState('');
  const [nlMsg, setNlMsg] = useState('');

  useEffect(() => {
    fetchBlogPosts().then(setPosts).catch(() => setPosts(fbPosts));
  }, []);

  const categories = ['All', ...new Set(posts.map(p => p.category))];
  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);
  const featured = posts[0];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!nlEmail) return;
    try {
      const res = await subscribeNewsletter(nlEmail);
      setNlMsg(res.message);
      setNlEmail('');
    } catch {
      setNlMsg('Something went wrong. Try again.');
    }
    setTimeout(() => setNlMsg(''), 4000);
  };

  if (!featured) return <div className="py-32 text-center font-mono text-[13px]" style={{ color: 'rgba(242,239,232,0.3)' }}>Loading...</div>;

  return (
    <>
      <section className="pt-20 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex items-center gap-2 mb-3"><div className="w-6 h-[1px]" style={{ background: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>Writing</span></div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>Blog & Thoughts</h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px]" style={{ color: 'rgba(242,239,232,0.55)' }}>Writing about design, development, teaching, and the intersection of African identity and technology.</p>
        </div>
      </section>
      <KenteDivider />
      <section className="py-16">
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="p-8 cursor-pointer transition-all duration-300 hover:border-[rgba(232,160,32,0.25)]" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }} onClick={() => navigate(`/writing/${featured.slug || featured.id}`)}>
            <span className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase px-[10px] py-[4px] mb-4 inline-block" style={{ background: 'rgba(232,160,32,0.15)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 0 }}>◆ Featured</span>
            <h2 className="font-display text-[28px] font-extrabold leading-[1.15] mb-3" style={{ color: '#F2EFE8' }}>{featured.title}</h2>
            <p className="font-body text-[15px] leading-[1.7] mb-4 max-w-[640px]" style={{ color: 'rgba(242,239,232,0.55)' }}>{featured.excerpt}</p>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.3)' }}>{featured.date}</span>
              <span className="flex items-center gap-1 font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.3)' }}><Clock size={11} /> {featured.read_time || featured.readTime}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200" style={{ background: filter === cat ? 'rgba(232,160,32,0.15)' : 'transparent', color: filter === cat ? '#E8A020' : 'rgba(242,239,232,0.3)', border: `1px solid ${filter === cat ? 'rgba(232,160,32,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 0 }}>{cat}</button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {filtered.map(post => (
              <div key={post.slug || post.id} className="p-6 cursor-pointer transition-all duration-200 hover:bg-[#17172E]" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }} onClick={() => navigate(`/writing/${post.slug || post.id}`)}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">{post.tags.map((tag, j) => <span key={j} className="font-mono text-[10px] px-2 py-[2px]" style={{ background: '#1E1E3A', color: 'rgba(242,239,232,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>{tag}</span>)}</div>
                    <h3 className="font-display text-[18px] font-bold leading-[1.2] mb-2" style={{ color: '#F2EFE8' }}>{post.title}</h3>
                    <p className="font-body text-[13px] leading-[1.6]" style={{ color: 'rgba(242,239,232,0.45)' }}>{post.excerpt}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.25)' }}>{post.date}</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.25)' }}><Clock size={11} /> {post.read_time || post.readTime}</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="mt-2 flex-shrink-0" style={{ color: '#E8A020' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 p-8" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
            <div className="flex items-center gap-2 mb-3"><div className="w-6 h-[1px]" style={{ background: '#8B72F0' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#8B72F0' }}>Newsletter</span></div>
            <h3 className="font-display text-[20px] font-bold mb-2">Stay in the loop</h3>
            <p className="font-body text-[14px] mb-5" style={{ color: 'rgba(242,239,232,0.55)' }}>Get notified when I publish new articles. No spam, unsubscribe anytime.</p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-[480px]">
              <input type="email" placeholder="your@email.com" value={nlEmail} onChange={e => setNlEmail(e.target.value)} className="flex-1 font-body text-[14px] px-[14px] py-[10px] outline-none" style={{ background: '#17172E', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0, color: '#F2EFE8' }} required />
              <button type="submit" className="font-display text-[13px] font-semibold px-5 py-[10px] border-none cursor-pointer" style={{ background: '#E8A020', color: '#07070F', borderRadius: 0 }}>Subscribe</button>
            </form>
            {nlMsg && <p className="font-mono text-[12px] mt-3" style={{ color: '#E8A020' }}>{nlMsg}</p>}
          </div>
        </div>
      </section>
    </>
  );
};

export default WritingPage;
