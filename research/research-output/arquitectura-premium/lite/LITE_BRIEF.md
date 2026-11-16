# LITE_BRIEF — Demo Premium Arquitectura (1 página ejecutiva, 2026-11-16)

**Problema / actores:** estudios AR (arquitectura, interiorismo, deco, inmobiliario) compiten con fotos top pero webs 2014; comitente elige a las 23h entre 2 portfolios parecidos. Demo común ESTUDIO TRAZO ya cubre lo correcto; la premium debe vender "estudio que publica, filtra y cotiza en minutos" con UI 10x, 3D liviano y <2s.

**Enfoques / trade-offs:** E1 editorial liviano (foto + long-form + filtro) es lo más seguro y performante [Whitelam](https://whitelam.media/insights/best-architecture-firm-websites-2026) — 2026-11-16 — "photography weight / long pages / filterability"; E2 3D único (hero object + tour 360 + before/after) diferencia pero exige medir [Astro](https://astro.build/) — 2026-11-16 — "Islands 71% good CWV" + [Aconif tour](https://aconif.com/honorarios-arquitecto-argentina-2026/) — 2026-11-16 — "Ver proyecto y tour 360°"; E3 conversión directa (cotizador 4 pasos + WhatsApp + link pago) cierra [Made by NF](https://www.madebynf.com/journal/interior-design-portfolio-website) — 2026-11-16 — "CTA + comprimir + SEO por proyecto" + [Mercado Pago](https://www.mercadopago.com.ar/cuenta-negocio) — 2026-11-16 — "Link de pago".

**Recomendación tentativa:** premium = E1 como base (3-4 obras profundas + filtro real + voz) + **un solo** hero 3D liviano (living/patio con hotspots, precio live) + E3 (cotizar por etapa/superficie + WhatsApp + seña). No 3 objetos 3D, no scroll-jack, no autoplay pesado.

Propuesta valor tentativa: "Del croquis al tour: cotizá por etapa en 4 pasos y recorré la obra antes de llamarnos."
Superficies tentativas: home (hero 3D + prueba + filtro) / obras (ficha larga + before/after) / estudio-proceso / contacto-cotizador.

Table stakes (máx 5):
1. Foto profesional + long-form por obra [Whitelam](https://whitelam.media/insights/best-architecture-firm-websites-2026) — 2026-11-16
2. Archivo filtrable por tipo/zona/estado [Whitelam](https://whitelam.media/insights/best-architecture-firm-websites-2026) — 2026-11-16
3. Precios finales IVA + Defensa + baja [Argentina.gob.ar](https://www.argentina.gob.ar/produccion/defensadelconsumidor) — 2026-11-16 (marco; detalle UNRESOLVED R3)
4. Comprimir + SEO por obra + reduced-motion [Made by NF](https://www.madebynf.com/journal/interior-design-portfolio-website) — 2026-11-16
5. Cotizador por etapas 60/40 con alcance escrito [Aconif](https://aconif.com/honorarios-arquitecto-argentina-2026/) — 2026-11-16

Diferenciadores (máx 3):
1. Un hero 3D que se ilumina con cursor + hotspots (M1 UNRESOLVED, medir)
2. Tour 360 corto pozo/reforma como CTA [Aconif](https://aconif.com/honorarios-arquitecto-argentina-2026/) — 2026-11-16
3. Número de consulta + WhatsApp prearmado + link seña (M3 UNRESOLVED)

Anti-features (máx 3):
1. No 2º objeto 3D ni HUD gamer (mata perf; M1)
2. No autoplay video pesado / sonido sin consent (perf + accesibilidad)
3. No % honorario sin alcance (confunde; R1-R2)

Hipótesis corte MVP: 3 obras profundas + filtro + cotizador 4 pasos + WhatsApp; 3D solo si Lighthouse ≥90 móvil. Ledger: M1 UNRESOLVED, M2 PARTIALLY, M3 UNRESOLVED, R3 PARTIALLY.
No-construir aún: checkout real, portal cliente, multi-idioma, 12 obras.
Integraciones: wa.me, Google Maps, Mercado Pago link (anunciado [Mercado Pago](https://www.mercadopago.com.ar/cuenta-negocio) — 2026-11-16), RUM CWV.
Riesgos top 3: 1) 3D rompe <2s (medir; M1) 2) precio AR desactualiza (re-cotizar trimestral; R2) 3) prometer cobro sin validar norma/comisión (R3/M3 → validación legal).

**Qué NO valida este Lite:** demanda, disposición a pagar web premium, número exacto USD/m², exigibilidad botón arrepentimiento a cotizador, performance real del 3D.
**Preguntas pendientes:** ¿2-3 estudios pagarían seña online? ¿tour 360 propio o stock? ¿rango USD/m² premium CABA 2026?
**Decisión habilitada:** explorar con prototipo E1+E2-mínimo+E3 en `wm-arquitectura-premium` separada; si se vuelve apuesta comprometida, pasar a Fase 1 con presupuesto y validación humana. `UNRESOLVED` queda visible y no se recomienda sin fuente.
