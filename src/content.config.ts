import { z, defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob, file } from 'astro/loaders';

export const collections = {
  // Docs are driven by Starlight
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Our Blog Implementation is an Astro Content Collection
  blog: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog/posts" }),
    schema: z.object({
      title: z.string(),
      author: z.string(),
      pubDate: z.coerce.date(),
    })}),
  // Blog Authors are also an Astro Content Collection
  //TODO Make some properties optional
  authors: defineCollection({
    loader: file("./src/content/blog/authors.json"),
    schema: z.object({
      name: z.string(),
      title: z.string(),
      'social-github': z.string(),
      'social-linkedin': z.string(),
      'social-x': z.string(),
    })}),
};