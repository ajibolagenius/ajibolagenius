import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Public endpoints
export const fetchPersonalInfo = () => api.get('/personal-info').then(r => r.data);
export const fetchProjects = () => api.get('/projects').then(r => r.data);
export const fetchProject = (slug) => api.get(`/projects/${slug}`).then(r => r.data);
export const fetchCourses = () => api.get('/courses').then(r => r.data);
export const fetchBlogPosts = () => api.get('/blog-posts').then(r => r.data);
export const fetchBlogPost = (slug) => api.get(`/blog-posts/${slug}`).then(r => r.data);
export const fetchGallery = () => api.get('/gallery').then(r => r.data);
export const fetchTimeline = () => api.get('/timeline').then(r => r.data);
export const fetchTestimonials = () => api.get('/testimonials').then(r => r.data);

// Form submissions
export const submitContact = (data) => api.post('/contact', data).then(r => r.data);
export const subscribeNewsletter = (email) => api.post('/newsletter', { email }).then(r => r.data);

export default api;
