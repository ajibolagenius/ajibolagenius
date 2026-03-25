import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import {
  SITE_NAME,
  DEFAULT_PAGE_TITLE,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  STATIC_DEFAULT_OG_IMAGE_WIDTH,
  STATIC_DEFAULT_OG_IMAGE_HEIGHT,
} from './src/lib/siteBrand.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function escapeAttr(text) {
  return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function resolvePublicSiteUrlForBuild(env) {
  const a = (env.VITE_SITE_URL || process.env.URL || '').trim().replace(/\/$/, '');
  if (a) return a;
  const v = (process.env.VERCEL_URL || '').trim();
  if (v) return `https://${v.replace(/^https?:\/\//i, '').replace(/\/$/, '')}`;
  return '';
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const siteUrl = resolvePublicSiteUrlForBuild(env);
  const absOgImage = siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE_PATH}` : DEFAULT_OG_IMAGE_PATH;

  return {
  plugins: [
    react(),
    {
      name: 'html-og-placeholders',
      transformIndexHtml(html) {
        return html
          .replace(/__HTML_PAGE_TITLE__/g, escapeAttr(DEFAULT_PAGE_TITLE))
          .replace(/__HTML_META_DESCRIPTION__/g, escapeAttr(DEFAULT_META_DESCRIPTION))
          .replace(/__HTML_OG_TITLE__/g, escapeAttr(DEFAULT_PAGE_TITLE))
          .replace(/__HTML_OG_DESCRIPTION__/g, escapeAttr(DEFAULT_META_DESCRIPTION))
          .replace(/__HTML_TWITTER_TITLE__/g, escapeAttr(DEFAULT_PAGE_TITLE))
          .replace(/__HTML_TWITTER_DESCRIPTION__/g, escapeAttr(DEFAULT_META_DESCRIPTION))
          .replace(/__HTML_OG_IMAGE__/g, escapeAttr(absOgImage))
          .replace(/__HTML_OG_IMAGE_WIDTH__/g, String(STATIC_DEFAULT_OG_IMAGE_WIDTH))
          .replace(/__HTML_OG_IMAGE_HEIGHT__/g, String(STATIC_DEFAULT_OG_IMAGE_HEIGHT));
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: DEFAULT_PAGE_TITLE,
        short_name: SITE_NAME,
        description: DEFAULT_META_DESCRIPTION,
        theme_color: '#07070F',
        background_color: '#07070F',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-assets/manifest-icon-192.maskable.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-assets/manifest-icon-192.maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/pwa-assets/manifest-icon-512.maskable.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-assets/manifest-icon-512.maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}'],
        runtimeCaching: [
          { urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com\/.*/i, handler: 'CacheFirst', options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } } },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  server: {
    port: 3000,
    open: true,
    proxy: undefined, // set proxy for API in dev if needed, e.g. { '/api': 'http://localhost:8000' }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
};
});
