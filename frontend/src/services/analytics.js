/**
 * User activity tracking: persists events to Supabase (analytics_events) for admin charts / export.
 * Call from public site only; do not track /admin paths.
 */
import { supabase } from '../lib/supabase';

const isPlaceholder = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return !url || String(url).includes('placeholder');
};

export function track(eventType, props = {}) {
  const path = typeof props.path === 'string' ? props.path : (typeof window !== 'undefined' ? window.location?.pathname : '');
  const payload = { ...props };

  if (isPlaceholder()) return;
  supabase
    .from('analytics_events')
    .insert({
      event_type: eventType,
      path: path || payload.path || null,
      payload: payload,
    })
    .then(({ error }) => {
      if (error && import.meta.env.DEV) console.warn('[analytics]', error.message);
    })
    .catch(() => {});
}
