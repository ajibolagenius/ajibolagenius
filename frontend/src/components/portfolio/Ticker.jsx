import React from 'react';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { fetchProjects, fetchCourses, fetchSkills, fetchPersonalInfo } from '../../services/api';
import { personalInfo as fallbackInfo, tickerItems as fallbackTicker } from '../../data/mock';

/**
 * Build ticker items dynamically from live API data.
 * Falls back gracefully to mock data when API is unavailable.
 */
function buildTickerItems({ info, projects, courses, skills }) {
  const name = info?.name || fallbackInfo?.name || 'DON_GENIUS';
  const role = info?.role || fallbackInfo?.role || 'Design + Engineering';
  const location = info?.location || fallbackInfo?.location || 'Nigeria';

  const projectCount = Array.isArray(projects) ? projects.length : 0;
  const courseCount = Array.isArray(courses) ? courses.length : 0;

  // Top 4 skill names for the tech ticker line
  const topSkills = Array.isArray(skills) && skills.length > 0
    ? skills.slice(0, 4).map((s) => s.name).join(' · ')
    : 'Next.js · React · Tailwind';

  return [
    'Afrofuturism × Dark Cosmic',
    role,
    topSkills,
    name.toUpperCase().replace(/\s+/g, '_'),
    `From ${location}, For the World`,
    `${courseCount} Courses · ${projectCount} Projects`,
  ];
}

const Ticker = () => {
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo, fallbackInfo);
  const { data: projects } = useRealtimeQuery('projects', fetchProjects, []);
  const { data: courses } = useRealtimeQuery('courses', fetchCourses, []);
  const { data: skills } = useRealtimeQuery('skills', fetchSkills, []);

  const dynamicItems = buildTickerItems({ info, projects, courses, skills });
  // Duplicate for seamless infinite scroll
  const items = [...dynamicItems, ...dynamicItems];

  return (
    <div className="w-full overflow-hidden bg-[var(--elevated)] border-t border-b border-[var(--border)] py-2">
      <div className="ticker-track flex items-center gap-12 whitespace-nowrap font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--subtle)]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="text-[var(--sungold)]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
