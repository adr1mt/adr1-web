import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// GitHub Pages project site: https://adr1mt.github.io/<repo>/
// If the repository gets another name, change `base` here and nothing else.
const site = 'https://adr1mt.github.io';
const base = '/adr1-web';

// Code fences accept `title="…"` in their meta (```bash title="Terminal · client").
// The title becomes a data attribute that CodeBlock.astro shows above the code.
const codeTitle = {
  name: 'code-title',
  pre(node) {
    const title = this.options.meta?.__raw?.match(/title="([^"]+)"/)?.[1];
    if (title) node.properties['data-title'] = title;
  },
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      transformers: [codeTitle],
    },
  },
});
