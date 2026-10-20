# webmaster-studio — versión mejorada para portfolio freelance

Objetivo: analizar estudio-webs y armar versión mejorada para promocionar trabajos. Branch: main (feature work en rama aparte si supera 400 líneas). Delivery: ask-on-risk. Forecast inicial ~1800 líneas docs → supera 400, se preguntará estrategia (stacked-to-main vs feature-branch-chain) antes del siguiente commit. Runner: sin runner runnable para docs (excepción test-first, solo checks estructurales).

## Specs

- S1 — Descarga y base: "descarga el repo https://github.com/maurid2000/estudio-webs en una carpeta "webmaster-studio"" [HECHO 2026-10-20, main limpio]
- S2 — Reporte local: "En la carpet, crea un nuevo reporte local y agrega documentos" [scope: `reporte-local/` en webmaster-studio, Markdown]
- S3 — Ideas similares: "investiga opciones de ideas similares en la web" [scope decisión 2026-10-20: foco Global + diseño]
- S4 — Plan trabajo mejorada: "vamos a proponer un plan de trabajo: hay que hacer una propia versión mejorada." + "Yo también soy desarrollador web y estoy queriendo implementar alguna forma de promocionar los trabajos que soy capaz de hacer." + "Está me pareció buena, pero hay que mejorarla."
- S5 — Rubros + top 10: "Investiga los rubros y el top 10 páginas de cada rubro." + "son los mejores rubros para mí?" [scope decisión 2026-10-20: "Ayudame a decidir" → evaluar rentabilidad/demanda/competencia; alcance top 10 = "Global + diseño"] [REVISIÓN 2026-10-20 L5: salen los 4 menos populares para freelance AR — thaloz, invgate, vinos, veterinaria (evidencia T3: convierten menos / exigen producto vivo / ticket menor) — y entran 5: "clínica general y diagnóstico por imágenes" (evoluciona salud), "concesionario de autos nuevos y usados" (evoluciona autos), "lavadero de autos con bar", "estudio de estetica y yoga", "universidad privada". Resultado: 8 rubros (constructora, inmobiliaria, clínica+dx, concesionario, lavadero+bar, fitness, estética+yoga, universidad). Asunción reversible: si veterinaria/vinos traccionan en tu red, se reponen sin costo.] [REVISIÓN 2026-10-20 L7: sale fitness, "constructora" se reconvierte en estudio arquitectura y diseño. Finales 7: inmobiliaria, clínica+dx, concesionario, lavadero+bar, estética+yoga, universidad, arquitectura+diseño.]
- S6 — Plan negocios: "qué plan de negocios me conviene?" [scope decisión 2026-10-20: "Portfolio freelance"]
- S7 — Firma: "busquemos un rasgo de personalidad que emparente a todas las webs, que sea mi firma." [scope decisión 2026-10-20: "Creémosla juntos", sin marca/colores previos — Asunción: partir de cero]
- S8 — Proceso: "pregúntame todolo necesario antes de empeza." [HECHO 2026-10-20 vía question, 5 respuestas]
- S9 — Stack/hosting: "si es mejor y más útil usamos astro en lugar de next." + "Además, vamos a hostear gratuito en vercel." [scope decisión 2026-10-20: "Astro + islas"; Asunción: vidriera + contacto/WhatsApp primero, turnos/pagos/login solo si el rubro lo exige — por confirmar en T7]

## Tasks

