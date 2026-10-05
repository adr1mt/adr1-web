import rss from '@astrojs/rss';
import { getMicroposts } from '../../lib/site';

export async function GET(context) {
  const posts = await getMicroposts();
  return rss({
    title: 'Microblog · Serveis en Xarxa',
    description: 'Recomanacions tècniques breus per a l’alumnat de Serveis en Xarxa (CFGM SMX).',
    site: new URL(import.meta.env.BASE_URL, context.site),
    customData: '<language>ca</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/microblog/${post.id}/`,
      content: post.rendered?.html,
    })),
  });
}
