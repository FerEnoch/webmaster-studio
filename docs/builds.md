# Production builds and per-app reuse

`pnpm build` always publishes one **complete** `dist/`: the portfolio at `/`,
its catalogue at `/demos/`, and every registered demo at `/demos/<slug>/`.
Cloudflare Pages must deploy that complete artifact, never an app's standalone
output. `PUBLIC_SITE_URL` selects the canonical HTTP(S) origin (default:
`https://webmaster-studio.pages.dev`); paths, credentials, queries and fragments
are rejected before any build/cache writes.

## Commands

- `pnpm build`: build missing/changed apps, reuse verified matching outputs, and
  assemble/atomically replace the full deployment. Cold cache builds all apps.
- `pnpm build --check`: first run the app's Astro `check` on each affected app;
  any check/build failure leaves the previous complete `dist/` and report intact.
- `pnpm check:site`: check **all** published routes, links, canonicals, isolated
  assets and 404s using a temporary production-shaped loopback server. It remains
  exhaustive even when compilation is selective.
- `pnpm preview [-- --host 0.0.0.0 --port 4321]`: serve the integrated output;
  unknown routes return real 404 responses, not an SPA fallback.
- `pnpm build:apps` and per-app `pnpm run build:<id>` aliases remain standalone
  development tools; they do not publish an integrated Pages artifact.
- `node scripts/build-site.mjs --help` describes the production build interface.

## Cache and CI/E2E report

`.build-cache/outputs/<sha256>/` holds non-executable static app artifacts;
matching sibling JSON metadata records their SHA-256 content digest. Reuse checks
**all** paths and file bytes, rejects symlinks, and never imports/executes cached
code. Missing/malformed metadata, missing output or corrupted bytes rebuild the
app. The cache is acceleration, not authority: restore it opportunistically in
CI, and never deploy it directly. Keep `.build-cache/` out of the public snapshot
and git (repository hygiene is managed separately).

After each successful complete build, `.build-cache/build-report.json` is replaced
with UTF-8 JSON. Failed/rejected builds leave the last successful report unchanged;
CI must require a successful build exit before consuming it. Schema version 1:

```json
{
  "version": 1,
  "origin": "https://webmaster-studio.pages.dev",
  "built": ["estetica"],
  "reused": ["portfolio"],
  "affected": ["estetica"],
  "apps": [
    { "id": "estetica", "name": "wm-estetica", "base": "/demos/estetica/", "fingerprint": "<sha256>" },
    { "id": "portfolio", "name": "wm-portfolio", "base": "/", "fingerprint": "<sha256>" }
  ]
}
```

The example is abbreviated; `apps` and the union of `built`/`reused` contain
**every current APPS entry**, in registry order. IDs omit `wm-`. `affected` equals
`built`: an input change or an unavailable/unverifiable artifact requires work.
A branch reversion may reuse an older verified fingerprint. Consumers can select
browser coverage from these arrays, but must still validate/deploy the complete
`dist/`. Warm no-op builds report `built: []` and reuse every app.

Keys hash current app source/config/public files (including additions, deletions
and renames), directly imported relative shared source, the app route/base,
canonical origin, Node version/platform/architecture, root dependency/toolchain
settings, root build configs, production build helpers and dependency resolution.
No git-diff assumption is involved. Markdown, docs/internal metadata, generated
`.astro`/`dist`, and dependency directories do not affect app keys. Environment
files are not read. Build-time environment inputs other than the documented
origin are unsupported; add any future build-affecting environment variable to
the fingerprint contract before using it in source/config.

For the generated pnpm v9 lock format, each app hashes its importer and reachable
snapshot/package records, including transitive versions, optional/peer resolution
and integrity, plus root tooling/importer settings. Adding an unrelated importer
therefore does not invalidate existing apps. Unknown lock layouts or exotic/link
resolutions conservatively hash the whole lockfile. No YAML/parser dependency was
added. Root shared config changes invalidate all apps; imported shared source
changes invalidate its consumers. Shared modules must use explicit relative imports
(including re-exports); introduce a corresponding key input if adding aliases or
runtime filesystem reads of shared material. Per-app local aliases remain covered
by hashing the whole app input tree.

## Add or remove a demo

1. `node scripts/new-app.mjs --help` lists canonical registered apps/ports.
   `node scripts/new-app.mjs <id> --port <n> --dry-run` previews a new scaffold;
   remove `--dry-run` to copy from the kit, without overwriting existing work.
2. Author the demo and add its family/variant to the canonical registry
   `packages/webmaster-kit/rubros.ts` (see [catalogue](catalogue.md)). APPS drives
   build targets and routes; a folder alone is not a deployment target. Register
   a unique port and `/demos/<slug>/` URL. Do not edit a separate build list.
3. Run `pnpm install --frozen-lockfile` once the committed lock is in sync; when
   adding the importer locally, intentionally update the lock using the pinned
   pnpm version, then commit it with the demo. Never loosen CI frozen installs.
4. Add convenient root dev/build aliases and README documentation for the new
   demo as appropriate. Workspace tests discover targets from APPS, not a fixed
   number or slug list. The scaffolder does not edit the registry, lock or README.
5. `pnpm build --check` compiles the new app and catalogue; unchanged demo
   snapshots are **not** bulk-synchronized with the canonical registry.
   `pnpm check:site` validates all integrated paths.

Removing an APPS entry removes its routes on the next complete assembly, even if
an old cached artifact remains. The portfolio's canonical re-export means a
catalogue edit rebuilds the portfolio but not unrelated demos. Cached historical
entries may be evicted externally; their absence only causes fresh builds.