- T1 [S1,S4] Relevar repo (9 apps, docs, content.ts, formularios demo) — route: inline — status: completed
- T2 [S3] Investigar ideas similares globales (studios/portfolio que venden por rubro) — route: delegated explorer (Mapping trigger: >5 lookups) — status: completed — handoff: 10 casos 2026-10-20
- T3 [S5] Top 10 global diseño por rubro (9 rubros) + qué hacen bien — route: delegated explorer — status: completed — handoff: muestra 3-4 por rubro 2026-10-20 + extensión 5 rubros nuevos 2026-10-20 + arquitectura L7 inline 2026-10-20
- T4 [S5,S6] Evaluar si son los mejores rubros para freelance (demanda/competencia/dificultad) — route: inline (con handoff T2-T3) — status: completed — scope L7: 7 rubros finales en 04 (sale fitness, constructora→arquitectura)
- T5 [S6] Plan de negocios portfolio freelance (oferta, pricing, mantenimiento) — route: inline — status: completed — evidencia: reporte-local/05-plan-negocios.md
- T6 [S7] Proponer firma transversal (3 opciones + recomendación) — route: inline — status: completed — evidencia: reporte-local/06-firma.md (A ticket recomendada)
- T7 [S9] Comparar Astro vs Next + Vercel gratis (límites, islas, migración) — route: inline — status: completed — evidencia: reporte-local/07-astro-vercel.md (Astro islas, Hobby no comercial)
- T8 [S2,S4] Armar reporte-local/ + plan trabajo versión mejorada — route: inline — status: completed — evidencia: reporte-local/README..08 (8 docs) — commit: pendiente (untracked, rama feature pendiente)

## Implementación (autorizada 2026-10-20: "vamos con todo")

Arquitectura elegida: 8 apps Astro (1 por rubro + 1 portfolio madre) en `apps/wm-*` + 1 paquete compartido `packages/webmaster-ui`. Motivo: 8 apps = 8 demo URLs (patrón de los estudios del handoff T2), builds sin contención (dist/.astro por app) → paralelismo real; 1 app con 7 secciones colapsa outputs y serializa.
Entrega: feature-branch-chain sobre `feature/webmaster-studio-estrategia`, 1 commit por app. Estrategia derivada de "vamos con todo" + plan 08; adjustable antes de push.
Modelos: subagentes ODD en `opencode-go/minimax-m3.1-flash-free` vía `opencode.json` del repo (global intacto).

- T9 [S4,S7,S9] Base compartida: `packages/webmaster-ui` (Transition, PageHero, Booking, Ticket, LiveNow, Nav, Footer, grade, tokens, rubros.ts, whatsapp.ts) + `apps/wm-clinica` app de referencia funcionando — route: delegated writer (secuencial, base de todo lo demás) — status: pending
- T10 [S5] `apps/wm-concesionario` (nuevos+usados, VDP 360, cuota, test drive) — route: delegated writer — status: pending
- T11 [S5] `apps/wm-lavadero` (lavadero+bar, reserva tamaño, seña, tiempo vivo) — route: delegated writer — status: pending
- T12 [S5] `apps/wm-estetica` (estética+yoga, 1 BOOK, antes/después, promo) — route: delegated writer — status: pending
- T13 [S5] `apps/wm-universidad` (buscador carreras, salida laboral, visita/beca) — route: delegated writer — status: pending
- T14 [S5] `apps/wm-inmobiliaria` (ficha, tour, filtros, WhatsApp) — route: delegated writer — status: pending
- T15 [S5] `apps/wm-arquitectura` (obra, planos, antes/después, cotizar) — route: delegated writer — status: pending
- T16 [S2,S4] `apps/wm-portfolio` (madre filtrable por rubro + demo gratis 48h) — route: delegated writer — status: pending
- T17 [S4] Seam check: build de las 8 apps + typecheck + spot check de superficies + commits por app — route: parent inline — status: pending
- T8 [S2,S4] Armar reporte-local/ + plan trabajo versión mejorada — route: inline — status: pending — commit: pendiente

## Log

