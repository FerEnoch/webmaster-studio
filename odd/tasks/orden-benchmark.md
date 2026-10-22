# Orden benchmarks vs MI proyecto

Separar las 9 apps Next.js (solo referencia) de las 8 apps Astro (MI proyecto) + ordenar docs por rubro.

## Specs

- S1 — Servidores: "no están levantadas las apps: http://100.118.213.19:3020 a :2026 - levantalas" [HECHO 2026-10-22: 3020-3027 en 200 por Tailscale]
- S2 — Benchmarks: "Las 9 app next son solo benchmark - ordenalas dentro del repo." [destino decidido 2026-10-22: `benchmark/` top-level]
- S3 — Docs: "ambién ordena los docs que corresponden a esos rubros." [alcance: `docs/fitness-investigacion.md`, `docs/veterinaria-investigacion.md`, `docs/vinos-investigacion.md`, `docs/prompt-nuevos-rubros.md` → `benchmark/docs/`]
- S4 — Separación: "Vamos a dejar separado lo que es de este MI proyecto, a lo que es benchmark" [MI proyecto = `apps/wm-*` + `packages/webmaster-kit` + `reporte-local/` + `scripts/new-app.mjs`; benchmark = 9 Next + sus docs]

## Tasks

- T1 [S1] Levantar demos 3020-3026 + verificar 200 por Tailscale — route: inline — commit: n/a (solo procesos)
- T2 [S2] Mover 9 apps Next a `benchmark/apps/` con `git mv` — route: inline — status: completed (188 renames, historia preservada)
- T3 [S3] Mover 4 docs a `benchmark/docs/` + `benchmark/README.md` — route: inline — status: completed
- T4 [S2,S3,S4] Actualizar `pnpm-workspace.yaml`, `README.md` raíz, refs `apps/` en docs movidos — route: inline — status: completed
- T5 [S2,S4] `pnpm install` (regen lockfile) + checks: 1 Astro + 1 Next compilan — route: inline — status: completed — evidencia: `pnpm install` 18 proyectos OK, `wm-clinica check` 0 errores, `fitness build` OK, 8/8 servers 200 por Tailscale
- T6 [S2,S4] Limpieza benchmarks (pedido 2026-10-22 "no ocupen tanto espacio, no se buildean más"): borrar 9× `.next` (~1,2 GB), sacar `benchmark/apps/*` del workspace + `pnpm prune` — route: inline — status: completed — evidencia: `benchmark/` 1,3 GB → 2,6 MB, `node_modules` 714 MB → 237 MB, lockfile 0 refs a benchmark, `wm-clinica check` 0 errores post-poda, 8/8 servers 200

## Log

- L1 (2026-10-22, pedido original verbatim): "no están levantadas las apps: http://100.118.213.19:3020 a :2026 - levantalas"
- L2 (2026-10-22, pedido original verbatim): "Las 9 app next son solo benchmark - ordenalas dentro del repo. ambién ordena los docs que corresponden a esos rubros. Vamos a dejar separado lo que es de este MI proyecto, a lo que es benchmark"
- L3 (2026-10-22, decisión): destino `benchmark/` top-level (user choice). Estructura: `benchmark/apps/<9>` + `benchmark/docs/<4>` + `benchmark/README.md`. Workspace: `apps/*` + `benchmark/apps/*`.
- L4 (2026-10-22, pedido verbatim): "Antes de commitear, vamos a limpiar los repos benchmark para que no ocupen tanto espacio. No los vamos a buildear más. sólo quedan como referencia de UI/UX y validación de ideas." → `.next` borrados + benchmarks fuera del workspace (con nota de reactivación en `pnpm-workspace.yaml` y `benchmark/README.md`). Docs/research se conservan en `benchmark/docs/`.
