import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

/**
 * Toggle light/dark theme. Uses next-themes; persists to localStorage.
 * Design system: same styling in nav and admin.
 */
export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolvedTheme === 'light' ? '#FAF9F7' : '#07070F');
  }, [mounted, resolvedTheme]);

  const isLight = mounted && resolvedTheme === 'light';

  const handleClick = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <span className="flex items-center justify-center w-9 h-9 border border-[var(--border)] bg-[var(--elevated)] rounded-none" aria-hidden />
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center w-9 h-9 border border-[var(--border)] bg-[var(--elevated)] text-[var(--white)] hover:text-[var(--sungold)] hover:border-[var(--border-hi)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
