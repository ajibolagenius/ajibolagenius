import Image from "next/image";
import { getCvData } from "@/lib/cv-data";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";
import { NotFoundCopy } from "@/components/not-found-copy";

export default async function NotFound() {
  const { personalInfo } = await getCvData();

  return (
    <>
      <TopNav />
      <div className="hidden lg:block">
        <Sidebar info={personalInfo} />
      </div>
      <main
        id="main-content"
        tabIndex={-1}
        className="page-enter flex-1 lg:ml-80 focus:outline-none"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 py-24 text-center">
          <Image
            src="/illustration-404.svg"
            alt=""
            width={100}
            height={100}
          />
          <NotFoundCopy />
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
