import React, { useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const mainRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col relative z-[1]">
      <a
        href="#main-content"
        className="skip-link"
        onClick={() => mainRef.current?.focus()}
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
