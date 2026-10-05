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

const microblog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/microblog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { ra1, microblog };
