# Plantilla Gimnasios / Fitness — Investigación y brief

> Documento para pasarle a Opus antes de codear `apps/fitness`.
> Fecha de la investigación: octubre 2026. Hecha con búsqueda web; **muchas cifras vienen de blogs de proveedores** (se marca la confianza de cada dato). Lo que no se pudo verificar está en la sección 9.

---

## 1. Resumen ejecutivo (leer esto primero)

1. **El sitio de un gimnasio existe para una sola cosa: que alguien reserve una clase de prueba.** Todo lo demás (video, animación, marca) está al servicio de eso.
2. **Lo que más convierte, según todas las fuentes:** botón de prueba gratis visible sin scrollear en el celular, **grilla de clases con reserva en la misma página** (sin PDF, sin salir a otro sitio, sin crear cuenta), **precios visibles**, fotos y gente reales, y que cargue rápido.
3. **El miedo a resolver no es el precio, es "¿voy a quedar fuera de lugar?" y "¿me da el horario?"**. Hay que responder eso en la primera pantalla.
4. **La ventaja de esta plantilla frente a una web común:** el estilo de autos (video a pantalla completa, tipografía grande, movimiento con intención) **más** esas funciones de conversión. Mucho gimnasio tiene estética o tiene funciones, pocos tienen las dos.
5. **Restricción importante de rendimiento:** más del 70% del tráfico fitness es móvil (dato de proveedor, sin fuente primaria). El video y las animaciones se diseñan **primero para un celular medio**, no para una notebook.
6. **Legal Argentina:** los gimnasios están alcanzados por la obligación del **botón de baja** visible en la web y por la publicación de los contratos. Hay que incluirlo (ver sección 6). Verificar el texto vigente antes de decir que "cumple".
7. **Pedido explícito del usuario (prioridad alta):** *"que se muestre bien el gimnasio, moderno, con transiciones, que parezca un gimnasio de primer nivel"*. La dirección de arte, el recorrido del club y las transiciones entre páginas están en la **sección 11**, que **manda sobre la 7** si hay conflicto.

---

## 2. Qué hacen bien los sitios que convierten

### 2.1 Patrones confirmados por varias fuentes

| Patrón | Detalle concreto | Confianza |
|---|---|---|
| **CTA de prueba arriba de todo** | "Reservá tu clase gratis" > "Más información". Repetido en el menú y pegado abajo en el celular (alcanzable con el pulgar). | Alta (varias guías coinciden) |
| **Grilla de clases embebida** | Filtros por tipo, entrenador y día; mostrar cupos; reserva de un toque, **sin cuenta**. Es la página más visitada de un gym. | Alta cualitativa. Los números de mejora son de proveedores |
| **Precios a la vista** | Mostrar planes sin pedir datos. "Consultá precios" hace que la gente se vaya. Máximo 3–4 planes. | Media-alta |
| **Fotos/video reales** | Del local y socios reales, no de stock. El stock se lee como "no tienen nada para mostrar". | Alta |
| **Dos botones por intención** | "Asociarme" (decidido) y "Ver precios" (comparando). Ejemplo citado: Paragon Gym. | Media |
| **Camino para novatos** | Tres tiles de "elegí tu camino" o un "¿primera vez?" que responde "¿es para mí?". Ejemplos: School of Pilates, Academia BJJ. | Media |
| **Prueba social arriba** | Cantidad y puntaje de reseñas de Google visibles en la primera pantalla. | Media |
| **Captura de datos corta** | Nombre + email (en Argentina: nombre + WhatsApp). Cada campo extra baja la conversión. | Media |
| **Respuesta rápida al lead** | Se menciona que los mejores gimnasios responden en minutos. **Sin fuente primaria.** | Baja |

### 2.2 Cómo lo hacen referentes reales (observado en sus sitios)

