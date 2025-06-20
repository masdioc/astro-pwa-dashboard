import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import pwa from '@vite-pwa/astro';
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    react(), tailwind(),
    pwa({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Astro PWA App',
        short_name: 'PWAApp',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
