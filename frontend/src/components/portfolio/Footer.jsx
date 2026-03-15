import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { personalInfo as fbInfo, navLinks } from '../../data/mock';
import { footerStackNames } from '../../data/techStack';
import Badge from './Badge';
import { BADGE_VARIANTS } from '../../constants';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { fetchPersonalInfo } from '../../services/api';
import { useLocale } from '../../contexts/LocaleContext';

/**
 * Footer — Design System layout.
 * Deep bg, border-top, minified: brand · tagline · social | nav links | stack badges; copyright row.
 * Uses personal_info from Supabase (admin); falls back to mock.
 */

const SOCIAL_CONFIG = [
  { Icon: Github, key: 'github', label: 'GitHub' },
  { Icon: Twitter, key: 'twitter', label: 'Twitter' },
  { Icon: Linkedin, key: 'linkedin', label: 'LinkedIn' },
];

const Footer = () => {
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo, fbInfo);
  const { t } = useLocale();
  const social = info?.social ?? fbInfo.social ?? {};
  const socialIcons = SOCIAL_CONFIG.filter(({ key }) => social[key]).map(({ Icon, key, label }) => ({
    Icon,
    href: social[key],
    label,
  }));

  const name = info?.name ?? fbInfo.name ?? 'Ajibola Akelebe';
  const tagline = [info?.tagline ?? fbInfo.tagline, info?.tagline_suffix ?? fbInfo.taglineSuffix].filter(Boolean).join(' ').trim() || 'Design & Engineering, No boundaries.';

  return (
    <footer className="bg-[var(--deep)] border-t border-[var(--border)] py-6 md:py-8">
      <div className="max-w-[1160px] mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:flex-wrap">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-[15px] font-bold tracking-[0.08em] uppercase text-[var(--sungold)]">
              {name}{name && !name.endsWith('.') ? '.' : ''}
            </span>
            <span className="text-[var(--border)]" aria-hidden>·</span>
            <p className="font-body text-[13px] text-[var(--muted)]">
              {tagline}
            </p>
            {socialIcons.length > 0 && (
              <>
                <span className="text-[var(--border)]" aria-hidden>·</span>
                <div className="flex gap-3">
                  {socialIcons.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--subtle)] hover:text-[var(--sungold)] transition-colors duration-200"
                      aria-label={label}
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--sungold)] transition-colors duration-200"
              >
                {t('nav_' + href.slice(1)) || label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {footerStackNames.map((name, i) => (
              <Badge key={name} variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]}>
                {name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-[var(--dim)]">
            © {new Date().getFullYear()} {name?.trim() || 'Ajibola Akelebe'}.
          </p>
          <p className="font-mono text-[10px] text-[var(--dim)]">
            {t('footer_theme')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
