# webmaster-kit

Carpeta **fuente de verdad** del sistema de diseño de las apps Astro del
portfolio. **No es un paquete npm**: se COPIA dentro de cada app.

```bash
# desde la raiz del repo: crear el esqueleto de una app nueva
node scripts/new-app.mjs wm-concesionario

# o, si ya existe la app y querés resincronizar el kit
rsync -a --delete packages/webmaster-kit/components/ apps/wm-concesionario/src/components/ui/
rsync -a packages/webmaster-kit/types.ts      apps/wm-concesionario/src/lib/types.ts
rsync -a packages/webmaster-kit/rubros.ts     apps/wm-concesionario/src/lib/rubros.ts
rsync -a packages/webmaster-kit/urls.ts       apps/wm-concesionario/src/lib/urls.ts
rsync -a packages/webmaster-kit/whatsapp.ts   apps/wm-concesionario/src/lib/whatsapp.ts
rsync -a packages/webmaster-kit/media.ts      apps/wm-concesionario/src/lib/media.ts
rsync -a packages/webmaster-kit/styles/tokens.css apps/wm-concesionario/src/styles/tokens.css
```

> El runner no interactivo bloquea `rsync`; para regenerar desde cero usar el
> script `scripts/new-app.mjs`, que usa `fs.cp` de Node.

## Que hay adentro

| Ruta | Que es | Se copia a |
| --- | --- | --- |
| `types.ts` | Contrato de contenido (`RubroContent`, `Theme`, `Section`, `Legal`, ...) | `src/lib/types.ts` |
| `rubros.ts` | Demos: id, rubro, objecion, paleta, WhatsApp, puerto | `src/lib/rubros.ts` |
| `urls.ts` | `appUrl(href)` y `appPath(pathname)` para bases locales/integradas | `src/lib/urls.ts` |
| `whatsapp.ts` | `waLink(phone, text)` y `rubroWhatsapp(id, ctx)` | `src/lib/whatsapp.ts` |
| `media.ts` | Helpers de medios + pool de IDs **verificados** | `src/lib/media.ts` |
| `styles/tokens.css` | Tokens Tailwind v4 + utilidades de la firma | `src/styles/tokens.css` |
| `components/*.astro` | `BaseLayout`, `Nav`, `Footer`, `PageHero`, `LiveNow`, `RubroCard` | `src/components/ui/` |
| `components/*.tsx` | `Booking`, `Ticket` (islas React) | `src/components/ui/` |
| `app-template/` | Esqueleto de app (package.json, astro.config, layout, css, index) | raiz de `apps/wm-*` |

## El contrato

Una app de rubro es **un objeto `RubroContent`** + paginas que usan el layout.
Todo lo que cambia entre rubros (textos, paleta, medios, legales) vive en
`src/content/<rubro>.ts`. Todo lo que no cambia (navegacion, hero, ticket,
cortina) vive en el kit.

```ts
import type { RubroContent } from "@lib/types";

export const concesionario: RubroContent = {
  id: "concesionario",
  brand: "AUTOS EJEMPLO",
  rubro: "Concesionario de autos nuevos y usados",
  tagline: "Tu próximo auto, sin vueltas.",
  objeccion: "«No quiero pagar de más por un usado»",
  theme: {
    name: "aura",
    palette: { bg: "#0E1A1C", fg: "#E9F0EC", accent: "#FF6B4A" },
    fonts: { display: "Bricolage Grotesque", body: "Manrope" },
  },
  nav: [{ label: "Inicio", href: "/" }, /* ... */],
  hero: { kicker: "...", title: ["Linea 1", "Linea 2"], subtitle: "...", cta: { label: "...", href: "#turno" }, video: { src: "...", poster: "...", alt: "..." } },
  sections: [ /* ... */ ],
  conversion: { id: "turno", title: "...", steps: ["Datos", "Horario", "Confirmación"], options: [ /* ... */ ], slots: [ /* ... */ ], demoNotice: "Demo: no se envían datos." },
  legal: { /* ... */ },
  contact: { /* ... */ },
};
```

### Alias de importacion

Los componentes del kit importan los tipos por `@lib/*`:

- en una **app**: `@lib/*` -> `src/lib/*` (lo define `astro.config.mjs` y el `tsconfig.json`)
- dentro del **kit**: `@lib/*` -> la raiz del kit (ver `tsconfig.json` de esta carpeta)

Por eso el kit compila solo si el alias esta bien: no cambies `@lib/` por rutas
relativas.

## La firma (lo que tienen que compartir las webs)

1. **Cortina entre rutas** — `astro:transitions` (`<ClientRouter />`) + overlay
   `.wm-curtain`, animado en `astro:before-preparation` / `astro:after-swap`.
   El overlay usa `transition:persist` para que sea el mismo nodo antes y
   despues del swap.
