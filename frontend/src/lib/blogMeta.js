/**
 * Blog SEO / social copy. Excerpt is the primary listing blurb; meta_description is a fallback
 * when excerpt is empty (e.g. legacy rows or SEO-only overrides), so editing excerpt in admin
 * updates share previews without having to duplicate into meta_description.
 */
export function blogPostShareDescription(post, fallback = '') {
  if (!post) return fallback;
  const excerpt = typeof post.excerpt === 'string' ? post.excerpt.trim() : '';
  const meta = typeof post.meta_description === 'string' ? post.meta_description.trim() : '';
  const desc = typeof post.description === 'string' ? post.description.trim() : '';
  const title = typeof post.title === 'string' ? post.title.trim() : '';
  return excerpt || meta || desc || title || fallback;
}

/** Root-relative or absolute og_image from CMS; empty if missing or whitespace-only. */
export function blogPostCustomOgImage(post) {
  if (!post?.og_image || typeof post.og_image !== 'string') return '';
  return post.og_image.trim();
}
