# Estudio

Portfolio freelance con **7 apps Astro: 6 demos de rubro + 1 portfolio madre**
en `apps/wm-*`. Comparten el kit canónico de `packages/webmaster-kit/`.

El monorepo usa **pnpm** (`pnpm-workspace.yaml`, `apps/*`): las dependencias se
instalan **una sola vez** en la raíz.

---

# 🌱 Portfolio Astro — `webmaster-studio`

## Qué es

Un portfolio freelance: **6 demos de rubro** (una web por rubro, cada una
publicable y vendible) + **1 sitio portfolio madre** que las indexa. Todas
comparten una misma firma visual, para que se entienda que son el mismo
portfolio y no templates sueltos.

- **Stack:** Astro 7 (islas) + React 19 (islas interactivas) + Tailwind v4
  (plugin de Vite). Hospedaje: un proyecto estático de Cloudflare Pages.
- **Kit canónico:** `packages/webmaster-kit/` — no es un paquete npm, es una
  carpeta fuente que se **copia** dentro de cada app. Contiene el contrato de
  contenido (`types.ts`), los 6 rubros (`rubros.ts`), los deep-links de
  WhatsApp (`whatsapp.ts`), los tokens y utilidades de la firma
  (`styles/tokens.css`) y los componentes compartidos (`components/`).
- **App de referencia:** `apps/wm-concesionario/` — ejemplo del kit.
  Las apps nuevas se generan desde el kit, no copiando otra demo.

```
packages/
  webmaster-kit/      ← kit canónico (se copia a cada app)
    types.ts          ← contrato: RubroContent, Theme, Section, Legal, Contact…
    rubros.ts         ← los 6 rubros + getRubro(id)
    whatsapp.ts       ← waLink(phone, text) + rubroWhatsapp(id, ctx)
    media.ts          ← helpers de medios + pool de IDs VERIFICADOS
    styles/tokens.css ← @theme de Tailwind v4 + .wm-grade/.wm-grain/.wm-vignette/.wm-curtain
    components/       ← BaseLayout, Nav, Footer, PageHero, LiveNow, RubroCard, Booking, Ticket
    app-template/     ← esqueleto de app que usa el scaffolder
apps/
  wm-concesionario/  ← concesionario de autos (referencia)   :3021
  wm-lavadero/       ← lavadero de autos con bar         :3022
  wm-estetica/       ← estudio de estética y yoga         :3023
  wm-universidad/    ← universidad privada                :3024
  wm-inmobiliaria/   ← inmobiliaria                       :3025
  wm-arquitectura/   ← estudio de arquitectura y diseño   :3026
  wm-portfolio/      ← portfolio madre (índice de demos)  :3027
scripts/
  new-app.mjs        ← scaffolder de apps nuevas
```

## La firma (idéntica en las 7 webs)

1. Cortina entre rutas (`astro:transitions` + overlay `.wm-curtain`).
2. Hero de video que se encoge con el scroll (sticky + `transform`).
3. Grade / grano / viñeta uniforme sobre fotos y videos.
4. Una sección "pinned" que cuenta algo (en concesionario: la letra chica del usado).
5. Señal "en vivo" creíble (`LiveNow`: "Abierto ahora · 6 turnos hoy").
6. Una conversión que termina en **TICKET** animado (reserva en 3 pasos).
7. Un solo CTA sobre el fold + WhatsApp flotante con mensaje prearmado.

## Tabla de apps y puertos

| App | Rubro | Puerto | Comando |
| --- | --- | --- | --- |
| `wm-concesionario` | Concesionario de autos nuevos y usados | 3021 | `pnpm run dev:concesionario` |
| `wm-lavadero` | Lavadero de autos con bar | 3022 | `pnpm run dev:lavadero` |
| `wm-estetica` | Estudio de estética y yoga | 3023 | `pnpm run dev:estetica` |
| `wm-universidad` | Universidad privada | 3024 | `pnpm run dev:universidad` |
| `wm-inmobiliaria` | Inmobiliaria | 3025 | `pnpm run dev:inmobiliaria` |
| `wm-arquitectura` | Estudio de arquitectura y diseño | 3026 | `pnpm run dev:arquitectura` |
| `wm-portfolio` | Portfolio madre | 3027 | `pnpm run dev:portfolio` |

## Cómo correr

