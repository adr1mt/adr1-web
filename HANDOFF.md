# HANDOFF · adr1-web

## Objetivo

Web pública del módulo 0227 (Astro): RA1 (DHCP), RA2 (DNS), blog y herramientas.
Fuente de los RA: repo privado `adr1mt/m7-serveis-en-xarxa` (HTML); aquí el MDX
se convierte y se revisa a mano. RA3–RA8 no tienen web pública hasta que se migren.

## Estado (29/10/2026)

- RA2 migrado en la rama `feat/ra2`: T2.1–T2.4, G2.1, A2.1–A2.4 e índice
  (`src/pages/ra2/index.astro`, con su introducción y el recordatori de `.internal`).
- La web ya admite varios RA: una colección `ra` (`src/content/raN/…`), la lista
  `RAS` en `src/lib/site.ts`, la ruta `src/pages/[ra]/[...slug].astro`, `RaNav`
  (antes `Ra1Nav`) y `RaIndex`. Las URL del RA1 no cambian.
- `scripts/convert-ra.py`: conversor HTML → MDX con las reglas del RA1 (Callout,
  Flow, Quiz, problemas con **Causa**/**Solució**, currículum plegado, enlaces
  relativos desde la raíz del RA).
- Verificado: `npm run check` (0 errores), `npm run build` (sin errores), el HTML
  del RA1 idéntico al de `main` en texto y enlaces, todas las palabras del HTML
  del RA2 presentes en las páginas generadas, 0 enlaces internos rotos, sin scroll
  horizontal a 320 px en las 10 páginas del RA2, test de T2.4 funcionando, tema
  claro y oscuro.
- Sin push: falta revisarlo y fusionar `feat/ra2` en `main`.

## Siguiente paso

1. Revisar el RA2 en `npm run preview` y fusionar `feat/ra2` en `main`.
2. Comprobar el RA2 en la web desplegada cuando acabe GitHub Actions.
3. Al portar cambios del repo privado, cruzar las actividades por contenido,
   no por número de fichero.

## Diferencias conscientes con el HTML del RA2

- Los bloques que el HTML etiqueta «Codi» pasan a «Terminal», como en el RA1;
  el contenido de `/etc/resolv.conf` (T2.1) lleva ese título. La salida
  `resolvectl dns` + resultado va en `text`.
- Los bloques «Configuració · BIND 9» van en `text`: Shiki no tiene BIND.
- «Abans de començar» y «On trobaràs ajuda» de las actividades son `###`, para
  que salgan en el índice de la página.
- Las menciones del RA2 al RA1 ahora enlazan a la web (`../../../ra1/…`). La
  mención a RA2 en G1.0 («Resoldre noms: dig») sigue sin enlace.

## Diferencias conscientes con el HTML de G1.0

- El marcador gris `IP-de-la-porta-d-enllaç` (clase `c`) queda como texto normal
  en un bloque `bash`.
- La mención a RA2 en «Resoldre noms: dig» se mantiene sin enlace.
- `<kbd>` sin estilo propio (monoespaciado del navegador), como el resto del sitio.

## Referencias

- Original: `/mnt/datos/Applications/0227/m7-serveis-en-xarxa/RA1/guies/g1-0-terminal-linux.html`
- Colores: `/mnt/datos/Applications/0227/m7-serveis-en-xarxa/_identitat/sinapsi.css`
- Despliegue: `https://adr1mt.github.io/adr1-web/`
