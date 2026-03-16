import React from 'react';
import { Home, Briefcase, Pencil, LayoutGrid } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/work', label: 'Work', icon: Briefcase },
  { href: '/gallery', label: 'Gallery', icon: LayoutGrid },
  { href: '/writing', label: 'Writing', icon: Pencil },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (href) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-around items-center h-16 bg-[var(--nav-mobile-bg)] backdrop-blur-[20px] border-t border-[var(--border)] pb-safe">
      {navItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <button
            key={item.href}
            onClick={() => handleNav(item.href)}
            className="flex flex-col items-center justify-center w-full h-full text-[var(--muted)] hover:text-[var(--sungold)] transition-colors duration-200"
            style={{ color: active ? 'var(--sungold)' : 'var(--muted)' }}
          >
            <Icon size={20} className="mb-1" />
            <span className="font-mono text-[10px] tracking-[0.05em]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
