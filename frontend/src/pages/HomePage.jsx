import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Projects from '../components/portfolio/Projects';
import Courses from '../components/portfolio/Courses';
import Skills from '../components/portfolio/Skills';
import Contact from '../components/portfolio/Contact';
import { fetchCourses, fetchPersonalInfo, fetchProjects, fetchSkills } from '../services/api';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildPersonSchema } from '../lib/structuredData';
import { buildStaticPageMeta } from '../lib/routeMeta';

/**
 * Revamped HomePage — Stark print-style editorial studio.
 * Layout Flow: Fixed Nav -> Issue Bar -> Hero -> About -> Work -> Teaching -> Skills -> Contact -> Footer
 */
const HomePage = () => {
  const personalInfo = useRealtimeQuery('personal_info', fetchPersonalInfo, null);
  const projects = useRealtimeQuery('projects', fetchProjects, []);
  const courses = useRealtimeQuery('courses', fetchCourses, []);
  const skills = useRealtimeQuery('skills', fetchSkills, []);

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

      <Hero query={personalInfo} />
      <About personalInfoQuery={personalInfo} skillsQuery={skills} />
      <Projects query={projects} />
      <Courses query={courses} personalInfoQuery={personalInfo} />
      <Skills query={skills} />
      <Contact query={personalInfo} />
    </>
  );
};

export default HomePage;
