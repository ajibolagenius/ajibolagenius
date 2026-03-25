import { useEffect } from 'react';
import { setPageMeta, resetPageMeta, setStructuredData, clearStructuredData } from '../lib/pageMeta';

/**
 * Set document title and OG/meta for the current page. Restores defaults on unmount.
 * Use on every page; pass dynamic title/description for detail pages.
 * Pass structuredData (JSON-LD object) to inject schema.org data for search.
 *
 * @param {{
 *   title?: string;
 *   description?: string;
 *   image?: string;
 *   canonical?: string;
 *   ogType?: 'website' | 'article';
 *   article?: { publishedTime?: string; modifiedTime?: string; section?: string; tag?: string };
 *   structuredData?: object | null;
 * }} opts
 */
export function usePageMeta(opts) {
  useEffect(() => {
    setPageMeta(opts ?? {});
    if (opts?.structuredData != null) setStructuredData(opts.structuredData);
    return () => {
      resetPageMeta();
      clearStructuredData();
    };
  }, [
    opts?.title,
    opts?.description,
    opts?.image,
    opts?.canonical,
    opts?.ogType,
    opts?.article ? JSON.stringify(opts.article) : null,
    opts?.structuredData ? JSON.stringify(opts.structuredData) : null,
  ]);
}
