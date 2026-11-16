# LITE_BENCHMARK — 3 enfoques + referentes + lecturas (2026-11-16)

## Enfoques genuinamente distintos

### E1 — Portfolio editorial premium liviano (foto + tipografía + micro-luz)
Problema/actor: estudio que vende por obra y proceso, lector nocturno que compara 2 estudios a las 23h.
Mecanismo: hero foto a pantalla completa, páginas de obra largas (600-2000 palabras, planos, proceso), archivo filtrable, voz propia, performance obsesiva pese a imagen pesada.
Trade-offs: máxima legibilidad y performance; menos "wow" 3D. Riesgo: parecer sobrio si la foto es floja.
Evidencia:
- [Whitelam Media – Best Architecture Firm Websites 2026](https://whitelam.media/insights/best-architecture-firm-websites-2026) — 2026-11-16 — sección "What we were looking for" (photography weight, project depth, filterability, performance) + fichas BIG (project pages como tipo primario), Snøhetta (publicar en cadencia), Foster (filtro real), HdM (strip project page), RPBW (long-form que retiene minutos).
- [Made by NF – Interior Design Portfolio That Converts](https://www.madebynf.com/journal/interior-design-portfolio-website) — 2026-11-16 — estructura caso: ubicación, alcance, descriptores 3-5 palabras, overview 2-5 frases, highlights, prensa, testimonio, CTA + comprimir imágenes + títulos/URL por proyecto para SEO.

### E2 — Inmobiliario 3D interactivo liviano (un hero object + tour + before/after)
Problema/actor: desarrolladora / estudio que vende pozo o reforma; comitente que necesita "verlo" antes de contactar.
Mecanismo: un solo objeto 3D hero (no playground), hotspots, tour 360 / 3 vistas Arrive→Obra→Habitar, slider before/after, precio live atado a configurador, booking pre-llenado. Todo con reduced-motion y sin autoplay pesado.
Trade-offs: diferenciación alta, prueba tangible; riesgo perf/complejidad si se agregan 2º y 3º objetos 3D o scroll-jack.
Evidencia:
- [Aconif – Honorarios + tour 360 Vita Pallares](https://aconif.com/honorarios-arquitecto-argentina-2026/) — 2026-11-16 — bloque "Entrá a Vita Pallares. Recorré sus espacios. Departamentos en pozo… tour virtual" + CTA "Ver proyecto y tour 360°" (prueba de tour como conversión en pozo AR).
- Precedente interno: `research/research-output/lavadero-premium/carwashing-bar-web-design-prompts.txt` — hero light (cursor como luz), tour scroll 3 escenas, configurador 3D único, wipe before/after (patrón ya validado en repo para premium liviano).
- Pistas no leídas como prueba (solo descubrimiento, no referentes verificados): Matterport / R2U / Vinode / CloudPano hallados en búsqueda "real estate 3D tour lightweight" — no se inspeccionaron a fondo, no se citan como soporte.

### E3 — Interiorismo/deco conversión directa (cotizador + WhatsApp + pago)
Problema/actor: interiorista/decorador con ticket menor y ciclo corto; cliente que quiere número y visita, no monografía.
Mecanismo: 3-4 pasos (tipo → superficie → datos → confirmación), filtros por residencial/comercial, prueba con fotos + sketches + antes/después, CTA WhatsApp con mensaje prearmado, link de pago / seña, "en obra" como señal viva.
Trade-offs: fricción mínima, medición fácil; menos autoridad cultural que E1.
Evidencia:
- [Made by NF](https://www.madebynf.com/journal/interior-design-portfolio-website) — 2026-11-16 — "quality over quantity 6-10 proyectos", "split screen leer+ver", video solo si suma, filtro por necesidad, coming-soon para pipeline (útil cuando hay pocas obras).
- [Mercado Pago – Cuenta Negocio / Link de pago](https://www.mercadopago.com.ar/cuenta-negocio) — 2026-11-16 — sección VENTAS lista Link de pago + Checkout + Suscripciones (anuncia herramienta para cobrar sin tienda; no prueba uso en estudios).
- [Astro – Islands + Core Web Vitals](https://astro.build/) — 2026-11-16 — bloque "Astro Islands" + tabla HTTP Archive/CrUX: Astro 71% vs WordPress 48%, Gatsby 45%, Next 35%, Nuxt 28% (anuncia ventaja de islas; no mide nuestra demo).

## INSPIRACIÓN adyacente (no competidor, no prueba local)
- Lavadero-premium interno (showroom light + configurador único): idea de trasladar "una sola pieza 3D que vende" a inmueble (living/cocina/patio como hero object).
- Home staging / virtual staging: pista de búsqueda, sin lectura primaria; queda como idea a validar, no como referente.

## Registro de cobertura (presupuesto equilibrado)
Consultas variadas ejecutadas (8/8, no se llena cuota por llenar):
1. best architecture studio websites portfolio premium 2025 2026
2. interior design studio high-end booking conversion portfolio
3. real estate development 3D tour lightweight web before after
4. estudios arquitectura Argentina sitio web honorarios proyecto dirección obra
5. interiorismo decoración Argentina servicios precios diseño interior departamento
6. Astro islands lightweight 3D animation performance Core Web Vitals
7. Argentina Defensa Consumidor precios finales IVA incluidos ecommerce arrepentimiento
8. Mercado Pago Argentina link pago honorarios profesionales servicios
Lecturas dirigidas inspeccionadas (6/6):
- Whitelam 15 sites 2026 (global editorial)
- Made by NF interior converting (global interiorismo)
- Aconif honorarios AR 2026 + tour pozo (local AR)
- Astro.build islands + CWV (técnico anunciado)
- Mercado Pago cuenta negocio (pagos anunciados)
- Argentina.gob.ar Defensa del Consumidor (regulatorio marco)
Fetches totales: 7 (6 ok + 1 timeout InfoLeg, no cuenta como lectura). Parada: sufficient_coverage.
