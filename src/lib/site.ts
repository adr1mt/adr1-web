import { getCollection, type CollectionEntry } from 'astro:content';

export const SITE_TITLE = 'adr1';
export const MODULE = '0227 · CFGM SMX';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes an absolute site path ("/ra1/") with the deploy base. */
export const href = (path: string) => BASE + path;

// ---------- Learning outcomes (RA) ----------

export type RaPage = CollectionEntry<'ra'>;

/** The RAs already migrated to this web, in order. `id` is the content folder and the URL. */
export const RAS = [
  { id: 'ra1', n: 1, short: 'Servei DHCP', title: 'Instal·lació de serveis de configuració dinàmica (DHCP)' },
  { id: 'ra2', n: 2, short: 'Servei DNS', title: 'Instal·lació de serveis de resolució de noms (DNS)' },
] as const;

export type Ra = (typeof RAS)[number];
export type RaId = Ra['id'];

export const getRa = (id: RaId) => RAS.find((ra) => ra.id === id)!;
export const raLabel = (ra: Ra) => `RA${ra.n} · ${ra.short}`;
export const raUrl = (ra: Ra) => href(`/${ra.id}/`);

export const SECTIONS = [
  { id: 'teoria', label: 'Teoria', intro: 'Expliquen com funciona el servei, sense lligar-lo a cap producte.' },
  { id: 'guies', label: 'Guies', intro: 'El manual de cada producte: configuració pas a pas i comprovacions.' },
  { id: 'activitats', label: 'Activitats', intro: 'Encàrrecs amb requisits i criteris de comprovació.' },
] as const;

// A page id is "ra2/teoria/t2-1-noms-i-resolucio": RA, section and file name.
export const raOf = (page: RaPage) => page.id.split('/')[0];
export const sectionOf = (page: RaPage) => page.id.split('/')[1];
export const pageUrl = (page: RaPage) => href(`/${page.id}/`);

const sectionRank = (page: RaPage) => SECTIONS.findIndex((s) => s.id === sectionOf(page));
const refNumber = (page: RaPage) => Number(page.data.ref.split('.')[1]);

/** The pages of one RA in reading order: theory, guides, activities; each by its number. */
export async function getRaPages(ra: RaId) {
  const pages = await getCollection('ra', (page) => raOf(page) === ra);
  return pages.sort((a, b) => sectionRank(a) - sectionRank(b) || refNumber(a) - refNumber(b));
}

// ---------- Blog ----------

export type BlogPost = CollectionEntry<'blog'>;

export async function getPosts() {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id));
}

export const postUrl = (post: BlogPost) => href(`/blog/${post.id}/`);

export const tagSlug = (tag: string) =>
  tag.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const tagUrl = (tag: string) => href(`/blog/etiquetas/${tagSlug(tag)}/`);

export const formatDate = (date: Date) =>
  date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
