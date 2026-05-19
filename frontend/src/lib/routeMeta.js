import { DEFAULT_OG_IMAGE_PATH } from './siteBrand.js';
import { buildOgImageUrl } from './siteConfig.js';

export const STATIC_ROUTE_META = [
  {
    path: '/',
    title: 'Design & Engineering',
    description:
      'Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn.',
    category: 'Portfolio',
    subtitle: 'Developer, designer, educator',
  },
  {
    path: '/work',
    title: 'Selected Work',
    description:
      'A collection of products and experiments - from social platforms to creative coding explorations.',
    category: 'Projects',
    subtitle: 'Products, systems, and experiments',
  },
  {
    path: '/writing',
    title: 'Blog & Thoughts',
    description:
      'Writing about design, development, teaching, and the intersection of African identity and technology.',
    category: 'Writing',
    subtitle: 'Design, development, teaching, and technology',
  },
  {
    path: '/teach',
    title: 'Courses & Mentorship',
    description:
      'I teach what I know and share what I learn. Remote courses designed for the Nigerian developer ready to level up.',
    category: 'Teaching',
    subtitle: 'Courses and mentorship for developers',
  },
  {
    path: '/gallery',
    title: 'Gallery',
    description: 'Images and videos: UI, 3D, and graphic work.',
    category: 'Gallery',
    subtitle: 'UI, 3D, and graphic explorations',
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Get in touch - design and engineering inquiries, collaboration, or just say hello.',
    category: 'Contact',
    subtitle: 'Design and engineering inquiries',
  },
  {
    path: '/cv',
    title: 'CV',
    description: 'Experience, education, and skills - design and engineering.',
    category: 'Resume',
    subtitle: 'Experience, education, and skills',
  },
  {
    path: '/search',
    title: 'Search',
    description: 'Search blog posts, projects, and courses.',
    category: 'Search',
    subtitle: 'Find writing, projects, and courses',
  },
  {
    path: '/assets',
    title: 'Assets & Downloads',
    description: 'Design files, resources, and links shared by Ajibola Akelebe.',
    category: 'Resources',
    subtitle: 'Design files, resources, and downloads',
  },
];

function normalizePath(path) {
  if (!path || path === '/') return '/';
  return `/${String(path).replace(/^\/+|\/+$/g, '')}`;
}

export function getStaticRouteMeta(path) {
  const normalized = normalizePath(path);
  return STATIC_ROUTE_META.find((route) => route.path === normalized) || null;
}

export function buildStaticPageMeta(path) {
  const meta = getStaticRouteMeta(path);
  if (!meta) return null;
  const image = buildOgImageUrl(meta.title, meta.category, meta.subtitle) || DEFAULT_OG_IMAGE_PATH;
  return {
    title: meta.title,
    description: meta.description,
    canonical: meta.path,
    image,
  };
}
