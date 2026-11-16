# lavadero-premium — solución PREMIUM carwashing+bar (Gloss & Glass)

Header: segundo ejemplo de carwashing para el estudio, sin reemplazar apps/wm-lavadero. Marca ficticia Gloss & Glass, paleta del Drive. Scope v1: intermedio + configurador 3D.

## Specs

- S1 — Origen Drive: "Mirá en mi Drive, dentro de projects, el archivo carwashing&bar-web-design-prompts.txt y analiza toda la data para agregar un nuevo ejemplo de carwashing para el estudio webmaster. La idea no es reemplazar el anterior, sino agregar uno MAS PROFESIONAL, no ai-slop." [Drive id 16y0GJeTx8EBQcyhYY5prGuGtPXU7kWI7, 278730 bytes, 582 líneas, concepto "Gloss & Glass" / "A Better Kind of Pit Stop"]
- S2 — Research local: "Arma una carpeta local de research y poné ahí: el reporte-local, más el research-output. A esta última carpeta, limpiala (porque tiene la clínica, que no está más), y agrega el carwashing desde el Drive."
- S3 — Preguntar antes: "Pregunta las dudas antes de empezar" [HECHO 2026-11-16 vía question: destino demo / estructura research / alcance v1 / marca]
- S4 — No research de rubro: "Tené en cuenta que no quiero un research del rubro carwashing, sino que quiero implementar una web para el estudio como solución PREMIUM para el rubro, a partir de lo que se diseñó en el archivo de Drive."
- S5 — Decisiones 2026-11-16: (1) destino "Nueva app wm-lavadero-premium"; (2) estructura "Nueva research/ centralizada"; (3) alcance custom "Hacete un intermedio + configurador 3d"; (4) identidad "Marca y paleta del Drive"
- S6 — Alcance v1 intermedio+3D: hero showroom light (cursor como luz, CTAs smart AM/PM, live line) + servicios revelados por luz + wipe before/after + tour scroll Arrive→Transform→Unwind con fotos reales del espacio + configurador 3D único (un hero object, vehicle types, hotspots, precio live, booking pre-filled) + bar editorial (condensation & glow, zero-proof igual peso, 21+ tasteful) + Wash&Sip split + reserva 3 pasos + WhatsApp + sticky mobile bar. Explícitos NO: sin avatares/HUD, sin scroll-jack, sin neón flashing, sin sonido sin consent, sin autoplay video pesado, performance <2s, reduced-motion, mobile-first.
- S7 — Identidad: working title "Gloss & Glass" como marca ficticia; paleta graphite/chrome/aqua/cobre del Drive (bg #101114 aprox, chrome silver, aqua #2FC2DA-like, copper-amber #C97B2D-like); tipografía serif display + sans funcional; copy americano del Drive adaptado a es-AR; datos ficticios; 21+ tasteful; zero-proof + "wait & sip / drop off" + ride-home como diferenciador.
- S8 — Registro técnico: nueva app wm-lavadero-premium, slug /demos/lavadero-premium/, puerto 3031; alta en packages/webmaster-kit/rubros.ts (RUBROS pasa de 6 a 7) + site-config/assemble/build/check heredan; portfolio DemoIndex/catálogo la lista sola; copy "Seis ejemplos" pasa a genérico; scaffolder scripts/new-app.mjs como base, contenido propio del writer.

## Tasks

- T1 [S2,S5] Research/ centralizada: research/reporte-local + research/research-output, borrar research-output/wm-clinica, agregar carwashing de Drive — route: inline — commit: —
- T2 [S5,S8] Alta lavadero-premium en rubros.ts + verificar site-config/assemble + catálogo portfolio — route: inline — commit: —
- T3 [S1,S6,S7,S8] Scaffold wm-lavadero-premium (new-app.mjs --port 3031) + contenido Gloss & Glass — route: inline — commit: —
- T4 [S6] Home intermedio: hero light + servicios reveal + wipe + tour scroll — route: inline — commit: —
- T5 [S6] Configurador 3D único (isla React liviana, hotspots, precio live, prefill reserva) — route: inline — commit: —
- T6 [S6] Bar + Wash&Sip + reserva 3 pasos + WhatsApp + sticky mobile + resto páginas — route: inline — commit: —
- T7 [S6,S8] Build + check-site + preview 4321 verify /demos/lavadero-premium/ 200 — route: inline — commit: —

## Log

- L1 — Pedido original verbatim: "Mirá en mi Drive, dentro de projects, el archivo carwashing&bar-web-design-prompts.txt y analiza toda la data para agregar un nuevo ejemplo de carwashing para el estudio webmaster. La idea no es reemplazar el anterior, sino agregar uno MAS PROFESIONAL, no ai-slop. Arma una carpeta local de research y poné ahí: el reporte-local, más el research-output. A esta última carpeta, limpiala (porque tiene la clínica, que no está más), y agrega el carwashing desde el Drive. Pregunta las dudas antes de empezar"
- L2 — Aclaración verbatim: "Tené en cuenta que no quiero un research del rubro carwashing, sino que quiero implementar una web para el estudio como solución PREMIUM para el rubro, a partir de lo que se diseñó en el archivo de Drive."
- L3 — Respuestas 2026-11-16: destino=Nueva app wm-lavadero-premium; research=Nueva research/ centralizada; alcance=custom "Hacete un intermedio + configurador 3d"; marca=Marca y paleta del Drive.
- L5 — 2026-11-16: T7 done. `pnpm build` 8 apps + `pnpm check:site` GREEN (8 roots, 58 pages, 53 JS/CSS, 1634 links). Preview 4321 reiniciado con dist/ nuevo: /demos/lavadero-premium/ 200 (+servicios/bar/reservar 200), /demos/lavadero/ sigue 200, catálogo enlaza la premium. Sin commits (decisión de push del usuario pendiente).
- S9 — Ruptura visual 2026-11-16 (decisión usuario ante "no se ve diferencia con el normal"): la firma de 06-firma.md es lo que aplana las demos. Para la premium: LIBERTAD VISUAL TOTAL, CONTRATO ESTRUCTURAL INTACTO. Intacto: reserva 4 pasos, pase/ticket, WhatsApp lib, datos contacto/legal, 6 rutas, check-site verde, sin dependencias nuevas, Base.astro intacto. Libre: display propia, cards/botones/ritmo/secciones propios (cero look wm-card), luz cobre, layouts asimétricos. La firma se reinterpreta: es la conversión, no el look.
- L6 — 2026-11-16: usuario elige "Visual libre, conversión intacta". T8 rediseño visual propio (worker), T9 re-verificación.
- L7 — 2026-11-16: T8 done vía worker (Bodoni Moda + Archivo vía theme.fonts.href, lenguaje .gg-* propio, cards/botones/ritmo editoriales, Configurador solo 2 clases). Corrección parent: revertidos videos a autoplay muted loop (el worker los había pasado a controls+preload none). T9 done: `pnpm build` 8 apps + `pnpm check:site` GREEN (8 roots, 58 pages, 1635 links). Preview 4321 con dist/ nuevo: 6/6 rutas premium 200, lavadero normal 200, Bodoni Moda servida, autoplay presente. Sin commits.
- L8 — 2026-11-16: fondo three.js con scroll. gentle-design no abrió los artboards (el tool no reconoce diseños creados fuera de su flujo y el skill no está en disco); se sirven por HTTP puerto 4322. Tres direcciones en design/lavadero-bg/ (+brief.md con restricciones: cuarentena pnpm 3 días para three, bundle, reduced-motion, check-site). Pendiente: elección de dirección + aprobación de dependencia three (T11).
- L9 — 2026-11-16: instalado el skill oficial gentle-design (copiado de gentle-pi 4.8.0 + gentle-ui-design a ~/.agents/skills/). Artboards migrados a la regla del skill (pilas del sistema, sin URLs externas) + design.json con tradeoffs + sync del sistema (design/system.md + design/system.html).
