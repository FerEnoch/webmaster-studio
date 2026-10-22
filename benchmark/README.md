# Benchmark — 9 apps Next.js de referencia

> Solo referencia y benchmark de diseño de la primera versión. No es MI proyecto.
> Para el trabajo nuevo usar el kit Astro (`packages/webmaster-kit` + `apps/wm-*`).
>
> Desde 2026-10-22 estas apps **no están en el workspace pnpm**: no se instalan
> sus dependencias ni se buildean. Quedan como referencia de UI/UX, validación
> de ideas y research (`docs/`). Para reactivar una: agregar
> `- 'benchmark/apps/*'` a `pnpm-workspace.yaml` y correr `pnpm install`.

```
benchmark/
  apps/             ← las 9 apps Next.js (thaloz … vinos), puertos 3010-3018
    thaloz/         ← réplica de thaloz.com/about-us/company (:3010)
    invgate/        ← réplica de invgate.com con motion + lenis (:3011)
    constructora/   ← plantilla original con obra 3D (:3012)
    inmobiliaria/   ← catálogo + recorridos + terreno 3D (:3013)
    salud/          ← clínica: morph de partículas + turnos (:3014)
    autos/          ← concesionaria: video + configurador (:3015)
    fitness/        ← gimnasio NÚCLEO, referencia más completa (:3016)
    veterinaria/    ← clínica MANADA (:3017)
    vinos/          ← boutique ALTURA (:3018)
  docs/             ← investigación de esos rubros
    fitness-investigacion.md
    veterinaria-investigacion.md
    vinos-investigacion.md
    prompt-nuevos-rubros.md
```

## Correr (reactivar primero)

Estas apps no tienen sus deps instaladas. Para correr una:

```bash
# 1. agregar - 'benchmark/apps/*' a pnpm-workspace.yaml
pnpm install                        # desde la raíz
pnpm --filter fitness run dev
```

Los formularios son demostrativos: **no envían datos**.
Las fotos (Unsplash) y videos (Mixkit) se cargan por URL; para producción descargarlos.
Marcas, precios y profesionales ficticios.

## Origen y agradecimiento

Estas 9 apps provienen del repositorio
[estudio-webs](https://github.com/maurid2000/estudio-webs) de
**maurid2000**, que fue el punto de partida y la inspiración para hacer
webmaster-studio. Gracias por compartir ese trabajo: sin esa base, este
portfolio no existiría.
