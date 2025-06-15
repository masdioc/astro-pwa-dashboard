import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import pwa from '@vite-pwa/astro'; // kalau kamu pakai PWA juga

export default defineConfig({
  integrations: [
    react(),
    pwa({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Aplikasi Saya',
        short_name: 'AppSaya',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#00aaff',
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
