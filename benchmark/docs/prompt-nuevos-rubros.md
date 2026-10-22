# Prompt para sumar 3 webs nuevas al estudio

> Copiá todo lo que está dentro del bloque y reemplazá los 3 rubros si querés otros.

```
Trabajamos en el monorepo C:\mauricio developer\sistemas\webs\estudio (Next.js 15 App Router + TypeScript +
Tailwind v4 con tokens en @theme + motion/react + lenis; npm workspaces con un solo node_modules).
Son plantillas web por rubro para vender a pymes que no tienen tecnología ni tiempo. Marcas ficticias,
textos en español rioplatense, mercado Argentina.

Ya existen 7 apps (puertos 3010–3016): thaloz, invgate, constructora (3D), inmobiliaria (3D), salud,
autos (video) y fitness (NÚCLEO). LA REFERENCIA ES benchmark/apps/fitness: es la más completa y la que mejor funcionó.
Leela antes de empezar, junto con docs/fitness-investigacion.md (sección 11 = dirección de arte premium).

QUIERO 3 WEBS NUEVAS, una por rubro, en este orden:
  1. Restaurante / bodegón moderno           → benchmark/apps/gastro    (puerto 3017)
  2. Hotel boutique / cabañas de turismo     → benchmark/apps/hotel     (puerto 3018)
  3. Barbería / centro de estética premium   → benchmark/apps/estetica  (puerto 3019)

METODOLOGÍA (la que nos dio resultado):
  1. Investigación primero, por rubro, en docs/<rubro>-investigacion.md: mejores webs del mundo del rubro,
     qué hacen bien, antipatrones, qué pide el cliente argentino (WhatsApp, precios visibles, horarios,
     ubicación), requisitos legales del rubro, y un brief con: marca ficticia, paleta, tipografías, mapa de
     rutas, las 2–3 "experiencias firma" y la lista de fotos/videos VERIFICADOS.
  2. Después codear, app por app, sin pedirme confirmación en cada paso.
  3. Verificar en el navegador cada ruta en desktop (1440×900) y mobile (375×812), sin errores de consola.
  4. Al final: README raíz (fila en la tabla), scripts dev:/build: en el package.json raíz y entrada
     estudio-<app> en .claude/launch.json del worktree.

DIRECCIÓN DE ARTE (obligatoria):
  - NADA de 3D / Three.js. Sí: animaciones web y MUCHO video.
  - Look "de primer nivel": gradación de color uniforme sobre todas las fotos y videos (.grade de fitness:
    contrast/saturate/brightness/sepia), grano y viñeta; una sola tipografía display fuerte + una de texto;
    paleta de 1 color de fondo + 1 claro + 1 acento. Cada rubro con su identidad, no clonar el rojo de NÚCLEO.
  - Multipágina (4–5 rutas) con transición de cortina entre rutas (copiar Transition.tsx + TLink).
  - Hero de video que se encoge con el scroll + titulares con máscara línea por línea.
  - Al menos una sección "pinned" por scroll que cuente algo (en fitness: el recorrido del club con plano).
  - Una conversión principal que funcione de punta a punta como demo (en fitness: reserva sin registro con
    ticket animado). Ej.: reservar mesa / consultar disponibilidad con calendario / sacar turno con barbero.
  - Señales "en vivo" creíbles (abierto ahora, ocupación, lugares que quedan).
  - CTA fijo en mobile + WhatsApp flotante. Mobile-first: en celular todo tiene que ser rápido de usar.

REUTILIZAR DE benchmark/apps/fitness (copiar y adaptar, no reinventar):
  Transition.tsx (cortina + TLink), Booking.tsx (drawer en pasos + data-lenis-prevent), ui.tsx (Reveal, Lines,
  Count, LiveNow, Magnetic, Kicker), AutoVideo.tsx, SmoothScroll.tsx, PageHero.tsx, Chrome.tsx (header que se
  esconde, nav con layoutId, menú mobile con clip-path, footer legal), globals.css (grade/grain/vignette,
  marquee, reduced-motion). Todo el contenido centralizado en src/lib/content.ts.

MEDIOS:
  - Videos Mixkit: https://assets.mixkit.co/videos/{id}/{id}-720.mp4 y poster {id}-thumb-720-0.jpg.
    Comprobar cada uno con curl (HTTP 200) y mirarlo: descartar los que tienen frames blancos o no
    corresponden al rubro.
  - Fotos Unsplash: https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=...
    Los IDs vienen mal etiquetados seguido: verificar con curl y armar una hoja de contactos temporal en
    public/ para mirarlas, y después borrarla.
  - AutoVideo sólo reproduce cuando está visible (preload="none" + IntersectionObserver).

TRAMPAS QUE YA PISAMOS (evitarlas de entrada):
  - next/font falla por el certificado SSL de esta máquina → Google Fonts con <link> en el layout.
  - npm install con error de certificado → npm config set strict-ssl false y restaurar al terminar.
  - whileInView no dispara en un elemento 100% enmascarado (overflow-hidden + y:110%) → useInView en el
    contenedor (Lines de fitness ya lo resuelve).
  - useAnimate + React StrictMode corta animaciones de intro → usar animate() suelto + flag de cancelación
    + timeout de seguridad para que la cortina nunca quede tapando.
  - Un componente con display propio (inline-flex) pisa el `hidden` que le pasás → envolver en un span.
  - Las máscaras de titulares recortan los acentos de mayúsculas (Í, Á, É) → pt/-mt de 0.14em.
  - AutoVideo con "relative" y "absolute" a la vez queda con alto 0.
  - hue-rotate no cambia el color de un objeto gris → overlay enmascarado con mix-blend-mode: color.
  - El panel del navegador oculto frena requestAnimationFrame: las animaciones parecen trabadas. Verificar
    con varias screenshots seguidas o con chequeos de DOM por JavaScript; no "arreglar" algo que no está roto.
  - Con lenis, el scroll programático tarda: esperar antes de capturar.

LEGALES SEGÚN RUBRO: botón de arrepentimiento/baja si hay suscripción o venta online (Res. 316/2018 y
271/2020), link a Defensa del Consumidor, precios finales con impuestos, y lo específico del rubro que
surja de la investigación (ej. habilitación, alérgenos/menú accesible en gastronomía, políticas de
cancelación en hotelería).

CRITERIO DE TERMINADO, por app: tsc sin errores; todas las rutas cargan y la cortina funciona entre ellas;
la conversión principal se completa en desktop y mobile; cero errores de consola; fotos y videos
verificados; README, scripts y launch.json actualizados. Al final, un resumen corto de qué tiene cada web
y cómo correrla.
```
