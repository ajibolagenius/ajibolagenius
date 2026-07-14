import {
  Image as ImageIcon,
  Diamond,
  ShareNetwork,
  Selection,
  Flag,
  TextT,
} from "@phosphor-icons/react/dist/ssr";
import { getCvData } from "@/lib/cv-data";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";

const LICENSES = [
  {
    icon: ImageIcon,
    title: "Images",
    body: "All images were created using ChatGPT and are free for personal and commercial use.",
  },
  {
    icon: Diamond,
    title: "Icons",
    body: "All icons on this site are sourced from Phosphor Icons and are free for personal and commercial use.",
  },
  {
    icon: ShareNetwork,
    title: "Illustrations",
    body: "All illustrations are sourced from Office Club Illustrations and are free for personal and commercial use.",
  },
  {
    icon: Selection,
    title: "Logos",
    body: "All logos on this site are sourced from Logoipsum and are free for personal and commercial use.",
  },
  {
    icon: Flag,
    title: "Flags",
    body: "All flags on this site are sourced from SVG Flag Icons and are free for personal and commercial use.",
  },
  {
    icon: TextT,
    title: "Fonts",
    body: "Habibi and Geist fonts are sourced from Google Fonts and are free for personal and commercial use.",
  },
];

export default async function LicensesPage() {
  const { personalInfo } = await getCvData();

  return (
    <>
      <TopNav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-16">
        <div className="hidden lg:block">
          <Sidebar info={personalInfo} />
        </div>
        <div className="flex-1 py-8">
          <div className="text-center">
            <h1 className="text-h1 font-normal">Licenses</h1>
            <p className="mx-auto mt-3 max-w-md text-body-m text-ink/60">
              All graphical assets in this template are licensed for personal
              and commercial use. If you&apos;d like to use a specific asset,
              please check the license below.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {LICENSES.map(({ icon: Icon, title, body }) => (
              <div key={title} className=" bg-ink/5 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center  bg-accent text-cream">
                  <Icon weight="duotone" size={20} />
                </div>
                <h2 className="text-h3 font-normal">{title}</h2>
                <p className="mt-1 text-body-s text-ink/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
