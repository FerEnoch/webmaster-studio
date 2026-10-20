# 08 — Plan de trabajo (versión mejorada, 7 rubros)

## Orden (1 slice = 1 rubro + firma)

1. Setup Astro + design tokens + `Transition/PageHero/Booking/Ticket/LiveNow/grade` (base firma A).
2. Pilotos que venden: clínica+dx y lavadero+bar (conversión más clara, T4).
3. Concesionario + inmobiliaria (VDP + ficha + tour).
4. Estética+yoga + universidad (doble funnel + buscador).
5. Arquitectura+diseño (portfolio por obra, cierra con autor).
6. Portfolio madre filtrable + “demo gratis en 48h” + SEO local + legales.

## Definición de terminado por rubro

Astro build sin errores; Lighthouse mobile ≥95 perf; 0 consola; desktop 1440 + mobile 375; conversión punta a punta (reserva/test drive/seña/inscripción/visita/cotización) con ticket; medios propios verificados; precios/horarios/ubicación visibles; WhatsApp prearmado; legales AR.

## Costo / hosting

Dev en Hobby (personal). Prod cliente: avisar Pro vs Cloudflare según tráfico. No incluir backend real en precio base.

## Commits sugeridos

`feat(setup): astro base + firma`, luego `feat(rubro): <nombre> demo viva + ticket`, 1 commit por rubro (~400 líneas c/u). Branch: `feature/webmaster-studio-estrategia`.

## Next inmediato

Elegí piloto (recomiendo clínica+dx) y lo armamos en Astro con tu contenido real.
