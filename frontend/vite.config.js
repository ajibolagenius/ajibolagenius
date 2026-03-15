import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ajibola Akelebe — Design & Engineering',
        short_name: 'Ajibola Akelebe',
        description: 'Developer and designer based in Nigeria, building for a global audience.',
        theme_color: '#07070F',
        background_color: '#07070F',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/favicon.jpg', sizes: '192x192', type: 'image/jpeg', purpose: 'any' },
          { src: '/favicon.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'any' },
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
});
