# LITE_DOMAIN — Arquitectura Premium (DEMO PREMIUM, no reemplaza demo común)

## Objetivo (separado de etapa Lite)
- Pedido original verbatim: "Necesito hacer research del rubro de estudios de arquitectura y diseño inmobiliario, interiores, decoración, y todo lo referido al rubro. Usemos el skill de research y dejemos los resultados en research. Pregunta todo lo necesario antes de empezar"
- Aclaración verbatim: "1 - Estudios como clientes pero con un valor agregado: mejorar 10x la UI, con 3d y animaciones de inmuebles. Además debe ser super liviana y rápida."
- Aclaración verbatim: "Que quede claro esto: la demo actual del arquitectura qeuda como demo común. lo que estamos armando es el reasearch para una DEMO PREMIUM. Por eso el énfasis en la UI"
- research_goal registrado: `inspiration_exploration` — explorar/inspirar, sin apuesta cerrada.
- Etapa: Lite equilibrado (DEFAULT). No prueba demanda ni entrega go/no-go ni MVP validado.

## Mercado / jurisdicciones
- Mercado elegido por usuario: **Argentina** (2026-11-16). Sin default; preguntado y esperado antes de investigar.
- Alcance: global primero (benchmark independiente), después bajada AR con sus jurisdicciones.
- Regla aplicada: referentes regionales siguen AR, no LatAm implícito. Pagos, canales, regulación y logística chequeados según AR.

## Decisión actual y qué queda fuera
- Decisión que este Lite habilita: qué propuesta premium prototipar para nueva demo `wm-arquitectura-premium` (foco UI 10x, 3D liviano, rápida), sin tocar `apps/wm-arquitectura` (ESTUDIO TRAZO, demo común).
- Fuera de este Lite: arquitectura técnica, backlog, estimaciones, código, validación de demanda, pricing final, go/no-go.
- Si la decisión se vuelve comprometida (lanzar vertical, priorizar rubro), proponer Fase 1 por separado; no ampliar este Lite.

## Actores
- Estudios de arquitectura (proyecto + dirección, 60/40), interioristas/decoradores (residencial, comercial), desarrolladoras/inmobiliarias (pozo, venta/alquiler), constructoras integradas (diseño+obra), comitentes (dueños, inversores), municipio/CPAU, proveedores de medios (foto/video/3D), webmaster-studio (vende webs a esos estudios).
- Vocabulario útil: anteproyecto (25%), proyecto/documentación (20%), dirección de obra (40%), croquis previos (15%), cómputo, pliego, conforme a obra, habilitación, pozo, home staging, tour 360, before/after, hotspots, isla React, reduced-motion.

## Supuestos (no son hechos)
- SUP1: estudios AR compran web si muestra obra + proceso + número de consulta cerrado (INFERENCE, por validar con 2-3 entrevistas).
- SUP2: un solo objeto 3D hero liviano puede dar "wow" sin romper <2s ni Core Web Vitals (INFERENCE, por probar en prototipo, no afirma este Lite).
- SUP3: WhatsApp + cotizador 3-4 pasos + link de pago es suficiente como conversión premium para servicios (INFERENCE, por validar).
