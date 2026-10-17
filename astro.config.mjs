import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import citations from './scripts/remark-citations.mjs';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: process.env.SITE_URL || 'https://williamvdg.me',
  base: process.env.BASE_PATH || '/econ-nobel',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: { processor: unified({ remarkPlugins: [remarkMath, citations], rehypePlugins: [[rehypeKatex, { strict: 'error', throwOnError: true }]] }) },
});
