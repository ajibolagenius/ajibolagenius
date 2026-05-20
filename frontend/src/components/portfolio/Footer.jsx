import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { navLinks } from '../../data/defaultNav';
import { getPersonalInfoQueryFallback } from '../../lib/personalInfoFallbacks';
import { SITE_NAME } from '../../lib/siteConfig';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { fetchPersonalInfo } from '../../services/api';
import { useLocale } from '../../contexts/LocaleContext';

/**
 * Footer — public editorial system.
 */

const fbInfo = getPersonalInfoQueryFallback();

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

  const name = (info?.name ?? fbInfo.name ?? '').trim() || SITE_NAME;
  const tagline =
    [info?.tagline ?? fbInfo.tagline, info?.tagline_suffix ?? fbInfo.taglineSuffix].filter(Boolean).join(' ').trim() ||
    'Design & Engineering, No boundaries.';

  return (
    <footer>
      <span className="footer-copy">
        © {new Date().getFullYear()} {name}. All rights reserved.
      </span>
      <span className="footer-handle">DON_GENIUS</span>
      <div className="footer-socials">
        {social.github && (
          <a href={social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
        {social.linkedin && (
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
        {social.twitter && (
          <a href={social.twitter} target="_blank" rel="noopener noreferrer">
            Twitter/X
          </a>
        )}
        {social.dribbble && (
          <a href={social.dribbble} target="_blank" rel="noopener noreferrer">
            Dribbble
          </a>
        )}
      </div>
    </footer>
  );
};

export default Footer;
