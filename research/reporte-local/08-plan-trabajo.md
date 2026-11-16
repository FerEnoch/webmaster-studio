# 08 — Plan de trabajo: estado real tras la implementación (2026-10-20)

## Lo que está HECHO (rama `feature/webmaster-studio-estrategia`)

### Base compartida — `packages/webmaster-kit/`
Fuente de verdad del sistema. Se COPIA a cada app (no es paquete npm, evita fricción de build con Astro + Vite).
`types.ts` (RubroContent, Theme, Section, Legal, Contact, Conversion) · `rubros.ts` (los 7 rubros + `getRubro`) · `whatsapp.ts` (`waLink`, `rubroWhatsapp`) · `media.ts` (medios verificados) · `styles/tokens.css` (@theme Tailwind v4 + `.wm-grade` / `.wm-grain` / `.wm-vignette` / `.wm-curtain`) · `components/` (BaseLayout, Nav, Footer, PageHero, LiveNow, RubroCard, Booking.tsx, Ticket.tsx) · `app-template/` (esqueleto).

### 8 apps Astro (1 por rubro + portfolio madre)
| App | Rubro | Rutas | Conversión principal |
| --- | --- | --- | --- |
| wm-clinica | clínica + dx | 5 | turnera por estudio → ticket |
| wm-concesionario | usados + nuevos | 13 | test drive → ticket |
| wm-lavadero | lavadero + bar | 6 | reserva con seña → ticket |
| wm-estetica | estética + yoga | 6 | turno → ticket |
| wm-universidad | universidad | 6 | admisión / visita → ticket |
| wm-inmobiliaria | inmobiliaria | 11 | visita → ticket |
| wm-arquitectura | arquitectura | 5 | cotización → ticket |
| wm-portfolio | portfolio madre | 5 | demo gratis 48h → ticket |

Todas: cortina entre rutas, hero de video que se encoge, grade/grano/viñeta, sección pinned, señal en vivo, 1 CTA, WhatsApp prearmado, legales AR (Res. 316/2018, 271/2020, Defensa del Consumidor, precios con impuestos) y contenido ficticio marcado como demo.

### Scaffolder
`node scripts/new-app.mjs wm-<rubro>` crea el esqueleto copiando del kit. Para sumar un rubro: scaffolder → `src/content/<rubro>.ts` → reemplazar `src/pages/index.astro` → registrar en `rubros.ts` y en el `package.json` raíz → `pnpm --filter wm-<slug> run check && ... run build`.

## Verificación histórica (seam check del 2026-10-20)

Esta evidencia corresponde al estado de aquella fecha, no a una verificación
actual de la limpieza ni a instrucciones para compilar las apps retiradas.

- 8/8 apps: `astro check` con **0 errores**, build OK, 57 páginas HTML.
- Probe headless sobre las 8: el form de contacto se oculta, la confirmación aparece, **no navega**, 0 errores de consola.
- `pnpm audit --audit-level high` → **No known vulnerabilities found**.
- 9/9 apps Next legacy siguen compilando con pnpm (sin regresión).
- Sin artefactos de build en git.

## Toolchain
pnpm 12.11.2 (único package manager) con `pnpm-workspace.yaml` endurecido: `minimumReleaseAge` 3 días, `trustPolicy: no-downgrade`, `blockExoticSubdeps`, `allowBuilds` (allowlist) y `strictDepBuilds`. `overrides: postcss ^8.5.18` mata 2 vulnerabilidades HIGH heredadas de `next`. Astro 7.4.1 + React 19 + Tailwind v4.

## Limpieza de las apps anteriores

La decisión ya está tomada: el usuario pidió eliminarlas, no conservarlas
como referencia. Scripts raíz y documentación operativa se actualizan para
las ocho apps Astro. El registro original queda como histórico en
`odd/tasks/orden-benchmark.md`; el borrado y la verificación final de esta
limpieza quedan a cargo del parent.

## Pendientes de decisión
1. **Vercel**: los `demoUrl` (`wm-<slug>.vercel.app`) son placeholders. Hobby es "personal, no comercial": para clientes reales hay que avisar Pro ($20/mes + overages) o Cloudflare. Decidir antes de vender.
2. **Deploy**: pushear a Vercel es decisión del usuario; el recuento de commits de la verificación anterior es histórico.

## Próximo sprint sugerido
1. Deploy de las 8 apps a Vercel (8 proyectos, un click c/u) + dominios demo.
2. Portfolio madre con los links reales a las demos.
3. Medir: clicks de WhatsApp / reservas iniciadas por rubro durante 2 semanas → ajustar precios del plan de negocios (`05-plan-negocios.md`).