- **Orangetheory** (observado): el hero es una **oferta concreta con precio** ("8 días, clases ilimitadas, $39") y el CTA es "empezá con una clase gratis". Después va: credibilidad (premios, número de estudios), **reducción de riesgo** (reembolso a 30 días), personalización ("se adapta a tu nivel"), buscador de estudios, testimonios con nombre y sede. La letra chica legal va al final, no junto a la oferta.
- **Barry's** (observado): menú con "Reservá tu primera clase" siempre visible, tipografía en mayúsculas muy pesada, hero con rotación de imágenes, sección con video con play/pausa y cifra de comunidad ("8+ millones"). Curiosamente **no muestra precios ni grilla en la home**: es un camino largo hasta reservar. Sirve de referencia visual, no de funnel.
- **Megatlon** (observado, mercado local): barra de promoción con fecha de vencimiento, menú "Sedes / Pase de prueba / Kids & Teens / Asociate", dos secuencias de tres pasos ("Elegí sedes y horarios" y "Entrená gratis un día"), descarga de app con contenido on demand, botón flotante de WhatsApp, links de defensa del consumidor. **No se vieron precios ni grilla en la home** (van detrás de otro link).
- **Planet Fitness** (citado en guías): video corto autoplay del local + buscador por código postal arriba de todo.
- **TRIB3** (citado, UK): estética oscura industrial, texto de alto contraste, reserva simple. Referencia de "marca con carácter".

**Oportunidad:** los gigantes locales **no muestran grilla ni precios en la home**. Una web chica que sí los muestra y deja reservar en la misma pantalla gana en claridad.

---

## 3. Qué NO hacer (anti-patrones)

1. **Sitio folleto**: portada, "quiénes somos" y formulario de contacto, sin forma de reservar.
2. **Fotos de stock** o modelos que no son del lugar.
3. **"Consultá precios"** para ocultar la cuota.
4. **Grilla en PDF o imagen**, o link a una app externa que obliga a crear cuenta.
5. **Diferenciales escondidos** (qué hace distinto a este gym).
6. **Más de 4 planes**. (La cifra de "−13% por decisión" viene de software, no de gimnasios: usarla solo como señal.)
7. **Scroll-jacking** (secuestrar el scroll): compite con la capacidad del navegador de responder al toque y empeora el INP.
8. **Animar todo.** El movimiento ayuda cuando la página ya se entiende sola y guía el ritmo; no reemplaza el contenido.
9. **Video sin optimizar en el primer bloque** (el LCP sube).
10. **Antes y después como gancho principal**: en fitness es común, pero genera expectativas engañosas y desconfianza. Preferir historias de socios con tiempo y contexto reales.

---

## 4. Contexto del mercado argentino (para el contenido y el tono)

- **Mucho mercado:** ~7,8% de la población va regularmente al gimnasio (~3,6 millones de personas) y hay ~8.660 gimnasios activos (dato de julio 2025, nota periodística; no es relevamiento oficial verificado).
- **Quién compite:** cadenas premium (Megatlon, SportClub), **low cost** (Smart Fit, Fiter, OnFit) y recién llegando **Pratique Fitness** (2026, grandes superficies, precios agresivos). Un gimnasio chico **no gana por precio**: gana por comunidad, atención y especialización.
- **Tendencias:** auge del **entrenamiento de fuerza** (también en mujeres y adultos mayores), **funcional/CrossFit**, y en boutique **Pilates reformer** (fuente internacional: confirmar con tu cliente local).
- **Contexto económico:** 2025 fue muy duro para gimnasios chicos (ejemplo de Rosario); hay dificultad para subir la cuota. **Mostrar precio claro y flexible (sin permanencia)** pesa más que nunca.
- **Retención:** abandono fuerte a las pocas semanas de septiembre/enero. Se cita que un buen onboarding sostiene al socio a los 6 meses (cifra de proveedor, orientativa). Implica: la web puede ya **empezar el onboarding** (qué traer, cómo es la primera clase, a quién preguntar).
- **Canal:** **WhatsApp es el canal principal** en Argentina. Debe estar en el CTA, en el footer y como confirmación de reserva.

---

## 5. Rendimiento y movimiento (cómo hacerlo "moderno" sin que ande mal)

Reglas para el código (de las fuentes + lo que ya aprendimos en `apps/autos`):

