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
      work: "Work",
      writing: "Writing",
      contact: "Contact",
      cv: "CV",
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
    /** Homepage section labels, set small in the left rail. */
    labels: {
      work: "selected work",
      kindWords: "kind words",
      experience: "experience",
      writing: "writing",
      contact: "contact",
      owe: "òwe",
      shownOf: "{shown} of {total}",
      since: "{year} to now",
      writingSub: "case studies & notes",
      oweSub: "a proverb I work by",
      available: "available now",
    },
    hero: {
      welcome: "Ẹ kú àbọ̀. Welcome.",
      currentlyAt: "Currently at",
      and: "and",
      inLagos: "in Lagos",
      lastCommit: "last commit {time} on",
      seeWork: "See selected work",
      playTrack: "Play {title} by {artist}",
      pauseTrack: "Pause {title}",
      projectsShipped: "{count} projects shipped",
    },
    actions: {
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
      writeTo: "Write to me at",
      myEmail: "my email",
      findMe: "or find me on",
      and: "and",
      copy: "Copy address",
      copied: "Copied",
      orWhatsApp: "or WhatsApp",
      orMessage: "Or send a message",
    },
    work: {
      noPreview: "No preview",
      viewAllProjects: "View all projects",
      allProjects: "All {count} projects, client and side",
      goTo: "Go to",
      previous: "Previous project",
      next: "Next project",
      pause: "pause",
      play: "play",
      problem: "Problem",
      decision: "Key decision",
      result: "Result",
      caseStudy: "Case study",
      status: {
        live: "Live",
        "in-progress": "In progress",
        archived: "Archived",
      } as Record<string, string>,
    },
    experience: {
      fullHistory: "Full history, education and certificates on the CV",
    },
    owe: {
      work: "work",
      cure: "medicine, the cure",
      want: "poverty, want",
      meaning:
        "Work is the cure for want. The same letters, a different tone, and the meaning turns around. I like a language where the detail decides everything.",
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
      work: "Iṣẹ́",
      writing: "Ìkọ̀wé",
      contact: "Kàn sí Mi",
      cv: "CV",
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
    labels: {
      work: "iṣẹ́ àṣàyàn",
      kindWords: "ọ̀rọ̀ rere",
      experience: "ìrírí",
      writing: "ìkọ̀wé",
      contact: "kàn sí mi",
      owe: "òwe",
      shownOf: "{shown} nínú {total}",
      since: "láti {year} títí di òní",
      writingSub: "ìtàn iṣẹ́ & àkọsílẹ̀",
      oweSub: "òwe tí mo fi ń ṣiṣẹ́",
      available: "mo wà lárọ̀ọ́wọ́tó",
    },
    hero: {
      welcome: "Ẹ kú àbọ̀ o!",
      currentlyAt: "Lọ́wọ́lọ́wọ́, mo wà ní",
      and: "àti",
      inLagos: "ní Èkó",
      lastCommit: "kóòdù tó kẹ́yìn {time} ní",
      seeWork: "Wo àwọn iṣẹ́ àṣàyàn",
      playTrack: "Ṣe {title} láti ọwọ́ {artist}",
      pauseTrack: "Dá {title} dúró",
      projectsShipped: "{count} àwọn iṣẹ́ tí a parí",
    },
    actions: {
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
      writeTo: "Kọ̀wé sí mi ní",
      myEmail: "ímeèlì mi",
      findMe: "tàbí wá mi lórí",
      and: "àti",
      copy: "Dàkọ àdírẹ́sì",
      copied: "Ó ti dàkọ",
      orWhatsApp: "tàbí WhatsApp",
      orMessage: "Tàbí fi ìfiranṣẹ́ ránṣẹ́",
    },
    work: {
      noPreview: "Kò sí àwòrán àkọ́kọ́",
      viewAllProjects: "Wo gbogbo àwọn iṣẹ́",
      allProjects: "Gbogbo iṣẹ́ {count}, ti oníbàárà àti ti ara mi",
      goTo: "Lọ sí",
      previous: "Iṣẹ́ tó ṣáájú",
      next: "Iṣẹ́ tó kàn",
      pause: "dádúró",
      play: "tẹ̀síwájú",
      problem: "Ìṣòro",
      decision: "Ìpinnu pàtàkì",
      result: "Àbájáde",
      caseStudy: "Ìtàn iṣẹ́",
      status: {
        live: "Ó ti jáde",
        "in-progress": "Ó ń lọ lọ́wọ́",
        archived: "Ti fi pamọ́",
      } as Record<string, string>,
    },
    experience: {
      fullHistory: "Gbogbo ìtàn iṣẹ́, ẹ̀kọ́ àti ẹ̀rí wà nínú CV",
    },
    owe: {
      work: "iṣẹ́ ọwọ́",
      cure: "ìwòsàn",
      want: "àìní",
      meaning:
        "Iṣẹ́ ni ìwòsàn àìní. Lẹ́tà kan náà, ohùn tó yàtọ̀, ìtumọ̀ sì yí padà.",
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
