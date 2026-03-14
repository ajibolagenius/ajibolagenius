import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SmoothScrollProvider from './SmoothScrollProvider';
import { track } from '../../services/analytics';

const Layout = ({ children }) => {
  const mainRef = useRef(null);
  const location = useLocation();

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
        Skip to content
      </a>
      <Navbar />
      <main ref={mainRef} id="main-content" className="flex-1 pt-[56px]" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