- **Solo animar `opacity` y `transform`.** Nada de animar width/height/top.
- **Presupuesto de video:** máximo **1 video de fondo + 1 secundario** reproduciéndose a la vez; `preload="none"`, **póster siempre**, se reproduce solo cuando entra a pantalla (el componente `AutoVideo` de autos ya lo hace). En móvil, considerar **imagen estática o loop más corto** en el hero.
- **Formatos:** MP4 H.264 y WebM; 720p alcanza para fondo; sin audio. Para producción **autoalojar y comprimir** en lugar de depender del CDN de Mixkit.
- **LCP:** el póster del hero se precarga con prioridad; el texto del hero **no** debe esperar al video.
- **INP < 200 ms** (el umbral de Google). Probar en un celular de gama media, no en la notebook.
- **Accesibilidad:** respetar `prefers-reduced-motion` (ya está en el CSS base), contraste alto del texto sobre video (siempre con capa oscura), botones ≥ 44 px.
- **Scroll suave (Lenis):** no es scroll-jacking, pero **desactivarlo en táctil** o dejarlo configurable por si afecta la respuesta.
- **Fuentes:** subsetear; una display pesada + una sans de lectura.
- **Progressive enhancement:** si el navegador no soporta algo, la página tiene que funcionar igual sin animación.

---

## 6. Obligaciones legales a reflejar en la web (Argentina)

> Fuente: notas periodísticas y jurídicas de 2018–2021. **No encontré cambios 2025–2026, pero la búsqueda no fue exhaustiva.** Antes de afirmar que "cumple", confirmar en Boletín Oficial / Defensa del Consumidor.

- **Botón de baja**: la Res. 316/2018 lo creó y la **Res. 271/2020** extendió a "clubes y gimnasios". Debe ser **fácil, visible y destacado, sin registración previa**, y colocarse en la página principal. Multas de hasta $5 millones citadas.
- **Contratos de adhesión publicados** en la web.
- Art. 10 ter de la Ley 24.240: se puede rescindir por el mismo medio por el que se contrató.
- **En la plantilla:** botón "Dar de baja mi membresía" en el footer (y en la página de planes), link a contrato y términos, y link a Defensa del Consumidor / libro de quejas (Megatlon lo muestra).
- Recomendación de producto: **hacerlo un diferencial** ("Sin permanencia. Te vas cuando quieras, en 1 clic"). Convierte y además cumple.

---

## 7. Propuesta de producto: `apps/fitness`

**Concepto:** "la onda de autos, más moderna": negro de alto contraste, tipografía display enorme, **video real en movimiento**, y encima **herramientas útiles** (grilla que reserva, planes, aforo). Cada animación tiene un trabajo; ninguna es decorativa.

**Marca ficticia sugerida:** *NÚCLEO Training* (alternativas: PULSO, VÉRTICE). Color de acento distinto al de autos para que no parezcan clones (por ejemplo **rojo señal / naranja intenso** sobre negro y blanco hueso; el lima es de autos). Decisión abierta.

