import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import pwa from "@vite-pwa/astro";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  vite: {
    server: {
      fs: {
        strict: false,
      },
      historyApiFallback: true, // ⬅️ Tambahkan ini
    },
  },
  // vite: {
  //   server: {
  //     host: true,
  //     hmr: {
  //       protocol: "ws",
  //       host: "localhost",
  //       port: 4321,
  //     },
  //     historyApiFallback: true,
  //   },
  // },
  env: {
    schema: {
      BASE_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      API_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PUBLIC_API_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  integrations: [
    react(),
    tailwind(),
    pwa({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Belajar Asik",
        short_name: "B.ASIK",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /.*\.mp3$/,
            handler: "CacheFirst",
            options: {
              cacheName: "audio-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 165 * 24 * 60 * 60, // 165 hari
              },
            },
          },
        ],
      },
    }),
  ],
});
