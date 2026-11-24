# Estudio Real State — premium standalone demo

Faithful Astro storefront port of the supplied Next.js reference. It keeps the five-frame scroll narrative, editorial catalog, eight exact property slugs, illustrated map, deep-linked filters, sorting, carousel, and browser-local favorites. The visible brand is **Estudio Real State**.

## Scope

- Static Astro output at `/` for standalone development, or at the registered `/demos/inmobiliaria-premium/` base when `WM_DEPLOYMENT=1`.
- React is limited to interactive islands such as the hero, catalog, favorites, galleries, room tour, site plan and simulators. Navigation, listing copy and the initial view of the photo tour and site plan are server-rendered.
- No Next.js, Motion, Lenis, external maps, remote image URLs, form transport, real contact data, or new workspace package.
- The illustrated room tour follows an ordered route through fixed photos. Visitors can pick a stop, move with the keyboard, or opt into guided playback. It is not a floor plan or a 360° view.
- The homepage and property details share a lazily loaded Three.js scale model with pointer and keyboard camera controls. The north-up SVG shows street, frontage and depth and stays available both as a selectable view and as a fallback before hydration or if WebGL2 fails. Both views use the same approximate solar position, hour, season and conceptual footprint. Neither view is a survey, measured building height or site-specific calculation.
- Calculators, visit scheduling and valuation are local simulations.
- Integrated builds use the shared site configuration: `WM_BUILD_DIR` for staged output and `PUBLIC_SITE_URL` for canonical and Open Graph URLs.

The package intentionally reuses the repository's existing Astro 7.4.0, React 19.3.1, Tailwind 4.3.3, Three.js 0.187.0, and related importer ranges. No dependency or install-script approval was added. The lockfile adds only this importer using the existing resolved package graph.

## Commands

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter wm-inmobiliaria-premium run dev
pnpm --filter wm-inmobiliaria-premium run build
pnpm --filter wm-inmobiliaria-premium run check
WM_DEPLOYMENT=1 pnpm --filter wm-inmobiliaria-premium run build
pnpm --filter wm-inmobiliaria-premium run test:e2e
```

Or, app-local after dependencies are installed and `dist/` has been built with `WM_DEPLOYMENT=1`:

```sh
cd apps/wm-inmobiliaria-premium
pnpm run test:e2e
```

The app Playwright config uses the repository-pinned `@playwright/test` 1.58.2. It starts its own foreground static server on `127.0.0.1:3033`, serves the built `dist/` at the demo base, blocks service workers, and runs the storefront and property-detail checks in isolated contexts. `PREMIUM_E2E_PORT` selects another loopback port for both the server and browser. Set `E2E_ARTIFACT_DIR` to direct reports, logs, screenshots, and load evidence outside the repository; otherwise git-ignored `.test-artifacts/` is used. There is no second test runner.

Example external-evidence run:

```sh
E2E_ARTIFACT_DIR=/tmp/estudio-real-state-evidence pnpm run test:e2e
```

The mobile evidence is Chromium **touch emulation** (`hasTouch` and `isMobile`), not a physical-device certification. Reduced motion is emulated through Playwright's `reducedMotion: "reduce"`.

## Favorites and data boundary

Favorites use only `estudio-real-state:favorites:v1` and only the eight known slugs. Invalid or foreign slugs are discarded. The legacy `umbral:favs` key and other demos are never read or changed. No property/form input is persisted or transmitted; there are no forms, analytics, contact endpoints, accounts, or real contact details in this slice.

## Local photography and provenance

`src/data/asset-manifest.json` is the authoritative app-scoped manifest for all 12 photographs / 36 responsive WebP derivatives. Each record contains:

- source item URL, creator, original-file URL, acquisition URL/date and acquisition SHA-256;
- exact license URL, attribution requirement, derivative license, and transformation disclosure;
- hero/listing/detail roles, authored hero focal coordinates, derivative dimensions, byte sizes and SHA-256 hashes.

The photographs are **verified, visually aligned Wikimedia Commons and Pexels replacements**, not exact source-reference photos. Exact-photo provenance checks did not establish reusable rights, so CDN availability was not treated as permission. `hero-villa-pool` is isolated to the fifth hero frame; the licensed `laguna-pool` derivatives remain on the Casa Laguna catalog cover and detail. Original acquisition files and provenance records stay outside the tracked app; only optimized local derivatives ship. `public/images/` has no hotlinks or originals.

`src/pages/creditos.astro` (`/demos/inmobiliaria-premium/creditos`) renders public attribution, license links, roles, sizes, and hashes. All derivatives are auto-oriented, metadata-stripped, resized without upscaling, and encoded at WebP quality 82. There are no generative edits. Photographs are illustrative and do not document real inventory.

To audit derivatives against the manifest, inspect the source page and license, download the recorded acquisition item independently, compare its SHA-256, then apply the disclosed ImageMagick operation:

```sh
magick ACQUIRED.jpg -auto-orient -strip -resize '1600x1600>' \
  -colorspace sRGB -quality 82 -define webp:method=6 OUTPUT.webp
```

Repeat at 480 and 960 pixels and compare the recorded derivative hashes. ImageMagick/WebP encoder differences can change output bytes; the acquisition hash and source item remain the stable provenance link.

## Test rules

`tests/e2e/storefront.spec.mjs` groups observable behavior into exactly four tests:

1. Visible brand, accessible five-step hero and deep-linked hero search.
2. Eight static detail URLs with meaningful content, filter/reset/sort/query persistence and map/list switching.
3. Favorite persistence, removal, malformed-slug filtering and cross-demo storage isolation.
4. Local-only images with outside requests blocked, responsive/touch fit, keyboard operation and reduced-motion content availability; desktop/touch-mobile captures and resource-size evidence.

`tests/e2e/detail-tour.spec.mjs` covers section navigation, the photo route and simulators. `tests/e2e/solar-lot.spec.mjs` covers plot geometry before hydration and solar controls at 320 px with canvas disabled. In Chromium with WebGL2 it compares drawn pixels after orbit, zoom and camera reset, checks shared state across views, and verifies deferred loading and context-loss fallback on the homepage.

`tests/static-server.mjs` is a minimal foreground static-file harness, not a test runner. It exists because the installed Astro preview command daemonizes and exits, which is incompatible with Playwright's `webServer` lifetime contract.
