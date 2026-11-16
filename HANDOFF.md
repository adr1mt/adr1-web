# HANDOFF · adr1-web

## Objetivo

Web pública del módulo 0227 (Astro): RA1 (DHCP), RA2 (DNS), blog y herramientas.
Fuente de los RA: repo privado `adr1mt/m7-serveis-en-xarxa` (HTML); aquí el MDX
se convierte y se revisa a mano. RA3–RA8 no tienen web pública hasta que se migren.

## Estado (16/11/2026)

- RA2 publicado en `main`: T2.1–T2.4, G2.1 y A2.1–A2.5. La web admite varios RA
  (colección `src/content/raN/`, lista `RAS` en `src/lib/site.ts`).
- A2.5 «El mateix DNS en una xarxa /8» nueva: A2.3 repetida en 10.0.0.0/8 más
  diez casos de diagnóstico (coherencia A/PTR, zona inversa /8, CNAME, serial).
  Convertida con `scripts/convert-ra.py` a una carpeta temporal y copiada sola,
  para no pisar las demás páginas revisadas a mano.
- Verificado: `npm run check` (0 errores), `npm run build`, A2.5 sin scroll
  horizontal a 320 px y sin enlaces internos rotos. Tema claro sin revisar
  (mismos componentes que A2.3).

## Siguiente paso

1. Comprobar la A2.5 en la web desplegada cuando acabe GitHub Actions.
2. Al portar cambios del repo privado, convertir a carpeta temporal y copiar
   solo la página cambiada; cruzar actividades por contenido, no por número.

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
