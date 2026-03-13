import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Projects from '../components/portfolio/Projects';
import HomeCTA from '../components/portfolio/HomeCTA';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Home — Hero (with ticker) · About (stats + Skills & Tools) · Featured projects · CTA
 */
const HomePage = () => {
  usePageMeta({ title: 'Design & Engineering', description: 'Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn.' });
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
