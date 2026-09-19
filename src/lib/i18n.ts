"use client";

import { useSyncExternalStore } from "react";

export type Locale = "en" | "yo";

export const TRANSLATIONS = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      notes: "Notes",
      experience: "Experience",
      about: "About",
      sandbox: "Sandbox",
      cv: "CV / Resume",
      contactMe: "Contact Me",
      search: "Search",
      searchCommands: "Search & Commands",
      skipToContent: "Skip to content",
      toggleMenu: "Toggle menu",
    },
    headings: {
      about: "About",
      experience: "Experience",
      skills: "Skills",
      tools: "Technologies & tools",
      education: "Education",
      certifications: "Certifications",
      recommendations: "Recommendations",
      languages: "Languages",
      connect: "Let's Connect",
      work: "Featured work",
      projects: "Projects",
      notes: "Notes & Writing",
      sandbox: "Sandbox",
      licenses: "Licenses",
    },
    hero: {
      greeting: "Ẹ ǹlẹ́ o!",
      flourish: "Software Engineer & Instructor",
    },
    actions: {
      openCv: "Open CV",
      sendMessage: "Send Message",
      sending: "Sending…",
      backToSite: "Back to site",
      backToProjects: "Back to projects",
      backToLab: "Back to lab",
      allNotes: "All notes",
      returnHome: "Return Home",
      tryAgain: "Try again",
      backToTop: "Back to top",
    },
    contact: {
      namePlaceholder: "Your name",
      emailPlaceholder: "Your email",
      messagePlaceholder: "Your message",
      successTitle: "Message sent",
      successDesc: "Thanks for reaching out — I'll get back to you soon.",
      errorOffline: "Couldn't reach the server. Please try again.",
    },
    footer: {
      builtWith: "Built with Next.js, Supabase, and Tailwind CSS.",
      allRightsReserved: "All rights reserved.",
      licenses: "Licenses",
    },
    notFound: {
      title: "Not Found",
      description:
        "The page you're looking for doesn't exist. Go back home to browse the resume.",
    },
    connect: {
      availability:
        "Currently available for full-time roles, freelance work, and collaborations.",
      emailMe: "Email Me",
      callMe: "Call Me",
      joinNetwork: "Join my network:",
    },
    work: {
      noPreview: "No preview",
      viewAllProjects: "View all projects",
      featuredReel: "Featured reel",
      paused: "Paused",
      auto: "Auto",
      goTo: "Go to",
    },
    sidebar: {
      companies: "{count} companies / institutions",
      projectsShipped: "{count} projects shipped",
      basedIn: "Based in {location}",
    },
    about: {
      keySkills: "Key skills:",
    },
    experience: {
      viewAllRoles: "View all {count} roles",
    },
    share: {
      shareOnX: "Share on X",
      shareOnLinkedIn: "Share on LinkedIn",
      shareOnFacebook: "Share on Facebook",
      shareOnWhatsApp: "Share on WhatsApp",
      share: "Share",
      copyLink: "Copy link",
    },
  },
  yo: {
    nav: {
      home: "Ilé",
      projects: "Àwọn Iṣẹ́",
      notes: "Àkọsílẹ̀",
      experience: "Ìrírí",
      about: "Nípa Mi",
      sandbox: "Yàrá Àdánwò",
      cv: "Ìwé Ìtàn Iṣẹ́ (CV)",
      contactMe: "Kàn sí Mi",
      search: "Ṣàwárí",
      searchCommands: "Ṣàwárí & Àṣẹ",
      skipToContent: "Fò lọ sí àkóónú",
      toggleMenu: "Yí àkójọ padà",
    },
    headings: {
      about: "Nípa Mi",
      experience: "Ìrírí Iṣẹ́",
      skills: "Àwọn Ọgbọ́n & Ẹ̀bùn",
      tools: "Àwọn Irinṣẹ́ & Ọgbọ́n-ẹ̀rọ",
      education: "Ètò Ẹ̀kọ́",
      certifications: "Àwọn Ẹ̀rí-ẹ̀kọ́",
      recommendations: "Àwọn Ẹ̀rí Ọ̀rọ̀",
      languages: "Àwọn Èdè",
      connect: "Ẹ Jẹ́ Ká Sọ̀rọ̀",
      work: "Àwọn Iṣẹ́ Pàtàkì",
      projects: "Àwọn Iṣẹ́ Àkànṣe",
      notes: "Àkọsílẹ̀ & Ìkọ̀wé",
      sandbox: "Yàrá Àdánwò",
      licenses: "Àwọn Ìwé-àṣẹ",
    },
    hero: {
      greeting: "Ẹ ǹlẹ́ o!",
      flourish: "Onímọ̀-ẹ̀rọ Kọ̀ǹpútà & Olùkọ́",
    },
    actions: {
      openCv: "Ṣí CV",
      sendMessage: "Fi Ìfiranṣẹ́ Ranṣẹ́",
      sending: "Ó ń lọ…",
      backToSite: "Padà sí ojúlé",
      backToProjects: "Padà sí àwọn iṣẹ́",
      backToLab: "Padà sí yàrá àdánwò",
      allNotes: "Gbogbo àkọsílẹ̀",
      returnHome: "Padà sí Ilé",
      tryAgain: "Tún gbìyànjú",
      backToTop: "Padà sí òkè",
    },
    contact: {
      namePlaceholder: "Orúkọ rẹ",
      emailPlaceholder: "Imeeli rẹ",
      messagePlaceholder: "Ìfiranṣẹ́ rẹ",
      successTitle: "Ìfiranṣẹ́ ti lọ",
      successDesc: "Ẹ ṣeun fún ìfiranṣẹ́ rẹ — màá fèsì láìpẹ́.",
      errorOffline: "Kò lè bá olupin sọ̀rọ̀. Jọ̀wọ́ tún gbìyànjú lẹ́ẹ̀kan síi.",
    },
    footer: {
      builtWith: "A fi Next.js, Supabase, àti Tailwind CSS kọ́ ọ.",
      allRightsReserved: "Gbogbo ẹ̀tọ́ wà ní ìpamọ́.",
      licenses: "Àwọn Ìwé-àṣẹ",
    },
    notFound: {
      title: "Kò rí ìwé náà",
      description:
        "Ojú ìwé tí o ń wá kò sí. Padà sí ilé láti wo ìwé-ìtàn iṣẹ́ náà.",
    },
    connect: {
      availability:
        "Mo wà ní àyè nísinsin yìí fún iṣẹ́ alákòókò kíkún, iṣẹ́ òmìnira, àti ìfọwọ́sowọ́pọ̀.",
      emailMe: "Fi Ímeèlì Ránṣẹ́ sí Mi",
      callMe: "Pè Mí",
      joinNetwork: "Dara pọ̀ mọ́ nẹ́tíwọ́kì mi:",
    },
    work: {
      noPreview: "Kò sí àwòrán àkọ́kọ́",
      viewAllProjects: "Wo gbogbo àwọn iṣẹ́",
      featuredReel: "Àkójọ Iṣẹ́ Pàtàkì",
      paused: "Ó dúró",
      auto: "Àdáṣiṣẹ́",
      goTo: "Lọ sí",
    },
    sidebar: {
      companies: "{count} àwọn ilé-iṣẹ́ / ilé-ẹ̀kọ́",
      projectsShipped: "{count} àwọn iṣẹ́ tí a parí",
      basedIn: "Ń gbé ní {location}",
    },
    about: {
      keySkills: "Àwọn Ọgbọ́n Pàtàkì:",
    },
    experience: {
      viewAllRoles: "Wo gbogbo iṣẹ́ {count}",
    },
    share: {
      shareOnX: "Fi ránṣẹ́ sórí X",
      shareOnLinkedIn: "Fi ránṣẹ́ sórí LinkedIn",
      shareOnFacebook: "Fi ránṣẹ́ sórí Facebook",
      shareOnWhatsApp: "Fi ránṣẹ́ sórí WhatsApp",
      share: "Fi Ránṣẹ́",
      copyLink: "Dàkọ ọ̀nà asopọ̀",
    },
  },
};

export type TranslationBundle = typeof TRANSLATIONS.en;

function subscribeLanguage(callback: () => void) {
  window.addEventListener("language-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("language-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLanguageSnapshot(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("portfolio_locale");
  return stored === "yo" ? "yo" : "en";
}

function getLanguageServerSnapshot(): Locale {
  return "en";
}

export function useLanguage() {
  const locale = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot,
  );

  const setLocale = (next: Locale) => {
    localStorage.setItem("portfolio_locale", next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
    window.dispatchEvent(new CustomEvent("language-change"));
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "yo" : "en");
  };

  const t: TranslationBundle = TRANSLATIONS[locale];

  return { locale, setLocale, toggleLocale, t };
}
