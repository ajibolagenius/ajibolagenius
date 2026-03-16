import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Image component with lazy loading and optional optimization.
 * - Uses native loading="lazy" and decoding="async" by default.
 * - Set priority={true} for above-the-fold / LCP images (eager load + fetchpriority="high").
 * - Optional fade-in on load to reduce visual pop-in.
 * - Pass sizes for responsive hints (used with srcset if provided; improves LCP).
 */
const OptimizedImage = React.forwardRef(
  (props, ref) => {
    const {
      src,
      alt = '',
      className,
      loading: loadingProp,
      decoding: decodingProp,
      priority = false,
      fadeIn = false,
      highQuality = false,
      sizes,
      onLoad,
      onError,
      ...rest
    } = props;

    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);
    const resolvedRef = ref ?? imgRef;

    const loading = highQuality ? 'eager' : (loadingProp ?? (priority ? 'eager' : 'lazy'));
    const fetchPriority = (priority || highQuality) ? 'high' : undefined;
    const decoding = highQuality ? 'sync' : decodingProp || 'async';

    const handleLoad = (e) => {
      setLoaded(true);
      onLoad?.(e);
    };

    const img = (
      <img
        ref={resolvedRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={sizes}
        className={cn(
          fadeIn && !loaded && 'opacity-0',
          fadeIn && loaded && 'opacity-100 transition-opacity duration-300',
          className
        )}
        onLoad={handleLoad}
        onError={handleLoad} // Still mark as "loaded" visually on error to avoid infinite opacity-0
        {...rest}
      />
    );

    if (fadeIn) {
      return (
        <span className={cn('block overflow-hidden', rest.style?.objectFit && 'relative')} style={{ minHeight: 1 }}>
          {img}
        </span>
      );
    }
    return img;
  }
);
OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
