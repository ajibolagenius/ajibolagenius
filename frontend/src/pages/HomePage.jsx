import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Projects from '../components/portfolio/Projects';
import Courses from '../components/portfolio/Courses';
import Timeline from '../components/portfolio/Timeline';
import Contact from '../components/portfolio/Contact';

const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Courses />
      <Timeline />
      <Contact />
    </>
  );
};

export default HomePage;
