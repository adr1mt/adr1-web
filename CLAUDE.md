# M7 Serveis de xarxa · piloto Astro

Nueva versión de la web del módulo 0227 (CFGM SMX): **RA1 (DHCP)**, **RA2 (DNS)**,
un **blog** de recomendaciones y la infraestructura común. RA3–RA8 no tienen
web pública (el repositorio `m7-serveis-en-xarxa-web` se borró el 19/10/2026)
y no se enlazan desde ninguna página (el texto puede nombrarlos, sin enlace); se
migran uno a uno cuando el usuario lo pida. El orden de las actividades del RA1
es el de esta web, aunque el repo privado lo tenga distinto.
Barra: Inici (portada personal «adr1») · Serveis de xarxa (`/serveis-en-xarxa/`, lista de RA) · Blog ·
Herramientas (`/herramientas/`, utilidades en el navegador; de momento IPCalc).

## Comandos

- `npm run dev` — desarrollo (la búsqueda no funciona: Pagefind indexa en el build).
- `npm run build` — `astro build` + índice de Pagefind en `dist/pagefind/`.
- `npm run preview` — sirve `dist/` en `http://localhost:4321/adr1-web/`.
- `npm run check` — `astro check`.
- `npm run new:post` — crea una entrada del blog.

## Arquitectura

- Astro estático, una sola aplicación, sin framework de cliente ni Tailwind.
  JavaScript solo para tema, menú, copiar código, TOC activo, test y búsqueda.
- `src/content/raN/{teoria,guies,activitats}/*.mdx`: el contenido, en una sola
  colección `ra`. La primera carpeta es el RA, la segunda la sección, y `ref`
  (T1.1, G2.1, A2.3) da el orden. Sidebar, índice del RA y anterior/siguiente se
  derivan de la colección (`src/lib/site.ts`); no hay listas a mano.
- `RAS` en `src/lib/site.ts` es la lista de RA publicados (título y nombre corto).
  Las páginas salen de `src/pages/[ra]/[...slug].astro`; cada índice
  (`src/pages/raN/index.astro`) usa `RaIndex` y pone su propia introducción.
- Añadir un RA: entrada en `RAS`, `src/pages/raN/index.astro` y el MDX en
  `src/content/raN/`. `scripts/convert-ra.py` hace la primera conversión del HTML
  privado; después se revisa a mano.
- `src/content/blog/AAAA-MM-DD-slug.md`: `title`, `date`, `tag` (una sola), `image` e
  `imageAlt` opcionales (imagen en `src/content/blog/img/`). La URL es `/blog/<nombre del fichero>/`.
- Componentes MDX de los RA: `Callout` (recordatori, bones pràctiques, nota), `Flow`
  (secuencias como DORA), `Quiz` + `Question` (autoevaluación, solo en teoría).
  Los bloques de código llevan título: ```` ```bash title="Terminal" ````.
  La salida de terminal con colores (`ip -c a`, `systemctl status`) va en ```` ```ansi ````
  con los códigos de escape reales (carácter ESC): `1;36` cian, `1;33` amarillo, `1;35` magenta,
  `1;34` azul, `1;32` verde y `32` sin negrita para la salida esperada. El tema claro cambia
  esos colores por los de impresión del original (`ansiColors` en `astro.config.mjs`).
- Enlaces entre páginas: relativos, siempre desde la raíz del RA (`../../guies/g1-2-kea/`);
  a otro RA, un nivel más arriba (`../../../ra1/guies/g1-2-kea/`). Así no dependen de `base`.
- `site` y `base` están en `astro.config.mjs`. Si el repositorio cambia de nombre, solo se cambia `base`.

## Contenido

- Idioma: la web (portada, blog, cabecera, pie, búsqueda) en castellano; el módulo
  (`/serveis-en-xarxa/` y los RA) en catalán, con `lang="ca"`. Código y comentarios en inglés.
  Pagefind indexa todo como `es` (`--force-language es`) para tener un solo índice.
- La fuente original de los RA es el repo privado `adr1mt/m7-serveis-en-xarxa`
  (HTML). El MDX es una copia convertida: un cambio allí hay que
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
