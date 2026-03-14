/**
 * Slice a list by page and page size. Returns items for current page and metadata.
 * @param {Array} list - Full list
 * @param {number} page - 1-based page index
 * @param {number} pageSize - Items per page
 * @returns {{ items: Array, totalPages: number, start: number, end: number, total: number }}
 */
export function paginate(list, page, pageSize) {
  const total = list?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.max(1, Math.min(page, totalPages));
  const start = (p - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const items = Array.isArray(list) ? list.slice(start, end) : [];
  return { items, totalPages, start, end, total, page: p };
}
