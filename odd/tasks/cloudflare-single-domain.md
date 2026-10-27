# Cloudflare single-domain deployment
Serve the existing portfolio and seven Astro demos as one static Cloudflare Pages deployment; preserve design and local per-app development.
Branch: `feat/cloudflare-single-domain`; base: `59e1039`; delivery: `auto-chain`, `chain_strategy=stacked-to-main`; verified destination: `origin/main` (local symbolic ref); forecast: approximately 900 authored diff lines excluding generated output. Runners: Node test runner, pnpm Astro checks/builds, available browser tooling.

## Specs

### S1 — Iteration and previews
> vamos a hacer un repo público para deployar este sitio y todos los subsitios. Me recomendas vercel free tier, o github pages, u otro lado? Necesito iteración, velocidad y previews

Acceptance from the approved brief: one local deployable static output, one Cloudflare Pages project, branch/PR previews containing the portfolio and all seven demos on the same origin. Remote repository publication, Cloudflare account changes and DNS changes are not authorized by this implementation.

### S2 — Cloudflare under one domain
> Vamos a utilizar Cloudflare y hacer los cambios necesarios para que el proyecto se sirva de acuerdo a tu recomendación de "bajo un solo dominio". Explícame un brief de los cambios a implementar antes de hacerlo:

Approved brief's routing: portfolio at `/`; existing demo catalogue at `/demos/`; demo apps at `/demos/clinica/`, `/demos/concesionario/`, `/demos/lavadero/`, `/demos/estetica/`, `/demos/universidad/`, `/demos/inmobiliaria/`, and `/demos/arquitectura/`, including nested pages. Keep the eight Astro apps separate; isolate their built assets; fix base-aware navigation, anchors, menu selection and metadata; use same-origin links between apps; ensure cross-app navigation does not mix client-router state; generate a real static 404 rather than SPA fallback. Keep canonical kit, copied app helpers/components and future scaffolding consistent. Preserve existing per-app commands and design, and provide an integrated local preview. A failed app build must fail the aggregate build. No SSR/backend, real form submission, media hosting migration or dependency upgrades.

### S3 — Implementation approval
> Metele con todo

Implement the brief already presented in this conversation. Update operational documentation with the aggregate build/preview commands, pinned Node/pnpm, frozen-lockfile install, production URL configuration, Pages output directory, production/preview branch settings, and later custom-domain setup. Run focused regression tests, all eight Astro checks/builds, direct-route/static-link checks and available functional browser checks. Remote preview proof is explicitly deferred until the user connects/publishes the repository; do not claim a live deployment.

### S4 — Delegation and context
> Utiliza subagentes para lo que necesites y mejor manejo del contexto

Use a bounded writer for this cohesive deployment change (measured context-backstop trigger), then independent verification because deployment/environment changes are Risk item 5; shared routing also warrants attention to item 3. Parent owns tracking, risk assessment, review and work-unit commits. Workers must not commit, push or publish.

## Tasks
- T1 | S1–S4 | delegated writer (context backstop; one cohesive deployment behavior) | done | Routes, aggregate build/preview/checker, kit/template/scaffolder and docs implemented with RED/GREEN and self-review. Shim incident self-healed; scaffolder invalid-origin preflight already enforced by committed test. Parent re-ran core checks GREEN | commit: 7a5f7c5 (slice 1/2 routing; boundary L11).
- T2 | S1–S4 | parent inline (independent verifier not admitted; focused suite run inline) | done | Verified actual diff via public commands: node tests 17/17, 8/8 Astro checks, aggregate build + check-site GREEN, preview smoke 200/404, zero vercel.app in dist/, diff-check clean | commit: covered by slices 7a5f7c5 + be2d42c.
- T3 | S1–S4 | parent inline | done | Evidence recorded, work-unit commits created, native assess run (medium, review not due); local readiness reported, remote setup left to user | commit: 7a5f7c5 + be2d42c + 39caf7f + this close-out.

