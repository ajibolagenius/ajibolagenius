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
  education: { table: 'education_entries', order: { column: 'order', ascending: true } },
  certifications: { table: 'certifications', order: { column: 'order', ascending: true } },
  testimonials: { table: 'testimonials' },
  skills: { table: 'skills', order: { column: 'order', ascending: true } },
  assets: { table: 'assets', order: { column: 'sort_order', ascending: true } },
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

const PROJECT_SCREENSHOTS_BUCKET = 'project-screenshots';
const GALLERY_MEDIA_BUCKET = 'gallery-media';
const ASSETS_BUCKET = 'assets';

/**
 * Upload a project screenshot to Storage. Returns the public URL.
 * Use when editing an existing project (projectId required for path).
 * @param {string} projectId - Project UUID
 * @param {File} file - Image file (jpeg, png, webp, gif)
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadProjectScreenshot(projectId, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const name = `${crypto.randomUUID()}.${ext}`;
  const path = `${projectId}/${name}`;
  const { error } = await supabase.storage.from(PROJECT_SCREENSHOTS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(PROJECT_SCREENSHOTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload gallery media (image or video) to Storage. Returns the public URL.
 * @param {File} file - Image (jpeg, png, webp, gif) or video (mp4, webm, quicktime)
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadGalleryMedia(file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const name = `${crypto.randomUUID()}.${ext}`;
  const path = name;
  const { error } = await supabase.storage.from(GALLERY_MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(GALLERY_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Extension → MIME type for asset uploads (must match bucket allowed_mime_types). */
const ASSET_EXT_TO_MIME = {
  zip: 'application/zip',
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  csv: 'text/csv',
  txt: 'text/plain',
  json: 'application/json',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

/**
 * Upload an asset file to Storage. Returns { publicUrl, path, fileName } for storing in assets row.
 * Sends explicit contentType so bucket MIME validation accepts the upload.
 * @param {File} file - Any allowed type (images, PDF, ZIP, etc.)
 * @returns {Promise<{ publicUrl: string, path: string, fileName: string }>}
 */
export async function uploadAssetFile(file) {
  const fileName = file.name || 'download';
  const ext = fileName.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${crypto.randomUUID()}.${ext}`;
  const contentType = file.type || ASSET_EXT_TO_MIME[ext] || 'application/octet-stream';
  const { error } = await supabase.storage.from(ASSETS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path, fileName };
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
  education: {
    list: () => list(tableConfig.education.table, tableConfig.education.order),
    create: (d) => create(tableConfig.education.table, d),
    update: (id, d) => update(tableConfig.education.table, id, d),
    delete: (id) => remove(tableConfig.education.table, id).then(() => ({ status: 'ok' })),
  },
  certifications: {
    list: () => list(tableConfig.certifications.table, tableConfig.certifications.order),
    create: (d) => create(tableConfig.certifications.table, d),
    update: (id, d) => update(tableConfig.certifications.table, id, d),
    delete: (id) => remove(tableConfig.certifications.table, id).then(() => ({ status: 'ok' })),
  },
  testimonials: {
    list: () => list(tableConfig.testimonials.table),
    create: (d) => create(tableConfig.testimonials.table, d),
    update: (id, d) => update(tableConfig.testimonials.table, id, d),
    delete: (id) => remove(tableConfig.testimonials.table, id).then(() => ({ status: 'ok' })),
  },
  skills: {
    list: () => list(tableConfig.skills.table, tableConfig.skills.order),
    create: (d) => create(tableConfig.skills.table, d),
    update: (id, d) => update(tableConfig.skills.table, id, d),
    delete: (id) => remove(tableConfig.skills.table, id).then(() => ({ status: 'ok' })),
  },
  assets: {
    list: () => list(tableConfig.assets.table, tableConfig.assets.order),
    create: (d) => create(tableConfig.assets.table, d),
    update: (id, d) => update(tableConfig.assets.table, id, d),
    delete: (id) => remove(tableConfig.assets.table, id).then(() => ({ status: 'ok' })),
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
          locale: d.locale ?? 'en',
        })
        .eq('id', 1)
        .then(handleResponse)
        .then(() => ({ status: 'ok' })),
  },
  contactMessages: {
    list: () =>
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then(handleResponse),
    delete: (id) => remove('contact_messages', id).then(() => ({ status: 'ok' })),
  },
  newsletterSubscribers: {
    list: () =>
      supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).then(handleResponse),
    delete: (id) => remove('newsletter_subscribers', id).then(() => ({ status: 'ok' })),
  },
  courseWaitlist: {
    list: () =>
      supabase.from('course_waitlist').select('*').order('created_at', { ascending: false }).then(handleResponse),
    delete: (id) => remove('course_waitlist', id).then(() => ({ status: 'ok' })),
  },
  /** Invoke Edge Function to email waitlist when a course is marked open. Call after saving course with open_for_enrolment true. */
  notifyCourseOpen: (courseSlug, courseName) =>
    supabase.functions.invoke('notify-course-open', { body: { course_slug: courseSlug, course_name: courseName } }).then((r) => {
      if (r.error) throw r.error;
      return r.data ?? { ok: false, sent: 0 };
    }),
  stats: async () => {
    const keys = [
      'projects',
      'blog_posts',
      'gallery',
      'courses',
      'timeline',
      'education',
      'certifications',
      'testimonials',
      'assets',
      'contact_messages',
      'newsletter_subscribers',
      'course_waitlist',
    ];
    const tables = [
      'projects',
      'blog_posts',
      'gallery_items',
      'courses',
      'timeline_entries',
      'education_entries',
      'certifications',
      'testimonials',
      'assets',
      'contact_messages',
      'newsletter_subscribers',
      'course_waitlist',
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
  /** Fetch raw created_at for messages and subscribers in the last N days (for analytics charts). */
  analyticsTimeSeries: async (days = 30) => {
    const since = new Date();
    since.setDate(since.getDate() - Math.min(Math.max(Number(days) || 30, 7), 90));
    const iso = since.toISOString();
    const [messagesRes, subsRes] = await Promise.all([
      supabase.from('contact_messages').select('created_at').gte('created_at', iso),
      supabase.from('newsletter_subscribers').select('created_at').gte('created_at', iso),
    ]);
    if (messagesRes.error) throw messagesRes.error;
    if (subsRes.error) throw subsRes.error;
    return { messages: messagesRes.data ?? [], subscribers: subsRes.data ?? [] };
  },
  /** User activity events (auth only). Returns events in the last N days for admin charts. */
  analyticsEvents: async (days = 30) => {
    const since = new Date();
    since.setDate(since.getDate() - Math.min(Math.max(Number(days) || 30, 1), 90));
    const { data, error } = await supabase
      .from('analytics_events')
      .select('id, event_type, path, payload, created_at')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(5000);
    if (error) throw error;
    return data ?? [];
  },
};

export default adminEndpoints;
