# Estudio

Monorepo de webs por rubro. Dos generaciones conviven acá:

- **Portfolio Astro (`apps/wm-*` + `packages/webmaster-kit`)** — el trabajo nuevo:
  8 demos Astro (7 rubros + portfolio madre) que comparten un kit canónico.
- **9 apps Next.js (`apps/thaloz` … `apps/vinos`)** — las referencias/benchmarks
  de la primera versión. Se conservan como documentación y benchmark de diseño.

El monorepo usa **pnpm** (`pnpm-workspace.yaml`, `apps/*`): las dependencias se
instalan **una sola vez** en la raíz.

---

# 🌱 Portfolio Astro — `webmaster-studio`

## Qué es

Un portfolio freelance: **8 demos de rubro** (una web por rubro, cada una
publicable y vendible) + **1 sitio portfolio madre** que las indexa. Todas
comparten una misma firma visual, para que se entienda que son el mismo
portfolio y no templates sueltos.

- **Stack:** Astro 7 (islas) + React 19 (islas interactivas) + Tailwind v4
  (plugin de Vite). Hospedaje: Vercel Hobby.
- **Kit canónico:** `packages/webmaster-kit/` — no es un paquete npm, es una
  carpeta fuente que se **copia** dentro de cada app. Contiene el contrato de
  contenido (`types.ts`), los 7 rubros (`rubros.ts`), los deep-links de
  WhatsApp (`whatsapp.ts`), los tokens y utilidades de la firma
  (`styles/tokens.css`) y los componentes compartidos (`components/`).
- **App de referencia:** `apps/wm-clinica/` — completa, compila y es el molde
  exacto que copian las otras 7.

```
packages/
  webmaster-kit/      ← kit canónico (se copia a cada app)
    types.ts          ← contrato: RubroContent, Theme, Section, Legal, Contact…
    rubros.ts         ← los 7 rubros + getRubro(id)
    whatsapp.ts       ← waLink(phone, text) + rubroWhatsapp(id, ctx)
    media.ts          ← helpers de medios + pool de IDs VERIFICADOS
    styles/tokens.css ← @theme de Tailwind v4 + .wm-grade/.wm-grain/.wm-vignette/.wm-curtain
    components/       ← BaseLayout, Nav, Footer, PageHero, LiveNow, RubroCard, Booking, Ticket
    app-template/     ← esqueleto de app que usa el scaffolder
apps/
  wm-clinica/        ← app de referencia (Astro)         :3020
  wm-concesionario/  ← concesionario de autos             :3021
  wm-lavadero/       ← lavadero de autos con bar         :3022
  wm-estetica/       ← estudio de estética y yoga         :3023
  wm-universidad/    ← universidad privada                :3024
  wm-inmobiliaria/   ← inmobiliaria                       :3025
  wm-arquitectura/   ← estudio de arquitectura y diseño   :3026
  wm-portfolio/      ← portfolio madre (índice de demos)  :3027
scripts/
  new-app.mjs        ← scaffolder de apps nuevas
```

## La firma (idéntica en las 8 webs)

1. Cortina entre rutas (`astro:transitions` + overlay `.wm-curtain`).
2. Hero de video que se encoge con el scroll (sticky + `transform`).
3. Grade / grano / viñeta uniforme sobre fotos y videos.
4. Una sección "pinned" que cuenta algo (en la clínica: la preparación de cada estudio).
5. Señal "en vivo" creíble (`LiveNow`: "Abierto ahora · 6 turnos hoy").
6. Una conversión que termina en **TICKET** animado (reserva en 3 pasos).
7. Un solo CTA sobre el fold + WhatsApp flotante con mensaje prearmado.

## Tabla de apps y puertos

| App | Rubro | Puerto | Comando |
| --- | --- | --- | --- |
| `wm-clinica` | Clínica + diagnóstico por imágenes | 3020 | `pnpm run dev:clinica` |
| `wm-concesionario` | Concesionario de autos nuevos y usados | 3021 | `pnpm run dev:concesionario` |
| `wm-lavadero` | Lavadero de autos con bar | 3022 | `pnpm run dev:lavadero` |
| `wm-estetica` | Estudio de estética y yoga | 3023 | `pnpm run dev:estetica` |
| `wm-universidad` | Universidad privada | 3024 | `pnpm run dev:universidad` |
| `wm-inmobiliaria` | Inmobiliaria | 3025 | `pnpm run dev:inmobiliaria` |
| `wm-arquitectura` | Estudio de arquitectura y diseño | 3026 | `pnpm run dev:arquitectura` |
| `wm-portfolio` | Portfolio madre | 3027 | `pnpm run dev:portfolio` |

