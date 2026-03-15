import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/portfolio/ThemeToggle';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const contentNav = [
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/timeline', label: 'Timeline' },
  { to: '/admin/testimonials', label: 'Testimonials' },
];

const engagementNav = [
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/newsletter', label: 'Newsletter' },
  { to: '/admin/waitlist', label: 'Waitlist' },
];

const settingsNav = [
  { to: '/admin/personal-info', label: 'Personal Info' },
];

function NavGroup({ title, items }) {
  return (
    <div className="mb-6">
      <span className="block px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--subtle)]">
        {title}
      </span>
      <div className="mt-0.5 space-y-0.5">
        {items.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-3 py-2 font-mono text-[12px] tracking-[0.06em] transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--sungold)]/15 text-[var(--sungold)] border-l-2 border-[var(--sungold)] shadow-[var(--shadow-sharp-sm)]'
                  : 'text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--elevated)] border-l-2 border-transparent'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--void)] flex">
      <aside className="w-60 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-[var(--sungold)]" aria-hidden />
            <span className="font-display font-bold text-[var(--sungold)] text-[13px] tracking-[0.15em] uppercase">
              Admin
            </span>
          </div>
        </div>
        <nav className="flex-1 p-3 overflow-auto">
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `block px-3 py-2 font-mono text-[12px] tracking-[0.06em] mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--sungold)]/15 text-[var(--sungold)] border-l-2 border-[var(--sungold)]'
                  : 'text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--elevated)] border-l-2 border-transparent'
              }`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-3 py-2 font-mono text-[12px] tracking-[0.06em] mb-4 transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--sungold)]/15 text-[var(--sungold)] border-l-2 border-[var(--sungold)]'
                  : 'text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--elevated)] border-l-2 border-transparent'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavGroup title="Content" items={contentNav} />
          <NavGroup title="Engagement" items={engagementNav} />
          <NavGroup title="Settings" items={settingsNav} />
        </nav>
        <div className="p-3 border-t border-[var(--border)] space-y-0.5">
          <div className="flex items-center gap-2 px-3 py-2">
            <ThemeToggle />
            <span className="font-mono text-[11px] text-[var(--subtle)]">Theme</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 font-mono text-[11px] text-[var(--subtle)] hover:text-[var(--sungold)] transition-colors"
          >
            View site →
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 font-mono text-[11px] text-[var(--subtle)] hover:text-[var(--terracotta)] transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto min-w-0">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