```bash
pnpm install --frozen-lockfile # una sola vez, en la raíz
pnpm dev                    # portfolio madre: http://localhost:3027
pnpm run dev:concesionario   # http://localhost:3021
pnpm run build:concesionario # build estático -> apps/wm-concesionario/dist
pnpm --filter wm-concesionario run check # astro check (typecheck + .astro)
pnpm build                  # las 7 apps integradas -> dist/
pnpm preview                # http://127.0.0.1:4321, rutas de producción (desde sesión remota: pnpm preview --host 0.0.0.0)
pnpm check:site             # HTTP: páginas, enlaces/anclas, assets, canonical y 404
pnpm build:apps             # builds independientes -> apps/wm-*/dist/
```

El `pnpm install` de la raíz instala **todas** las apps del workspace
(`apps/*`). Para una sola app: `pnpm --filter wm-concesionario run dev`.
Cada alias `dev:<rubro>` de la tabla tiene su equivalente `build:<rubro>`,
incluido `pnpm run build:portfolio`.

## Publicar bajo un solo dominio (Cloudflare Pages)

**Un proyecto, un `dist/` completo:** portfolio en `/`, catálogo en `/demos/`
y las seis demos en `/demos/<slug>/` (`concesionario`, `lavadero`,
`estetica`, `universidad`, `inmobiliaria`, `arquitectura`). También se publican
las páginas anidadas de autos y propiedades. Las apps siguen separadas.

### Probar antes de publicar

Usar **Node 22.22.0** (`.node-version` / `.nvmrc`) y **pnpm 12.11.2**
(`packageManager`). No tomar la versión incidental del equipo como configuración
de Pages. Con pnpm disponible, instalar desde el lockfile sin actualizar dependencias:

```bash
pnpm install --frozen-lockfile
node --test scripts/*.test.mjs
pnpm -r run check
PUBLIC_SITE_URL=https://webmaster-studio.pages.dev pnpm build
pnpm preview --port 4321
# En otra terminal, con el mismo PUBLIC_SITE_URL usado para compilar:
pnpm check:site --url http://127.0.0.1:4321
```

Sin `--url`, `pnpm check:site` abre y cierra su propio servidor temporal. Los
scripts de build, preview y checker ofrecen `--help`. `PUBLIC_SITE_URL` debe ser
un origen HTTP(S), sin ruta, credenciales, query ni fragmento. Su valor por defecto
es `https://webmaster-studio.pages.dev`: **reemplazarlo por el nombre real asignado
al proyecto**. Configurarlo como variable del entorno de build; el script de raíz
no carga archivos `.env`. Se usa solo para canonical, OG y JSON-LD, nunca para
navegación: los enlaces entre apps conservan el origen del preview.

`pnpm build` compila con los prefijos de producción en `.dist-stage-*` (ignorado
y eliminado al terminar). Astro mueve CSS desde `.astro/` con `rename`, por eso
el staging debe estar en el mismo filesystem que el repo, no en otro volumen temporal.
Solo después de completar las siete apps y la combinación sin colisiones promueve
el resultado a `dist/`. Ante un fallo, sale con error y conserva el último output
completo (si había uno). No publicar ese output antiguo como si fuera el nuevo.
Cada demo mantiene su propio `_astro/`. La promoción local usa renames en el mismo
filesystem; no ejecutar dos builds agregados simultáneamente.

`pnpm dev` y los aliases por app siguen usando `/` y los puertos de la tabla.
Para recorrer **varias apps**, usar el preview integrado: los enlaces del catálogo
no apuntan a otros servidores de desarrollo. `pnpm build:apps` conserva el build
recursivo anterior; no es el comando de publicación.

### Conectar el repositorio (paso manual posterior)

| Ajuste de Cloudflare Pages | Valor |
| --- | --- |
| Framework preset | `None` (sitio estático, sin adaptador SSR) |
| Root directory | raíz del repositorio |
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Build output directory | `dist` |
| Variables de producción **y previews** | `NODE_VERSION=22.22.0`, `PNPM_VERSION=12.11.2`, `SKIP_DEPENDENCY_INSTALL=true`, `PUBLIC_SITE_URL=https://<proyecto>.pages.dev` |
| Production branch | `main` |
| Preview branches | habilitar las ramas no productivas / PRs (incluida `feat/cloudflare-single-domain`) |

Desactivar la instalación automática con `SKIP_DEPENDENCY_INSTALL` permite que
el comando explícito aplique `--frozen-lockfile`. `wrangler.toml` declara el output
estático, no crea ni conecta el proyecto ni configura ramas. No se necesita token
en este repositorio para el flujo de Git de Pages. Confirmar en el primer log de
Pages que se usaron las versiones fijadas y el lockfile congelado.

