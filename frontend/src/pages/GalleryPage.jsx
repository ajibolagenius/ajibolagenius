import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGallery } from '../services/api';
import { galleryItems as fbGallery } from '../data/mock';
import SectionKicker from '../components/portfolio/SectionKicker';
import FilterButtons from '../components/portfolio/FilterButtons';

const FILTER_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'UI', value: 'UI' },
  { label: '3D', value: '3D' },
  { label: 'Graphic', value: 'Graphic' },
];

/** Masonry-style heights for grid variety */
const MASONRY_HEIGHTS = [200, 260, 180, 300, 220, 240, 280, 200, 320, 190, 250, 270];

const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchGallery().then(setItems).catch(() => setItems(fbGallery));
  }, []);

  const displayItems = items.length > 0 ? items : fbGallery;
  const filtered = filter === 'All' ? displayItems : displayItems.filter(g => g.type === filter);

  return (
    <>
      <section className="pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <SectionKicker label="Gallery" accent="sungold" />
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Visual Archive
          </h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] text-[var(--muted)]">
            A collection of UI designs, 3D experiments, and graphic work.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="mb-8">
            <FilterButtons options={FILTER_OPTIONS} value={filter} onChange={setFilter} label="Type" />
          </div>

          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-4"
            initial={false}
          >
            {filtered.map((item, i) => {
              const h = MASONRY_HEIGHTS[i % MASONRY_HEIGHTS.length];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-4 break-inside-avoid cursor-pointer group"
                  onClick={() => setLightbox(item)}
                >
                  <div
                    className="relative overflow-hidden border border-[var(--border)] transition-all duration-300 group-hover:border-[rgba(232,160,32,0.25)]"
                    style={{
                      height: `${h}px`,
                      background: 'var(--surface)',
                      backgroundImage: `repeating-linear-gradient(45deg, ${item.color}08 0px, ${item.color}08 1px, transparent 1px, transparent 16px)`
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <span
                        className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2"
                        style={{ color: item.color }}
                      >
                        {item.type}
                      </span>
                      <span className="font-display text-[14px] font-bold text-center text-[var(--white)]">
                        {item.title}
                      </span>
                    </div>
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--void)]/80"
                    >
                      <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--sungold)]">
                        View
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {lightbox ? (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(7,7,15,0.92)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            />
            <motion.div
              className="relative max-w-[800px] w-full"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="min-h-[320px] md:min-h-[400px] flex flex-col items-center justify-center relative border border-[var(--border-md)]"
                style={{
                  background: 'var(--surface)',
                  backgroundImage: `repeating-linear-gradient(45deg, ${lightbox.color}12 0px, ${lightbox.color}12 1px, transparent 1px, transparent 20px)`
                }}
              >
                <span
                  className="font-mono text-[12px] tracking-[0.12em] uppercase mb-2"
                  style={{ color: lightbox.color }}
                >
                  {lightbox.type}
                </span>
                <span className="font-display text-[22px] md:text-[28px] font-bold text-center text-[var(--white)] px-4">
                  {lightbox.title}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[11px] text-[var(--subtle)]">{lightbox.type}</span>
                <button
                  onClick={() => setLightbox(null)}
                  className="font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none text-[var(--sungold)] hover:opacity-80 transition-opacity"
                >
                  Close
                </button>
              </div>
            </motion.div>
            <motion.button
              className="absolute top-6 right-6 p-2 bg-transparent border-none cursor-pointer text-[var(--white)] hover:text-[var(--sungold)] transition-colors"
              onClick={() => setLightbox(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close"
            >
              <X size={24} />
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;
