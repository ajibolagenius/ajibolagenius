import Image from "next/image";
import { House } from "@phosphor-icons/react/dist/ssr";
import { getCvData } from "@/lib/cv-data";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";

export default async function NotFound() {
  const { personalInfo } = await getCvData();

  return (
    <>
      <TopNav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-16">
        <div className="hidden lg:block">
          <Sidebar info={personalInfo} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
          <Image
            src="/illustration-404.svg"
            alt=""
            width={100}
            height={100}
          />
          <h1 className="text-h1 font-normal">Not Found</h1>
          <p className="max-w-sm text-body-m text-ink/60">
            The page you&apos;re looking for doesn&apos;t exist. Go back home
            to browse the resume.
          </p>
          <a
            href="/"
            className="mt-2 inline-flex items-center gap-2  bg-ink px-4 py-2.5 text-body-s font-medium text-cream"
          >
            <House weight="duotone" size={16} />
            Return Home
          </a>
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
