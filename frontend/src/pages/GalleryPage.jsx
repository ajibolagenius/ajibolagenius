import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGallery } from '../services/api';
import SectionKicker from '../components/portfolio/SectionKicker';
import FilterButtons from '../components/portfolio/FilterButtons';
import SortSelect from '../components/portfolio/SortSelect';
import { usePageMeta } from '../hooks/usePageMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { GallerySkeleton } from '../components/portfolio/SkeletonLayouts';
import { byString, applySort } from '../lib/sortHelpers';
import { paginate } from '../lib/paginate';
import ListPagination from '../components/portfolio/ListPagination';
import OptimizedImage from '../components/portfolio/OptimizedImage';

const FILTER_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'UI', value: 'UI' },
  { label: '3D', value: '3D' },
  { label: 'Graphic', value: 'Graphic' },
  { label: 'Illustration', value: 'Illustration' },
  { label: 'Motion', value: 'Motion' },
  { label: 'Photography', value: 'Photography' },
  { label: 'Branding', value: 'Branding' },
  { label: 'Print', value: 'Print' },
  { label: 'Other', value: 'Other' },
];

const GALLERY_SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
];

const MASONRY_HEIGHTS = [200, 260, 180, 300, 220, 240, 280, 200, 320, 190, 250, 270];
const GALLERY_PAGE_SIZE = 12;

function hasMedia(item) {
  const url = item?.url?.trim();
  return !!url;
}

function isVideo(item) {
  return (item?.media_kind || '').toLowerCase() === 'video';
}

/** Single gallery card: media (image/video) or placeholder */
function GalleryCard({ item, height, onClick }) {
  const url = item?.url?.trim();
  const video = hasMedia(item) && isVideo(item);
  const cardLabel = item?.title ? `View ${item.title}` : 'View gallery item';
  const commonClasses = "relative overflow-hidden border border-[var(--border)] transition-all duration-300 group-hover:border-[rgba(232,160,32,0.25)] cursor-pointer group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]";

  if (url && video) {
    return (
      <button
        type="button"
        className={commonClasses}
        style={{ height: `${height}px` }}
        onClick={onClick}
        aria-label={cardLabel}
      >
        <video
          src={url}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: item.color || 'var(--sungold)' }}>{item.type}</span>
          <span className="font-display text-[14px] font-bold text-[var(--white)]">{item.title}</span>
        </div>
      </button>
    );
  }

  if (url) {
    return (
      <button
        type="button"
        className={commonClasses}
        style={{ height: `${height}px` }}
        onClick={onClick}
        aria-label={cardLabel}
      >
        <OptimizedImage
          src={url}
          alt={item.title ? `Gallery: ${item.title}` : 'Gallery image'}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = e.target.nextElementSibling;
            if (fallback) fallback.classList.remove('opacity-0');
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[var(--surface)] opacity-0 transition-opacity" style={{ backgroundImage: item.color ? `repeating-linear-gradient(45deg, ${item.color}08 0px, ${item.color}08 1px, transparent 1px, transparent 16px)` : undefined }}>
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: item.color || 'var(--sungold)' }}>{item.type}</span>
          <span className="font-display text-[14px] font-bold text-center text-[var(--white)]">{item.title}</span>
        </div>
        <div className="absolute inset-0 bg-[var(--void)]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--sungold)]">View</span>
        </div>
      </button>
    );
  }

  // Placeholder card (no URL)
  return (
    <button
      type="button"
      className={commonClasses}
      style={{
        height: `${height}px`,
        background: 'var(--surface)',
        backgroundImage: item.color ? `repeating-linear-gradient(45deg, ${item.color}08 0px, ${item.color}08 1px, transparent 1px, transparent 16px)` : undefined,
      }}
      onClick={onClick}
      aria-label={cardLabel}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: item.color || 'var(--sungold)' }}>{item.type}</span>
        <span className="font-display text-[14px] font-bold text-center text-[var(--white)]">{item.title}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--void)]/80">
        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--sungold)]">View</span>
      </div>
    </button>
  );
}

