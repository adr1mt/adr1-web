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

// Retune the bundled syntax themes for classroom reading: blue keys, green strings,
// violet values and legible grey comments. ANSI output keeps its terminal colours.
const syntaxPalette = {
  light: {
    '#998418': '#1d4ed8', '#59873a': '#1d4ed8',
    '#b56959': '#0f6b57',
    '#2f798a': '#6d28d9', '#1e754f': '#6d28d9', '#a65e2b': '#6d28d9', '#ab5959': '#6d28d9',
    '#a0ada0': '#526174', '#999999': '#526174',
  },
  dark: { '#f9e2af': '#93c5fd', '#fab387': '#c4b5fd' },
};
const syntaxColors = {
  name: 'classroom-syntax-colors',
  span(node) {
    if (this.options.lang === 'ansi') return;
    node.properties.style = node.properties.style?.replace(
      /--shiki-(light|dark):(#[0-9a-f]{6})/gi,
      (_, theme, color) => `--shiki-${theme}:${syntaxPalette[theme][color.toLowerCase()] ?? color}`,
    );
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
      transformers: [codeTitle, ansiColors, syntaxColors],
    },
  },
});
