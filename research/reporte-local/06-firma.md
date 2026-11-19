# 06 — Firma transversal (3 opciones + recomendación)

## Opción A — “Demo viva + ticket” (recomendada)

Todas las webs comparten: cortina entre rutas, hero video que se encoge con scroll, grade/grano/viñeta uniforme, 1 pinned que cuenta algo, LiveNow creíble, y 1 conversión que termina en ticket/voucher animado (reserva, test drive, seña, inscripción, visita). El ticket es tu firma visual: mismo motion, distinto color por rubro.

Por qué gana: es transversal, medible (convierte), y se ve en 10 segundos. El cliente entiende qué compró.

## Opción B — “Corto + WhatsApp”

Una sola acción sobre el fold (BOOK / Reservar / Cotizar), sticky en mobile, WhatsApp con mensaje por rubro + tiempo estimado en vivo. Todo lo demás minimalista, performance primero.

Por qué: máxima conversión local, ideal Vercel gratis + Astro estático. Menos show, más llamados.

## Opción C — “Autor + proceso”

Foco en quién hizo la obra/caso: equipo real primero, antes/después, planos/proceso, prensa/testimonio. Paleta calma, tipografía editorial.

Por qué: diferencia arquitectura, estética, universidad. Menos potente para lavadero/concesionario.

## Recomendación

A como base (ticket + cortina + hero que se encoge + grade), con B como regla (1 CTA) y C donde aplique (cara del equipo). En código: `Transition`, `PageHero`, `Booking`, `Ticket`, `LiveNow`, `grade` compartidos como paquete UI en Astro (islas) con tokens por rubro (1 fondo + 1 claro + 1 acento, 1 display + 1 texto).

## Cómo validarla

Si en 5 segundos no ves ticket/cortina/CTA único, no es tu firma. Aplicar a 2 rubros piloto (clínica+dx y lavadero) y medir clicks WhatsApp/reserva.
