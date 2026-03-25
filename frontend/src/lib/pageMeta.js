/**
 * Dynamic page meta and Open Graph. Uses siteConfig for brand defaults.
 */

import {
  SITE_NAME,
  DEFAULT_PAGE_TITLE,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  getTwitterSiteMeta,
} from './siteConfig';

const OG_TYPE_WEBSITE = 'website';
const OG_TYPE_ARTICLE = 'article';

export function getBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}

/** Make a path or root-relative URL absolute using the site base. */
export function absolutizeUrl(href) {
  if (!href || typeof href !== 'string') return '';
  if (href.startsWith('http')) return href;
  const base = getBaseUrl();
  if (!base) return href.startsWith('/') ? href : `/${href}`;
  return `${base}${href.startsWith('/') ? '' : '/'}${href}`;
}

function ensureMeta(nameOrProperty, _attr, content) {
  const isProperty = nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('article:');
  const selector = isProperty
    ? `meta[property="${nameOrProperty}"]`
    : `meta[name="${nameOrProperty}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (isProperty) el.setAttribute('property', nameOrProperty);
    else el.setAttribute('name', nameOrProperty);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content || '');
}

function removeArticleMeta() {
  document.querySelectorAll('meta[property^="article:"]').forEach((n) => n.remove());
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  const base = getBaseUrl();
  const absoluteHref = href?.startsWith('http') ? href : `${base}${href?.startsWith('/') ? '' : '/'}${href || ''}`;
  el.setAttribute('href', absoluteHref);
}

/**
 * @param {{
 *   title?: string;
 *   description?: string;
 *   image?: string;
 *   canonical?: string;
 *   ogType?: 'website' | 'article';
 *   article?: { publishedTime?: string; modifiedTime?: string; section?: string; tag?: string };
 * }} opts
 */
export function setPageMeta(opts = {}) {
  const base = getBaseUrl();
  const title = opts.title ? `${opts.title} — ${SITE_NAME}` : DEFAULT_PAGE_TITLE;
  const description = opts.description || DEFAULT_META_DESCRIPTION;

  let image = opts.image || DEFAULT_OG_IMAGE_PATH;
  if (!image.startsWith('http')) {
    image = `${base}${image.startsWith('/') ? '' : '/'}${image}`;
  }

  const canonical = opts.canonical !== undefined ? opts.canonical : (typeof window !== 'undefined' ? window.location.pathname : '');
  const absoluteUrl = canonical.startsWith('http') ? canonical : `${base}${canonical.startsWith('/') ? '' : '/'}${canonical}`;
  const ogType = opts.ogType || OG_TYPE_WEBSITE;

  document.title = title;
  ensureMeta('description', 'content', description);
  ensureMeta('og:title', 'content', title);
  ensureMeta('og:description', 'content', description);
  ensureMeta('og:image', 'content', image);
  ensureMeta('og:image:width', 'content', String(OG_IMAGE_WIDTH));
  ensureMeta('og:image:height', 'content', String(OG_IMAGE_HEIGHT));
  ensureMeta('og:url', 'content', absoluteUrl);
  ensureMeta('og:type', 'content', ogType);
  ensureMeta('og:site_name', 'content', SITE_NAME);

  ensureMeta('twitter:card', 'content', 'summary_large_image');
  ensureMeta('twitter:title', 'content', title);
  ensureMeta('twitter:description', 'content', description);
  ensureMeta('twitter:image', 'content', image);

  const twitterSite = getTwitterSiteMeta();
  if (twitterSite) ensureMeta('twitter:site', 'content', `@${twitterSite}`);

  removeArticleMeta();
  if (ogType === OG_TYPE_ARTICLE && opts.article) {
    const a = opts.article;
    if (a.publishedTime) ensureMeta('article:published_time', 'content', a.publishedTime);
    if (a.modifiedTime) ensureMeta('article:modified_time', 'content', a.modifiedTime);
    if (a.section) ensureMeta('article:section', 'content', a.section);
    if (a.tag) ensureMeta('article:tag', 'content', a.tag);
  }

  setCanonical(canonical);
}

export function resetPageMeta() {
  setPageMeta({});
}

const STRUCTURED_DATA_ID = 'page-structured-data';

export function setStructuredData(data) {
  let el = document.getElementById(STRUCTURED_DATA_ID);
  if (data == null) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.id = STRUCTURED_DATA_ID;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function clearStructuredData() {
  setStructuredData(null);
}

export {
  SITE_NAME,
  DEFAULT_PAGE_TITLE as DEFAULT_TITLE,
  DEFAULT_META_DESCRIPTION as DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH as DEFAULT_IMAGE,
  OG_TYPE_WEBSITE,
  OG_TYPE_ARTICLE,
};
