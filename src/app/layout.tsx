import type { Metadata } from "next";
import { Geist, Geist_Mono, Habibi } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Ajibola — Portfolio",
  description: "Software engineer portfolio and case studies.",
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
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
