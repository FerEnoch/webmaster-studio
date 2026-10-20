# Reanudar — webmaster-studio

**Último estado: 2026-10-20, sesión cerrada.** Rama `feature/webmaster-studio-estrategia`, 18 commits, **sin pushear**. Worktree limpio.

## Qué está hecho

- Investigación + plan + firma: `reporte-local/01..08` (leer `08` para el estado final).
- Feature doc canónico: `odd/tasks/webmaster-studio.md` (Specs S1-S9, Tasks T1-T17, Log L1-L19).
- 8 apps Astro en `apps/wm-*` + kit compartido en `packages/webmaster-kit/` + scaffolder `scripts/new-app.mjs`.
- pnpm 12.11.2 con supply-chain endurecido (`pnpm-workspace.yaml`, `.npmrc`).
- Verificado: 8/8 `astro check` 0 errores, 57 HTML, `pnpm audit` limpio, 9/9 apps Next legacy sin regresión, probe de forms 8/8 (`.odd/probe-forms.mjs`).

## Decisiones pendientes (L19)

1. **Vercel**: Hobby es "personal, no comercial" → para clientes reales avisar Pro ($20/mes) o Cloudflare. Los `demoUrl` (`wm-<slug>.vercel.app`) son placeholders.
2. **Legacy**: ¿las 9 apps Next se archivan o quedan como benchmarks?
3. **Firma A (ticket)**: ¿te representa? ¿Cerramos los 7 rubros?
4. **Push**: la rama está sin pushear; el remoto `origin` es el repo de otro autor, NO pushear sin autorización explícita.

## Para retomar

```bash
cd /home/ferenoch/Projects/mis_proyectos/webmaster-studio
git switch feature/webmaster-studio-estrategia
git log --oneline -5
```

- Reanudar una feature: `mem_context` → `mem_search` project `webmaster-studio` → leer `odd/tasks/webmaster-studio.md` completo (hasta `## Log`).
- Estado en memoria: topic `odd/webmaster-studio/tasks` (observación 1349, pinneada).

## Opciones para el próximo paso

- **A. Deploy** de las 8 apps a Vercel (8 proyectos, Root Directory = `apps/wm-<slug>`) + portfolio madre con los links reales. Requiere autorización explícita parapushear y para tocar Vercel.
- **B. Ajustar demos** antes de deployar: cambiar paleta/rubro/texto de alguna app concreta.
- **C. Medir**: deploy + 2 semanas de clicks de WhatsApp/reservas por rubro → ajustar el pricing de `reporte-local/05-plan-negocios.md`.
- **D. Sumar un rubro** con el scaffolder: `node scripts/new-app.mjs wm-<rubro>` → contenido → `pnpm --filter wm-<rubro> run check && run build`.

## Trampas ya pisadas (no repetirlas)

- El Task tool NO lee el `opencode.json` del repo: para subagentes con modelo del repo usar `opencode run --dir <repo> --agent <ag>` (el repo necesita `"mode": "primary"`).
- Permisos "ask" del config global matan al worker en ejecución no interactiva: `rm`, `external_directory`, `~/.playwright-cli` están permitidos SOLO en el `opencode.json` del repo.
- `pnpm install` concurrente rompe el lockfile (prefer-frozen-lockfile): el parent crea los esqueletos y corre UN install antes de lanzar writers en paralelo.
- Astro 7: `astro preview` es daemon (`astro preview stop`); sin `transition:persist` la cortina se recrea en el swap; sin importar el CSS global el build sale sin estilos y no avisa.
- `minimumReleaseAge` + `minimumReleaseAgeStrict` NO hace fallback: falla `ERR_PNPM_NO_MATURE_MATCHING_VERSION` → los rangos deben apuntar a la última versión con más de 3 días.
- El `ClientRouter` de Astro 7 intercepta los `submit` en fase de burbuja sobre `document` y resetea los forms: los listeners de demo van en FASE DE CAPTURA (`true` como 3er argumento).
