// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://alrubinger.github.io',
  base: '/exitcondition.alrubinger.com',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});