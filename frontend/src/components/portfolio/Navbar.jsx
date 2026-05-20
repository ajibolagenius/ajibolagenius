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

        <ul className="nav-links">
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          <button
            className="nav-cta"
            onClick={(e) => handleNavClick(e, '/contact')}
          >
            Hire Me
          </button>
          {/* Hamburger — shown via .nav-hamburger CSS class at <1024px */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="3" y1="6" x2="21" y2="6"
                style={{
                  transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'translateY(0) rotate(0)',
                  transformOrigin: '50% 50%',
                  transition: 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              />
              <line
                x1="3" y1="12" x2="21" y2="12"
                style={{
                  opacity: menuOpen ? 0 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />
              <line
                x1="3" y1="18" x2="21" y2="18"
                style={{
                  transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'translateY(0) rotate(0)',
                  transformOrigin: '50% 50%',
                  transition: 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
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
