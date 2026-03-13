import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API = `${BASE}/api`;

function getToken() {
  return localStorage.getItem('admin_token');
}

export const adminApi = axios.create({
  baseURL: API,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email, password) =>
    adminApi.post('/auth/login', { email, password }).then((r) => r.data),
};

export const adminEndpoints = {
  projects: { list: () => adminApi.get('/projects').then((r) => r.data), create: (d) => adminApi.post('/admin/projects', d).then((r) => r.data), update: (id, d) => adminApi.put(`/admin/projects/${id}`, d).then((r) => r.data), delete: (id) => adminApi.delete(`/admin/projects/${id}`).then((r) => r.data) },
  blogPosts: { list: () => adminApi.get('/blog-posts').then((r) => r.data), create: (d) => adminApi.post('/admin/blog-posts', d).then((r) => r.data), update: (id, d) => adminApi.put(`/admin/blog-posts/${id}`, d).then((r) => r.data), delete: (id) => adminApi.delete(`/admin/blog-posts/${id}`).then((r) => r.data) },
  gallery: { list: () => adminApi.get('/gallery').then((r) => r.data), create: (d) => adminApi.post('/admin/gallery', d).then((r) => r.data), update: (id, d) => adminApi.put(`/admin/gallery/${id}`, d).then((r) => r.data), delete: (id) => adminApi.delete(`/admin/gallery/${id}`).then((r) => r.data) },
  courses: { list: () => adminApi.get('/courses').then((r) => r.data), create: (d) => adminApi.post('/admin/courses', d).then((r) => r.data), update: (id, d) => adminApi.put(`/admin/courses/${id}`, d).then((r) => r.data), delete: (id) => adminApi.delete(`/admin/courses/${id}`).then((r) => r.data) },
  timeline: { list: () => adminApi.get('/timeline').then((r) => r.data), create: (d) => adminApi.post('/admin/timeline', d).then((r) => r.data), update: (id, d) => adminApi.put(`/admin/timeline/${id}`, d).then((r) => r.data), delete: (id) => adminApi.delete(`/admin/timeline/${id}`).then((r) => r.data) },
  testimonials: { list: () => adminApi.get('/testimonials').then((r) => r.data), create: (d) => adminApi.post('/admin/testimonials', d).then((r) => r.data), update: (id, d) => adminApi.put(`/admin/testimonials/${id}`, d).then((r) => r.data), delete: (id) => adminApi.delete(`/admin/testimonials/${id}`).then((r) => r.data) },
  personalInfo: { get: () => adminApi.get('/personal-info').then((r) => r.data), update: (d) => adminApi.put('/admin/personal-info', d).then((r) => r.data) },
  contactMessages: { list: () => adminApi.get('/admin/contact-messages').then((r) => r.data) },
  newsletterSubscribers: { list: () => adminApi.get('/admin/newsletter-subscribers').then((r) => r.data) },
};

export default adminApi;
