#!/usr/bin/env node
// Creates a new blog post: npm run new:post
import { createInterface } from 'node:readline';
import { existsSync, writeFileSync } from 'node:fs';
import { stdin, stdout, exit } from 'node:process';

const DIR = new URL('../src/content/blog/', import.meta.url);
const rl = createInterface({ input: stdin, output: stdout });
// Reading lines through the iterator also works when the answers are piped in.
const lines = rl[Symbol.asyncIterator]();
const ask = async (q) => {
  stdout.write(q);
  const { value, done } = await lines.next();
  return done ? '' : value;
};

const title = (await ask('Título: ')).trim();
if (!title) { console.error('Falta el título.'); exit(1); }

const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD, local time
const date = (await ask(`Fecha [${today}]: `)).trim() || today;
if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) { console.error('Fecha no válida (AAAA-MM-DD).'); exit(1); }

const tag = (await ask('Etiqueta (p. ej. Software): ')).trim();
if (!tag) { console.error('Falta la etiqueta.'); exit(1); }
rl.close();

const slug = title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60).replace(/-$/, '') || 'entrada';
const file = new URL(`${date}-${slug}.md`, DIR);
if (existsSync(file)) { console.error(`Ya existe: src/content/blog/${date}-${slug}.md`); exit(1); }

const yaml = (s) => JSON.stringify(s); // a JSON string is valid YAML and escapes quotes
writeFileSync(file, `---
title: ${yaml(title)}
date: ${date}
tag: ${yaml(tag)}
# image: ./img/nombre.png
# imageAlt: "Descripción de la imagen"
---

Escribe aquí la entrada.
`, { flag: 'wx' });

console.log(`Creado: src/content/blog/${date}-${slug}.md`);
