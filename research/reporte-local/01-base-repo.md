# 01 — Base actual del repo

## Qué es

Portfolio freelance con **8 apps Astro: 7 demos de rubro + 1 portfolio madre**.
El workspace pnpm incluye `apps/*`; las dependencias se instalan una sola vez
en la raíz. El kit compartido es fuente que se copia, no un paquete npm.

| App | Rubro | Puerto | Desarrollo |
| --- | --- | --- | --- |
| `wm-clinica` | Clínica + diagnóstico por imágenes | 3020 | `pnpm run dev:clinica` |
| `wm-concesionario` | Concesionario de autos nuevos y usados | 3021 | `pnpm run dev:concesionario` |
| `wm-lavadero` | Lavadero de autos con bar | 3022 | `pnpm run dev:lavadero` |
| `wm-estetica` | Estética y yoga | 3023 | `pnpm run dev:estetica` |
| `wm-universidad` | Universidad privada | 3024 | `pnpm run dev:universidad` |
| `wm-inmobiliaria` | Inmobiliaria | 3025 | `pnpm run dev:inmobiliaria` |
| `wm-arquitectura` | Arquitectura y diseño | 3026 | `pnpm run dev:arquitectura` |
| `wm-portfolio` | Portfolio madre | 3027 | `pnpm dev` |

Cada app tiene scripts `dev`, `check` y `build`. La raíz ofrece aliases
`dev:<rubro>` y `build:<rubro>` para las ocho apps; `pnpm build` compila todo
el workspace y `pnpm run check:clinica` conserva el chequeo de referencia.

## Cómo está construido

- **Stack:** Astro 7 + islas React 19 + Tailwind v4 mediante Vite.
- **Kit canónico:** `packages/webmaster-kit/` contiene tipos, rubros, WhatsApp,
  medios, tokens, componentes compartidos y `app-template/`.
- **Contenido:** `apps/wm-<rubro>/src/content/<rubro>.ts`; páginas en `src/pages/`.
- **Firma compartida:** cortina entre rutas, hero de video que se encoge,
  grade/grano/viñeta, sección pinned, señal en vivo y conversión con ticket.
- **Scaffolder:** `scripts/new-app.mjs` copia desde el kit, no desde otra app;
  rechaza destinos existentes para no sobrescribir trabajo.
- **Conversión:** WhatsApp con mensaje prearmado. Los formularios y reservas
  son demos y no envían datos; un backend real se cotiza e integra aparte.
- **Contenido y legales:** marcas y precios ficticios marcados como demo,
  precios finales con impuestos, Defensa del Consumidor y baja/arrepentimiento
  cuando corresponde. Fotos de Unsplash y videos de Mixkit por URL.

## Verificación

```bash
node --test scripts/workspace.test.mjs
pnpm --filter wm-clinica run check
pnpm run build:clinica
```

La prueba estructural revisa scripts y referencias operativas; no reemplaza
los checks y builds de las ocho apps. Para producción faltan contenidos y
medios propios, integraciones reales y URLs de deploy confirmadas.

## Fuentes vigentes

- [README del proyecto](../README.md) — comandos y procedimiento para sumar rubros.
- [Configuración raíz](../package.json) y [workspace](../pnpm-workspace.yaml).
- [Guía del kit](../packages/webmaster-kit/README.md) y
  [esqueleto canónico](../packages/webmaster-kit/app-template/).
- [Scaffolder](../scripts/new-app.mjs) — copia, validación del destino y puertos.
- [App de referencia](../apps/wm-clinica/) — implementación Astro de clínica.
