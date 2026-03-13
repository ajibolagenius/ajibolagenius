import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { personalInfo } from '../../data/mock';
import { footerStackNames } from '../../data/techStack';

const Footer = () => {
  return (
    <footer className="bg-[var(--deep)] border-t border-[var(--border)] py-12">
      <div className="kente-divider" />
      <div className="max-w-[1160px] mx-auto px-8 pt-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-display text-2xl font-extrabold tracking-[0.08em] uppercase block mb-2 text-[var(--sungold)]">
              AjibolaAkelebe.
            </span>
            <p className="font-body text-[13px] text-[var(--subtle)]">
              Design & Engineering, No boundaries.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--subtle)] transition-colors duration-200 hover:text-[var(--sungold)]"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href={personalInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--subtle)] transition-colors duration-200 hover:text-[var(--sungold)]"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--subtle)] transition-colors duration-200 hover:text-[var(--sungold)]"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase mb-2 text-[var(--subtle)]">
              Built with craft
            </p>
            <p className="font-mono text-[11px] text-[var(--dim)]">
              {footerStackNames.join(' · ')}
            </p>
            <p className="font-mono text-[10px] mt-3 text-[var(--dim)]">
              © 2024 AjibolaAkelebe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
