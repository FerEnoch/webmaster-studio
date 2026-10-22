# Clínica veterinaria — investigación y brief

> Rubro 8 del estudio. Misma metodología que fitness: investigar → brief → codear → verificar.
> App destino: `benchmark/apps/veterinaria`, puerto **3017**. Referencia técnica: `benchmark/apps/fitness`.
> Marcado como **[verificado]** lo que comprobé (HTTP 200 o fuente leída) y **[a verificar]** lo que queda para la etapa de código.

## 0. Resumen ejecutivo

- Una veterinaria vende **confianza bajo estrés**: quien entra a la web suele tener a la mascota enferma, asustada o necesita algo *ya*. Tres preguntas definen todo: ¿me pueden atender hoy?, ¿puedo confiar en ellos?, ¿cuánto cuesta?
- Las webs del rubro fallan casi siempre igual: fotos de stock, azul clínico frío, turno escondido, urgencias mezcladas con la reserva común. Hay mucho espacio para diferenciarse con **calidez + movimiento + utilidad real**.
- La propuesta: una clínica con identidad cálida (nada de azul hospital), **tres experiencias firma** que además sirven para vender (triage de urgencia, "libreta de salud" personalizada y recorrido de la primera visita), mucho video de animales y transiciones suaves.
- Diferencia con fitness: allá lo premium era oscuro y de alto contraste; acá lo premium es **luminoso, cálido y tranquilizador**. Mismo motor de animación, otra piel.

## 1. Qué hacen bien las mejores webs del rubro

