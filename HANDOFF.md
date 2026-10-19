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
- `CLAUDE.md`: RA2–RA8 ya no remiten a `m7-serveis-en-xarxa-web` (borrado).
- Verificado: `npm run check` (0 errores), `npm run build`, preview a 320 px
  en tema claro y oscuro, sin scroll horizontal de página.
- Commit y push a `main` hechos; GitHub Actions despliega.

## Siguiente paso

1. Comprobar G1.0 en la web desplegada cuando acabe GitHub Actions.
2. Enlace roto: `t1-2-encaminament-nat.mdx` apunta a RA2 en la web borrada
   (`m7-serveis-en-xarxa-web/RA2/`). Quitar el enlace y dejar el texto.
3. Revisar el orden de actividades: en el privado son `a1-2-dhcp-systemd-networkd`,
   `a1-3-dhcp-kea`, `a1-4-kea-escala-reserves`; aquí `a1-2-dhcp-kea`,
   `a1-3-kea-escala-reserves`, `a1-4-dhcp-systemd-networkd`.

## Diferencias conscientes con el HTML de G1.0

- El marcador gris `IP-de-la-porta-d-enllaç` (clase `c`) queda como texto normal
  en un bloque `bash`.
- La mención a RA2 en «Resoldre noms: dig» se mantiene sin enlace.
- `<kbd>` sin estilo propio (monoespaciado del navegador), como el resto del sitio.

## Referencias

- Original: `/mnt/datos/Applications/0227/m7-serveis-en-xarxa/RA1/guies/g1-0-terminal-linux.html`
- Colores: `/mnt/datos/Applications/0227/m7-serveis-en-xarxa/_identitat/sinapsi.css`
- Despliegue: `https://adr1mt.github.io/adr1-web/`
