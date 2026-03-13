import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/portfolio/Layout';
import ErrorBoundary from './components/portfolio/ErrorBoundary';
import HomePage from './pages/HomePage';

const WorkPage = lazy(() => import('./pages/WorkPage'));
const WorkDetailPage = lazy(() => import('./pages/WorkDetailPage'));
const TeachPage = lazy(() => import('./pages/TeachPage'));
const WritingPage = lazy(() => import('./pages/WritingPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const CVPage = lazy(() => import('./pages/CVPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="py-32 text-center font-mono text-[13px] text-[var(--subtle)]">
                  Loading…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/work" element={<WorkPage />} />
                <Route path="/work/:slug" element={<WorkDetailPage />} />
                <Route path="/teach" element={<TeachPage />} />
                <Route path="/writing" element={<WritingPage />} />
                <Route path="/writing/:slug" element={<BlogPostPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/cv" element={<CVPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
