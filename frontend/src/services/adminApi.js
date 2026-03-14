/**
 * Admin API — CRUD and stats using Supabase with authenticated session.
 * Requires user to be signed in via Supabase Auth; RLS enforces access.
 */
import { supabase } from '../lib/supabase';

function handleResponse({ data, error }) {
  if (error) {
    if (error.message?.toLowerCase().includes('jwt') || error.message?.toLowerCase().includes('expired')) {
      supabase.auth.signOut();
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    throw error;
  }
  return data;
}

const tableConfig = {
  projects: { table: 'projects', order: { column: 'created_at', ascending: false } },
  blogPosts: { table: 'blog_posts', order: { column: 'date', ascending: false } },
  gallery: { table: 'gallery_items' },
  courses: { table: 'courses' },
  timeline: { table: 'timeline_entries', order: { column: 'order', ascending: true } },
  testimonials: { table: 'testimonials' },
};

function list(tableName, order) {
  let q = supabase.from(tableName).select('*');
  if (order) q = q.order(order.column, { ascending: order.ascending });
  return q.then(handleResponse);
}

function create(tableName, payload) {
  return supabase.from(tableName).insert(payload).select().single().then(handleResponse);
}

async function update(tableName, id, payload) {
  const { id: _id, created_at: _ca, ...rest } = payload ?? {};
  const r = await supabase.from(tableName).update(rest).eq('id', id).select();
  handleResponse(r);
  return { status: 'ok', id };
}

function remove(tableName, id) {
  return supabase.from(tableName).delete().eq('id', id).then(handleResponse);
}

export const adminEndpoints = {
  projects: {
    list: () => list(tableConfig.projects.table, tableConfig.projects.order),
    create: (d) => create(tableConfig.projects.table, d),
    update: (id, d) => update(tableConfig.projects.table, id, d),
    delete: (id) => remove(tableConfig.projects.table, id).then(() => ({ status: 'ok' })),
  },
  blogPosts: {
    list: () => list(tableConfig.blogPosts.table, tableConfig.blogPosts.order),
    create: (d) => create(tableConfig.blogPosts.table, d),
    update: (id, d) => update(tableConfig.blogPosts.table, id, d),
    delete: (id) => remove(tableConfig.blogPosts.table, id).then(() => ({ status: 'ok' })),
  },
  gallery: {
    list: () => list(tableConfig.gallery.table),
    create: (d) => create(tableConfig.gallery.table, d),
    update: (id, d) => update(tableConfig.gallery.table, id, d),
    delete: (id) => remove(tableConfig.gallery.table, id).then(() => ({ status: 'ok' })),
  },
  courses: {
    list: () => list(tableConfig.courses.table),
    create: (d) => create(tableConfig.courses.table, d),
    update: (id, d) => update(tableConfig.courses.table, id, d),
    delete: (id) => remove(tableConfig.courses.table, id).then(() => ({ status: 'ok' })),
  },
  timeline: {
    list: () => list(tableConfig.timeline.table, tableConfig.timeline.order),
    create: (d) => create(tableConfig.timeline.table, d),
    update: (id, d) => update(tableConfig.timeline.table, id, d),
    delete: (id) => remove(tableConfig.timeline.table, id).then(() => ({ status: 'ok' })),
  },
  testimonials: {
    list: () => list(tableConfig.testimonials.table),
    create: (d) => create(tableConfig.testimonials.table, d),
    update: (id, d) => update(tableConfig.testimonials.table, id, d),
    delete: (id) => remove(tableConfig.testimonials.table, id).then(() => ({ status: 'ok' })),
  },
  personalInfo: {
    get: () => supabase.from('personal_info').select('*').eq('id', 1).single().then(handleResponse),
    update: (d) =>
      supabase
        .from('personal_info')
        .update({
          name: d.name,
          tagline: d.tagline,
          tagline_suffix: d.tagline_suffix,
          description: d.description,
          role: d.role,
          email: d.email,
          location: d.location,
          availability: d.availability,
          social: d.social ?? {},
        })
        .eq('id', 1)
        .then(handleResponse)
        .then(() => ({ status: 'ok' })),
  },
  contactMessages: {
    list: () =>
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then(handleResponse),
  },
  newsletterSubscribers: {
    list: () =>
      supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).then(handleResponse),
  },
  stats: async () => {
    const keys = [
      'projects',
      'blog_posts',
      'gallery',
      'courses',
      'timeline',
      'testimonials',
      'contact_messages',
      'newsletter_subscribers',
    ];
    const tables = [
      'projects',
      'blog_posts',
      'gallery_items',
      'courses',
      'timeline_entries',
      'testimonials',
      'contact_messages',
      'newsletter_subscribers',
    ];
    const counts = {};
    await Promise.all(
      tables.map(async (table, i) => {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        counts[keys[i]] = error ? 0 : count ?? 0;
      })
    );
    const [messagesRes, subsRes] = await Promise.all([
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).limit(5),
    ]);
    if (messagesRes.error) throw messagesRes.error;
    if (subsRes.error) throw subsRes.error;
    return {
      counts,
      recent_messages: messagesRes.data ?? [],
      recent_subscribers: subsRes.data ?? [],
    };
  },
};

export default adminEndpoints;
