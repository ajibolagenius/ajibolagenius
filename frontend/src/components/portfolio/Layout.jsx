import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';
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
    <div className="min-h-screen flex flex-col relative z-[1]">
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
      <main ref={mainRef} id="main-content" className="flex-1 pt-[56px] pb-[64px] md:pb-0" tabIndex={-1}>
        <PullToRefresh onRefresh={() => setTimeout(() => window.location.reload(), 800)}>
          {children}
        </PullToRefresh>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Layout;
