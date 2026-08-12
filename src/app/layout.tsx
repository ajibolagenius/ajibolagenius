import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Habibi } from "next/font/google";
import { ThemeScript } from "@/components/theme-script";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { Toaster } from "@/components/toast/toaster";
import { FlashToaster } from "@/components/toast/flash-toaster";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const habibi = Habibi({
  variable: "--font-habibi",
  subsets: ["latin"],
  weight: "400",
});

/**
 * Site-wide fallbacks only. Every content route sets its own title and
 * description — the homepage and /cv derive theirs from `personal_info` — so
 * these apply to routes that have nothing more specific to say. Keep in sync
 * with `manifest.ts`, which the install prompt reads.
 */
const title = "Ajibola Akelebe — Portfolio";
const description =
  "Portfolio, CV, and sandbox of Ajibola Akelebe — a developer and designer building for the web.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — Ajibola",
  },
  description,
  authors: [{ name: "Ajibola Akelebe", url: siteUrl }],
  creator: "Ajibola Akelebe",
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Ajibola Akelebe — Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ajibola",
  },
};

export const viewport: Viewport = {
  themeColor: "#e64301",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${habibi.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        {children}
        {/* One stack for the whole app — client-facing pages and /admin both
            render inside this layout. */}
        <Toaster />
        <FlashToaster />
        <ServiceWorkerRegistration />
        <Analytics />
      </body>
    </html>
  );
}