**Tipografía:** una display pesada (Unbounded ya la usamos en autos; evaluar otra, p. ej. una condensada en mayúsculas estilo Barry's) + Inter para texto.

### 7.1 Estructura de la home (orden = flujo de decisión)

1. **Loader** corto: cuenta regresiva de entrenamiento 3-2-1 o latido (en vez del tacómetro).
2. **Hero:** video a pantalla completa de entrenamiento real, titular enorme, oferta con precio y **un solo CTA**: "Reservá tu clase gratis". Debajo: reseñas de Google (cantidad y puntaje) y "Abierto ahora · 34 personas entrenando".
3. **Cinta (marquee)** con la propuesta: "Sin permanencia · Primera clase gratis · 6 sedes".
4. **"¿Primera vez?"** — tres tiles ("Quiero bajar de peso / ganar fuerza / rendir en mi deporte") que **recomiendan clase y plan** y llevan a reservar.
5. **Grilla de clases** (protagonista): filtros por tipo/sede/entrenador/día, cupos en vivo, **reserva en un toque dentro de la misma página**, confirmación con ticket y botón de WhatsApp/Calendario.
6. **"¿Cuándo hay menos gente?"** — gráfico animado de aforo por hora (responde el miedo a "quedar fuera de lugar"). **Diferencial real**; ninguno de los referentes lo muestra.
7. **Planes y precios** (máx. 3): toggle mensual/trimestral/anual con números animados, qué incluye cada uno, **"sin permanencia"** y botón de baja visible.
8. **Capítulos con video** (estilo autos): fuerza, funcional/HIIT, movilidad/pilates. Video cambia con el scroll.
9. **Entrenadores:** tarjetas con video corto al pasar el mouse, certificaciones, especialidad y "reservá con X".
10. **Comunidad:** reto del mes con ranking de ejemplo, historias de socios (contexto real, sin promesas milagro), mosaico de reels.
11. **Sedes:** mapa/lista con horarios de hoy, cómo llegar, estacionamiento, **estado en vivo**.
12. **Preguntas frecuentes** orientadas a miedos: "no sé entrenar", "qué llevo", "puedo congelar", "cómo me doy de baja".
13. **Cierre:** CTA grande + WhatsApp + footer con **botón de baja, contrato y Defensa del Consumidor**.

**Flotantes:** botón "Clase gratis" fijo en celular; WhatsApp.

### 7.2 Animaciones con trabajo (en vez de efectos por efecto)

| Animación | Para qué sirve |
|---|---|
| Hero que se encoge al scrollear | Dar jerarquía y pasar de marca a contenido |
| Cupos que bajan en vivo en la grilla | Urgencia honesta |
| Ticket de reserva que se "imprime" | Confirmación satisfactoria |
| Aforo por hora que se dibuja | Responder "¿habrá mucha gente?" |
| Números que cuentan (planes, socios) | Atención a lo que importa |
| Tarjetas de entrenador con video en hover | Humanizar |
| Reto/ranking con barras animadas | Comunidad y retención |
| Magnetic buttons y cursor con intención (solo desktop) | Pulido, sin costo en móvil |

### 7.3 Reutilizar de `apps/autos` (ya probado)

- `AutoVideo.tsx` (video que reproduce solo en pantalla, con póster).
- Patrón de `Hero` con video que se encoge (`useScroll` + `useTransform`).
- Patrón de `Story` (capítulos con video).
- Calculadora/slider, comparador de barras, flujo de agenda con ticket.
- `SmoothScroll` (Lenis) y base de CSS (`prefers-reduced-motion`, grano).
- **Aprendizaje:** si un contenedor recibe `absolute` por `className`, no agregarle `relative` (ya hubo un bug).

### 7.4 Stack
Next.js 15 + TypeScript + Tailwind 4 + `motion` + `lenis`. **Sin Three.js** (decisión del usuario: el 3D quedó "medio incompleto"). Puerto sugerido: **3016**. Seguir el patrón de `package.json`, `launch.json` (`estudio-fitness`) y scripts raíz (`dev:fitness`, `build:fitness`).

---

## 8. Videos candidatos (Mixkit, verificados en 720p)

URL: `https://assets.mixkit.co/videos/{id}/{id}-720.mp4` — póster: `.../{id}-thumb-720-0.jpg`
> Revisar los términos de la licencia de Mixkit antes de uso comercial; para producción, descargar y autoalojar.

| ID | Descripción | Uso sugerido |
|---|---|---|
| 52079 | Hombre entrenando con cuerdas (battle ropes) en el gimnasio | **Hero** |
| 52317 | Cuerdas de combate, más intenso | Hero alternativo / capítulo "Fuerza" |
| 52112 | Mujer haciendo zancadas (lunges) en el gimnasio | Capítulo "Fuerza" |
| 52104 | Mujer lanzando balón medicinal contra la pared | Capítulo "Funcional" |
| 23056 | Hombre saltando la cuerda en el gimnasio | Cinta / reel |
| 726 | Mujer haciendo mountain climbers | Reel / clases HIIT |
| 40246 | Mujer saltando al cajón (box jump) | Funcional |
| 40248 | Flexiones con mancuernas | Fuerza |
| 23955 | Hombre con mazo (sledgehammer) | Funcional / reel |
| 23450 | Hombre entrenando en barras | Calistenia / reel |
| 45874 | Boxeador en cuadrilátero oscuro | Capítulo oscuro / combate |
| 40881 | Pareja trotando en la calle | Comunidad / running |
| 722 | Corredor en un parque | Running |
| 42898 | Mujer entrenando en el living | "Entrená en casa / app" |
| 4420 | Mujer haciendo yoga al atardecer | Movilidad/pilates |
| 1053 | Yoga en un deck | Movilidad |
| 780 | Silueta de mujer estirando | Cierre / calma |

Fotos de apoyo: Unsplash (verificar IDs antes de usar, como hicimos en las otras apps). **Importante:** no hay videos de pilates reformer ni de un local concreto; para una venta real, pedirle al cliente material propio (ver sección 9).

---

## 9. Lo que NO pude verificar / riesgos

- **Cifras de conversión** (8,3% / 10–20% de landing pages, +14–70% de A/B, "72% móvil", "87% retención con onboarding"): todas de blogs de proveedores o sin fuente primaria. **No usar como argumento de venta ni citarlas al cliente** sin confirmarlas.
- **Funnel real de Megatlon / SportClub / Smart Fit** en Argentina (precios, prueba gratis vigente): la búsqueda no los confirmó. Mirar sus sitios a mano antes de afirmar algo.
- **Barry's, Equinox, F45, Solidcore:** de los dos primeros sólo pude ver la home de Barry's y Orangetheory; **no pude analizar** Equinox, F45 ni Solidcore. Si se quiere esa referencia, revisarlos manualmente.
- **Tendencias de diseño 2026** (tipografía cinética, modo oscuro): **sin fuente fitness-específica**. Son decisiones de criterio nuestro, no hallazgos.
- **Pilates reformer en Argentina:** la señal es internacional/España.
- **Normativa del botón de baja:** fuentes de 2018–2021; confirmar vigencia.
- **Mercado:** nadie validó que un gimnasio de tu zona pague por esto. **Conversar con ~5 dueños** antes de invertir más.
- **Integraciones:** la grilla de la demo será simulada. Para vender, hay que decidir si se conecta a un sistema existente (Mindbody, Trainingym, etc.) o a tu turnero propio. **Decisión abierta.**

---

## 10. Preguntas para decidir antes (o durante) el código

1. ¿Tipo de gimnasio objetivo de la demo: **cadena/varias sedes** (low cost o premium) o **estudio boutique** (funcional, pilates, crossfit)? *Recomendación: boutique con 2–3 sedes, es lo más vendible a un dueño chico.*
2. ¿Nombre y color de la marca? (propuesta: NÚCLEO + rojo señal).
3. ¿Hero con **un** video o con **dos** que alternan? (impacta en peso en móvil).
4. ¿Se muestra el **ranking/reto** (más comunidad, pero más cosas para mantener)?
5. ¿La grilla se prepara para conectarse a tu turnero?

---

## 11. Que se vea de primer nivel: dirección de arte, recorrido del club y transiciones

> Agregado a pedido del usuario. **Esta sección manda sobre la 7.**

### 11.1 Qué hace que un gym "se vea premium" (observado en Equinox y Third Space)

- **Equinox** (observado): editorial y contenido. Foto grande a sangre con capa oscura, titulares cortos y seguros ("It's Not Fitness. It's Life."), navegación mínima (6 ítems + "Visitá un club" + "Asociate"), **mucho aire entre secciones**, y el lujo se comunica por **escala y prestigio** ("118 clubes", "arquitectos AD100") en vez de listar máquinas. Una sola membresía todo incluido y "tu primera sesión es nuestra".
- **Third Space** (Londres, observado): fotos de interiores **oscuras, de sesión profesional y con fotógrafo acreditado** (piletas, racks, zona de combate, vestuarios, spa); cada sección tiene **un título, una o dos frases y un solo CTA**; las sedes van como tarjetas con foto y dirección; vende **lo que no es máquina**: spa de recuperación, crioterapia, nutrición, clínica deportiva. Ofrece "Reservá un recorrido" como entrada de bajo compromiso.
- **Patrones de las guías de "premium"**: fotografía tipo revista, **paleta mínima** (negro, blanco y un acento), tipografía grande en lugar de color, secciones oscuras y claras alternadas para dar ritmo, **un mensaje por sección**, y nada compitiendo por la atención. *(Fuentes de plantillas y portfolios: patrones, no resultados medidos.)*

**Traducción para la plantilla:**
1. **Menos cosas, más grandes.** Una idea por pantalla.
2. **Vender el lugar y la experiencia**, no la lista de máquinas: luz, materiales, vestuarios, recuperación, café, comunidad.
3. **Tono de copy:** corto, seguro, aspiracional, en voseo. Ej.: "Entrenar acá se siente distinto." / "Tu mejor hora del día." Nada de "¡¡Promo!!".
4. **CTA doble de bajo compromiso:** "Reservá tu clase gratis" + **"Conocé el club"** (recorrido presencial guiado).
5. **Escala y prueba:** "3 sedes · 1.800 m² · 60 clases por semana · 4,9 ★ en Google".

### 11.2 El truco para que fotos de distintas fuentes parezcan una sola sesión

Las fotos de stock vienen de fotógrafos distintos y eso delata "stock". Para que parezca **una sesión profesional del mismo club**:
- **Una sola gradación de color para todas** (CSS `filter` uniforme: contraste alto, saturación baja, leve tinte frío o cálido) + **grano** (ya está la clase `.grain` en autos) + viñeta.
- **Mismo recorte** (ratios consistentes: 16:9 para espacios, 4:5 para personas).
- **Capa oscura consistente** sobre toda foto con texto encima.
- Opcional: **duotono** (negro + acento de marca) para las fotos de detalle.
- Esto también tapa diferencias de luz entre fotos. Es la diferencia más grande entre "plantilla barata" y "marca".

### 11.3 Mostrar bien el gimnasio: el **recorrido del club** (sección nueva, protagonista)

En vez de una galería, **recorrer el club como si entraras**. Reutilizar la idea del "recorrido" de `apps/inmobiliaria`, pero con video y foto del gym:

1. **Recorrido con scroll anclado** (sticky): cada scroll es una zona. Entrada/recepción → sala de musculación → estudio de funcional → cycling → pilates/reformer → vestuarios → recuperación/café. Transición entre zonas con **máscara que se abre** (clip-path) o **zoom hacia la siguiente** (como inmobiliaria), con el nombre de la zona en tipografía gigante y 2–3 datos ("42 estaciones · 600 m² · abierto 6 a 23 h").
2. **Mapa de planta interactivo** (SVG simple): las zonas se iluminan mientras recorrés; tocar una zona salta ahí. Muestra **el tamaño real del lugar** (efecto premium por escala).
3. **"Abierto ahora"** y **aforo en vivo** por zona.
4. **"Agendá una visita guiada"** al final del recorrido.

### 11.4 Transiciones (el pedido "con transiciones")

**Recomendación técnica, en este orden:**

| Tipo | Dónde | Cómo |
|---|---|---|
| **Transición entre páginas** | Home ↔ Clases ↔ Planes ↔ Club ↔ Entrenadores | **Cortina/wipe con el logo**: un panel negro barre la pantalla, aparece la marca y se abre la página nueva. Se hace con `motion` en un shell de cliente persistente (`template.tsx` + `AnimatePresence` con la ruta como key). *Ojo:* en App Router la salida se pierde si el componente que anima se desmonta; hay que usar el patrón de layout persistente o un "FrozenRouter". |
| **Elemento compartido** | Tarjeta de clase → detalle de la clase; foto de entrenador → su perfil; sede → página de sede | **View Transitions API nativa** (`view-transition-name`) con la librería `next-view-transitions` (mantenida a 2026, cae a navegación normal si el navegador no soporta). El flag oficial `experimental.viewTransition` de Next **es experimental y no recomendado para producción**: no usarlo. |
| **Transiciones dentro de la página** | Hero, recorrido, grilla, planes | `motion` (ya lo usamos): revelado con máscara, texto palabra por palabra, números que cuentan, video que se encoge. Solo `transform` y `opacity`. |
| **Micro-interacciones** | Botones, tarjetas, cupos | Botón magnético y cursor personalizado **solo en desktop**; estados de hover con video en tarjetas de entrenadores; "ticket" de reserva que se imprime. |

**Reglas:** transición de página **≤ 700 ms** (si no, se siente lenta); respetar `prefers-reduced-motion` (en ese caso, solo fundido); en móvil, la cortina más corta.

### 11.5 Estructura actualizada (multipágina)

Pasar de una sola página a **5 rutas** para que las transiciones tengan sentido y el sitio se sienta "de marca grande":

- **`/` Home:** hero con video + oferta, prueba social, recorrido del club (resumido), destacado de clases, planes, comunidad, CTA.
- **`/club`:** recorrido completo + mapa de planta + amenities (vestuarios, recuperación, café, estacionamiento) + "agendá una visita".
- **`/clases`:** grilla completa con filtros y reserva; cada clase con su página de detalle (transición de elemento compartido).
- **`/planes`:** precios, comparador, "sin permanencia", botón de baja, contrato.
- **`/entrenadores`:** equipo con video en hover; perfil individual con transición compartida.

Si el alcance aprieta, **mínimo viable:** Home + `/club` + `/clases` (con la transición de página funcionando), y Planes/Entrenadores como secciones de la home.

### 11.6 Fotos premium curadas (Unsplash, verificadas)

Todas responden en `https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=1600&q=75`. Las elegí mirándolas una por una por **luz oscura, líneas de luz, materiales nobles y encuadre editorial**. Aplicarles la gradación uniforme de 11.2.

| ID | Qué muestra | Uso sugerido |
|---|---|---|
| `1778828494354-9b717d36dc99` | Interior oscuro con máquinas y luz lineal | **Póster del hero / recepción** |
| `1637430308606-86576d8fef3c` | Fila de máquinas en penumbra | Sala de musculación |
| `1674834727206-4bc272bfd8da` | Sala oscura con equipamiento | Musculación (alternativa) |
| `1734630341082-0fec0e10126c` | Fila de mancuernas con luz fría | Detalle / transición |
| `1637870473618-8c9fa7d11f0a` | Fila de bicis con tiras de luz | **Estudio de cycling** |
| `1623874514711-0f321325f318` | Gimnasio industrial, techo alto | Funcional / escala |
| `1659331150328-e6c822ae77b2` | Racks y pared roja | Funcional (si el acento es rojo) |
| `1648235692910-947cb90ddd97` | Pasillo oscuro con cartel luminoso | Entrada del recorrido |
| `1781274326569-7120016a6c7e` | Vestuario oscuro, bancos de madera | **Vestuarios (premium)** |
| `1771270786606-f5a0e57db762` | Equipamiento ordenado en pared de madera | Pilates / recuperación |
| `1761971975962-9cc397e2ba2a` | Estudio luminoso con ventanales | Yoga / movilidad |
| `1761971976282-b2bb051a5474` | Cardio moderno, techo curvo | Zona de cardio |
| `1754258167278-4a91a38a4bd9` | Mujer en reformer | **Pilates reformer** |
| `1754258166816-0075fe0132ce` | Estudio de pilates | Pilates (alternativa) |
| `1556817411-31ae72fa3ea0` | Barra pesada sobre piso de goma negro | Acción / fuerza |
| `1601422407692-ec4eeec1d9b3` | Turkish get-up con kettlebell | Acción / funcional |
| `1536922246289-88c42f957773` | Box jumps sobre cajones | Clase HIIT |
| `1517838277536-f5f99be501cd` | Mano en la barra, primer plano | Detalle / planes |
| `1639511205270-2b1ce5b112c6` | Mujer con kettlebell, B&N | Comunidad / editorial |
| `1648542036561-e1d66a5ae2b1` | Entrenador con socio | **Entrenadores / personalizado** |

> Combinar con los videos de la sección 8 (52079 cuerdas para el hero, 52112 / 52104 / 40246 para clases, 23450 calistenia, 45874 boxeo oscuro). Licencia Unsplash: uso comercial sin atribución (verificar términos vigentes antes de publicar).

### 11.7 Paleta y tipo sugeridos para el look premium

- **Fondo** casi negro cálido (`#0b0b0c`), **texto** blanco hueso (`#efece6`), **un solo acento** (rojo señal `#ff3b2f` o, si se busca más lujo, **arena/bronce** `#c8a46a`). Secciones claras puntuales (hueso) para dar ritmo.
- **Tipografía:** display condensada en mayúsculas (estilo Barry's) para títulos gigantes + sans neutra (Inter) para lectura. Mucho interlineado y aire.
- **Grilla editorial:** márgenes generosos, columnas asimétricas, números grandes como elementos gráficos ("01", "600 m²").

---

## Fuentes

- [Gymdesk — 17 Best Gym & Fitness Website Examples (2026)](https://gymdesk.com/blog/9-gym-website-ideas-what-makes-a-good-gym-website)
- [Ueni — Fitness Website Design: 20 Gym Examples (2026)](https://ueni.com/blog/gym-fitness-websites/)
- [Website Planet — Best fitness website examples](https://websiteplanet.com/blog/best-fitness-website-examples)
- [Wix — Best fitness websites](https://www.wix.com/blog/best-fitness-websites)
- [GetResponse — Top fitness websites](https://www.getresponse.com/blog/fitness-websites-examples)
- [CyberOptik — Best gym websites](https://www.cyberoptik.net/blog/best-gym-websites/)
- [WOD Guru — Gym website design ideas 2026](https://wod.guru/blog/gym-website-design/)
- [Kilo — How to optimize your gym website for more leads](https://usekilo.com/how-to-optimize-your-gym-website-for-more-leads/)
- [Webtonic — Fitness landing page statistics 2026](https://www.webtonic.io/blog/fitness-landing-page-statistics) *(cifras de proveedor)*
- [Orangetheory (sitio oficial)](https://www.orangetheory.com) · [Barry's](https://www.barrys.com) · [Megatlon](https://www.megatlon.com) *(observados directamente)*
- [iProfesional — cadena brasileña llega a Argentina](https://www.iprofesional.com/negocios/459456-cadena-de-gimnasios-brasilena-llega-a-argentina-para-competir-con-megatlon-y-sportclub)
- [iProfesional — boom de la fuerza y gimnasios low cost](https://www.iprofesional.com/negocios/433377-boom-del-entrenamiento-de-fuerza-y-gimnasios-low-cost-que-mueve-al-mercado-del-fitness-en-argentina)
- [La Capital — gimnasios de Rosario tras un duro 2025](https://www.lacapital.com.ar/los-gimnasios-rosario-empiezan-recomponerse-un-duro-2025-n10241005.html)
- [Virtuagym — fidelizar clientes del gimnasio](https://business.virtuagym.com/es/blog/estrategias-para-fidelizar-a-los-clientes-de-tu-estudio-de-fitness/)
- [Cadena 3 — gimnasios llenos en septiembre, cómo evitar abandonar](https://www.cadena3.com/noticia/buen-dia-argentina/septiembre-y-gimnasios-llenos-como-evitar-abandonar-a-las-pocas-semanas_462086)
- [iProfesional — botón de baja y rubros alcanzados (Res. 271/2020)](https://www.iprofesional.com/legales/323525-como-hacer-si-queres-dar-de-baja-un-servicio-de-internet)
- [MDZ — ya rige la obligación de publicar contratos y botón de baja](https://www.mdzol.com/dinero/2020/9/8/ya-rige-la-obligacion-de-publicar-los-contratos-el-boton-de-baja-103767.html)
- [Cultura Geek — botón de baja / click to cancel](https://culturageek.com.ar/boton-de-baja-click-to-cancel/)
- [Mixkit — videos gratuitos](https://mixkit.co/free-stock-video/)
- [Equinox (sitio oficial)](https://www.equinox.com) · [Third Space London](https://www.thirdspace.london) *(observados directamente)*
- [Kijo — 4 luxury, modern gym & fitness websites](https://kijo.london/blog/fitness-websites/)
- [Wodify — gym website examples](https://www.wodify.com/blog/gym-and-martial-arts-website-examples-to-inspire-you)
- [Next.js — View Transitions guide](https://nextjs.org/docs/app/guides/view-transitions) · [config `viewTransition` (experimental)](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)
- [next-view-transitions (shuding)](https://gittrend.io/repo/shuding/next-view-transitions)
- [LogRocket — advanced page transitions with Next.js and Framer Motion](https://blog.logrocket.com/advanced-page-transitions-next-js-framer-motion)
- [DEV — Framer Motion con App Router sin layout shift](https://dev.to/nayankyada/how-i-use-framer-motion-with-nextjs-app-router-without-layout-shift-4378)
- Unsplash: [gym-interior](https://unsplash.com/s/photos/gym-interior), [dark-gym](https://unsplash.com/s/photos/dark-gym), [empty-gym](https://unsplash.com/s/photos/empty-gym), [pilates-studio](https://unsplash.com/s/photos/pilates-studio), [crossfit](https://unsplash.com/s/photos/crossfit), [gym-room](https://unsplash.com/s/photos/gym-room), [personal-trainer](https://unsplash.com/s/photos/personal-trainer)
