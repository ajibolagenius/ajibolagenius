import React, { useState } from 'react';
import { Home, Briefcase, Pencil, GraduationCap, MoreHorizontal, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/work', label: 'Work', icon: Briefcase },
  { href: '/teach', label: 'Teach', icon: GraduationCap },
  { href: '/writing', label: 'Writing', icon: Pencil },
];

const BottomNav = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (href) => {
    navigate(href);
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const moreLinks = [
    { label: "Gallery", href: "/gallery" },
    { label: "CV", href: "/cv" },
    { label: "Search", href: "/search" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <>
      {/* Backdrop for closing 'More' Menu */}
      {moreOpen && (
        <div 
          className="fixed inset-0 z-30 md:hidden" 
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* Sliding 'More' Menu */}
      <div 
        className={`fixed inset-x-0 bottom-16 z-40 bg-[var(--nav-mobile-bg)] backdrop-blur-[20px] border-t border-[var(--border)] transition-transform duration-300 ease-in-out md:hidden flex flex-col ${moreOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex flex-col p-4 gap-2">
           {moreLinks.map((link) => (
             <button
               key={link.href}
               onClick={() => handleNav(link.href)}
               className="text-left font-mono text-[13px] tracking-[0.08em] no-underline transition-colors duration-200 py-3 px-2 rounded-md hover:bg-[var(--void)] hover:text-[var(--sungold)]"
               style={{
                 color: isActive(link.href) ? 'var(--sungold)' : 'var(--muted)',
               }}
             >
               {link.label}
             </button>
           ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-around items-center h-16 bg-[var(--nav-mobile-bg)] backdrop-blur-[20px] border-t border-[var(--border)] pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
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
        
        {/* 'More' Toggle Button */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="flex flex-col items-center justify-center w-full h-full text-[var(--muted)] hover:text-[var(--sungold)] transition-colors duration-200"
          style={{ color: moreOpen ? 'var(--sungold)' : 'var(--muted)' }}
        >
          {moreOpen ? <X size={20} className="mb-1" /> : <MoreHorizontal size={20} className="mb-1" />}
          <span className="font-mono text-[10px] tracking-[0.05em]">More</span>
        </button>
      </nav>
    </>
  );
};

export default BottomNav;
