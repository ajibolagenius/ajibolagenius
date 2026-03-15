/**
 * Image URL helpers for optimization (e.g. Supabase Storage transforms).
 * Supabase Pro supports /storage/v1/render/image/public/bucket/path?width=&quality=
 */

const SUPABASE_OBJECT_PREFIX = '/storage/v1/object/public/';
const SUPABASE_RENDER_PREFIX = '/storage/v1/render/image/public/';

/**
 * If src is a Supabase Storage public URL, return a transform URL with optional width/height/quality.
 * Otherwise return src unchanged. Requires Supabase Pro for image transforms.
 * @param {string} src - Full image URL
 * @param {{ width?: number; height?: number; quality?: number }} [opts]
 * @returns {string}
 */
export function getOptimizedImageUrl(src, opts = {}) {
  if (!src || typeof src !== 'string') return src;
  try {
    const u = new URL(src);
    const path = u.pathname;
    if (!path.includes(SUPABASE_OBJECT_PREFIX)) return src;
    const renderPath = path.replace(SUPABASE_OBJECT_PREFIX, SUPABASE_RENDER_PREFIX);
    const params = new URLSearchParams();
    if (opts.width != null) params.set('width', String(opts.width));
    if (opts.height != null) params.set('height', String(opts.height));
    if (opts.quality != null) params.set('quality', String(Math.min(100, Math.max(20, opts.quality))));
    const qs = params.toString();
    return `${u.origin}${renderPath}${qs ? `?${qs}` : ''}`;
  } catch {
    return src;
  }
}

/** Default sizes for full-width content (e.g. gallery, project hero) on a max-w-[1160px] layout. */
export const DEFAULT_IMAGE_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1160px';
