import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Projects from '../components/portfolio/Projects';
import Courses from '../components/portfolio/Courses';
import Skills from '../components/portfolio/Skills';
import Contact from '../components/portfolio/Contact';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildPersonSchema } from '../lib/structuredData';
import { buildStaticPageMeta } from '../lib/routeMeta';

/**
 * Revamped HomePage — Stark print-style editorial studio.
 * Layout Flow: Fixed Nav -> Issue Bar -> Hero -> About -> Work -> Teaching -> Skills -> Contact -> Footer
 */
const HomePage = () => {
  usePageMeta({
    ...buildStaticPageMeta('/'),
    structuredData: buildPersonSchema(),
  });

  return (
    <>
      {/* Editorial Issue Bar (Nigeria · Global Reach) */}
      <div className="issue-bar">
        <span className="issue-info">Nigeria &nbsp;· &nbsp;·&nbsp; Global Reach</span>
        <span className="issue-tag">PORTFOLIO 2026</span>
      </div>

      <Hero />
      <About />
      <Projects />
      <Courses />
      <Skills />
      <Contact />
    </>
  );
};

export default HomePage;
