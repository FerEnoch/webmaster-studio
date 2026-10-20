# 01 — Base del repo (relevamiento 2026-10-20)

## Qué es

Monorepo npm workspaces (`estudio`, `apps/*`, un solo `node_modules`). 9 apps Next.js + TypeScript:

- thaloz (:3010) — réplica thaloz.com/about-us/company
- invgate (:3011) — réplica invgate.com home, motion + lenis
- constructora (:3012) — "Basalto", Three.js/R3F edificio que se construye con scroll
- inmobiliaria (:3013) — catálogo, recorridos, terreno 3D
- salud (:3014) — clínica, morph partículas + turnos
- autos (:3015) — concesionaria, video + configurador
- fitness (:3016) — "NÚCLEO", la más completa y referencia oficial (ver `docs/prompt-nuevos-rubros.md`)
- veterinaria (:3017) — "MANADA", triage, libreta salud, turnos pasos
- vinos (:3018) — "ALTURA", tienda + viajes Mendoza, sommelier, voucher

Docs existentes: `fitness-investigacion.md`, `veterinaria-investigacion.md`, `vinos-investigacion.md`, `prompt-nuevos-rubros.md` (metodología).

## Cómo está construido (patrón fitness, a reutilizar)

- Next.js 15 App Router + Tailwind v4 tokens `@theme` + motion/react + lenis
- Contenido centralizado en `apps/<app>/src/lib/content.ts` (textos, precios, IDs fotos/videos)
- Componentes: Transition (cortina + TLink), Booking (drawer pasos + data-lenis-prevent), ui (Reveal, Lines, Count, LiveNow, Magnetic, Kicker), AutoVideo (solo visible, preload none + IO), SmoothScroll, PageHero, Chrome (header hide, nav layoutId, menú mobile clip-path, footer legal), globals.css (grade/grain/vignette, marquee, reduced-motion)
- Dirección arte obligatoria: nada de 3D salvo constructora/inmobiliaria; mucho video; grade uniforme + grano + viñeta; 1 display + 1 texto; paleta 1 fondo + 1 claro + 1 acento; multipágina 4-5 rutas; hero video que se encoge + titulares máscara línea por línea; 1 sección pinned con historia; 1 conversión demo punta a punta (reserva sin registro + ticket); señales en vivo creíbles; CTA fijo mobile + WhatsApp flotante; mobile-first
- Medios: Unsplash (fotos, verificar IDs con curl + hoja contactos) y Mixkit (videos, verificar HTTP 200, descartar frames blancos); para prod descargar y servir propio
- Formularios/carrito/reservas/bajas: demo, no envían datos — hay que conectar backend real
- Legales AR: arrepentimiento/baja (Res. 316/2018, 271/2020), Defensa Consumidor, precios finales con impuestos, más específico por rubro (ej. Ley 24.788 vinos)
- Mercado: pymes AR sin tecnología ni tiempo, textos rioplatense, marcas/precios/reviews ficticios a reemplazar

## Trampas pisadas (del prompt)

next/font falla por SSL → <link> Google Fonts; npm strict-ssl false temporal; whileInView enmascarado → useInView contenedor; useAnimate + StrictMode corta intros → animate suelto + cancel + timeout cortina; inline-flex pisa hidden → envolver span; máscaras recortan Í/Á/É → pt/-mt 0.14em; AutoVideo relative+absolute = alto 0; hue-rotate no tiñe grises → overlay mix-blend color; rAF frenado con tab oculta ≠ bug; lenis scroll programático lento → esperar antes de captura.

## Qué mejorar para tu versión (hipótesis a validar en T2-T7)

1. Performance/SEO: Next multi-app pesado para Vercel gratis → Astro + islas deja landing estática instantánea e hidrata solo Booking/carro/mapas.
2. Conversión real: conectar WhatsApp deep-link con mensaje prearmado, form → Formspree/Resend/WhatsApp, precios visibles, horarios/ubicación, prueba social reemplazable.
3. Firma: hoy cada rubro tiene identidad propia pero falta rasgo transversal (candidatos: cortina + hero video que se encoge + grade/grano + LiveNow + ticket/voucher animado).
4. Costo Vercel gratis: 9 Next apps = 9 proyectos o monorepo pesado; en Astro podés unificar en 1 sitio multi-rubro con colecciones por rubro.
5. Reposicionamiento: de "réplicas + plantillas ficticias" a "portfolio freelance con demos vendibles + checklist prod (medios propios, backend, legales, tsc clean, 0 errores consola, desktop 1440 + mobile 375)".

## Fuentes

- `README.md`, `package.json`, `docs/prompt-nuevos-rubros.md` (2026-10-20)
- `apps/fitness/` estructura (referencia a leer completa en T8)

Risk: none (solo docs, sin cambios de código ni datos).
