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

// ```ansi fences show terminal output with its escape codes (ip -c a, systemctl status).
// On the light background the theme's ANSI cyan and yellow fall below 4.5:1, so the
// light colours are swapped for the print colours of the original module (sinapsi.css).
const ansiLight = { '#2993a3': '#00666e', '#bda437': '#7a5600', '#a13865': '#86288a', '#296aa3': '#1d4ed8', '#1e754f': '#0e6b3b' };
const ansiColors = {
  name: 'ansi-colors',
  span(node) {
    if (this.options.lang !== 'ansi') return;
    node.properties.style = node.properties.style?.replace(/--shiki-light:(#[0-9a-f]{6})/, (_, c) => `--shiki-light:${ansiLight[c] ?? c}`);
  },
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      themes: { light: 'vitesse-light', dark: 'catppuccin-mocha' },
      defaultColor: false,
      transformers: [codeTitle, ansiColors],
    },
  },
});
