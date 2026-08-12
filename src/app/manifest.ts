import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ajibola Akelebe — Portfolio",
    short_name: "Ajibola",
    // Kept in step with the fallback description in layout.tsx — this is the
    // copy the install prompt shows.
    description:
      "Portfolio, CV, and sandbox of Ajibola Akelebe — a developer and designer building for the web.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf5ef",
    theme_color: "#e64301",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
