import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchGallery } from '../services/api';
import { galleryItems as fbGallery } from '../data/mock';
import { KenteDivider } from '../components/portfolio/About';

const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchGallery().then(setItems).catch(() => setItems(fbGallery));
  }, []);

  const types = ['All', ...new Set(items.map(g => g.type))];
  const filtered = filter === 'All' ? items : items.filter(g => g.type === filter);

  return (
    <>
      <section className="pt-20 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex items-center gap-2 mb-3"><div className="w-6 h-[1px]" style={{ background: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>Gallery</span></div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>Visual Archive</h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px]" style={{ color: 'rgba(242,239,232,0.55)' }}>A collection of UI designs, 3D experiments, and graphic work.</p>
        </div>
      </section>
      <KenteDivider />
      <section className="py-16">
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex gap-2 mb-10">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200" style={{ background: filter === t ? 'rgba(232,160,32,0.15)' : 'transparent', color: filter === t ? '#E8A020' : 'rgba(242,239,232,0.3)', border: `1px solid ${filter === t ? 'rgba(232,160,32,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 0 }}>{t}</button>
            ))}
          </div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filtered.map((item, i) => {
              const heights = [200, 260, 180, 300, 220, 240, 280, 200, 320, 190, 250, 270];
              const h = heights[i % heights.length];
              return (
                <div key={item.id || i} className="mb-4 break-inside-avoid cursor-pointer group transition-all duration-300" onClick={() => setLightbox(item)}>
                  <div className="relative overflow-hidden transition-all duration-300" style={{ height: `${h}px`, background: `linear-gradient(135deg, ${item.color}15, ${item.color}08)`, backgroundColor: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                    <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(45deg, ${item.color}08 0px, ${item.color}08 1px, transparent 1px, transparent 16px)` }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-[12px] tracking-[0.12em] uppercase mb-1" style={{ color: item.color, opacity: 0.6 }}>{item.type}</span>
                      <span className="font-display text-[14px] font-bold text-center px-4" style={{ color: '#F2EFE8' }}>{item.title}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(7,7,15,0.7)' }}>
                      <span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: '#E8A020' }}>View Details</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8" style={{ background: 'rgba(7,7,15,0.92)', backdropFilter: 'blur(20px)' }} onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 bg-transparent border-none cursor-pointer" style={{ color: '#F2EFE8' }} onClick={() => setLightbox(null)}><X size={24} /></button>
          <div className="max-w-[800px] w-full" onClick={e => e.stopPropagation()}>
            <div className="h-[400px] flex flex-col items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${lightbox.color}20, ${lightbox.color}08)`, backgroundColor: '#111126', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0 }}>
              <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(45deg, ${lightbox.color}10 0px, ${lightbox.color}10 1px, transparent 1px, transparent 20px)` }} />
              <span className="font-display text-[16px] tracking-[0.12em] uppercase mb-2 relative z-10" style={{ color: lightbox.color, opacity: 0.7 }}>{lightbox.type}</span>
              <span className="font-display text-[24px] font-bold relative z-10">{lightbox.title}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.3)' }}>{lightbox.type}</span>
              <button onClick={() => setLightbox(null)} className="font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none" style={{ color: '#E8A020' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
