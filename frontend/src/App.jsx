import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/portfolio/Layout';
import ErrorBoundary from './components/portfolio/ErrorBoundary';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import AdminRoute from './pages/admin/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import HomePage from './pages/HomePage';

const WorkPage = lazy(() => import('./pages/WorkPage'));
const WorkDetailPage = lazy(() => import('./pages/WorkDetailPage'));
const TeachPage = lazy(() => import('./pages/TeachPage'));
const WritingPage = lazy(() => import('./pages/WritingPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const CVPage = lazy(() => import('./pages/CVPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage'));
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage'));
const AdminTimelinePage = lazy(() => import('./pages/admin/AdminTimelinePage'));
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'));
const AdminPersonalInfoPage = lazy(() => import('./pages/admin/AdminPersonalInfoPage'));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'));
const AdminNewsletterPage = lazy(() => import('./pages/admin/AdminNewsletterPage'));
const AdminWaitlistPage = lazy(() => import('./pages/admin/AdminWaitlistPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));

const adminFallback = (
  <div className="py-32 text-center font-mono text-[13px] text-[var(--subtle)]">Loading…</div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<Suspense fallback={adminFallback}><AdminProjectsPage /></Suspense>} />
              <Route path="blog" element={<Suspense fallback={adminFallback}><AdminBlogPage /></Suspense>} />
              <Route path="gallery" element={<Suspense fallback={adminFallback}><AdminGalleryPage /></Suspense>} />
              <Route path="courses" element={<Suspense fallback={adminFallback}><AdminCoursesPage /></Suspense>} />
              <Route path="timeline" element={<Suspense fallback={adminFallback}><AdminTimelinePage /></Suspense>} />
              <Route path="testimonials" element={<Suspense fallback={adminFallback}><AdminTestimonialsPage /></Suspense>} />
              <Route path="personal-info" element={<Suspense fallback={adminFallback}><AdminPersonalInfoPage /></Suspense>} />
              <Route path="messages" element={<Suspense fallback={adminFallback}><AdminMessagesPage /></Suspense>} />
              <Route path="newsletter" element={<Suspense fallback={adminFallback}><AdminNewsletterPage /></Suspense>} />
              <Route path="waitlist" element={<Suspense fallback={adminFallback}><AdminWaitlistPage /></Suspense>} />
              <Route path="analytics" element={<Suspense fallback={adminFallback}><AdminAnalyticsPage /></Suspense>} />
            </Route>

            <Route path="/" element={<Layout><ErrorBoundary><Outlet /></ErrorBoundary></Layout>}>
              <Route index element={<HomePage />} />
              <Route path="work" element={<Suspense fallback={adminFallback}><WorkPage /></Suspense>} />
              <Route path="work/:slug" element={<Suspense fallback={adminFallback}><WorkDetailPage /></Suspense>} />
              <Route path="teach" element={<Suspense fallback={adminFallback}><TeachPage /></Suspense>} />
              <Route path="writing" element={<Suspense fallback={adminFallback}><WritingPage /></Suspense>} />
              <Route path="writing/:slug" element={<Suspense fallback={adminFallback}><BlogPostPage /></Suspense>} />
              <Route path="gallery" element={<Suspense fallback={adminFallback}><GalleryPage /></Suspense>} />
              <Route path="cv" element={<Suspense fallback={adminFallback}><CVPage /></Suspense>} />
              <Route path="contact" element={<Suspense fallback={adminFallback}><ContactPage /></Suspense>} />
              <Route path="search" element={<Suspense fallback={adminFallback}><SearchPage /></Suspense>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
