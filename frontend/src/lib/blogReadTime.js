/** Words per minute for blog read-time estimates (matches admin editor). */
export const BLOG_READ_WPM = 200;

/**
 * @param {string} body - HTML or plain text article body
 * @returns {string} e.g. "5 min" (minimum 1 min when body is non-empty per editor rules)
 */
export function formatBlogReadTimeFromBody(body) {
  if (!body || typeof body !== 'string') return '1 min';
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return `${Math.max(1, Math.ceil(words / BLOG_READ_WPM))} min`;
}

/**
 * Label for UI: prefer a live estimate from `body` when present so stale DB `read_time` does not stick.
 * @param {{ body?: string, read_time?: string | number, readTime?: string | number } | null | undefined} post
 * @returns {string}
 */
export function getBlogReadTimeDisplay(post) {
  if (!post) return '';
  const body = post.body;
  if (typeof body === 'string' && body.trim().length > 0) {
    return formatBlogReadTimeFromBody(body);
  }
  const stored = post.read_time ?? post.readTime;
  if (stored == null || stored === '') return '';
  if (typeof stored === 'number' && stored > 0) {
    return `${Math.ceil(stored)} min`;
  }
  return String(stored);
}