2. **Hero de video que se encoge con el scroll** — `.wm-hero` con `sticky` +
   un unico listener de scroll con `rAF` que escribe `--wm-hero-scale`
   (solo `transform`).
3. **Grade / grano / viñeta uniforme** — `.wm-grade` (filtro), `.wm-grain`
   (overlay SVG con `mix-blend-mode: overlay`), `.wm-vignette` (radial gradient).
   Se aplican sobre fotos **y** videos.
4. **1 seccion "pinned" que cuenta algo** — cada app la implementa en su
   `src/pages/index.astro`.
5. **Señal "en vivo" creible** — `LiveNow.astro`, parametrizada por rubro.
6. **1 conversion que termina en TICKET** — `Booking.tsx` (3 pasos) renderiza
   `Ticket.tsx`.
7. **1 solo CTA sobre el fold** — `hero.cta`.

## Rutas y despliegue integrado

- `rubros.ts` sigue siendo el catálogo canónico: `demoUrl` es una ruta del mismo
  origen (`/demos/<slug>/`), no un dominio de producción.
- Usar `appUrl("/contacto")`, `appUrl("/#turno")` o
  `appUrl("/?prop=id#visita")` donde se renderiza un enlace interno (también en
  React). Conserva query/fragmento, agrega la base y la barra final; deja intactos
  anclas locales, protocolos externos y enlaces de WhatsApp. No usarlo para los
  enlaces **entre** apps, que ya contienen la ruta completa del catálogo.
- `appPath(Astro.url.pathname)` quita la base para comparar la página activa.
  Los contenidos mantienen rutas locales sin prefijos; Nav, Footer y PageHero
  las resuelven al renderizar. No guardar URLs de producción en el contenido.
- Enlaces entre apps: `data-astro-reload`, como RubroCard y la vuelta al portfolio.
  Evita compartir listeners, islas y estado de `ClientRouter` entre bundles distintos.
- La plantilla usa `appConfig(id)` de `scripts/site-config.mjs`: desarrollo y
  builds independientes en `/`, build integrado con `WM_DEPLOYMENT=1` y su base
  `/demos/<id>/`. El scaffolder copia `urls.ts` y `public/404.html` además del kit,
  conserva puertos y no sobrescribe destinos. Una app nueva sigue necesitando
  contenido, registro en el catálogo y aliases en raíz.
- No copiar a mano un build parcial a `dist/`: el comando raíz compila y combina
  todas las apps registradas antes de promover el output completo. La configuración de Pages,
  Node/pnpm, previews y `PUBLIC_SITE_URL` está en el [README raíz](../../README.md#publicar-bajo-un-solo-dominio-cloudflare-pages).

## Reglas de contenido

- Textos rioplatenses, marcas **ficticias**, mercado Argentina.
- Precios **finales con impuestos** (`legal.pricesIncludeTaxes`).
- Boton de arrepentimiento/baja si hay venta online
  (Res. 316/2018 y 271/2020) + link a Defensa del Consumidor.
- Maximo **6 videos** y **8 fotos** por app. Los IDs deben salir de
  `media.ts` (verificados con `curl -sI -m 15`).
- Formularios y reservas **no mandan datos**: la UI lo dice explicitamente.

## Trampas que ya pisamos

- `next/font` falla por el certificado SSL de la maquina -> las fuentes van por
  `<link>` a Google Fonts (ya resuelto en `BaseLayout.astro`).
- La mascara de titulares recorta los acentos de mayusculas -> `padding-top` +
  `margin-top` negativo de `0.14em` (ya resuelto en `.wm-lines`).
- Un componente con `display` propio pisa el `hidden` que le pasas -> en este
  kit no se usa `hidden` sobre elementos con display.
- `useAnimate` + StrictMode cortaba las intros -> aca no hay animaciones de
  entrada con JS: la cortina usa transiciones CSS con un timeout de seguridad.
- Un panel de navegador oculto frena `requestAnimationFrame`: no es un bug.
- Con `@theme inline` los tokens de runtime (`--wm-bg`, `--wm-fg`,
  `--wm-accent`) se definen por rubro en el `<html>`; las clases utilitarias
  (`bg-bg`, `text-fg`, `text-accent`) se resuelven en runtime.

## Puertos

| App | Puerto |
| --- | --- |
| `wm-concesionario` | 3021 |
| `wm-lavadero` | 3022 |
| `wm-estetica` | 3023 |
| `wm-universidad` | 3024 |
| `wm-inmobiliaria` | 3025 |
| `wm-inmobiliaria-premium` | 3033 |
| `wm-arquitectura` | 3026 |
| `wm-arquitectura-premium` | 3032 |
| `wm-locales-catalogo` | 3028 |
| `wm-tiendas-ecommerce` | 3029 |
| `wm-portfolio` | 3027 |
