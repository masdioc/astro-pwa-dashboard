import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import pwa from "@vite-pwa/astro";
import VitePWA from '@vite-pwa/astro';
export default defineConfig({
  integrations: [react(), tailwind(), pwa()],
});
