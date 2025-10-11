// @ts-check
import { defineConfig } from 'astro/config';

import astroD2 from 'astro-d2'
import react from '@astrojs/react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://alrubinger.github.io',
  base: '/exitcondition.alrubinger.com',

  integrations: [
    // Enable React support for TSX/JSX components used in MDXComponents
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      //extendDefaultPlugins: true
    }),
  // https://astro-d2.vercel.app/configuration/#configuration-options
  astroD2({
    theme: {
      default: '8',
      dark: '200',
    },
  })],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true,
      // Remove default theme application
      defaultColor: 'light'
    }
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
