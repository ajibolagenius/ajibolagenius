import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Projects from '../components/portfolio/Projects';
import SkillsOrbit from '../components/portfolio/SkillsOrbit';
import HomeCTA from '../components/portfolio/HomeCTA';

/**
 * Home — design-system.html Site Map:
 * Hero (3D + name) · Ticker · About snapshot · Featured projects (3) · Skills orbit · CTA (contact/courses)
 */
const HomePage = () => {
  return (
    <>
      <Hero />
      <About snapshot />
      <Projects featuredOnly />
      <SkillsOrbit />
      <HomeCTA />
    </>
  );
};

export default HomePage;
