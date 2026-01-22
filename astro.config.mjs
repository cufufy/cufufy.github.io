// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GITHUB PAGES CONFIGURATION
  // Replace 'https://example.com' with your website's URL (e.g., https://username.github.io)
  site: 'https://example.com',
  // Replace '/' with your repository name if deploying to a user page subpath (e.g., '/my-repo')
  // If you are using a custom domain or the repository name matches username.github.io, keep it as '/'
  base: '/',

  vite: {
    plugins: [tailwindcss()]
  }
});
