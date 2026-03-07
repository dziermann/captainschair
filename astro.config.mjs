// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://username.github.io',
  base: '/captainschair',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    AstroPWA({
      base: '/captainschair/',
      scope: '/captainschair/',
      filename: 'sw.js',
      manifestFilename: 'manifest.webmanifest',
      includeAssets: ['favicon.svg', 'favicon.ico', 'icons/*.svg'],
      registerType: 'autoUpdate',
      injectRegister: false, // We're doing it manually in Layout.astro
      manifest: {
        name: "Captain's Chair Database",
        short_name: "Captain's Chair",
        description: "Fan-made database for the Star Trek: Captain's Chair boardgame.",
        theme_color: '#F8991D',
        icons: [
          {
            src: 'icons/ship.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        navigateFallback: '/captainschair/',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <--- 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <--- 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/captainschair\//],
      }
    })
  ]
});