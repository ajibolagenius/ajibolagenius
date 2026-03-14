import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

const isPlaceholder =
  import.meta.env.VITE_SUPABASE_URL === undefined ||
  import.meta.env.VITE_SUPABASE_URL === '' ||
  (typeof import.meta.env.VITE_SUPABASE_URL === 'string' && import.meta.env.VITE_SUPABASE_URL.includes('placeholder'));

/**
 * Fetches data on mount and subscribes to Supabase Realtime for the table.
 * When the table changes (INSERT/UPDATE/DELETE), data is refetched so the UI stays in sync.
 * Enable Realtime in Supabase: Database → Replication → add the table to supabase_realtime publication.
 *
 * @param {string} tableName - Supabase table name (e.g. 'projects', 'blog_posts', 'personal_info')
 * @param {() => Promise<any>} fetchFn - Function that returns the current data (e.g. fetchProjects)
 * @param {any} [fallback] - Fallback value when fetch fails
 * @param {{ enabled?: boolean }} [options] - enabled: false to skip fetch and realtime (default true)
 * @returns {{ data: any, loading: boolean, error: Error | null, refetch: () => Promise<void> }}
 */
export function useRealtimeQuery(tableName, fetchFn, fallback = null, options = {}) {
  const { enabled = true } = options;
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const refetch = useCallback(async () => {
    if (!enabled) return;
    setError(null);
    try {
      const result = await fetchFnRef.current();
      setData(result);
    } catch (e) {
      setError(e);
      if (fallback !== undefined) setData(fallback);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const result = await fetchFnRef.current();
        if (mounted) setData(result);
      } catch (e) {
        if (mounted) {
          setError(e);
          if (fallback !== undefined) setData(fallback);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    if (!tableName || isPlaceholder) {
      return () => { mounted = false; };
    }

    const channel = supabase
      .channel(`realtime:${tableName}:${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          if (mounted) refetch();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [tableName, enabled]);

  return { data, loading, error, refetch };
}
