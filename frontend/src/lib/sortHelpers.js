/**
 * Generic sort helpers for list pages. All return a comparator (a, b) => number.
 */

export function byString(key, direction = 'asc') {
  return (a, b) => {
    const va = (a[key] ?? '').toString().toLowerCase();
    const vb = (b[key] ?? '').toString().toLowerCase();
    const cmp = va.localeCompare(vb, undefined, { sensitivity: 'base' });
    return direction === 'desc' ? -cmp : cmp;
  };
}

export function byDate(key, direction = 'desc') {
  return (a, b) => {
    const va = a[key] ? new Date(a[key]).getTime() : 0;
    const vb = b[key] ? new Date(b[key]).getTime() : 0;
    return direction === 'desc' ? vb - va : va - vb;
  };
}

export function byNumber(key, direction = 'asc') {
  return (a, b) => {
    const va = Number(a[key]) || 0;
    const vb = Number(b[key]) || 0;
    return direction === 'desc' ? vb - va : va - vb;
  };
}

/** Parse price strings like "₦350K" or "350000" to a number for sorting. */
export function byPrice(key, direction = 'asc') {
  return (a, b) => {
    const parse = (v) => {
      if (v == null) return 0;
      const s = String(v).replace(/[^\d.]/g, '').trim();
      if (!s) return 0;
      const n = parseFloat(s);
      if (String(v).toUpperCase().includes('K')) return n * 1000;
      return n;
    };
    const va = parse(a[key]);
    const vb = parse(b[key]);
    return direction === 'desc' ? vb - va : va - vb;
  };
}

export function applySort(list, comparator) {
  return [...list].sort(comparator);
}
