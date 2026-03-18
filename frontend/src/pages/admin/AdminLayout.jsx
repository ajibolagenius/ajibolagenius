import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../../components/portfolio/ThemeToggle';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const contentNav = [
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/timeline', label: 'Timeline' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/assets', label: 'Assets' },
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
                  : 'text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--elevated)] hover:translate-x-0.5 border-l-2 border-transparent'
              }`
            }
          >
            {isActive => (
              <span className="flex items-center gap-2">
                {isActive && <span className="w-1.5 h-1.5 bg-[var(--sungold)] shrink-0 animate-pulse" style={{ boxShadow: '0 0 6px rgba(232,160,32,0.4)' }} />}
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--void)] flex">
      {/* Mobile sidebar toggle — visible only when sidebar is hidden */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-40 flex items-center justify-center w-10 h-10 border border-[var(--border)] bg-[var(--surface)] text-[var(--white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)]"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open admin menu"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar overlay on mobile when open */}
      {sidebarOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-[var(--void)]/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close admin menu"
        />
      )}

      <aside
        className={`w-60 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col flex-shrink-0 fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Admin navigation"
      >
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between relative">
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--sungold)] opacity-30" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-[var(--sungold)]" aria-hidden />
            <span className="font-display font-bold text-[var(--sungold)] text-[13px] tracking-[0.15em] uppercase">
              Admin
            </span>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 text-[var(--muted)] hover:text-[var(--white)]"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
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
      <main className="flex-1 overflow-auto min-w-0 pt-14 lg:pt-0">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
