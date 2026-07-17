"use client";

import { useState } from "react";

const LOGO_MAPPING: Record<string, string> = {
  "next.js": "nextjs_icon_dark.svg",
  "nextjs": "nextjs_icon_dark.svg",
  "typescript": "typescript.svg",
  "javascript": "javascript.svg",
  "tailwind css": "tailwindcss.svg",
  "tailwindcss": "tailwindcss.svg",
  "supabase": "supabase.svg",
  "react": "react_dark.svg",
  "react.js": "react_dark.svg",
  "reactjs": "react_dark.svg",
  "react native": "react_dark.svg",
  "expo": "react_dark.svg",
  "python": "python.svg",
  "aws": "aws.svg",
  "docker": "docker.svg",
  "mongodb": "mongodb.svg",
  "postgresql": "postgresql.svg",
  "postgres": "postgresql.svg",
  "figma": "figma.svg",
  "three.js": "three.js_dark.svg",
  "threejs": "three.js_dark.svg",
  "webgl": "webgl_dark.svg",
  "framer motion": "motion_dark.svg",
  "motion": "motion_dark.svg",
  "node.js": "nodejs.svg",
  "nodejs": "nodejs.svg",
  "node": "nodejs.svg",
  "github": "github.svg",
  "adobe": "adobe.svg",
  "affinity designer": "affinity_designer.svg"
};

const LIGHT_VARIANTS: Record<string, string> = {
  "react_dark.svg": "react_light.svg",
  "motion_dark.svg": "motion_light.svg",
  "three.js_dark.svg": "three.js_light.svg",
  "webgl_dark.svg": "webgl_light.svg"
};

export function TechLogo({ name }: { name: string }) {
  const [error, setError] = useState(false);
  
  const key = name.toLowerCase().trim();
  const fileName = LOGO_MAPPING[key] || `${key.replace(/\s+/g, "-")}.svg`;
  
  if (error) return null;

  const supabaseUrl = "https://peincqeqcufbkoccyneo.supabase.co";
  const src = `${supabaseUrl}/storage/v1/object/public/tech-logos/${fileName}`;
  
  const hasLightVariant = LIGHT_VARIANTS[fileName];
  const lightSrc = hasLightVariant ? `${supabaseUrl}/storage/v1/object/public/tech-logos/${hasLightVariant}` : src;

  return (
    <span className="inline-flex shrink-0 items-center justify-center mr-1.5 h-4 w-4">
      {hasLightVariant ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightSrc}
            alt={name}
            onError={() => setError(true)}
            className="h-full w-full object-contain dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={name}
            onError={() => setError(true)}
            className="hidden h-full w-full object-contain dark:block"
          />
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => setError(true)}
          className="h-full w-full object-contain"
        />
      )}
    </span>
  );
}
