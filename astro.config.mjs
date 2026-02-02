// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Hostinger VPS / Standalone Node configuration
  site: 'https://example.com',
  base: '/',

  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    plugins: [tailwindcss()]
  }
});
