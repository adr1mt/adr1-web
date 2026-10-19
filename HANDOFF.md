# HANDOFF · adr1-web

## Objetivo

Web pública del módulo 0227 (piloto Astro): RA1 (DHCP), blog y herramientas.
Fuente del RA1: repo privado `adr1mt/m7-serveis-en-xarxa` (HTML); aquí el MDX
se copia a mano. RA2–RA8 no tienen web pública hasta que se migren.

## Estado (19/10/2026)

- Guía nueva G1.0 «Guia: terminal de Linux»
  (`src/content/ra1/guies/g1-0-terminal-linux.mdx`), convertida del HTML
  privado en el commit `0888dab`. Sin test, como toda guía.
- Salida de terminal con colores reales de Ubuntu 26.04 en bloques ```` ```ansi ````
  con códigos ESC. Transformer `ansiColors` en `astro.config.mjs`: en tema claro
  usa los colores de impresión de `sinapsi.css` (contraste ≥ 5,8:1); el oscuro
  usa los de catppuccin-mocha (≥ 7,8:1). Negrita en `global.css`.
- A1.1 enlaza a G1.0 y G1.1, como en el HTML.
- Ninguna página enlaza a otros RA (aún no revisados para esta web); el texto
  puede nombrarlos. Quitado el enlace de T1.2 a la web borrada.
- El orden de actividades bueno es el de esta web (A1.2 Kea, A1.3 empresa de
  2000 equips, A1.4 systemd-networkd), aunque el repo privado lo tenga distinto.
  Regla recogida en `CLAUDE.md`.
- Verificado: `npm run check` (0 errores), `npm run build`, preview a 320 px
  en tema claro y oscuro, sin scroll horizontal de página.
- Commit y push a `main` hechos; GitHub Actions despliega.

## Siguiente paso

1. Comprobar G1.0 y T1.2 en la web desplegada cuando acabe GitHub Actions.
2. Al portar cambios del repo privado, cruzar las actividades por contenido,
   no por número de fichero.

## Diferencias conscientes con el HTML de G1.0

- El marcador gris `IP-de-la-porta-d-enllaç` (clase `c`) queda como texto normal
  en un bloque `bash`.
- La mención a RA2 en «Resoldre noms: dig» se mantiene sin enlace.
- `<kbd>` sin estilo propio (monoespaciado del navegador), como el resto del sitio.

## Referencias

- Original: `/mnt/datos/Applications/0227/m7-serveis-en-xarxa/RA1/guies/g1-0-terminal-linux.html`
- Colores: `/mnt/datos/Applications/0227/m7-serveis-en-xarxa/_identitat/sinapsi.css`
- Despliegue: `https://adr1mt.github.io/adr1-web/`
