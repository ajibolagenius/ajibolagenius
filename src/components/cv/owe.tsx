"use client";

import { HomeSection } from "@/components/cv/home-section";
import { useLanguage } from "@/lib/i18n";

/**
 * Closing signature: a Yorùbá proverb that turns on tone. iṣẹ́ (work) and
 * ìṣẹ́ (poverty) share their letters and differ only in tone marks.
 */
export function Owe() {
  const { t } = useLanguage();

  const gloss = [
    ["iṣẹ́", t.owe.work],
    ["oògùn", t.owe.cure],
    ["ìṣẹ́", t.owe.want],
  ];

  return (
    <HomeSection id="owe" label={t.labels.owe} sub={t.labels.oweSub}>
      <div className="flex flex-col gap-6">
        <p lang="yo" className="font-display text-[clamp(2.125rem,5vw,3.5rem)] leading-[1.1]">
          <span className="text-accent">Iṣẹ́</span> ni oògùn{" "}
          <span className="text-accent">ìṣẹ́</span>.
        </p>
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-4">
          {gloss.map(([word, meaning]) => (
            <div key={word} className="flex flex-col gap-0.5">
              <dt lang="yo" className="font-display text-[1.375rem]">
                {word}
              </dt>
              <dd className="text-body-s text-ink/55">{meaning}</dd>
            </div>
          ))}
        </dl>
        <p className="max-w-[62ch] text-body-m text-ink/65">{t.owe.meaning}</p>
      </div>
    </HomeSection>
  );
}
