"use client";

import { useState } from "react";
import {
  LinkSimple,
  Check,
  XLogo,
  LinkedinLogo,
  FacebookLogo,
} from "@phosphor-icons/react/dist/ssr";

export function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: XLogo,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedinLogo,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookLogo,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-body-xs uppercase tracking-wide text-ink/40">
        Share
      </span>
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center border border-ink/20 text-ink/70 transition-colors hover:border-ink hover:text-ink"
        >
          <Icon weight="duotone" size={16} />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="inline-flex h-9 w-9 items-center justify-center border border-ink/20 text-ink/70 transition-colors hover:border-ink hover:text-ink"
      >
        {copied ? (
          <Check weight="duotone" size={16} />
        ) : (
          <LinkSimple weight="duotone" size={16} />
        )}
      </button>
    </div>
  );
}
