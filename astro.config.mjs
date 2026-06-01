import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeCopyButton from './src/lib/rehype-copy-button.mjs';
import rehypeSectionWrapper from './src/lib/rehype-section-wrapper.mjs';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://exitcondition.alrubinger.com',
  integrations: [mdx(), svelte()],
  unified: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          content: { type: 'text', value: ' ↗' },
          test: (element) => {
            const c = element.properties?.className;
            if (!c) return true;
            const list = Array.isArray(c) ? c : String(c).split(/\s+/);
            return !list.includes('no-arrow');
          },
        },
      ],
      rehypeCopyButton,
      rehypeSectionWrapper,
    ],
  },
  vite: {
    resolve: {
      alias: {
        $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
      },
    },
    plugins: [tailwindcss()],
  },
  output: 'static',
});
