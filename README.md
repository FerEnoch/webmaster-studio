# Estudio

Varias páginas web, cada una en su propia app de Next.js + TypeScript.
Las dependencias se instalan **una sola vez** en la raíz (`node_modules` compartido)
gracias a npm workspaces.

```
estudio/
  package.json          ← workspaces: apps/*
  node_modules/         ← compartido
  apps/
    thaloz/             ← réplica de thaloz.com/about-us/company
    invgate/            ← réplica de invgate.com (home) con animaciones mejoradas
    constructora/       ← plantilla original de constructora con obra 3D en tiempo real
    inmobiliaria/       ← catálogo de propiedades, recorridos y terreno 3D
    salud/              ← clínica: morph de partículas y sistema de turnos
    autos/              ← concesionaria: video, configurador y animaciones web
    fitness/            ← gimnasio boutique premium: video, recorrido del club, reservas
    veterinaria/        ← clínica veterinaria cálida: triage, libreta de salud, turnos, recorrido
    vinos/              ← boutique de vinos + viajes en Mendoza: tienda, sommelier, itinerarios
  docs/                 ← investigaciones y briefs por rubro
```

| App | Comando | URL |
| --- | --- | --- |
| thaloz | `npm run dev` | http://127.0.0.1:3010 |
| invgate | `npm run dev:invgate` | http://localhost:3011 |
| constructora | `npm run dev:constructora` | http://localhost:3012 |
| inmobiliaria | `npm run dev:inmobiliaria` | http://localhost:3013 |
| salud | `npm run dev:salud` | http://localhost:3014 |
| autos | `npm run dev:autos` | http://localhost:3015 |
| fitness | `npm run dev:fitness` | http://localhost:3016 |
| veterinaria | `npm run dev:veterinaria` | http://localhost:3017 |
| vinos | `npm run dev:vinos` | http://localhost:3018 |

## Correr

```bash
npm install
npm run dev
```

Thaloz abre en http://127.0.0.1:3010 y también en `/about-us/company`.

InvGate: `npm run dev:invgate` → http://localhost:3011
(usa `motion` para las animaciones y `lenis` para el scroll suave).

## Sumar otra web

1. Copiá `apps/thaloz` a `apps/<nombre>`.
2. Cambiá el `"name"` del `package.json` de esa app y el puerto.
3. En la raíz, agregá `"dev:<nombre>": "npm run dev -w <nombre>"`.
4. `npm install` desde la raíz (no hace falta un `node_modules` por app).

Las fotos de Thaloz son referencias de Unsplash: el layout y los textos siguen
la página pública, las imágenes no son las originales del sitio.

InvGate: las capturas de producto, montañas y diagramas están hechos en código
(SVG/React animado); las fotos son de Unsplash.

Constructora ("Basalto", marca ficticia): `npm run dev:constructora` → http://localhost:3012
El edificio del hero es una escena Three.js (React Three Fiber) generada por código que se construye con el scroll.

Fitness ("NÚCLEO", marca ficticia): `npm run dev:fitness` → http://localhost:3016
Multipágina (`/`, `/club`, `/clases`, `/planes`, `/entrenadores`) con transición de cortina entre rutas,
gradación de color uniforme sobre fotos y videos (`.grade`), recorrido del club por scroll con plano interactivo,
grilla de clases con cupos y reserva sin registro, y botón de baja visible (Res. 316/2018).
Investigación y brief en `docs/fitness-investigacion.md`.

Veterinaria ("MANADA", marca ficticia): `npm run dev:veterinaria` → http://localhost:3017
Paleta cálida (crema, verde bosque, coral) y serif Fraunces. Hero con "ventana" de video que se abre a pantalla completa,
beneficios animados, triage "¿Está bien tu mascota?" (rojo → guardia, nunca a la reserva), libreta de salud con línea de
tiempo por edad que recomienda plan, recorrido de la clínica sala por sala con plano, turnos en pasos con carnet animado.
Investigación y brief en `docs/veterinaria-investigacion.md`.

Vinos ("ALTURA", marca ficticia): `npm run dev:vinos` → http://localhost:3018
Nocturna y cálida (vino, crema, latón) con Cormorant Garamond. Hero con video en arco de bodega que se abre y altímetro,
"La subida" Maipú → Luján → Valle de Uco con cordillera en parallax 2D, sommelier virtual que llena la copa con el color
del vino recomendado, tienda con carrito y envío gratis, viajes con itinerario hora a hora y mapa que dibuja la ruta,
voucher tipo pase de embarque, club con suscripción. Aviso de mayoría de edad y leyendas de la Ley 24.788.
Las botellas son ilustraciones SVG propias (sin marcas reales). Investigación en `docs/vinos-investigacion.md`.

## Para integrar (colegas)

1. `git clone <repo> && cd estudio-webs && npm install` (un solo `node_modules` para todas las apps).
2. Cada app corre sola con su comando de la tabla de arriba; `npm run build:<app>` para compilar.
3. Todas son plantillas de demostración: marcas, precios, reseñas, matrículas y legajos son **ficticios** y hay que reemplazarlos por los datos reales del cliente.
4. El contenido de cada web está centralizado en `apps/<app>/src/lib/content.ts` (textos, precios, IDs de fotos y videos).
5. Fotos de Unsplash y videos de Mixkit se cargan por URL (licencias gratuitas); para producción conviene descargarlos y servirlos desde el propio hosting.
6. Los formularios (turnos, carrito, reservas, bajas) son demostrativos: **no envían datos**. Hay que conectarlos al backend real.
7. `docs/prompt-nuevos-rubros.md` tiene la metodología para sumar rubros nuevos; `docs/*-investigacion.md`, la investigación de cada uno.
