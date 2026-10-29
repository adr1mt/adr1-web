import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pages of every learning outcome (src/content/raN/). The first folder is the RA,
// the second (teoria / guies / activitats) the section, and `ref` (T1.1, G2.1,
// A2.3…) gives the order, so no separate nav list exists.
const ra = defineCollection({
  loader: glob({ pattern: 'ra[1-8]/**/*.mdx', base: './src/content' }),
  schema: z.object({
    ref: z.string().regex(/^[TGA][1-8]\.\d+$/),
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

export const collections = { ra, blog };
