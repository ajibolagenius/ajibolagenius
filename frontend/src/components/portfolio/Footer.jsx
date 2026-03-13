import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { personalInfo, navLinks } from '../../data/mock';
import { footerStackNames } from '../../data/techStack';
import Badge from './Badge';
import { BADGE_VARIANTS } from '../../constants';

/**
 * Footer — Design System layout.
 * Deep bg, border-top, minified: brand · tagline · social | nav links | stack badges; copyright row.
 */

const SOCIAL_ICONS = [
  { Icon: Github, href: personalInfo.social?.github, label: 'GitHub' },
  { Icon: Twitter, href: personalInfo.social?.twitter, label: 'Twitter' },
  { Icon: Linkedin, href: personalInfo.social?.linkedin, label: 'LinkedIn' },
].filter(({ href }) => href);

const Footer = () => {
  return (
    <footer className="bg-[var(--deep)] border-t border-[var(--border)] py-6 md:py-8">
      <div className="max-w-[1160px] mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:flex-wrap">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-[15px] font-bold tracking-[0.08em] uppercase text-[var(--sungold)]">
              Ajibola Akelebe.
            </span>
            <span className="text-[var(--border)]" aria-hidden>·</span>
            <p className="font-body text-[13px] text-[var(--muted)]">
              Design & Engineering, No boundaries.
            </p>
            {SOCIAL_ICONS.length > 0 && (
              <>
                <span className="text-[var(--border)]" aria-hidden>·</span>
                <div className="flex gap-3">
                  {SOCIAL_ICONS.map(({ Icon, href, label }) => (
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
                {label}
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
            © 2026 Ajibola Akelebe.
          </p>
          <p className="font-mono text-[10px] text-[var(--dim)]">
            Afrofuturism × Dark Cosmic
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
