# Design system — webmaster-studio (sincronizado 2026-11-16)

Fuentes: `packages/webmaster-kit/styles/tokens.css` (firma base), overrides de la premium en `apps/wm-lavadero-premium/src/content/lavadero-premium.ts` (theme) y `apps/wm-lavadero-premium/src/styles/global.css` (sistema `.gg-*`).

## Colores

| Token | Valor | Uso |
| --- | --- | --- |
| `--wm-bg` | `#0e1a1c` (kit) / `#101114` (premium) | fondo de página |
| `--wm-fg` | `#e9f0ec` (kit) / `#EDEAE2` (premium) | texto principal |
| `--wm-accent` | `#ff6b4a` (kit) / `#D08A3E` (premium, cobre) | acento, CTAs, reglas |
| `--color-muted` | `color-mix(in oklab, fg 62%, bg)` | texto secundario |
| `--color-line` | `color-mix(in oklab, fg 16%, bg)` | bordes y divisores |
| `--color-soft` | `color-mix(in oklab, accent 16%, bg)` | superficies suaves |

## Tipografía

| Token | Valor | Uso |
| --- | --- | --- |
| `--wm-font-display` | `"Bricolage Grotesque", ui-sans-serif, system-ui` (kit) / `Fraunces` (demos normales) / `Bodoni Moda` (premium, vía `theme.fonts.href`) | titulares |
| `--wm-font-body` | `"Manrope", ui-sans-serif, system-ui` (kit) / `Archivo` (demos y premium) | texto y controles |

## Radio y espaciado

| Token | Valor | Uso |
| --- | --- | --- |
| `--wm-radius` | `0.75rem` (kit) / `0.6rem` (premium) | radio base |
| `--radius-wm-lg` | `calc(--wm-radius * 1.8)` | radio grande |
| `.wm-container` | `max-width: 82rem`, `1.25rem` / `2.5rem` (sm+) | contenedor |

## Sombras y motion

| Token | Valor | Uso |
| --- | --- | --- |
| `--wm-ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | transiciones (sin bounce) |
| `--wm-ease-inout` | `cubic-bezier(0.76, 0, 0.24, 1)` | cortina entre rutas |
| `wm-grain` | overlay SVG `feTurbulence`, `opacity: 0.09`, `mix-blend: overlay` | grano de la firma |
| `wm-vignette` | radial transparente 40% → bg 80% | viñeta de la firma |
| `wm-ticket-print` | `900ms ease` desde arriba | ticket de conversión |

## Reglas de componentes (firma)

- `.wm-btn`: pill, uppercase, un solo acento por pantalla; `.wm-btn--ghost` con borde interior.
- `.wm-card`: superficie `fg 4%`, borde interior `fg 10%`.
- `.wm-kicker`: `0.7rem`, `letter-spacing 0.28em`, uppercase, regla cobre de `2rem` antes.
- `.wm-display`: uppercase, `line-height 0.92` (kit; la premium usa serif sin uppercase en hero propio).
- Foco visible: `outline 2px accent + 3px offset`. `prefers-reduced-motion`: sin animación.
