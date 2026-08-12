import type { Metadata } from "next";
import {
  Image as ImageIcon,
  Diamond,
  ShareNetwork,
  Selection,
  Flag,
  TextT,
  Stack,
  Copyright,
} from "@phosphor-icons/react/dist/ssr";
import { getCvData } from "@/lib/cv-data";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";

const title = "Licenses";
const description = "Attribution and licensing for images, icons, and illustrations used on this site.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/licenses",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const LICENSES: {
  icon: React.ComponentType<{ weight?: "duotone"; size?: number }>;
  title: string;
  body: string;
  link?: { label: string; url: string };
}[] = [
  {
    icon: ImageIcon,
    title: "Images",
    body: "The avatar portraits were generated with AI and are free for personal and commercial use. Project screenshots are my own work and belong to their respective case studies.",
  },
  {
    icon: Diamond,
    title: "Icons",
    body: "UI icons are from Phosphor Icons, used under the MIT license — free for personal and commercial use.",
    link: { label: "phosphoricons.com", url: "https://phosphoricons.com" },
  },
  {
    icon: ShareNetwork,
    title: "Illustrations",
    body: "The hero, 404, and contact illustrations are from Office Club Illustrations and are free for personal and commercial use.",
  },
  {
    icon: Selection,
    title: "Logos & shapes",
      body: "Company placeholder marks and decorative geometric shapes are from Shapes.gallery and are free for personal and commercial use.",
      link: { label: "shapes.gallery", url: "https://www.shapes.gallery" },
  },
  {
    icon: Flag,
    title: "Flags",
    body: "Language flags (US, NG) are sourced from SVG Flag Icons and are free for personal and commercial use.",
  },
  {
    icon: TextT,
    title: "Fonts",
    body: "Habibi, Geist, and Geist Mono are served via Google Fonts under the SIL Open Font License.",
    link: { label: "fonts.google.com", url: "https://fonts.google.com" },
  },
  {
    icon: Stack,
    title: "Open-source stack",
    body: "Built with Next.js, React, Tailwind CSS, and Supabase — all used under their MIT / Apache open-source licenses. Hosted on Vercel.",
  },
  {
    icon: Copyright,
    title: "Site content",
    body: "Case studies, copy, and CV content are © Ajibola Akelebe. Please don't reuse them without permission.",
  },
];

export default async function LicensesPage() {
  const { personalInfo, visibleSections } = await getCvData();

  return (
    <>
      <TopNav visibleSections={visibleSections} />
      <div className="hidden lg:block">
        <Sidebar info={personalInfo} />
      </div>
      <main className="page-enter flex-1 lg:ml-80">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <div className="text-center">
            <h1 className="text-h1 font-normal">Licenses</h1>
            <p className="mx-auto mt-3 max-w-md text-body-m text-ink/60">
              Credits for the assets, tools, and open-source software that
              power this site. If you&apos;d like to use a specific asset,
              please check its license below.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {LICENSES.map(({ icon: Icon, title, body, link }) => (
              <div key={title} className=" bg-ink/5 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center  bg-accent text-cream">
                  <Icon weight="duotone" size={20} />
                </div>
                <h2 className="text-h3 font-normal">{title}</h2>
                <p className="mt-1 text-body-s text-ink/60">{body}</p>
                {link && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-body-s text-accent underline-offset-2 hover:underline"
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
