// @ts-check
import { defineConfig } from 'astro/config';

import astroD2 from 'astro-d2'
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

import docsSidebar from './src/content/sidebars/docs.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://alrubinger.github.io',
  base: '/exitcondition.alrubinger.com',

  integrations: [
    react(), 
    starlight({
      title: "Block Open Source",
      logo: {
        replacesTitle: true,
        light: './src/assets/logos/block_light.png',
        dark: './src/assets/logos/block_dark.png',
      },
      customCss: [
        './src/styles/global.css'
      ],
      /* 
        We override default Starlight components here, giving us full control
        over how things are displayed and styled. In some cases, this is simply to wrap
        the default implementation with our own CSS class so that Starlight and other display
        systems in the site may share CSS info. 
        
        The full list of components available to override are:

          https://starlight-overrides-map.netlify.app/
          https://starlight.astro.build/reference/overrides/

        Guide to overriding is:

          https://starlight.astro.build/guides/overriding-components/

      */
      components: {
        Head: './src/components/starlight/Head.astro',
        MarkdownContent: './src/components/starlight/MarkdownContent.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      social: {
        'x.com': 'https://x.com/blockopensource',
        linkedin: 'https://www.linkedin.com/company/block-opensource',
        youtube: 'https://www.youtube.com/@blockopensource',
        github: 'https://github.com/block',
      },
      editLink: {
        baseUrl: 'https://github.com/alrubinger/exitcondition.alrubinger.com/edit/main/',
      },
      sidebar: [
        ...docsSidebar,
      ],
      // https://expressive-code.com/key-features/syntax-highlighting/#configuration
      expressiveCode: {
        themes: ['dracula', 'solarized-light'],
        shiki: {
          langs: [
          ],
        },
      }
    }), 
  mdx(), 
  tailwindcss( {
    applyBaseStyles: false,
  }), 
  // https://astro-d2.vercel.app/configuration/#configuration-options
  astroD2({
    theme: {
      default: '8',
      dark: '200',
    },
  })],
  vite: {
    plugins: [tailwindcss()]
  },
  experimental: {
    svg: true,
  },
});