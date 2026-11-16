# arquitectura-premium — DEMO PREMIUM del rubro arquitectura (visual libre + conversión)

Header: nueva app `wm-arquitectura-premium` (puerto 3032, slug `/demos/arquitectura-premium/`) para el rubro "Estudio de arquitectura y diseño". NO reemplaza `apps/wm-arquitectura` (demo común, ESTUDIO TRAZO): conviven como dos soluciones del mismo rubro en el portfolio madre. Rama: `feat/arquitectura-premium`. Estrategia de entrega: `ask-on-risk` (default). Test runner: `node --test scripts/*.test.mjs` + `pnpm --filter wm-arquitectura-premium run check` + `pnpm build` + `pnpm check:site`.

## Specs

- S1 — Pedido original verbatim: "Arma el prototipo premium y vinculalo a la web del estudio en el rubro \"arquitectura\"".
- S2 — Condición de la demo común, verbatim: "Que quede claro esto: la demo actual del arquitectura qeuda como demo común. lo que estamos armando es el reasearch para una DEMO PREMIUM. Por eso el énfasis en la UI".
- S3 — Foco comercial verbatim: "1 - Estudios como clientes pero con un valor agregado: mejorar 10x la UI, con 3d y animaciones de inmuebles. Además debe ser super liviana y rápida."
- S4 — Cambio de estructura de demos, verbatim: "antes -> firma en cada demo (en lo referente al diseño) , ahora -> visual libre + conversión. Revisa eso antes de seguir para no condicionarte."
- S5 — Traducción operativa de S4 (de `odd/tasks/lavadero-premium.md` S9 y log L6): **libertad visual total + contrato estructural intacto**. Intacto: reserva 4 pasos que termina en ticket/pase, WhatsApp lib, datos contacto/legal, 6 rutas, check-site verde, sin dependencias nuevas, `Base.astro` intacto. Libre: display propia, cards/botones/ritmo/secciones propios (cero look `wm-card`), paleta y luz propias, layout asimétrico. "La firma se reinterpreta: es la conversión, no el look."
- S6 — Recomendación del research (Lite `research/research-output/arquitectura-premium/lite/LITE_BRIEF.md`): E1 editorial liviano como base + **un solo** hero 3D con hotspots y precio live + E3 (cotizador por etapa/superficie + WhatsApp + seña). Explícitos NO: no 2º objeto 3D, no HUD gamer, no scroll-jack, no autoplay video pesado, no sonido sin consent.
- S7 — Mercado y contenido: Argentina, CABA/GBA. Textos rioplatenses, marcas y datos ficticios, precios finales con IVA incluido, botón de baja/arrepentimiento + link a Defensa del Consumidor (heredado de la demo común).
- S8 — Registro técnico: alta en el catálogo canónico `packages/webmaster-kit/rubros.ts` con `id: "arquitectura-premium"`, `slug: "arquitectura-premium"`, `demoUrl: "/demos/arquitectura-premium/"`, `port: 3032`, `rubro` igual al de la común (mismo string → el filtro del portfolio las agrupa); aliases `dev:arquitectura-premium` / `build:arquitectura-premium` en el `package.json` raíz; portfolio madre: la solución premium listada junto a la común bajo el rubro arquitectura.
- S9 — Vínculo cruzado: la demo común `wm-arquitectura` enlaza a la premium (y la premium a la común) con el patrón de enlaces entre apps ya usado (`data-astro-reload`, ruta completa del catálogo), para que se lea como "versión estándar / versión premium" del mismo rubro.
- S10 — Límites del research que NO se deben prometer en la UI: performance del hero 3D sin medir (`M1 UNRESOLVED`), números USD/m² premium sin cotizar (`M2/M3`), aplicabilidad exacta de la baja/arrepentimiento a un cotizador de servicios sin leer la norma (`R3 PARTIALLY_SUPPORTED`). La demo puede mostrar precios orientativos etiquetados como demo, nunca como tarifa garantizada.
- S11 — Budget de performance: super liviana y rápida. Objetivo declarado: build estático sin dependencias nuevas, JS mínimo (una isla React para el hero 3D + una para el cotizador), `prefers-reduced-motion` respetado, sin video autoplay pesado en el fold.

## Tasks

- T1 [S1,S4,S5,S8,S9] Feature doc + rama + research ya escrito — route: inline — commit: —
- T2 [S8] Scaffold `wm-arquitectura-premium` (scaffolder, puerto 3032) + alta en catálogo canónico + aliases raíz + portfolio madre (solución premium del rubro arquitectura) — route: inline — commit: —
- T3 [S6,S7,S10] Contenido propio de la app (servicios, obras, proceso, equipo, FAQs, legales) con datos ficticios y precios finales con IVA — route: inline — commit: —
- T4 [S5,S6,S11] Identidad visual libre: tokens propios, tipografía display propia, layout asimétrico, cero look `wm-card` — route: inline — commit: —
- T5 [S6,S11] Hero 3D único (isla React liviana) + hotspots + precio live + reduced-motion + fallback sin 3D — route: inline — commit: —
- T6 [S6,S7] Conversión intacta: cotizador 4 pasos → ticket/pase + WhatsApp lib + contacto — route: inline — commit: —
- T7 [S8,S9] Vínculo cruzado común↔premium + páginas restantes (obras, estudio, contacto, legal) — route: inline — commit: —
- T8 [S1,S11] Verificación: `node --test scripts/*.test.mjs`, `pnpm --filter wm-arquitectura-premium run check`, `pnpm build`, `pnpm check:site`, preview 4321 con `/demos/arquitectura-premium/` 200 — route: inline — commit: —

## Log

- L1 — Pedido original verbatim: "Arma el prototipo premium y vinculalo a la web del estudio en el rubro \"arquitectura\""
- L2 — Condición verbatim: "Que quede claro esto: la demo actual del arquitectura qeuda como demo común. lo que estamos armando es el reasearch para una DEMO PREMIUM. Por eso el énfasis en la UI"
- L3 — Foco verbatim: "1 - Estudios como clientes pero con un valor agregado: mejorar 10x la UI, con 3d y animaciones de imóveis. Además debe ser super liviana y rápida."
- L4 — Cambio de estructura verbatim: "antes -> firma en cada demo (en lo referente al diseño) , ahora -> visual libre + conversión. Revisa eso antes de seguir para no condicionarte."
- L5 — 2026-11-16: research Lite cerrado en `research/research-output/arquitectura-premium/` (mercado Argentina, goal explorar/inspirar, 8 consultas / 6 lecturas, stop sufficient_coverage). Recomendación: E1 + un hero 3D + E3.
- L6 — 2026-11-16: revisión del cambio de estructura → la "firma" (cortina/hero/grade/ticket compartidos) NO se replica en el premium; se conserva SOLO el contrato de conversión (Booking 4 pasos → ticket, WhatsApp, legales, 6 rutas, check-site verde, sin deps nuevas). Demo común intacta.
- L7 — 2026-11-16: rama `feat/arquitectura-premium` creada desde `main`. Estado de partida del worktree: hay cambios NO committeados de la sesión anterior (README, portfolio mother, kit, pnpm-lock) — no los toco ni los mezclo en los commits de esta feature.