## Cómo correr

```bash
pnpm install                # una sola vez, en la raíz
pnpm run dev:clinica        # http://localhost:3020
pnpm run build:clinica      # build estático -> apps/wm-clinica/dist
pnpm run check:clinica      # astro check (typecheck + .astro)
```

El `pnpm install` de la raíz instala **todas** las apps del workspace
(`apps/*`). Para una sola app: `pnpm --filter wm-clinica run dev`.

## Sumar un rubro nuevo

1. **Crear el esqueleto** (copia desde el kit, nunca desde `apps/wm-clinica`):

   ```bash
   node scripts/new-app.mjs wm-concesionario
   # preview sin escribir nada:
   node scripts/new-app.mjs --dry-run wm-concesionario
   ```

   El scaffolder crea `package.json` (mismo set de dependencias y versiones que
   `wm-clinica`, con el nombre y el puerto de la app), `astro.config.mjs`,
   `tsconfig.json`, `.gitignore`, `src/layouts/Base.astro`,
   `src/styles/global.css`, `src/pages/index.astro` (placeholder) y copia el
   kit a `src/components/ui/` + `src/lib/` + `src/styles/tokens.css`.
   Si el destino ya existe, falla sin pisar nada.

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
   (paleta, WhatsApp, puerto).

6. **Verificar**: `pnpm --filter wm-<rubro> run check && pnpm --filter wm-<rubro> run build`.

### Checklist de contenido (ley AR)

- Precios **finales con impuestos** (`legal.pricesIncludeTaxes`).
- Botón de arrepentimiento/baja si hay venta online (Res. 316/2018 y 271/2020).
- Link a Defensa del Consumidor.
- Textos rioplatenses; marcas, precios, sedes y profesionales **ficticios**,
  marcados como demo en la UI.
- Formularios y reservas **no envían datos**: la UI lo dice explícitamente.

---

# Las 9 apps Next.js de referencia → `benchmark/`

> Se conservan en `benchmark/` como benchmark y documentación de la primera versión. No es MI proyecto. Para el
> trabajo nuevo usar el kit Astro de arriba. Comandos con pnpm (`--filter` funciona igual tras la mudanza).

Varias páginas web, cada una en su propia app de Next.js + TypeScript.
Las dependencias se instalan **una sola vez** en la raíz (`node_modules` compartido)
gracias a npm workspaces.

```
estudio/
  package.json          ← workspaces: apps/*, benchmark/apps/*
  node_modules/         ← compartido
  benchmark/
    README.md           ← qué hay acá y cómo correrlo
    apps/
      thaloz/             ← réplica de thaloz.com/about-us/company
      invgate/            ← réplica de invgate.com (home) con animaciones mejoradas
      constructora/       ← plantilla original de constructora con obra 3D en tiempo real
      inmobiliaria/       ← catálogo de propiedades, recorridos y terreno 3D
      salud/              ← clínica: morph de partículas y sistema de turnos
      autos/              ← concesionaria: video, configurador y animaciones web
      fitness/            ← gimnasio boutique premium: video, recorrido del club, reservas
      veterinaria/        ← clínica veterinaria cálida: triage, libreta de salud, turnos, recorrido
      vinos/              ← boutique de vinos + viajes en Mendoza: tienda, sommelier, itinerarios
    docs/                 ← investigaciones y briefs de esos rubros
```

| App | Comando | URL |
| --- | --- | --- |
| thaloz | `npm run dev` | http://127.0.0.1:3010 |
| invgate | `npm run dev:invgate` | http://localhost:3011 |
| constructora | `npm run dev:constructora` | http://localhost:3012 |
| inmobiliaria | `npm run dev:inmobiliaria` | http://localhost:3013 |
| salud | `npm run dev:salud` | http://localhost:3014 |
| autos | `npm run dev:autos` | http://localhost:3015 |
| fitness | `npm run dev:fitness` | http://localhost:3016 |
| veterinaria | `npm run dev:veterinaria` | http://localhost:3017 |
| vinos | `npm run dev:vinos` | http://localhost:3018 |