## Log
- L1 — Original request verbatim: "vamos a hacer un repo público para deployar este sitio y todos los subsitios. Me recomendas vercel free tier, o github pages, u otro lado? Necesito iteración, velocidad y previews"
- L2 — User selected Cloudflare and requested a brief verbatim: "Vamos a utilizar Cloudflare y hacer los cambios necesarios para que el proyecto se sirva de acuerdo a tu recomendación de \"bajo un solo dominio\". Explícame un brief de los cambios a implementar antes de hacerlo:"
- L3 — Approved brief: preserve eight static Astro apps, publish portfolio at root and demos under `/demos/<slug>/`, correct links/assets/active menus and cross-app transitions, combine outputs in root `dist/`, keep per-app development, update canonical kit and scaffolder, document one Pages project and preview workflow, validate routes/404s/browser behavior. No design/backend/media migration; remote publication and account setup remain separate.
- L4 — Implementation approval verbatim: "Metele con todo"
- L5 — Delegation request verbatim: "Utiliza subagentes para lo que necesites y mejor manejo del contexto"
- L6 — 2026-10-27 baseline: clean worktree on existing feature branch, HEAD `59e1039`; review mode on (global). Existing evidence: eight independent Astro build outputs, root-absolute demo links, external vercel.app demo URLs, canonical kit copied into apps. A previous read-only explorer was unavailable; no retry of that failed exploration. Implementation writer will perform its own necessary reads.
- L7 — Delivery forecast approximately 900 authored changed lines because existing copies of shared navigation and content need coordinated base handling plus public-interface tests and docs. The roughly 400-line work-unit heuristic is advisory, not permission to omit tests or compress code. No push, PR creation or merge is authorized.
- L9 — 2026-10-27 parent checks on final candidate: `node --test scripts/*.test.mjs` 17/17 pass; `pnpm -r run check` exit 0 with 8/8 apps 0 errors; `pnpm build` (`node scripts/build-site.mjs`) exit 0 `Built 8 apps into dist/`; `node scripts/check-site.mjs` exit 0 `Checked 8 roots, 57 pages, 51 JS/CSS assets and 1574 links/anchors; canonical origin https://webmaster-studio.pages.dev; unknown routes return 404`; `git diff --check` clean; preview smoke 200 on `/`, `/demos/`, `/demos/clinica/`, `/demos/clinica/estudios/`, 404 on unknown, same-origin demo links; integrated `dist/` has zero `vercel.app` refs with correct `/demos/<slug>/_astro` isolation and `data-astro-reload` portfolio boundary. Stale ignored `apps/*/dist` leftovers are not part of the deployable output. No browser runner available in parent; hydration/browser flow left to independent verifier within existing bounds.
- L12 — Slice 2/2 committed as be2d42c `feat(deploy): unified Cloudflare Pages build, preview and docs` (14 files: aggregate scripts, deployment tests, package scripts, node/pnpm pin, wrangler, docs, workspace test, this file). Worktree clean. Native assess on base-diff 59e1039: risk medium, nativeRisk medium, reviewDue false (under_budget), writer self-verification stands, no separate verifier. No push/PR/merge.
- L11 — Slice 1/2 committed as 7a5f7c5 `feat(deploy): base-aware routing for single-domain Cloudflare Pages` (127 files: site-config, kit urls/components/template, per-app configs/helpers/pages/layouts/components, per-app 404s, scaffolder). Slice 2/2 committed as be2d42c; docs close-out as 39caf7f. Stacked-to-main chain on the same branch; no push/PR/merge.
- L10 — Independent verifier launch refused by policy (no admitted Risk line); parent completed T2 inline with focused suite. No retry, no invented Risk line. T3 commits proceed on feat/cloudflare-single-domain with no push/PR/merge.
- L8 — User selected "Cadena hacia la rama principal verificada" (`stacked-to-main`). Verified local `refs/remotes/origin/HEAD` resolves to `origin/main`; origin is `https://github.com/maurid2000/estudio-webs`. Created isolated feature branch `feat/cloudflare-single-domain` at `59e1039`. Plan cohesive work-unit commits with tests/docs together; do not force artificial slices if no independently valid split exists. Local runtime is Node v25.5.0 with pnpm 12.11.2; document the required supported Node version separately.
