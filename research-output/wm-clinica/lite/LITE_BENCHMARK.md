# LITE_BENCHMARK — 3 enfoques + 1 inspiración adyacente

## Enfoque A — Reserva online con hora garantizada + pase
- **Problema/actor:** paciente que odia llamar por teléfono en horario de recepción; recepción saturada.
- **Mecanismo:** self-scheduling 24/7 (elige estudio/especialidad → horario real → confirmación con código), reprogramación/cancelación fácil que libera el slot.
- **Referentes:** Zocdoc (EE.UU., marketplace con disponibilidad real; *descubierto vía snippet, no leído — pendiente*), [Crontu](https://crontu.com.ar/) (AR, leído 2026-10-27: busca por especialidad/zona/cobertura, confirma con pago online o en consultorio, confirma y recuerda por email+WhatsApp, cancela sin costo hasta 48 h antes), [Calu](https://calu.app/) (AR, leído 2026-10-27: agenda + reservas online, +3.000 profesionales según anuncia).
- **Evidencia:** [Frontiers 2025](https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2025.1567397/full) (leído, 2026-10-27): en consultorio privado, no-show 1,8 % online vs 5,9 % offline (p<0,0001); OAS bajó citas desaprovechadas 22,7 %→10,3 %; en hospital universitario el efecto se invierte y lo que más reduce ausencias son recordatorios (consultas regulares OR 0,40; SMS OR 0,93). Alcance: oftalmología, Alemania — no trasladable directo a AR.
- **Trade-offs:** menos fricción y mejor uso de agenda vs más cancelaciones fáciles y necesidad de lista de espera. Tasa "37,6 % canceladas self-service vs 27 % por agente" (estudio PMC citado solo en snippets, no leído 2026-10-27) → `UNRESOLVED`, no se afirma tasa; se propone lista de espera como hipótesis a validar ([Cliengo guía salud 2026](https://guiawabusiness.cliengo.com/recordatorios-turnos-whatsapp) — 2026-10-27 — ¿Cómo funcionan los recordatorios?: si cancela, el horario se libera y puedes ofrecerlo a la lista de espera).
- **Qué validar:** si el pase con código + cancelación fácil aumenta conversión sin disparar ausencias en estudios (no solo consultas).

## Enfoque B — Resultados online + preparación que evita reprograme
- **Problema/actor:** paciente ansioso por el informe; estudios que se reprograman por mala preparación (ayuno, ropa, metal).
- **Mecanismo:** portal de resultados con plazos por estudio (24/48/72 h) + ficha de preparación accionable por estudio + explicación sin cargo si el informe lo requiere.
- **Referentes:** Hospital Italiano — Portal de Pacientes (*snippet 2026-10-27, no leído: fetch 404; pendiente de verificación*); RADNET/Cedimed/Núcleo Radiológico (*snippets: páginas de preparación por estudio en LatAm; pendientes*).
- **Evidencia:** solo pistas de descubrimiento; la demo ya implementa el patrón (plazos + preparación por ficha). Sin lectura primaria que lo respalde como diferenciador medido → ver `LITE_LEDGER.md` M4 (`UNRESOLVED`).
- **Trade-offs:** confianza y menos llamadas vs costo de operar un portal real (fuera del alcance de una demo estática).
- **Qué validar:** si "resultado online garantizado + primera explicación sin cargo" convierte más que listar tecnología del escáner.

## Enfoque C — WhatsApp como canal operativo (no solo botón flotante)
- **Problema/actor:** turnos que se pierden por no-confirmación; recepción que vive atendiendo el teléfono.
- **Mecanismo:** reserva en chat → recordatorio Utility 24 h antes (y 2 h) con botones Confirmo/Reprogramar/Cancelar → respuesta que reabre ventana y ofrece horarios → aviso de resultado listo (sin el resultado en el chat).
- **Referentes:** [Cliengo guía salud 2026](https://guiawabusiness.cliengo.com/recordatorios-turnos-whatsapp) (leída, 2026-10-27: flujo captación→atención 24 h→agendamiento→recordatorio→post-consulta; "cuánto baja el ausentismo depende de cada agenda: medir antes/después"), [Calu](https://calu.app/) (leída 2026-10-27: recordatorios automáticos por WhatsApp incluidos), Wazzy (*snippet: agenda que se auto-actualiza*).
- **Evidencia:** anunciada por proveedores (no medición independiente). Límite: Meta cobra Utility desde 1/10/2026 y los 1.000 primeros mensajes/mes; promociones = Marketing con consentimiento; datos de salud sensibles → resultados por portal, no por chat ([Cliengo](https://guiawabusiness.cliengo.com/recordatorios-turnos-whatsapp), leída 2026-10-27).
- **Trade-offs:** menos ausencias y recepción liberada vs costo por mensaje, opt-in y operación multi-sede con un solo número.
- **Qué validar:** recordatorio con botones + lista de espera como primer experimento (mide confirmación y ausencia antes/después).

## INSPIRACIÓN adyacente (no competidor, no prueba de demanda)
- **Doctolib** (UE, ayuda oficial *descubierta, no leída — pendiente*): estados de confirmación por color (directo vs pendiente de confirmación del centro). Idea trasladable: el pase de la demo podría mostrar estado (pendiente/confirmado) en vez de binario.
- Hotelería/aerolíneas: prepago flexible con cancelación hasta 48 h ([Crontu](https://crontu.com.ar/) ya lo hace 2026-10-27: "sin costo hasta 48 h antes") como ancla de confianza para estudios con preparación.

## Registro de cobertura (tope 7 variadas / 5 lecturas)
- Consultas variadas (7): 1) OAS + no-show (resultados) · 2) Doctolib/Zocdoc oficial (resultados) · 3) portal resultados UX (falló proveedor) · 4) AR turnos online prepagas (resultados) · 5) WhatsApp recordatorios ausentismo (resultados) · 6) portal paciente HIBA (resultados) · 7) preparación estudios + precio transparente (resultados).
- Lecturas reales (4/5): [Crontu](https://crontu.com.ar/) homepage · [Cliengo](https://guiawabusiness.cliengo.com/recordatorios-turnos-whatsapp) guía WhatsApp salud · [Frontiers](https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2025.1567397/full) OAS no-show 2025 · [Calu](https://calu.app/) agenda. Fallidas (no cuentan como lectura): Zocdoc help (403), HIBA resultados (404), PMC self-scheduling (JS), Doctolib zendesk (403).
- Parada: `sufficient_coverage` — consultas 6–7 repetían patrones; margen de 1 lectura sin usar por decisión, no por límite técnico.
