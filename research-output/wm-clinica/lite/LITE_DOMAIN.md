# LITE_DOMAIN — Clínica demo wm-clinica (webmaster-studio)

> Conformidad protocolo `aea2460` (2026-10-28): este artefacto no recomienda; documenta objetivo, mercado, actores y supuestos. Lo observado en la demo cita inspección local con ruta y fecha; sin fuente externa inspeccionada queda `UNRESOLVED` y no sostiene decisión. Fuentes originales 2026-10-27 preservadas.

## Objetivo y decisión
- **Objetivo:** inspiración / exploración (sin apuesta cerrada).
- **Decisión actual:** qué mejorar primero en la demo `wm-clinica` (foco integral: conversión/turnos + contenido/confianza). No decidir MVP ni stack.
- **Decisión habilitada esperada:** próxima validación a correr (no un go/no-go).

## Mercado / jurisdicciones
- **Elegido por el usuario:** Argentina nacional, foco CABA + GBA norte (coherente con las 3 sedes ficticias: Palermo, Belgrano, Vicente López) — registrado en `run.yaml` 2026-10-27, sin default aplicado.

## Actores
- Paciente particular / con prepaga u obra social que pide turno y se hace estudios.
- Recepción / equipo de la clínica (agenda, confirmaciones, entrega de resultados).
- Profesional (consulta) y radiólogo (informe).
- Visitante de la demo (cliente potencial del portfolio que evalúa comprar una web así).

## Vocabulario y workflows observados en la demo (inspección local 2026-10-27, sin URL externa: sostiene "la demo lo tiene", no validez jurídica ni demanda)
- Turno online en 3 pasos (Datos → Horario → Confirmación) con **pase con código** para recepción (`apps/wm-clinica/src/content/pase.ts`: `EstadoPase pendiente|confirmado|cancelado`; `apps/wm-clinica/src/content/clinica.ts`: pase con código que arranca pendiente); slots con lugares; aviso "Demo: no se envían datos".
- Estudios con **preparación por ficha** (ayuno, ropa, qué traer — `clinica.ts`: "Sin preparación" / fichas por estudio), duración y **resultado online 24/48/72 h**.
- WhatsApp flotante con mensaje prearmado + reserva por WhatsApp (FAQ `clinica.ts`: "¿Puedo pedir el turno por WhatsApp?"; `src/pages/contacto.astro`: "Tres sedes, un WhatsApp").
- Precios finales con IVA, botón de baja, link a Defensa del Consumidor (`clinica.ts`: "final, IVA incluido" / "precios finales e incluyen el IVA" / "Botón de baja" / "Defensa del Consumidor"; `src/pages/legal.astro`: "Precios finales, privacidad y baja sin vueltas" + `Botón de baja` + `Defensa del Consumidor`; alcance jurídico exacto sin fuente legal externa inspeccionada → `UNRESOLVED` como claim jurídico, ver ledger R1/R2).

## Supuestos (no hechos — todos `UNRESOLVED`, validar antes de decidir)
- S1 (`UNRESOLVED`): el visitante valora más "resolver todo en un día" que el precio por estudio. Sin fuente inspeccionada; validar con entrevistas/test. Falta: evidencia de preferencia en CABA/GBA imágenes.
- S2 (`UNRESOLVED`): la fricción real está en pedir el turno, no en elegir el estudio. Sin fuente inspeccionada; validar. Falta: medición fricción DNI+obra social (M3).
- S3 (`UNRESOLVED`): mostrar preparación reduce reprogramaciones por mala preparación. Plausible por patrón de contenido (`clinica.ts`: "si no [se cumple la preparación], el estudio se reprograma"), sin medición de eficacia; validar. Falta: medición antes/después.
