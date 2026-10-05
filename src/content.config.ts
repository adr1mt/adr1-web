import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// RA1 pages. The folder (teoria / guies / activitats) is the section and
// `ref` (T1.1, G1.2, A1.3…) gives the order, so no separate nav list exists.
const ra1 = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ra1' }),
  schema: z.object({
    ref: z.string().regex(/^[TGA]1\.\d+$/),
    title: z.string(),
    description: z.string(),
  }),
});

// One tag per post keeps the blog simple. The image, if any, goes under the title.
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    tag: z.string(),
    image: image().optional(),
    imageAlt: z.string().default(''),
  }),
});

export const collections = { ra1, blog };
