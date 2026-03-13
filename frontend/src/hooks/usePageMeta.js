import { useEffect } from 'react';
import { setPageMeta, resetPageMeta } from '../lib/pageMeta';

/**
 * Set document title and OG/meta for the current page. Restores defaults on unmount.
 * Use on every page; pass dynamic title/description for detail pages.
 *
 * @param {{
 *   title?: string;
 *   description?: string;
 *   image?: string;
 *   canonical?: string;
 *   ogType?: 'website' | 'article';
 * }} opts
 */
export function usePageMeta(opts) {
  useEffect(() => {
    setPageMeta(opts ?? {});
    return () => resetPageMeta();
  }, [opts?.title, opts?.description, opts?.image, opts?.canonical, opts?.ogType]);
}