const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('title-asc');
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState(null);
  const { data, loading, error, refetch } = useRealtimeQuery('gallery_items', fetchGallery);
  const displayItems = Array.isArray(data) && data.length > 0 ? data : [];
  const filteredByType = filter === 'All' ? displayItems : displayItems.filter((g) => (g.type || '') === filter);
  const filtered = useMemo(() => {
    const comp = sortBy === 'title-desc' ? byString('title', 'desc') : byString('title', 'asc');
    return applySort(filteredByType, comp);
  }, [filteredByType, sortBy]);

  const { items: paginatedItems, totalPages, start, end, total } = useMemo(
    () => paginate(filtered, page, GALLERY_PAGE_SIZE),
    [filtered, page]
  );

  usePageMeta({
    title: 'Gallery',
    description: 'Images and videos: UI, 3D, and graphic work.',
    canonical: '/gallery',
  });

  return (
    <>
      <section className="relative pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)] overflow-hidden">
        {/* Nebula Glow Backdrop */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-[var(--nebula)] opacity-[0.05] blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[80%] bg-[var(--sungold)] opacity-[0.03] blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8">
          <SectionKicker label="Gallery" accent="sungold" />
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Gallery
          </h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] text-[var(--muted)]">
            A curated collection of visual experiments, UI studies, and technical art.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Subtle grid accent for the whole section */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <FilterButtons options={FILTER_OPTIONS} value={filter} onChange={(v) => { setFilter(v); setPage(1); }} label="Type" />
            <div className="flex items-center gap-4">
               <span className="font-mono text-[10px] uppercase text-[var(--subtle)] hidden sm:inline">Sort BY</span>
               <SortSelect options={GALLERY_SORT_OPTIONS} value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} label="" />
            </div>
          </div>

          {loading && displayItems.length === 0 ? (
            <GallerySkeleton count={6} />
          ) : (
            <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6" initial={false}>
              {paginatedItems.map((item, i) => {
                const h = MASONRY_HEIGHTS[(start + i) % MASONRY_HEIGHTS.length];
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="mb-6 break-inside-avoid relative group/item"
                  >
                    {/* Technical corner accent for each card on hover */}
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--sungold)] opacity-0 group-hover/item:opacity-100 transition-all duration-300 z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--sungold)] opacity-0 group-hover/item:opacity-100 transition-all duration-300 z-10 pointer-events-none" />
                    
                    <GalleryCard item={item} height={h} onClick={() => setLightbox(item)} />
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="mt-12">
              <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total }} />
            </div>
          )}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {lightbox ? (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ background: 'var(--modal-backdrop)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox?.title ? `Viewing: ${lightbox.title}` : 'Gallery lightbox'}
          >
            <motion.div className="absolute inset-0" onClick={() => setLightbox(null)} />
            <motion.div
              className="relative max-w-[900px] w-full"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {hasMedia(lightbox) && isVideo(lightbox) ? (
                <div className="bg-[var(--void)] rounded-none overflow-hidden border border-[var(--border-hi)] shadow-sharp-lg">
                  <div className="relative group/vid">
                    <video
                      src={lightbox.url}
                      className="w-full max-h-[75vh] object-contain block"
                      controls
                      autoPlay
                      playsInline
                    />
                    {/* Corner accents inside lightbox */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[var(--sungold)] opacity-40" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[var(--sungold)] opacity-40" />
                  </div>
                  
                  <div className="p-6 bg-[var(--surface)] border-t border-[var(--border-md)] flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 border border-[var(--border-hi)] text-[var(--sungold)]">{lightbox.type}</span>
                        <h2 className="font-display font-bold text-[18px] text-[var(--white)]">{lightbox.title}</h2>
                      </div>
                      {lightbox.description && (
                        <p className="font-body text-[13px] text-[var(--muted)] max-w-[400px] mt-1 line-clamp-2">{lightbox.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <a
                        href={lightbox.url}
                        download={lightbox.title || 'gallery-video'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--white)] hover:text-[var(--sungold)] transition-colors flex items-center gap-2"
                      >
                        <span className="opacity-40">↓</span> Download
                      </a>
                      <div className="w-px h-4 bg-[var(--border-hi)]" />
                      <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        className="font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none text-[var(--sungold)] hover:opacity-80 transition-opacity"
                      >
                        Close [ESC]
                      </button>
                    </div>
                  </div>
                </div>
              ) : hasMedia(lightbox) ? (
                <div className="bg-[var(--surface)] rounded-none overflow-hidden border border-[var(--border-hi)] shadow-sharp-lg">
                  <div className="relative group/img bg-[var(--void)]">
                    <OptimizedImage 
                      src={lightbox.url} 
                      alt={lightbox.title} 
                      className="w-full max-h-[75vh] object-contain block" 
                      highQuality={true}
                    />
                    {/* Corner accents inside lightbox */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[var(--sungold)] opacity-40" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[var(--sungold)] opacity-40" />
                  </div>

                  <div className="p-6 bg-[var(--surface)] border-t border-[var(--border-md)] flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 border border-[var(--border-hi)] text-[var(--sungold)]">{lightbox.type}</span>
                        <h2 className="font-display font-bold text-[18px] text-[var(--white)]">{lightbox.title}</h2>
                      </div>
                      {lightbox.description && (
                         <p className="font-body text-[13px] text-[var(--muted)] max-w-[400px] mt-1 line-clamp-2">{lightbox.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <a
                        href={lightbox.url}
                        download={lightbox.title || 'gallery-image'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--white)] hover:text-[var(--sungold)] transition-colors flex items-center gap-2"
                      >
                        <span className="opacity-40">↓</span> Download Original
                      </a>
                      <div className="w-px h-4 bg-[var(--border-hi)]" />
                      <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        className="font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none text-[var(--sungold)] hover:opacity-80 transition-opacity"
                      >
                        Close [ESC]
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="min-h-[320px] md:min-h-[460px] flex flex-col items-center justify-center relative border border-[var(--border-hi)] shadow-sharp-lg"
                  style={{
                    background: 'var(--surface)',
                    backgroundImage: lightbox.color ? `repeating-linear-gradient(45deg, ${lightbox.color}12 0px, ${lightbox.color}12 1px, transparent 1px, transparent 20px)` : undefined,
                  }}
                >
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[var(--sungold)] opacity-40" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[var(--sungold)] opacity-40" />

                  <span className="font-mono text-[12px] tracking-[0.2em] uppercase mb-4 text-[var(--sungold)] px-3 py-1 border border-[var(--border-hi)]">{lightbox.type}</span>
                  <h2 className="font-display text-[28px] md:text-[42px] font-bold text-center text-[var(--white)] px-8 max-w-[600px] leading-[1.1]">{lightbox.title}</h2>
                  
                  {lightbox.description && (
                    <p className="font-body text-[15px] text-[var(--muted)] text-center max-w-[400px] mt-6 px-4">
                      {lightbox.description}
                    </p>
                  )}

                  <div className="absolute bottom-6 flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setLightbox(null)}
                      className="font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer bg-transparent border border-[var(--border-md)] px-6 py-2 text-[var(--white)] hover:border-[var(--sungold)] transition-colors"
                    >
                      Close Overview
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
            <motion.button
              type="button"
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
