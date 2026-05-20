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
      <div
        className="scroll-bar fixed top-0 left-0 right-0 h-0.5 bg-[var(--red)] z-[999] pointer-events-none"
        style={{ width: `${scrollPct}%` }}
        aria-hidden
      />

      <nav>
        <a
          href="/"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span>A</span>jibola Akelebe
        </a>

        <ul className="nav-links hidden lg:flex">
          {navLinks.slice(0, 7).map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: isActive(link.href) ? 'var(--red)' : 'var(--ink)',
                }}
              >
                {t('nav_' + link.href.slice(1)) || link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            className="nav-cta"
            onClick={(e) => handleNavClick(e, '/contact')}
          >
            Hire Me
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
