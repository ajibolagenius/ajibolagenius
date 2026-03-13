import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/mock';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between transition-all duration-300 border-b border-[var(--border)] backdrop-blur-[20px] px-8"
      style={{
        background: scrolled ? 'rgba(7,7,15,0.92)' : 'rgba(7,7,15,0.85)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-[1160px] mx-auto w-full h-full flex items-center justify-between">
        {/* Logo — gradient per design system */}
        <a
          href="/"
          className="font-display text-[13px] font-bold tracking-[0.15em] uppercase no-underline bg-clip-text text-transparent bg-gradient-to-br from-[var(--sungold)] to-[var(--violet)]"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          AjibolaAkelebe.
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-mono text-xs tracking-[0.08em] no-underline transition-colors duration-200 hover:text-[var(--sungold)]"
                style={{
                  color: isActive(link.href) ? 'var(--sungold)' : 'var(--muted)'
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Version badge - desktop */}
        <span className="hidden md:inline-block font-mono text-[11px] px-[10px] py-[3px] text-[var(--subtle)] bg-[var(--elevated)] border border-[var(--border)] rounded-none">
          v1.0
        </span>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 border-none bg-transparent cursor-pointer text-[var(--white)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 py-6 px-8 bg-[rgba(7,7,15,0.97)] backdrop-blur-[20px] border-b border-[var(--border)]">
          <ul className="list-none m-0 p-0 flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-mono text-sm tracking-[0.08em] no-underline transition-colors duration-200 hover:text-[var(--sungold)]"
                  style={{
                    color: isActive(link.href) ? 'var(--sungold)' : 'var(--muted)'
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
  );
};

export default Navbar;