## Correr

```bash
npm install
npm run dev
```

Thaloz abre en http://127.0.0.1:3010 y también en `/about-us/company`.

InvGate: `npm run dev:invgate` → http://localhost:3011
(usa `motion` para las animaciones y `lenis` para el scroll suave).

## Sumar otra web

1. Copiá `apps/thaloz` a `apps/<nombre>`.
2. Cambiá el `"name"` del `package.json` de esa app y el puerto.
3. En la raíz, agregá `"dev:<nombre>": "npm run dev -w <nombre>"`.
4. `npm install` desde la raíz (no hace falta un `node_modules` por app).

Las fotos de Thaloz son referencias de Unsplash: el layout y los textos siguen
la página pública, las imágenes no son las originales del sitio.

InvGate: las capturas de producto, montañas y diagramas están hechos en código
(SVG/React animado); las fotos son de Unsplash.

Constructora ("Basalto", marca ficticia): `npm run dev:constructora` → http://localhost:3012
El edificio del hero es una escena Three.js (React Three Fiber) generada por código que se construye con el scroll.

Fitness ("NÚCLEO", marca ficticia): `npm run dev:fitness` → http://localhost:3016
Multipágina (`/`, `/club`, `/clases`, `/planes`, `/entrenadores`) con transición de cortina entre rutas,
gradación de color uniforme sobre fotos y videos (`.grade`), recorrido del club por scroll con plano interactivo,
grilla de clases con cupos y reserva sin registro, y botón de baja visible (Res. 316/2018).
Investigación y brief en `benchmark/docs/fitness-investigacion.md`.

Veterinaria ("MANADA", marca ficticia): `npm run dev:veterinaria` → http://localhost:3017
Paleta cálida (crema, verde bosque, coral) y serif Fraunces. Hero con "ventana" de video que se abre a pantalla completa,
beneficios animados, triage "¿Está bien tu mascota?" (rojo → guardia, nunca a la reserva), libreta de salud con línea de
tiempo por edad que recomienda plan, recorrido de la clínica sala por sala con plano, turnos en pasos con carnet animado.
Investigación y brief en `benchmark/docs/veterinaria-investigacion.md`.

Vinos ("ALTURA", marca ficticia): `npm run dev:vinos` → http://localhost:3018
Nocturna y cálida (vino, crema, latón) con Cormorant Garamond. Hero con video en arco de bodega que se abre y altímetro,
"La subida" Maipú → Luján → Valle de Uco con cordillera en parallax 2D, sommelier virtual que llena la copa con el color
del vino recomendado, tienda con carrito y envío gratis, viajes con itinerario hora a hora y mapa que dibuja la ruta,
voucher tipo pase de embarque, club con suscripción. Aviso de mayoría de edad y leyendas de la Ley 24.788.
Las botellas son ilustraciones SVG propias (sin marcas reales). Investigación en `benchmark/docs/vinos-investigacion.md`.

## Para integrar (colegas)

1. `git clone <repo> && cd estudio-webs && npm install` (un solo `node_modules` para todas las apps).
2. Cada app corre sola con su comando de la tabla de arriba; `npm run build:<app>` para compilar.
3. Todas son plantillas de demostración: marcas, precios, reseñas, matrículas y legajos son **ficticios** y hay que reemplazarlos por los datos reales del cliente.
4. El contenido de cada web está centralizado en `apps/<app>/src/lib/content.ts` (textos, precios, IDs de fotos y videos).
5. Fotos de Unsplash y videos de Mixkit se cargan por URL (licencias gratuitas); para producción conviene descargarlos y servirlos desde el propio hosting.
6. Los formularios (turnos, carrito, reservas, bajas) son demostrativos: **no envían datos**. Hay que conectarlos al backend real.
7. `benchmark/docs/prompt-nuevos-rubros.md` tiene la metodología para sumar rubros nuevos; `benchmark/docs/*-investigacion.md`, la investigación de cada uno.
