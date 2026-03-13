import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { personalInfo, navLinks } from '../../data/mock';
import { footerStackNames } from '../../data/techStack';
import Badge from './Badge';

const badgeVariants = ['gold', 'cosmic', 'cyan', 'terra'];

const Footer = () => {
  return (
    <footer className="bg-[var(--deep)] border-t border-[var(--border)] py-6 md:py-8">
      <div className="max-w-[1160px] mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:flex-wrap">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-[15px] font-bold tracking-[0.08em] uppercase text-[var(--sungold)]">
              Ajibola Akelebe.
            </span>
            <span className="text-[var(--border)]">·</span>
            <p className="font-body text-[13px] text-[var(--muted)]">
              Design & Engineering, No boundaries.
            </p>
            <span className="text-[var(--border)]">·</span>
            <div className="flex gap-3">
              <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="text-[var(--subtle)] hover:text-[var(--sungold)] transition-colors" aria-label="GitHub"><Github size={14} /></a>
              <a href={personalInfo.social.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--subtle)] hover:text-[var(--sungold)] transition-colors" aria-label="Twitter"><Twitter size={14} /></a>
              <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--subtle)] hover:text-[var(--sungold)] transition-colors" aria-label="LinkedIn"><Linkedin size={14} /></a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--sungold)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {footerStackNames.map((name, i) => (
              <Badge key={name} variant={badgeVariants[i % badgeVariants.length]}>
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
