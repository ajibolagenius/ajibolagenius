import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Cursor from './Cursor';
import SmoothScrollProvider from './SmoothScrollProvider';
import PullToRefresh from './PullToRefresh';
import { track } from '../../services/analytics';
import { useLocale } from '../../contexts/LocaleContext';

const Layout = ({ children }) => {
  const mainRef = useRef(null);
  const location = useLocation();
  const { t } = useLocale();

  useEffect(() => {
    if (location?.pathname) track('page_view', { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative z-[1] editorial-shell">
      <Cursor />
      <SmoothScrollProvider />
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        {t('skip_to_content')}
      </a>
      <Navbar />
      <main ref={mainRef} id="main-content" className="flex-1 pt-[72px]" tabIndex={-1}>
        <PullToRefresh onRefresh={() => setTimeout(() => window.location.reload(), 800)}>
          {children}
        </PullToRefresh>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
