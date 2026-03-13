import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Projects from '../components/portfolio/Projects';
import HomeCTA from '../components/portfolio/HomeCTA';

/**
 * Home — Hero (with ticker) · About (stats + Skills & Tools) · Featured projects · CTA
 */
const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <Projects featuredOnly />
      <HomeCTA />
    </>
  );
};

export default HomePage;
