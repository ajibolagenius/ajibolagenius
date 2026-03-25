/**
 * Dynamic page meta and Open Graph — design system brand.
 * Single source for site name and default description; updates document and meta tags.
 */

const SITE_NAME = 'Ajibola Akelebe';
const DEFAULT_TITLE = `${SITE_NAME} — Design & Engineering`;
const DEFAULT_DESCRIPTION = 'Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn.';
const DEFAULT_IMAGE = '/og-image.png';
const OG_TYPE_WEBSITE = 'website';
const OG_TYPE_ARTICLE = 'article';

/** Base URL for absolute canonical and og:image (set VITE_SITE_URL in production). */
export function getBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}

const META_KEYS = {
  description: { name: 'description', attr: 'content' },
  ogTitle: { property: 'og:title', attr: 'content' },
  ogDescription: { property: 'og:description', attr: 'content' },
  ogImage: { property: 'og:image', attr: 'content' },
  ogUrl: { property: 'og:url', attr: 'content' },
  ogType: { property: 'og:type', attr: 'content' },
  twitterCard: { name: 'twitter:card', attr: 'content' },
  twitterTitle: { name: 'twitter:title', attr: 'content' },
  twitterDescription: { name: 'twitter:description', attr: 'content' },
  twitterImage: { name: 'twitter:image', attr: 'content' },
};

function ensureMeta(nameOrProperty, _attr, content) {
  const isProperty = nameOrProperty.startsWith('og:');
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
 * Update document title and meta tags. Call from usePageMeta or when head must be set imperatively.
 * @param {{
 *   title?: string;
 *   description?: string;
 *   image?: string;
 *   canonical?: string;
 *   ogType?: 'website' | 'article';
 * }} opts
 */
export function setPageMeta(opts = {}) {
  const base = getBaseUrl();
  const title = opts.title ? `${opts.title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const description = opts.description || DEFAULT_DESCRIPTION;
  
  // Ensure image is absolute
  let image = opts.image || DEFAULT_IMAGE;
  if (!image.startsWith('http')) {
    image = `${base}${image.startsWith('/') ? '' : '/'}${image}`;
  }
  
  // Default canonical to exact visiting URL path if not explicitly provided
  const canonical = opts.canonical !== undefined ? opts.canonical : (typeof window !== 'undefined' ? window.location.pathname : '');
  const absoluteUrl = canonical.startsWith('http') ? canonical : `${base}${canonical.startsWith('/') ? '' : '/'}${canonical}`;
  const ogType = opts.ogType || OG_TYPE_WEBSITE;

  document.title = title;
  ensureMeta('description', 'content', description);
  ensureMeta('og:title', 'content', title);
  ensureMeta('og:description', 'content', description);
  ensureMeta('og:image', 'content', image);
  ensureMeta('og:url', 'content', absoluteUrl);
  ensureMeta('og:type', 'content', ogType);
  
  ensureMeta('twitter:card', 'content', 'summary_large_image');
  ensureMeta('twitter:title', 'content', title);
  ensureMeta('twitter:description', 'content', description);
  ensureMeta('twitter:image', 'content', image);
  
  setCanonical(canonical);
}

/** Restore default meta (e.g. on route leave). */
export function resetPageMeta() {
  setPageMeta({});
}

const STRUCTURED_DATA_ID = 'page-structured-data';

/**
 * Set or clear JSON-LD structured data (one script tag). Call with null to remove.
 * @param {object | null} data - JSON-LD object (e.g. Person, BlogPosting, Course)
 */
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

/** Clear structured data (e.g. on route leave). */
export function clearStructuredData() {
  setStructuredData(null);
}

export { SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_IMAGE, OG_TYPE_WEBSITE, OG_TYPE_ARTICLE };
