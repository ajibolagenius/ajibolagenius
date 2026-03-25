/**
 * JSON-LD structured data builders for schema.org (Person, BlogPosting, Course).
 * Used with setStructuredData / usePageMeta for rich search results.
 */
import { getBaseUrl } from './pageMeta';
import { SITE_NAME, DEFAULT_META_DESCRIPTION } from './siteConfig';

export function buildPersonSchema(opts = {}) {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: opts.name || SITE_NAME,
    description: opts.description || DEFAULT_META_DESCRIPTION,
    url: base,
    image: opts.image ? (opts.image.startsWith('http') ? opts.image : `${base}${opts.image.startsWith('/') ? '' : '/'}${opts.image}`) : `${base}/og-image.png`,
  };
}

export function buildBlogPostingSchema(post, baseUrl) {
  const base = baseUrl || getBaseUrl();
  const url = `${base}/writing/${post.slug || ''}`;
  const image = post.og_image
    ? (post.og_image.startsWith('http') ? post.og_image : `${base}${post.og_image.startsWith('/') ? '' : '/'}${post.og_image}`)
    : `${base}/og-image.png`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt || post.description || post.title,
    image,
    url,
    datePublished: post.date || post.published_at,
    dateModified: post.updated_at || post.date || post.published_at,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_NAME,
      image: `${base}/og-image.png`,
    },
  };
}

export function buildCourseSchema(course, baseUrl) {
  const base = baseUrl || getBaseUrl();
  return {
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Person',
      name: SITE_NAME,
    },
    ...(course.duration && { timeRequired: course.duration }),
  };
}

/** ItemList of Course for the Teach page. */
export function buildTeachPageSchema(courses, baseUrl) {
  const base = baseUrl || getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Courses by ${SITE_NAME}`,
    description: 'Teaching what I know — courses and mentorship.',
    url: `${base}/teach`,
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 20).map((course, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: buildCourseSchema(course, base),
    })),
  };
}
