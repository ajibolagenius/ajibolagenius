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
      <section className="pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <SectionKicker label="Gallery" accent="sungold" />
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Gallery
          </h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] text-[var(--muted)]">
            Images and videos: UI, 3D, and graphic work.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <FilterButtons options={FILTER_OPTIONS} value={filter} onChange={(v) => { setFilter(v); setPage(1); }} label="Type" />
            <SortSelect options={GALLERY_SORT_OPTIONS} value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} label="Sort" />
          </div>
          {loading && displayItems.length === 0 ? (
            <GallerySkeleton count={6} />
          ) : (
            <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4" initial={false}>
              {paginatedItems.map((item, i) => {
                const h = MASONRY_HEIGHTS[(start + i) % MASONRY_HEIGHTS.length];
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mb-4 break-inside-avoid"
                  >
                    <GalleryCard item={item} height={h} onClick={() => setLightbox(item)} />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          {!loading && filtered.length > 0 && (
            <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total }} />
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
                <div className="bg-[var(--void)] rounded overflow-hidden border border-[var(--border-md)]">
                  <video
                    src={lightbox.url}
                    className="w-full max-h-[70vh] object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                  <div className="p-4 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-mono text-[11px] tracking-[0.12em] uppercase mr-2" style={{ color: lightbox.color || 'var(--sungold)' }}>{lightbox.type}</span>
                      <span className="font-display font-bold text-[var(--white)]">{lightbox.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLightbox(null)}
                      className="font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none text-[var(--sungold)] hover:opacity-80 transition-opacity"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : hasMedia(lightbox) ? (
                <div className="bg-[var(--surface)] rounded overflow-hidden border border-[var(--border-md)]">
                  <OptimizedImage src={lightbox.url} alt={lightbox.title ? `Gallery: ${lightbox.title}` : 'Gallery image'} className="w-full max-h-[70vh] object-contain" loading="eager" />
                  <div className="p-4 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-mono text-[11px] tracking-[0.12em] uppercase mr-2" style={{ color: lightbox.color || 'var(--sungold)' }}>{lightbox.type}</span>
                      <span className="font-display font-bold text-[var(--white)]">{lightbox.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLightbox(null)}
                      className="font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none text-[var(--sungold)] hover:opacity-80 transition-opacity"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="min-h-[320px] md:min-h-[400px] flex flex-col items-center justify-center relative border border-[var(--border-md)] rounded"
                  style={{
                    background: 'var(--surface)',
                    backgroundImage: lightbox.color ? `repeating-linear-gradient(45deg, ${lightbox.color}12 0px, ${lightbox.color}12 1px, transparent 1px, transparent 20px)` : undefined,
                  }}
                >
                  <span className="font-mono text-[12px] tracking-[0.12em] uppercase mb-2" style={{ color: lightbox.color || 'var(--sungold)' }}>{lightbox.type}</span>
                  <span className="font-display text-[22px] md:text-[28px] font-bold text-center text-[var(--white)] px-4">{lightbox.title}</span>
                  <div className="mt-4 flex items-center justify-between w-full px-4">
                    <span className="font-mono text-[11px] text-[var(--subtle)]">{lightbox.type}</span>
                    <button
                      type="button"
                      onClick={() => setLightbox(null)}
                      className="font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none text-[var(--sungold)] hover:opacity-80 transition-opacity"
                    >
                      Close
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
