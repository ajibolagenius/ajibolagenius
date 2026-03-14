/**
 * Public API for portfolio data and forms.
 * All reads/writes go through Supabase; falls back to mock data when fetch fails (handled by callers).
 */
import { supabase } from '../lib/supabase';

function handleResponse({ data, error }) {
  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('404')) {
      const e = new Error(error.message);
      e.status = 404;
      throw e;
    }
    if (error.code) console.warn('[API]', error.code, error.message);
    throw error;
  }
  return data;
}

// Public read (portfolio content, no auth)
export const fetchPersonalInfo = () =>
  supabase.from('personal_info').select('*').eq('id', 1).single().then(handleResponse);

export const fetchProjects = () =>
  supabase.from('projects').select('*').order('created_at', { ascending: false }).then(handleResponse);

export const fetchProject = (slug) =>
  supabase.from('projects').select('*').eq('slug', slug).maybeSingle().then((r) => {
    if (r.error) return handleResponse(r);
    if (r.data === null) {
      const e = new Error('Project not found');
      e.status = 404;
      throw e;
    }
    return r.data;
  });

export const fetchCourses = () =>
  supabase.from('courses').select('*').then(handleResponse);

export const fetchBlogPosts = () =>
  supabase.from('blog_posts').select('*').order('date', { ascending: false }).then(handleResponse);

export const fetchBlogPost = (slug) =>
  supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle().then((r) => {
    if (r.error) return handleResponse(r);
    if (r.data === null) {
      const e = new Error('Post not found');
      e.status = 404;
      throw e;
    }
    return r.data;
  });

export const fetchGallery = () =>
  supabase.from('gallery_items').select('*').then(handleResponse);

export const fetchTimeline = () =>
  supabase.from('timeline_entries').select('*').order('order', { ascending: true }).then(handleResponse);

export const fetchTestimonials = () =>
  supabase.from('testimonials').select('*').then(handleResponse);

// Public write (contact form, newsletter — anon insert)
export const submitContact = async (data) => {
  const r = await supabase
    .from('contact_messages')
    .insert({ name: data.name, email: data.email, subject: data.subject ?? '', message: data.message });
  handleResponse(r);
  return { status: 'ok', message: "Message received! I'll get back to you soon." };
};

export const subscribeNewsletter = async (email) => {
  const { data, error } = await supabase.from('newsletter_subscribers').insert({ email }).select();
  if (error) {
    if (error.code === '23505') return { status: 'ok', message: "You're already subscribed!" };
    throw error;
  }
  return { status: 'ok', message: "Subscribed! You'll hear from me soon." };
};
