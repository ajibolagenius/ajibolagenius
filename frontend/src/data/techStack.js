/**
 * Tech stack from DESIGN-SYSTEM.md §10 — Technical Architecture.
 * Single source of truth for portfolio stack (Footer, CV tools grid, ticker).
 */

export const designSystemStack = [
  {
    layer: 'Core',
    technology: 'Next.js 14 (App Router)',
    shortName: 'Next.js',
    notes: 'File-based routing, RSC, SSG/ISR, API routes, TypeScript',
  },
  {
    layer: 'UI',
    technology: 'React 18 + Tailwind v3',
    shortName: 'React · Tailwind',
    notes: 'Components; Tailwind utilities; CSS variables for tokens',
  },
  {
    layer: '3D',
    technology: 'Three.js + R3F + Drei',
    shortName: 'Three.js',
    notes: 'Declarative 3D, GLSL for Adire geometry',
  },
  {
    layer: 'Animation',
    technology: 'GSAP 3 + ScrollTrigger, Framer Motion 11',
    shortName: 'GSAP · Framer Motion',
    notes: 'Scroll reveals, SVG draws; component + page transitions',
  },
  {
    layer: 'Content',
    technology: 'MDX + Contentlayer',
    shortName: 'MDX',
    notes: 'Type-safe content, Git as CMS, rehype-highlight',
  },
  {
    layer: 'Deployment',
    technology: 'Vercel + Resend',
    shortName: 'Vercel',
    notes: 'Hosting, edge, contact form email; GitHub Actions CI',
  },
];

/** For Footer "Built with" line — tech names used in this codebase */
export const footerStackNames = [
  'React',
  'Tailwind',
  'Three.js',
  'GSAP',
  'Framer Motion',
];

/** For CV "Tools & Stack" grid: { name, category } from design system stack */
export const techStackForCV = designSystemStack.map(({ layer, technology }) => ({
  name: technology,
  category: layer,
}));