Cada preview debe contener portfolio y demos en **su mismo origen**. Probar `/`,
`/demos/`, `/demos/concesionario/`, una ficha de auto y una de propiedad; una
ruta inexistente debe devolver **HTTP 404**, no la portada. `404.html` en raíz
impide el fallback SPA de Pages. Los cruces entre apps usan `data-astro-reload`;
las transiciones del router de Astro quedan dentro de cada app.

Más adelante: agregar el dominio desde **Pages → Custom domains**, seguir la
validación DNS de Cloudflare y cambiar `PUBLIC_SITE_URL` al dominio definitivo
en ambos entornos; reconstruir y verificar los canonical. Para volver atrás,
restaurar un deployment completo anterior desde Pages, no copiar una sola demo.
Esta implementación **no publica el repo ni configura Cloudflare/DNS**; el primer
preview remoto y la comprobación real de Pages quedan pendientes de esa conexión.
Los formularios siguen siendo simulaciones y los medios siguen en sus hosts actuales.

## Verificar la estructura del workspace

```bash
node --test scripts/*.test.mjs
```

Comprueba los destinos de los scripts raíz, los aliases de las siete apps y
que no reaparezcan las apps anteriores ni sus instrucciones operativas.
No reemplaza el typecheck ni el build de cada app.

## Sumar un rubro nuevo

1. **Crear el esqueleto** (copia desde el kit, nunca copiando otra demo):

   ```bash
   node scripts/new-app.mjs wm-concesionario
   # preview sin escribir nada:
   node scripts/new-app.mjs --dry-run wm-concesionario
   ```

   El scaffolder crea `package.json` (mismo set de dependencias y versiones que
   `wm-concesionario`, con el nombre y el puerto de la app), `astro.config.mjs`,
   `tsconfig.json`, `.gitignore`, `src/layouts/Base.astro`,
   `src/styles/global.css`, `src/pages/index.astro` (placeholder) y copia el
   kit a `src/components/ui/` + `src/lib/` + `src/styles/tokens.css`.
   Si el destino ya existe, falla sin pisar nada. También valida `PUBLIC_SITE_URL`
   antes de crear la app o imprimir el plan de dry-run: un origen inválido aborta
   sin crear el destino.

2. **Escribir el contenido**: `src/content/<rubro>.ts` exporta un objeto
   `RubroContent` (tipos en `src/lib/types.ts`). Todo el texto del rubro vive
   ahí: marca, servicios, precios, legales, contacto, paleta y fuentes.

3. **Escribir las páginas**: reemplazar `src/pages/index.astro` y agregar las
   rutas del rubro. Usar los componentes del kit (`PageHero`, `LiveNow`) y la
   isla `Booking` para la conversión.

4. **Medios**: usar los IDs verificados de `src/lib/media.ts` (pool por rubro).
   Máximo 6 videos y 8 fotos por app. Si agregás un ID nuevo, verificá:

   ```bash
   curl -sI -m 15 "https://assets.mixkit.co/videos/1234/1234-720.mp4"
   curl -sI -m 15 "https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1200"
   ```

5. **Registrar la app**: agregar el script `dev:<rubro>` / `build:<rubro>` en el
   `package.json` raíz y el rubro en `packages/webmaster-kit/rubros.ts`
   (paleta, WhatsApp, puerto y `demoUrl` como `/demos/<slug>/`). `site-config.mjs`
   reutiliza ese catálogo para el build integrado. Usar `appUrl()` de `src/lib/urls.ts`
   para rutas internas; no anteponer el origen de producción a enlaces de navegación.

6. **Verificar**: `pnpm --filter wm-<rubro> run check && pnpm --filter wm-<rubro> run build`.

Fuentes: [guía del kit](packages/webmaster-kit/README.md),
[esqueleto canónico](packages/webmaster-kit/app-template/) y
[scaffolder](scripts/new-app.mjs).

### Checklist de contenido (ley AR)

- Precios **finales con impuestos** (`legal.pricesIncludeTaxes`).
- Botón de arrepentimiento/baja si hay venta online (Res. 316/2018 y 271/2020).
- Link a Defensa del Consumidor.
- Textos rioplatenses; marcas, precios, sedes y profesionales **ficticios**,
  marcados como demo en la UI.
- Formularios y reservas **no envían datos**: la UI lo dice explícitamente.
