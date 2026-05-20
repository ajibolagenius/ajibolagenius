import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/defaultNav';
import { NAV_HEIGHT } from '../../constants';
import ThemeToggle from './ThemeToggle';
import { useLocale } from '../../contexts/LocaleContext';

/**
 * Public header — editorial studio nav with sleek mobile hamburger menu.
 */

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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

        <div className="flex items-center gap-4 z-[1001]">
          <ThemeToggle />
          <button
            className="nav-cta hidden sm:block"
            onClick={(e) => handleNavClick(e, '/contact')}
          >
            Hire Me
          </button>
          <button
            className="lg:hidden p-2 text-[var(--ink)] focus:outline-none relative flex items-center justify-center w-10 h-10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="4"
                y1="6"
                x2="20"
                y2="6"
                style={{
                  transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                  transformOrigin: 'center',
                  transition: 'transform 0.3s var(--ease-out)',
                }}
              />
              <line
                x1="4"
                y1="12"
                x2="20"
                y2="12"
                style={{
                  opacity: menuOpen ? 0 : 1,
                  transition: 'opacity 0.2s var(--ease-out)',
                }}
              />
              <line
                x1="4"
                y1="18"
                x2="20"
                y2="18"
                style={{
                  transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                  transformOrigin: 'center',
                  transition: 'transform 0.3s var(--ease-out)',
                }}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <ul className="mobile-menu-links">
          {navLinks.slice(0, 7).map((link, index) => (
            <li
              key={link.href}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
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
          {/* Add a Hire Me link explicitly on mobile inside the menu overlay since the header cta is hidden */}
          <li style={{ animationDelay: `${7 * 0.08}s` }}>
            <a
              href="/contact"
              onClick={(e) => handleNavClick(e, '/contact')}
              style={{
                color: isActive('/contact') ? 'var(--red)' : 'var(--ink)',
                borderBottom: '1px solid var(--red)'
              }}
            >
              Hire Me
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
