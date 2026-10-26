# Estudio

Portfolio freelance con **8 apps Astro: 7 demos de rubro + 1 portfolio madre**
en `apps/wm-*`. Comparten el kit canónico de `packages/webmaster-kit/`.

El monorepo usa **pnpm** (`pnpm-workspace.yaml`, `apps/*`): las dependencias se
instalan **una sola vez** en la raíz.

---

# 🌱 Portfolio Astro — `webmaster-studio`

## Qué es

Un portfolio freelance: **7 demos de rubro** (una web por rubro, cada una
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
- **App de referencia:** `apps/wm-clinica/` — ejemplo completo del kit.
  Las apps nuevas se generan desde el kit, no copiando la clínica.

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
pnpm dev                    # portfolio madre: http://localhost:3027
pnpm run dev:clinica        # http://localhost:3020
pnpm run build:clinica      # build estático -> apps/wm-clinica/dist
pnpm run check:clinica      # astro check (typecheck + .astro)
pnpm build                  # build recursivo de las 8 apps
```

El `pnpm install` de la raíz instala **todas** las apps del workspace
(`apps/*`). Para una sola app: `pnpm --filter wm-clinica run dev`.
Cada alias `dev:<rubro>` de la tabla tiene su equivalente `build:<rubro>`,
incluido `pnpm run build:portfolio`.

## Verificar la estructura del workspace

```bash
node --test scripts/workspace.test.mjs
```

Comprueba los destinos de los scripts raíz, los aliases de las ocho apps y
que no reaparezcan las apps anteriores ni sus instrucciones operativas.
No reemplaza el typecheck ni el build de cada app.

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