Fuentes: roundups de agencias y proveedores (hay sesgo comercial; tomo los principios, no los números).
[iMatrix](https://imatrix.com/blog/veterinary-website-design/), [Freshy Sites](https://freshysites.com/web-design-development/best-veterinary-websites/), [Lucid Crew](https://www.lucidcrew.com/vet-web-designs/), [Vetstoria](https://www.vetstoria.com/blog/veterinary-website-checklist-to-attract-more-pet-parents/), [Genius Vets](https://geniusvets.com/veterinary-marketing/blog/4-trends-veterinary-website-design-you-should-follow-and-3-you-shouldnt).

1. **Reducen la ansiedad al primer vistazo.** Fotos reales de pacientes y equipo, colores calmos y una promesa concreta ("atención sin miedo", "turno hoy") pesan más que "cuidado compasivo".
2. **Turno visible sin scrollear** + teléfono en todas las páginas. Reservar en menos de un minuto, mobile-first.
3. **Urgencias separadas de la reserva común.** Recomendación repetida: un aviso que derive las urgencias al teléfono en vez de dejarlas esperando una respuesta online; bloques de agenda reservados para urgencias; ruta de urgencia visible en todo el sitio.
4. **Credenciales a la vista** cerca del hero (acreditaciones, matrículas, "Fear Free" cuando es real).
5. **Una página por servicio**, con fotos reales; la clínica como marca de bienestar/membresía más que como "centro médico".
6. **Expectativas de respuesta claras** en formularios ("te respondemos en X horas").
7. **Micro-animación con propósito** (iconos, botones, feedback), no espectáculo: Vetster se cita por movimiento "juguetón pero controlado".

Referencias de animación narrativa (no las pude abrir a fondo, usar como inspiración y revisarlas a mano): Pawtopia (un solo scroll en capítulos guiado por huellas, ilustración SVG + GSAP/Lenis, respeta reduced-motion — autodescrito en LinkedIn, **[a verificar]**), Nestu (salud de mascotas con storytelling animado, [Webandcrafts](https://webandcrafts.com/works/nestu)), y las fichas de Awwwards "Cooper Pet Care" y "Kindred Pet Care".

## 2. Antipatrones a evitar

- Azul/verde hospitalario + fotos de stock de veterinario sonriendo con un perro perfecto.
- Turno solo por teléfono o formulario "contactanos" sin horarios.
- Mezclar urgencia con reserva online (riesgo real: alguien espera una respuesta mientras su mascota empeora).
- Pop-ups, carruseles automáticos, música/ladridos con autoplay.
- Precios ocultos: en Argentina el primer filtro es el costo.
- Promesas médicas ("curamos…", "100% seguro") y diagnósticos online: el triage **orienta, no diagnostica**, con aviso explícito.
- Animación que bloquea contenido o retrasa llegar al teléfono/turno (en este rubro el usuario no tiene paciencia).
- Fotos de animales sufriendo o heridas explícitas como "impacto".

## 3. Mercado argentino (qué espera el cliente)

- Contacto por **WhatsApp** primero; teléfono de guardia bien grande; ubicación con mapa y cómo llegar.
- **Guardia 24 hs** es un diferencial fuerte; las urgencias nocturnas/fin de semana cuestan 1,5–2,5× según [Hacecuentas](https://hacecuentas.com/calculadora-costo-veterinario-consulta-promedio) (estimación general, no tarifa real) → conviene mostrar un recargo claro, no esconderlo.
- **Planes de salud para mascotas** ganan terreno: cuota mensual por etapa (cachorro: vacunas y desparasitación; adulto: chequeo anual y odontología; senior: cardiológicos y bioquímicos), con guardia 24 h, videollamada con profesionales y descuentos en medicamentos/cirugías ([Sitio Andino](https://www.sitioandino.com.ar/lifestyle/planes-veterinarios-tu-mascota-como-funcionan-y-que-ganan-terreno-argentina-n5711100)). Es el mejor producto para una plantilla: da ticket recurrente.
- Programas públicos (ej. CABA, vacunación antirrábica y castración gratuitas) crean competencia por precio: la clínica debe vender **trato, tiempo y tecnología**, no la vacuna sola. **[a verificar vigencia]**
- Software de agenda con reservas 24 h (ej. [AgendaPro](https://agendapro.com/ar/veterinario/software-para-clinica-veterinaria)) ya es normal: reservar online no es novedad, la novedad es hacerlo *bien*.
- Servicios típicos: consulta, vacunación, desparasitación, castración/cirugía, odontología, diagnóstico por imágenes/laboratorio, internación, peluquería y baño, medicina felina, exóticos, domicilio, pasaporte/certificado de viaje (SENASA).
- No encontré clínicas argentinas con turnos online + precios publicados para citar como referencia: **hueco de mercado real** para vender la plantilla.

## 4. Legal y confianza (Argentina)

No soy fuente jurídica; esto es para no meter un error en la plantilla. Las reglas varían por provincia: **verificar con el Colegio de Veterinarios local**.

- **Director técnico matriculado** y habilitación del establecimiento: es exigencia provincial (p. ej. PBA ley 10.526, Río Negro, San Juan). Mostrar en el pie "Dirección técnica: Dr./Dra. … M.P. …" y la habilitación (placeholders claros en la plantilla).
- **Antirrábica**: obligatoria en perros y gatos desde los 3 meses con revacunación anual (fuente nota periodística, **[a verificar]** en la norma de la jurisdicción).
- **Certificados de salud/viaje**: requieren veterinario matriculado y, para el exterior, trámite SENASA. Mencionarlo como servicio, sin prometer plazos.
- **Venta de medicamentos / recetas**: régimen provincial; no publicar venta online de fármacos de venta bajo receta.
- **Planes de salud con cuota mensual**: botón de baja visible sin registro previo (Res. 316/2018 y 271/2020), contrato publicado, link a Defensa del Consumidor (mismo patrón que fitness).
- **Datos personales** (Ley 25.326): aviso en formularios de turno/WhatsApp.
- **Precios**: finales, con aclaración de recargo nocturno/feriado.
- **Testimonios**: marcados como demo en la plantilla.
- **Triage**: texto fijo "esto no reemplaza la consulta veterinaria; ante duda, llamá a la guardia".

## 5. Dirección de arte (distinta a fitness)

- **Sensación:** "clínica boutique donde tu mascota está tranquila". Luminoso, cálido, táctil. Cero azul hospital.
- **Paleta propuesta:** fondo crema `#f6f1e7`, tinta verde bosque muy oscuro `#16251f` (texto y secciones inversas), acento coral/terracota `#e8553d` para turno/urgencia, secundario salvia `#a9bfa0` y miel `#e9b44c` para detalles. Urgencia siempre en coral; "bien/tranquilo" en salvia.
- **Tipografía:** display serif cálida y con carácter (Fraunces o similar, con peso variable) + sans de lectura (Inter o DM Sans). Cargar por `<link>` de Google Fonts (next/font falla por el SSL de esta máquina).
- **Tratamiento de imagen:** gradación cálida uniforme (`.grade` adaptado: menos contraste y sepia suave, más luz) sobre fotos y videos para que lo heterogéneo del stock se vea como una sola sesión. Grano muy leve; sin viñeta oscura pesada.
- **Forma:** esquinas muy redondeadas, recortes tipo "huella"/blob en máscaras de imagen, ilustración SVG simple de huellas que guía el scroll (como en Pawtopia) pero **funcional** (marca el progreso, no decora).
- **Movimiento:** suave y con inercia (resortes), cortina entre páginas en color crema/verde con una huella; micro-feedback en botones. Respetar `prefers-reduced-motion`.
- **Sin 3D.** Más video y animación web (decisión del usuario).

## 6. Marca y estructura

**Nombre ficticio sugerido:** *MANADA — Clínica veterinaria* (alternativas: *Nido*, *Lomo*, *Patitas Club*). Tagline: "Donde tu mascota viene tranquila."

**Rutas (5):**

| Ruta | Contenido |
| --- | --- |
| `/` | Hero con video + barra de guardia/estado, triage, libreta de salud, servicios destacados, planes teaser, equipo teaser, reseñas, CTA |
| `/clinica` | Recorrido de la primera visita (pinned) + instalaciones + sede(s) |
| `/servicios` | Un bloque por servicio, con "desde $", duración y reserva directa; guardia 24 h destacada |
| `/planes` | Planes de salud cachorro/adulto/senior, toggle mensual/anual, comparativa, FAQ, botón de baja |
| `/equipo` | Veterinarios por especialidad con video al hover y modal de perfil |

Persistente en todas las páginas: **barra de guardia** (teléfono tocable + "Guardia abierta ahora" en vivo), CTA fijo mobile "Sacar turno", WhatsApp flotante.

## 7. Experiencias firma (lo que la hace distinta Y vende)

1. **Triage de urgencia ("¿Está bien mi mascota?")** — 3–4 preguntas rápidas con tarjetas (especie → qué pasa → hace cuánto → ¿respira/se mueve bien?). Resultado como semáforo: 🔴 *Llamá a la guardia ahora* (botón de llamada gigante), 🟡 *Turno hoy*, 🟢 *Turno de rutina / consejos*. El rojo **nunca** pasa por la reserva común. Aviso fijo de que orienta y no diagnostica. Resuelve la objeción #1 del rubro y es lo más "wow" funcional.
2. **Libreta de salud ("Armá la libreta de tu mascota")** — nombre, especie, edad aproximada (slider) → se "dibuja" una línea de tiempo animada con vacunas, desparasitaciones y controles que le tocan, qué ya pasó y qué vence pronto, y termina recomendando el plan (cachorro/adulto/senior) y abriendo la reserva con el servicio precargado. Es personalización que cualquier dueño entiende al instante y alimenta el upsell a planes.
3. **Recorrido de la primera visita (pinned, patrón del club de fitness)** — sala de espera sin miedo → consulta → laboratorio/imágenes → quirófano → internación → peluquería, con plano interactivo y notas "qué vas a ver / cómo lo hacemos tranquilo". Reduce ansiedad mostrando el proceso (y no hay que hacer 3D: fotos + video + zoom entre zonas).
4. **Turno en pasos** (drawer como `Booking.tsx`): especie → servicio → profesional → próximo horario libre → datos → "carnet de turno" animado. Con bloque que excluye urgencias.
5. **Señales en vivo creíbles:** "Guardia abierta · 2 veterinarios", demora estimada de espera, "próximo turno libre: hoy 17:30".

## 8. Contenido y servicios a modelar (`src/lib/content.ts`)

- `brand`, `sedes` (1–2), `guardia` (teléfono, horarios, recargo).
- `services` (~8): consulta general, vacunación, castración y cirugía, odontología, diagnóstico por imágenes, laboratorio, internación, peluquería y baño — cada uno con "desde $", duración, foto/video.
- `vets` (6): especialidades (clínica, cirugía, felina, exóticos, cardiología, comportamiento).
- `plans`: Cachorro / Adulto / Senior, mensual y anual con descuento, "sin permanencia".
- `healthTimeline`: reglas de edad → hitos de vacunas/controles (genéricos, marcados como demostrativos).
- `triageTree`: preguntas y resultados.
- `testimonials`, `faqs`, `marquee`.

## 9. Medios

### Videos Mixkit — URL `https://assets.mixkit.co/videos/{id}/{id}-720.mp4`, poster `{id}-thumb-720-0.jpg`

HTTP 200 comprobado en todos. **Falta mirarlos** (frames blancos, encuadre, si se ve bien con la gradación) antes de usarlos.

| Uso | ID | Descripción (por título Mixkit) |
| --- | --- | --- |
| Hero / consulta | 48986 | Veterinario examina las orejas de un ovejero alemán |
| Vacunas | 48987 | Cachorro recibiendo sus primeras vacunas |
| Vacunas | 21465 | Dándole una vacuna a un perro |
| Consulta | 15172 | Perro visitando al veterinario |
| Inyección | 14978 | Perro recibiendo una inyección |
| Peluquería | 45883 | Pelo de perro cortado de cerca |
| Peluquería | 45884 | Peluquero cepillando el manto |
| Peluquería | 45890 | Peluquero recortando el pelo con cuidado |
| Peluquería | 45891 | Corte de uñas cuidadoso |
| Baño | 1665 | Bañando a un perro pequeño y tranquilo |
| Baño | 33103 / 33101 | Perro mojado tras el baño / relajándose después |
| Peluquería | 1660, 1662, 1664 | Perro esperando el corte / peluquero con perro chico / cortando pelo a perro blanco |
| Cachorros | 48739 | Grupo de cachorros durmiendo en una pila |
| Gatos | 47711, 26150, 1779, 22732 | Gato siendo acariciado / panza / dueña jugando / gato blanco entre pastos |
| Gatitos | 32282, 14952 | Gatitos recién nacidos / niña durmiendo con su cachorro |
| Exóticos | 45522, 46075, 46076, 24813 | Conejo mimado / niño con conejo / conejo de orejas largas / erizo secándose |
| Dueño + mascota | 1658, 12529, 33162, 32188 | Dueño acariciando perro / abuela con gato / señora con su gato |
| Ambiente | 4130, 16619, 17123, 24979 | Perro albino durmiendo / cachorro en su cama / labrador / labrador lame al dueño |

Descartado: 101239 (HTTP 403). Los clips "101xxx" (serie "girl and dog") conviene revisarlos uno por uno antes de usar.

### Fotos Unsplash

**[verificado en la etapa de código]** — 40 IDs elegidos, HTTP 200 y revisados en hoja de contactos; están en `benchmark/apps/veterinaria/src/lib/content.ts` (objeto `P`). Necesito ~20: equipo veterinario real (no posado), consultorio luminoso, sala de espera, quirófano/instrumental, rayos X/ecógrafo, laboratorio, internación, peluquería, perros/gatos/conejo en consulta, fachada. Procedimiento ya probado: buscar candidatos, verificar HTTP 200 con curl, armar una hoja de contactos temporal en `public/`, mirarla y borrarla (los IDs vienen mal etiquetados seguido).

## 10. Plan de construcción (orden sugerido)

1. Base copiada de fitness: `Transition`, `Booking`, `ui`, `AutoVideo`, `SmoothScroll`, `PageHero`, `Chrome`, `globals.css` (reteñir tokens, no tocar lógica).
2. `content.ts` + paleta/tipografías + `layout`.
3. Home: hero, barra de guardia, triage, libreta, servicios, planes teaser, equipo, reseñas.
4. `/clinica` (recorrido), `/servicios`, `/planes`, `/equipo`.
5. Verificación completa: tsc, todas las rutas, cortina, triage (los 3 resultados), libreta, turno de punta a punta, desktop + mobile, consola limpia.
6. README, scripts `dev:/build:veterinaria`, entrada `estudio-veterinaria` (3017) en `.claude/launch.json`, actualizar memoria.

## 11. Preguntas abiertas para el usuario

1. **Nombre de marca:** ¿MANADA te sirve o preferís otro?
2. **Perfil:** ¿clínica de barrio con guardia 24 h (recomendado, es lo que más vende) o consultorio sin guardia?
3. **Ciudad/barrio** para textos, mapa y moneda de ejemplo (CABA por defecto).
4. **¿Sumamos tienda online (alimento/accesorios)?** Recomiendo no en esta versión: duplica el alcance y el catálogo ya lo cubrió BuddyPets.
5. **Triage:** ¿lo dejamos como orientación con aviso (recomendado) o preferís solo un botón "Urgencia" directo a llamada?

Con "dale" a las defaults (MANADA, barrio con guardia 24 h, CABA, sin tienda, triage con aviso) arranco directamente a codear.
