import { Flask } from "@phosphor-icons/react/dist/ssr";
import { PinnedPromoCard } from "@/components/pinned-promo-card";

export function SandboxPromoCard() {
  return (
    <PinnedPromoCard
      href="/sandbox"
      icon={Flask}
      eyebrow="Lab"
      title="Sandbox"
      description="Interactive experiments and small toys — open one and poke around."
    />
  );
}
