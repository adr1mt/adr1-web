# M7 Serveis en Xarxa · piloto Astro

Nueva versión de la web del módulo 0227 (CFGM SMX). Piloto limitado al **RA1 (DHCP)**,
un **blog** de recomendaciones y la infraestructura común. RA2–RA8 siguen en
la web actual (`https://adr1mt.github.io/m7-serveis-en-xarxa-web/`) y no se
enlazan ni se mencionan; se migran uno a uno cuando el usuario lo pida.
Barra: Inici (portada personal «adr1») · Serveis en Xarxa (`/serveis-en-xarxa/`, lista de RA) · Blog.

## Comandos

- `npm run dev` — desarrollo (la búsqueda no funciona: Pagefind indexa en el build).
- `npm run build` — `astro build` + índice de Pagefind en `dist/pagefind/`.
- `npm run preview` — sirve `dist/` en `http://localhost:4321/adr1-web/`.
- `npm run check` — `astro check`.
- `npm run new:post` — crea una entrada del blog.

## Arquitectura

- Astro estático, una sola aplicación, sin framework de cliente ni Tailwind.
  JavaScript solo para tema, menú, copiar código, TOC activo, test y búsqueda.
- `src/content/ra1/{teoria,guies,activitats}/*.mdx`: el contenido. La carpeta es
  la sección y `ref` (T1.1, G1.2, A1.3) da el orden. Sidebar, índice del RA y
  anterior/siguiente se derivan de la colección (`src/lib/site.ts`); no hay listas a mano.
- `src/content/blog/AAAA-MM-DD-slug.md`: `title`, `date`, `tag` (una sola), `image` e
  `imageAlt` opcionales (imagen en `src/content/blog/img/`). La URL es `/blog/<nombre del fichero>/`.
- Componentes MDX del RA1: `Callout` (recordatori, bones pràctiques, nota), `Flow`
  (secuencias como DORA), `Quiz` + `Question` (autoevaluación, solo en teoría).
  Los bloques de código llevan título: ```` ```bash title="Terminal" ````.
- Enlaces entre páginas del RA1: relativos (`../../guies/g1-2-kea/`), así no dependen de `base`.
- `site` y `base` están en `astro.config.mjs`. Si el repositorio cambia de nombre, solo se cambia `base`.

## Contenido

- Idioma: la web (portada, blog, cabecera, pie, búsqueda) en castellano; el módulo
  (`/serveis-en-xarxa/` y RA1) en catalán, con `lang="ca"`. Código y comentarios en inglés.
  Pagefind indexa todo como `es` (`--force-language es`) para tener un solo índice.
- La fuente original del RA1 es el repo privado `adr1mt/m7-serveis-en-xarxa`
  (HTML). En este piloto el MDX es una copia convertida: un cambio allí hay que
  traerlo aquí a mano.
- Teoría explica el servicio, guía documenta un producto, actividad es un encargo
  con comprobaciones. No se resume ni se inventa contenido pedagógico.

## Calidad

- Calma visual: nada de tarjetas dentro de tarjetas, gradientes, sombras grandes ni iconos decorativos.
- Sin scroll horizontal a 320 px; tema claro y oscuro revisados los dos.
- Antes de dar algo por bueno: `npm run check`, `npm run build` y revisión en navegador con `npm run preview`.

## Despliegue

GitHub Actions (`.github/workflows/deploy.yml`) con `withastro/action` en cada push a `main`.
En el repositorio: Settings → Pages → Source: **GitHub Actions**.
