# Demo catalogue and industry families

`packages/webmaster-kit/rubros.ts` is the canonical catalogue. Its historical
exports (`RUBROS`, `APPS`, `getRubro`, `requireRubro`, `PORTFOLIO`) remain available.
Despite the historical name, each `RUBROS` entry describes **one demo**, not one
industry. The portfolio re-exports this registry from `src/lib/rubros.ts`.

## Identity and ordering

- `id` identifies a demo and its `wm-<id>` app. Keep IDs, slugs, ports and
  `demoUrl` values unique. Existing demo URLs stay `/demos/<id>/`.
- `rubroId` is the stable industry/family identifier. For example, `lavadero`
  and `lavadero-premium` both have `rubroId: "lavadero"`; the architecture pair
  both use `rubroId: "arquitectura"`. Do not infer a family from a name or suffix.
- `rubro` is descriptive Spanish copy, not an identifier. Changing copy must not
  change grouping. Reserve `todos` for the unfiltered view, not a demo/family ID.
- A demo ID must not equal a different family's ID: family links intentionally
  also accept the base demo ID. `portfolio` is not a demo/family.
- `RUBROS` retains card order. `APPS` derives the same ordered demos and appends
  the portfolio; it does not collapse families into one build target.

`getRubroGroups(demos = RUBROS)` returns `{ id, nombre, accent, demos }[]` with
one group per `rubroId`, ordered by first appearance. Each group's demos keep
catalogue order. Family display names are overridden only inside the grouping
helper: `concesionario` → **Concesionarios**, `lavadero` → **Multiservicios**,
`estetica` → **Estética**, `universidad` → **Institucional y educativo**, and
`arquitectura` → **Estudios profesionales**. `locales-y-tiendas` → **Locales y tiendas**. **Inmobiliaria** stays unchanged.
Demo names and public `RUBROS`/`APPS` metadata retain their existing values.
For other families, chip copy comes from the same-ID base demo when present,
otherwise the first demo in that family; accent follows that same base lookup.
There is no separate membership list. The helpers do not mutate the catalogue.

The studio catalogue explains that demos will be added to each category to show
both standard and premium service options. This describes future growth, not a
claim that every family already has a premium demo.

## Filters and links

The portfolio renders one card per demo and one chip per family. Its existing
`data-wm-rubro-card` holds the demo ID; `data-wm-rubro-grupo` holds `rubroId`
for **every** card, including base demos. Cards keep the existing layout,
`.is-out` visibility behavior, `aria-hidden` and live result announcements.
Without JavaScript all demos remain visible.

- `/demos/?rubro=lavadero` shows both lavadero variants.
- `/demos/?rubro=arquitectura` shows both architecture variants.
- `/demos/?rubro=inmobiliaria` shows the original Inmobiliaria and Estudio Real
  State. Their demo paths are `/demos/inmobiliaria/` and
  `/demos/inmobiliaria-premium/`; `/demos/?rubro=inmobiliaria-premium` filters
  to the premium card only.
- `/demos/?rubro=locales-y-tiendas` shows the Telar and TRAMA cards together.
  `/demos/?rubro=locales-catalogo` and `/demos/?rubro=tiendas-ecommerce` show the
  corresponding card only. Telar is browse-only; TRAMA has a local checkout
  with separate Mercado Pago and MODO simulations, not a payment integration.
- Historical `/demos/?rubro=lavadero-premium` and
  `/demos/?rubro=arquitectura-premium` still show just that variant. The family
  chip is selected; clicking it shows the complete family and updates the query.
- `resolveRubroFilter(requested, demos = RUBROS)` accepts family IDs and demo
  IDs. Missing/unknown values fall back to `todos`. The existing URL handler
  removes `rubro` for that fallback, preserving other query parameters/fragments.
- `matchesRubroFilter({ id, rubroId }, filter)` matches all, a family or an exact
  demo. Resolve untrusted query values before matching.

Demo links retain `data-astro-reload` and their catalogue `demoUrl`; these are
cross-app URLs, so do not run them through `appUrl()`. Use the existing
`appUrl()` helper only for app-local paths. Build base paths are unchanged.

Integrated demos show **Ir a Webmaster Studio** as a display-type utility link
with an outbound cue outside the main navigation. It stays visible on mobile,
uses the real root `href="/"` and `data-astro-reload`, and does not replace demo
navigation or contact controls. Standalone demos and the studio omit this link.

## Adding another demo

1. Create its independent app using the existing scaffolding workflow and add
   content/routes in that app. Choose an unused demo ID, slug and port.
2. Add its full demo entry to canonical `RUBROS`. For another aesthetics demo,
   for example, use `id: "estetica-premium"`, `rubroId: "estetica"`,
   `slug: "estetica-premium"`, `demoUrl: "/demos/estetica-premium/"` and an
   unused port. Keep its own name, palette and content. `APPS`, the portfolio
   cards and the existing family's single chip derive automatically.
3. Add the root dev/build aliases and the app's deployment configuration using
   existing repository conventions. These are app integration steps, not new
   catalogue/group lists.
4. Portfolio-specific copy/images live in
   `apps/wm-portfolio/src/content/portfolio.ts`. Add three to five capabilities
   for each demo. Provide a distinct cover when it helps distinguish the demo;
   without a demo-specific cover the card uses the family image. A new family
   gets a chip without filter code changes.
5. Do **not** sync the canonical registry, types or UI into every existing app.
   Their copied registries are local content snapshots, not catalogue listings;
   leave custom demo content and components intact. A new app can receive the
   current snapshot through the existing scaffolder.

## Build and browser integration contract

For selective builds, distinguish app content from catalogue consumers. A
registry change affects the portfolio listing and build metadata, not the
source snapshots of unrelated demos. The build layer must still account for
actual shared dependencies (including `site-config.mjs`) and output changes;
this catalogue alone does not implement cache invalidation or selective builds.
Keep app-level identity in `APPS`/`getRubro`, never build only one app per family.

The previous byte-equality assertion between **all** app registries and the
canonical registry is no longer valid. Build tests should instead verify the
portfolio's canonical exports, stable app URLs/bases and isolated app snapshots;
do not restore equality by overwriting demo sources or customized kit UI.

Browser coverage verifies seven family chips plus “Todas”, eleven cards,
two results for each lavadero/real-estate/architecture/apparel family, one result for each premium
deep link, unknown-filter fallback, URL preservation, live announcements and
navigation to the original demo routes. Appended variants must be discoverable
through their `rubroId` without changing a hardcoded alias table. Deterministic
helper coverage runs with `node --test scripts/catalogue.test.mjs`.
