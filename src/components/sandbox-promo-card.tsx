import { Flask } from "@phosphor-icons/react/dist/ssr";
import { PinnedPromoCard } from "@/components/pinned-promo-card";

export function SandboxPromoCard() {
  return (
    <PinnedPromoCard
      href="/sandbox"
      icon={Flask}
      eyebrow="Explore"
      title="Sandbox"
      description="Mini projects and quick tests — small builds where I try out ideas."
    />
  );
}
