import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { articleSchema } from './lib/schema';
export const collections = {
  awards: defineCollection({ loader: glob({ pattern: '*.md', base: './content/awards' }), schema: articleSchema }),
  works: defineCollection({ loader: glob({ pattern: '*.md', base: './content/works' }), schema: articleSchema }),
};
