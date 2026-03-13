import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  { path: '/admin/projects', label: 'Projects', desc: 'Work and case studies' },
  { path: '/admin/blog', label: 'Blog', desc: 'Articles and posts' },
  { path: '/admin/gallery', label: 'Gallery', desc: 'Visual archive items' },
  { path: '/admin/courses', label: 'Courses', desc: 'Teach / courses' },
  { path: '/admin/timeline', label: 'Timeline', desc: 'CV timeline entries' },
  { path: '/admin/testimonials', label: 'Testimonials', desc: 'Student quotes' },
  { path: '/admin/personal-info', label: 'Personal Info', desc: 'Site hero & contact' },
  { path: '/admin/messages', label: 'Messages', desc: 'Contact form submissions' },
  { path: '/admin/newsletter', label: 'Newsletter', desc: 'Subscriber list' },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--white)] mb-2">Dashboard</h1>
      <p className="text-[var(--muted)] text-sm mb-8">Manage portfolio content.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map(({ path, label, desc }) => (
          <Link
            key={path}
            to={path}
            className="block p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--sungold)]/30 transition-colors"
          >
            <span className="font-display font-semibold text-[var(--white)]">{label}</span>
            <p className="text-[13px] text-[var(--muted)] mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