- L1 (2026-10-20, pedido original verbatim): "descarga el repo https://github.com/maurid2000/estudio-webs en una carpeta "webmaster-studio" y vamos a analizar la idea que implementar. En la carpet, crea un nuevo reporte local y agrega documentos: investiga opciones de ideas similares en la web y vamos a proponer un plan de trabajo: hay que hacer una propia versión mejorada. Yo también soy desarrollador web y estoy queriendo implementar alguna forma de promocionar los trabajos que soy capaz de hacer. Está me pareció buena, pero hay que mejorarla. Investiga los rubros y el top 10 páginas de cada rubro. son los mejores rubros para mí? qué plan de negocios me conviene? busquemos un rasgo de personalidad que emparente a todas las webs, que sea mi firma. pregúntame todolo necesario antes de empeza. una consideración. si es mejor y más útil usamos astro en lugar de next. Además, vamos a hostear gratuito en vercel."
- L2 (2026-10-20, Q&A bloqueo previo a investigar): P1 objetivo="Portfolio freelance (Recommended)" | P2 rubros="Ayudame a decidir (Recommended)" | P3 top10="Global + diseño" | P4 firma="Creémosla juntos (Recommended)" | P5 stack="Astro + islas (Recommended)"
- L3 (2026-10-20, evidencia base): main limpio, apps=[autos,constructora,fitness,inmobiliaria,invgate,salud,thaloz,veterinaria,vinos], docs=[fitness-investigacion,veterinaria-investigacion,vinos-investigacion,prompt-nuevos-rubros], README confirma Next.js+TS workspaces, content.ts centraliza textos, formularios demo no envían datos.
- L4 (2026-10-20, decisión routing): T1 inline; T2-T3 a un explorer por Mapping trigger; resto inline hasta re-evaluar. Sin writer (sin paralelismo con superficies disjuntas ni backstop). Test-first excepción: docs sin RED runnable, solo readback estructural.
- L5 (2026-10-20, cambio rubros verbatim): "saca los rubros menos populares y mete clínica general y diagnóstico por imágenes, concesionario de autos nuevos y usados, lavadero de autos con bar, estudio de estetica y yoga, universidad privada."
- L6 (2026-10-20, T3 ext + T4): explorer 5 nuevos OK (S5). Salen thaloz/invgate/vinos/veterinaria. Finales 8 en 04-rubros-para-vos.md. T3-T4 completed. Spot: git status solo untracked odd/+reporte-local/.
- L7 (2026-10-20, cambio rubros verbatim): "saca fitness y en lugar de "constructora" piensa en estudio de arquitectura y diseño"
- L8 (2026-10-20, T5-T8): 05 plan, 06 firma A ticket, 07 Astro islas + Hobby no comercial, 08 roadmap 7 slices. Feature 8/8 docs, commit pendiente.
- L9 (2026-10-20, verbatim): "vamos con todo. lanza subasgentes con minimax m3.1 flash free en casa lugar que puedas paramáximo  paralelismo" → autorización de implementación completa + modelo de subagentes.
- L10 (2026-10-20, verbatim): "continua PERO los modelos cámbialos para este repo nomás. qué en la configuración global de gentle-ai queden como estaban." → override de modelo SOLO en `opencode.json` del repo; global revertido y verificado (worker=openai/gpt-6.1-sol, verify=opencode-go/deepseek-v4.1-flash).
- L11 (2026-10-20, ejecución): el Task tool NO lee el config por repo (resuelve desde el config del proceso padre: evidencia DB, subagente salió con `openai/gpt-6.1-sol`). Mecanismo que sí lo respeta: `opencode run --dir <repo> --agent gentle-ai-worker` (el repo necesita `"mode": "primary"` en su `opencode.json` para ser lanzable por CLI). Verificado: `opencode debug agent gentle-ai-worker` desde el repo → `opencode-go/minimax-m3.1-flash-free`; desde el dir padre → `openai/gpt-6.1-sol` (global intacto). T9 base lanzado 2026-10-20 16:36 con minimax.
- L12 (2026-10-20, bloqueo T9 resuelto): el primer worker se detuvo con `interaction_required` porque `npm install` escribe `package-lock.json` y `node_modules/`, fuera de sus superficies. Parent amplió las allowed edit surfaces explícitamente y relanzó.
