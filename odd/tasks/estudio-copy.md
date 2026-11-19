# Estudio: copy sitio madre como estudio de software

Pasar `apps/wm-portfolio` de portfolio personal a Estudio de Desarrollo de Software (Webmaster Studio), tono levemente formal sin frases gancheras. Alcance: solo sitio madre.

## Specs

- S1: "NO ES UN PORTFOLIO sino un Estudio de Desarrollo de Software."
- S2: "No hagas frases gancheras como \"6 apps que ya funcionan\", sino algo levemente más formal (aunque no acartonado)."
- S3 (decisión 2026-11-15): marca = "Webmaster Studio".
- S4 (decisión 2026-11-15): las 6 webs se presentan como "Soluciones por industria".
- S5 (decisión 2026-11-15): "cambia a contacto+cotización PERO agregá algo referido a que se puede hacer rápidamente una demo".
- S6 (decisión 2026-11-15): "Empezar por el sitio madre".

## Tasks

- T1 [S1,S2,S3,S4] Hero y propuesta: kicker/título/subtítulo/CTAs sin gancho, marca Webmaster Studio — route: inline — status: completed — worker mwi1p06b: portfolio.ts:236, :259
- T2 [S1,S2,S5] Servicios/Proceso/Prueba/FAQ: quitar primera persona y promesas de ticket en 48 h — route: inline — status: completed — worker mwi1p06b: portfolio.ts:39, :119, :153, :187
- T3 [S1,S5] Conversión a contacto + cotización con mención de demo rápida — route: inline — status: completed — worker mwi1p06b: portfolio.ts:272, DemoRequest.tsx:58, :80, :118
- T4 [S1,S4] Demos → soluciones por industria en catálogo, índice y filtros — route: inline — status: completed — worker mwi1p06b: index.astro:94, demos.astro:18, SolutionCard.astro:28 (opción B aprobada)
- T5 [S1,S2,S3,S4,S5,S6] Legales + verificación: tests, typecheck madre, build integrado — route: inline — status: completed — parent: pnpm build 7 apps OK, check:site 7 roots 52 pages 1460 links, preview 200 con marca Webmaster Studio

## Log

- L1 (pedido original): "Vamos a revisar el copy y el proyecto en general. Necesitamos varios cambios porque NO ES UN PORTFOLIO sino un Estudio de Desarrollo de Software. No hagas frases gancheras como \"6 apps que ya funcionan\", sino algo levemente más formal (aunque no acartonado). Pregunta lo que necesites para estar seguro"
- L2 (decisiones 2026-11-15): marca Webmaster Studio; 6 webs como soluciones por industria; oferta contacto+cotización con mención de demo rápida; alcance solo sitio madre.
- L3 (implementación 2026-11-15): worker T1-T4 + opción B (SolutionCard local, kit intacto); parent T5: build 7 apps, check:site 7/52/1460, preview verificado.
