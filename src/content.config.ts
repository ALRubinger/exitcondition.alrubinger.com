import { z, defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob, file } from 'astro/loaders';

export const collections = {
  // Docs are driven by Starlight
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Our Blog Implementation is an Astro Content Collection
  blog: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/blog" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
    })})
};