# Fondo three.js con scroll — GLOSS & GLASS

Propuesta de animación de fondo manejada por scroll para la home de la demo premium (`apps/wm-lavadero-premium`). Estado: direcciones en evaluación, sin implementar.

## Restricciones reales (no negociables)

- `check-site` exige: assets bajo `/demos/lavadero-premium/_astro/`, 6 rutas, canónica, 404. three.js vía npm + bundle de Vite cumple (el JS empaquetado cae en `_astro/`).
- pnpm tiene cuarentena de 3 días (`minimumReleaseAgeStrict`): hay que fijar three a una versión con más de 3 días. Nada de `^` flotante.
- Performance: canvas `position:fixed`, `pointer-events:none`, `aria-hidden`; pausa con `IntersectionObserver` + `document.hidden`; respeta `prefers-reduced-motion` (fondo estático); en mobile, densidad reducida o fallback estático. Hidratación con `client:visible` + `import()` dinámico: three no pesa en la primera pintura.
- Accesibilidad: todo el contenido vive en el DOM; el canvas es decoración.

## Direcciones (artboards)

- `01-polvo-cobre.html` — Campo de partículas de cobre a la deriva sobre grafito. El scroll acelera la deriva y empuja la cámara. Costo real estimado: ~200 KB (three) o ~8 KB si se hace en canvas 2D. Riesgo: verse genérico "particles.js".
- `02-veta-luz.html` — Una veta de luz larga exposición barriendo un salón oscuro. El scroll mueve la veta y modula su intensidad. El más sobrio y el más barato de hacer bien.
- `03-tunel.html` — Dolly hacia adelante por un túnel abstracto de anillos (cortinas de espuma). El scroll es la profundidad. El más wow y el más riesgoso: puede leerse videojuego.

## Cómo elegir

Bajá con scroll en cada artboard (el fondo responde al scroll de la página, igual que en el sitio real). Elegí por: ¿cuál se siente salón y cuál se siente arcade? Mi recomendación: 02 como base + densidad de 01 en el hero.
