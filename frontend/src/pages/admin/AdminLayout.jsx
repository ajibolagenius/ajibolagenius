import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const nav = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/projects', end: false, label: 'Projects' },
  { to: '/admin/blog', end: false, label: 'Blog' },
  { to: '/admin/gallery', end: false, label: 'Gallery' },
  { to: '/admin/courses', end: false, label: 'Courses' },
  { to: '/admin/timeline', end: false, label: 'Timeline' },
  { to: '/admin/testimonials', end: false, label: 'Testimonials' },
  { to: '/admin/personal-info', end: false, label: 'Personal Info' },
  { to: '/admin/messages', end: false, label: 'Messages' },
  { to: '/admin/newsletter', end: false, label: 'Newsletter' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login', { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--void)] flex">
      <aside className="w-56 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <span className="font-display font-bold text-[var(--sungold)] text-sm tracking-wide">Admin</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-auto">
          {nav.map(({ to, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-3 py-2 font-mono text-[12px] tracking-[0.06em] rounded-none transition-colors ${
                  isActive
                    ? 'bg-[var(--sungold)]/15 text-[var(--sungold)] border-l-2 border-[var(--sungold)]'
                    : 'text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--elevated)]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-[var(--border)]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 font-mono text-[11px] text-[var(--subtle)] hover:text-[var(--sungold)]"
          >
            View site →
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 font-mono text-[11px] text-[var(--subtle)] hover:text-[var(--terracotta)]"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
