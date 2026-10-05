import { getCollection, type CollectionEntry } from 'astro:content';

export const SITE_TITLE = 'Serveis en Xarxa';
export const MODULE = '0227 · CFGM SMX';
export const OLD_WEB = 'https://adr1mt.github.io/m7-serveis-en-xarxa-web/';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes an absolute site path ("/ra1/") with the deploy base. */
export const href = (path: string) => BASE + path;

// ---------- RA1 ----------

export type Ra1Page = CollectionEntry<'ra1'>;

export const SECTIONS = [
  { id: 'teoria', label: 'Teoria', intro: 'Expliquen com funciona el servei, sense lligar-lo a cap producte.' },
  { id: 'guies', label: 'Guies', intro: 'El manual de cada producte: configuració pas a pas i comprovacions.' },
  { id: 'activitats', label: 'Activitats', intro: 'Encàrrecs amb requisits i criteris de comprovació.' },
] as const;

export const sectionOf = (page: Ra1Page) => page.id.split('/')[0];
export const pageUrl = (page: Ra1Page) => href(`/ra1/${page.id}/`);

const sectionRank = (page: Ra1Page) => SECTIONS.findIndex((s) => s.id === sectionOf(page));
const refNumber = (page: Ra1Page) => Number(page.data.ref.split('.')[1]);

/** All RA1 pages in reading order: theory, guides, activities; each by its number. */
export async function getRa1Pages() {
  const pages = await getCollection('ra1');
  return pages.sort((a, b) => sectionRank(a) - sectionRank(b) || refNumber(a) - refNumber(b));
}

// ---------- Microblog ----------

export type Micropost = CollectionEntry<'microblog'>;

export async function getMicroposts() {
  const posts = await getCollection('microblog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id));
}

export const postUrl = (post: Micropost) => href(`/microblog/${post.id}/`);

export const tagSlug = (tag: string) =>
  tag.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const tagUrl = (tag: string) => href(`/microblog/etiquetes/${tagSlug(tag)}/`);

export const formatDate = (date: Date) =>
  date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
