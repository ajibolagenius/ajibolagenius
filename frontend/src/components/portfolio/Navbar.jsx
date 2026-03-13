import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/mock';

/**
 * Header / Nav — Design System §08 Nav
 * Sticky 56px, rgba(7,7,15,0.85) + backdrop blur, bottom border.
 * Logo: Syne 13px 700, uppercase, 0.15em, --sungold.
 * Links: Space Mono 12px, muted, hover sungold.
 * Version: mono 11px, subtle, elevated bg, sharp, border.
 * Scroll progress bar: fixed top, 2px, --sungold, width % by scroll, z-999.
 */
const NAV_HEIGHT = 56;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
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
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300 border-b border-[var(--border)] backdrop-blur-[20px] px-4 md:px-8"
        style={{
          height: `${NAV_HEIGHT}px`,
          background: scrolled ? 'rgba(7,7,15,0.92)' : 'rgba(7,7,15,0.85)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-[1160px] mx-auto w-full h-full flex items-center justify-between">
          <a
            href="/"
            className="font-display text-[13px] font-bold tracking-[0.15em] uppercase no-underline text-[var(--sungold)]"
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
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <span className="hidden md:inline-block font-mono text-[11px] px-[10px] py-[3px] text-[var(--subtle)] bg-[var(--elevated)] border border-[var(--border)] rounded-none">
            v1.0
          </span>

          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 border-none bg-transparent cursor-pointer text-[var(--white)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="md:hidden absolute left-0 right-0 py-6 px-4 bg-[rgba(7,7,15,0.97)] backdrop-blur-[20px] border-b border-[var(--border)]"
            style={{ top: `${NAV_HEIGHT}px` }}
          >
            <ul className="list-none m-0 p-0 flex flex-col gap-4">
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
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
