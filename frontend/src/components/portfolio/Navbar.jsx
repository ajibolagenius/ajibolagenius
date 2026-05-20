import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/defaultNav';
import { NAV_HEIGHT } from '../../constants';
import ThemeToggle from './ThemeToggle';
import { useLocale } from '../../contexts/LocaleContext';

/**
 * Public header — editorial studio nav.
 */

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    handleScroll();
    const scrollOpts = { passive: true };
    window.addEventListener('scroll', handleScroll, scrollOpts);
    return () => window.removeEventListener('scroll', handleScroll, scrollOpts);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Scroll progress bar — Design System §08 */}
      <div
        className="scroll-bar fixed top-0 left-0 right-0 h-0.5 bg-[var(--sungold)] z-[999] pointer-events-none"
        style={{ width: `${scrollPct}%` }}
        aria-hidden
      />

      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300 border-b border-[var(--border)] backdrop-blur-[18px] px-4 md:px-8"
        aria-label="Main navigation"
        style={{
          height: `${NAV_HEIGHT}px`,
          background: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        <div className="max-w-[1160px] mx-auto w-full h-full flex items-center justify-between">
          <a
            href="/"
            className="font-display text-[13px] font-bold tracking-[0.14em] uppercase no-underline text-[var(--white)]"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Ajibola Akelebe.
          </a>

          <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-mono text-[12px] tracking-[0.08em] no-underline transition-colors duration-200 hover:text-[var(--sungold)]"
                  style={{
                    color: isActive(link.href) ? 'var(--sungold)' : 'var(--muted)',
                  }}
                >
                  {t('nav_' + link.href.slice(1)) || link.label}
                </a>
              </li>
            ))}
          </ul>

          <span className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.06em] uppercase px-[10px] py-[4px] text-[var(--sungold)] bg-[var(--surface)] border border-[var(--border-md)] rounded-none">
              <span className="hidden sm:inline">◆ </span>Open<span className="hidden sm:inline"> for select work</span>
            </span>
            <ThemeToggle />
          </span>
        </div>

        {/* mobileOpen menu removed in favour of BottomNav */}
      </nav>
    </>
  );
};

export default Navbar;
