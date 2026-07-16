import Link from "next/link";
import { BackToTop } from "@/components/cv/back-to-top";

export function SiteFooter({ name }: { name: string }) {
  return (
    <div className="lg:ml-80">
      <div className="mx-auto flex max-w-3xl items-center justify-between border-t border-ink/10 px-6 py-6 text-body-s text-ink/60">
        <p>© {new Date().getFullYear()} {name}</p>
        <div className="flex items-center gap-5">
          <Link href="/licenses" className="hover:text-ink">
            Licenses
          </Link>
          <BackToTop className="hover:text-ink" />
        </div>
      </div>
    </div>
  );
}
