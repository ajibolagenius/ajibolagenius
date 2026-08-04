import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { PinnedPromoCard } from "@/components/pinned-promo-card";

export function SideProjectsPromoCard() {
  return (
    <PinnedPromoCard
      href="/side-projects"
      icon={Sparkle}
      eyebrow="Explore"
      title="Side Projects"
      description="Personal experiments and works in progress — things I build outside of client work."
    />
  );
}
