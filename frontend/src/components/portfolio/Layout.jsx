import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative z-[1]">
      <Navbar />
      <main className="flex-1 pt-[56px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
