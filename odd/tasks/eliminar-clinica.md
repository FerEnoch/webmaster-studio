# Eliminar clínica del repo

Borrado total de `apps/wm-clinica` y de todas sus referencias visibles, build y tests. Rama: `feat/eliminar-clinica` desde `main`.

## Specs

- S1: "Quiero eliminar la clinica de las apps - no es un prototipo que me interese mostrar por ahora."
- S2: "Cambié de idea, quiero borrarla del repos"
- S3: alcance elegido por el usuario = "Borrar del repo" (no ocultar; eliminar carpeta + scripts + catálogo + tests).

## Tasks

- T1 [S1,S2,S3] Borrar `apps/wm-clinica/` + quitar entrada `clinica` de `packages/webmaster-kit/rubros.ts` y sincronizar copias en 7 apps restantes — route: inline — status: completed — `apps/wm-clinica` eliminada, kit + 7 copias sin clinica, pools propios restaurados (concesionario imgCrop, lavadero, universidad, portfolio)
- T2 [S1,S2,S3] Limpiar portfolio visible (`demos.astro`, `DemoIndex`, `index.astro`, `content/portfolio.ts`, `media.ts`/`demoImages`) de 7→6 demos — route: inline — status: completed — 6 demos, counts 6, sin imagen clinica
- T3 [S2,S3] Limpiar `package.json` (descripción + 3 scripts clinica), `README.md`, `packages/webmaster-kit/README.md`, `scripts/new-app.mjs` si nombra clinica — route: inline — status: completed — 7 apps / 6 demos, sin refs clinica en docs visibles
- T4 [S2,S3] Actualizar `scripts/workspace.test.mjs` + `scripts/deployment.test.mjs` + `scripts/check-site.mjs` (7 apps, 6 demos, sin slug clinica) y regenerar lockfile — route: inline — status: completed — `node --test scripts/*.test.mjs` 17/17, lockfile sin wm-clinica
- T5 [S1,S2,S3] Verificación: `node --test scripts/*.test.mjs` + `pnpm -r run check` + `pnpm build` + `check:site` — route: inline — status: completed — 17/17, `Built 7 apps into dist/`, `Checked 7 roots, 52 pages, 1460 links`, preview 200 en 127.0.0.1 y 100.118.213.19:4321

## Log

- L1 (pedido original): "Quiero eliminar la clinica de las apps - no es un prototipo que me interese mostrar por ahora."
- L2 (pregunta de alcance 2026-11-13): opciones "Ocultar por ahora" vs "Borrar del repo" → el usuario eligió "Ocultar por ahora".
- L3 (corrección 2026-11-13): "Cambié de idea, quiero borrarla del repos" → se ejecuta borrado total. `research-output/wm-clinica/` y `odd/tasks/wm-clinica-narrative.md` se conservan como historia (no rompen build).
- L4 (2026-11-13): rama base `main` (estaba en `feat/wm-clinica-narrative` con tree limpio) → nueva rama `feat/eliminar-clinica`.
- L5 (2026-11-15): build nuevo + preview Tailscale + integración a main. `pnpm build` 7 apps OK tras restaurar `imgCrop`/pools, `check:site` 7 roots OK, preview `0.0.0.0:4321` 200 en `100.118.213.19`. Se integra a `main` para seguir desde ahí.
