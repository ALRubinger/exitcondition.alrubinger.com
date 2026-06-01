import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    author: z.string().optional(),
  }),
});

const authors = defineCollection({
  loader: file('./src/content/blog/authors.json'),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    'social-github': z.string().optional(),
    'social-linkedin': z.string().optional(),
    'social-x': z.string().optional(),
    avatar: z.string(),
  }),
});

export const collections = { posts, authors };
