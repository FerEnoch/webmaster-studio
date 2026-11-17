# Deploy the tested site to Cloudflare Pages

GitHub Actions is the only build/release owner. It selectively compiles apps,
checks the complete site and runs browser checks, then uploads the **same tested
complete `dist/`** with pinned Wrangler. Cloudflare's native Git automatic builds
must be disabled; a linked Pages project does not wait for unrelated GitHub checks.
No account, repository, DNS or deployment is created by this configuration alone.

## Setup checklist

1. Prepare the public repository `ferenoch/webmaster-studio`, with `main` as the
   default branch. The public snapshot contains source and useful docs, not local
   planning/research material or build caches. Enabling Actions alone runs CI.
2. Choose one Pages connection path:
   - **New project:** create a Pages **Direct Upload** project through the
     Cloudflare dashboard, with production branch `main`. No native build command
     is needed: Actions supplies `dist/`. Choose `webmaster-studio` if available,
     otherwise use the assigned project name and its corresponding origin.
   - **Existing Git-linked project:** keep the project, but disable automatic
     production deployments and set automatic preview deployments to **None** in
     its Builds & deployments settings. Wrangler can upload to this existing
     project. Do not leave native automatic builds running alongside Actions.
3. In GitHub repository **Settings → Secrets and variables → Actions → Variables**,
   configure the repository-level variables below. Keep origin/project settings
   at repository level so check and deploy jobs see the same values; do not shadow
   them with different environment values.
4. Protect `main`: require PRs and the status check **Build, routes and browsers**
   from the **CI** workflow. Do not require **Deploy production** as a merge check:
   it intentionally skips on PRs and when disconnected. Require up-to-date checks
   and restrict bypasses according to repository ownership.
5. Create GitHub environment **production**. Restrict deployment branches to
   `main`, add a required reviewer where the repository plan supports it, and add
   the two environment secrets below. Never put plaintext credentials in source,
   workflow YAML, shell history examples or build variables.
6. Leave deploy disabled until the project/account are connected and checks pass.
   Then set `CLOUDFLARE_DEPLOY_ENABLED=true`, dispatch **CI** on current `main`,
   approve production if required, and inspect the actual upload result. A skipped
   job is **not published**. Verify `/`, `/demos/`, demo nested routes and real 404s
   on the Pages URL before adding a custom domain.

| Kind | Name | Value / purpose |
| --- | --- | --- |
| Repository variable | `CLOUDFLARE_DEPLOY_ENABLED` | Exact string `true` enables production; unset/`false` skips it |
| Repository variable | `CLOUDFLARE_PAGES_PROJECT` | Existing Pages project name, normally `webmaster-studio` |
| Repository variable | `PUBLIC_SITE_URL` | Canonical origin, normally `https://webmaster-studio.pages.dev` |
| Production secret | `CLOUDFLARE_ACCOUNT_ID` | Account containing that Pages project |
| Production secret | `CLOUDFLARE_API_TOKEN` | Account-scoped token with **Account → Cloudflare Pages → Edit** for only that account |

The token does not need DNS/Workers administration or global API-key access for
this static Pages upload. Protect and rotate it through Cloudflare/GitHub, never
through committed files. GitHub token permission is only `contents: read`; there
is no `id-token: write`, repository write permission, or PR access to Cloudflare
secrets. Deploy secrets are exposed only to the final protected upload step,
not dependency installation. No `pull_request_target` or `workflow_run` promotion
of untrusted artifacts is used.

## What CI actually runs

`.github/workflows/ci.yml` handles `pull_request`, pushes to `main`, and manual
`workflow_dispatch`. Job **Build, routes and browsers** installs Node from
`.node-version` (22.22.0), pnpm from `packageManager` (12.11.2), then runs:

```sh
pnpm install --frozen-lockfile
pnpm audit --audit-level high
node --test scripts/*.test.mjs
pnpm test:e2e:selection
pnpm build --check
pnpm check:site
pnpm exec playwright install chromium
pnpm test:e2e
```

A cache restore occurs before build, not between build and E2E. Normal PR/main
runs use `E2E_SCOPE=affected`; a manual dispatch uses `E2E_SCOPE=all`, providing a
full integration baseline even with warm outputs. Cold caches build/check all
apps; missing/invalid browser selection reports fall back to all. A valid warm
no-op explicitly skips app tests and retains the scope inventory tests. This is
not full render coverage. External media/fonts are blocked and not verified;
see [E2E scope and diagnostics](e2e.md).

Only `.build-cache/outputs` is cached. Keys use runner OS/architecture and a
main-only prefix, plus commit/run/attempt for immutable snapshots; per-app
fingerprints handle dependency/toolchain/origin changes. Only successful main
runs save outputs, after static/browser gates. PRs may restore default-main
outputs but never save this app cache. GitHub cache ref scoping prevents PR/fork
merge-ref caches from being read by main, even if a PR edits a workflow to use a
main-looking key. Do not replace this with cross-run PR artifact promotion or a
privileged cache-writing workflow. The fresh build report is never restored:
its hidden metadata is separate from deployed `dist/`.

A single main concurrency group serializes checks through publication; active
main runs are not cancelled mid-upload. Superseded PR checks are cancelled.
Because pending GitHub runs can be reordered, deploy checks current main's SHA
immediately before upload and fails stale runs rather than publishing them.

## Production gate and artifacts

Job **Deploy production** requires successful same-run checks, current `main`, a
push or manual dispatch, and the explicit enable variable. It uses environment
`production`, downloads only this run/attempt's `tested-site-*` artifact and runs:

```sh
pnpm exec wrangler pages deploy dist --project-name "$CLOUDFLARE_PAGES_PROJECT" --branch main
```

Wrangler is an exact root devDependency **4.161.0**, installed with the frozen
lockfile, not fetched with a floating CLI/action version. All workflow actions
are pinned to verified immutable commits with release comments. Keep those pins
and the lockfile under review when upgrading.

Once enabled, absent credentials, project or explicit origin fail with
`Missing required deployment setting: ...`; an origin different from the tested
artifact also fails. The default origin allows disconnected CI, but production
requires explicit `PUBLIC_SITE_URL`. Use that same HTTP(S) origin for local build
and checker; no path, query, fragment or credentials are allowed. An intentional
origin change (including adding a custom domain) invalidates required cached apps
and must pass a new build/check cycle. Navigation remains relative to the current
preview/production origin.

| Artifact | Uploaded when | Retention |
| --- | --- | --- |
| `tested-site-<run>-<attempt>` | After successful route/browser checks; exactly `dist/`, including static hidden files | 7 days |
| `diagnostics-<run>-<attempt>` | Always attempted, including failure; browser reports/traces/screenshots/scope plus `.build-cache/build-report.json` when available | 14 days |

Browser evidence lives under the runner's external temp directory, not the
checkout. Missing diagnostics before build/browser execution produce a warning;
missing tested-site files fail the check. Download artifacts from the run's
Actions page; interpret skips using the report, not a green badge alone. The
deploy job installs the CLI but never recompiles or modifies the tested site.

## Troubleshooting and rollback

- **Deployment skipped:** confirm repository enable variable is exactly `true`
  and the event/ref is eligible. Missing credentials are not silently ignored
  once deployment is enabled. Inspect environment approval/branch restrictions.
- **Install blocked:** keep quarantine, trust policy and `strictDepBuilds` intact.
  The exact `workerd@1.20261110.1` script approval selects and checks the matching
  official platform binary. Keep optional dependencies installed; if that binary
  is missing, investigate rather than approving its npm/download fallback or
  disabling script policy. pnpm 12's `ignore-scripts` config query may be undefined;
  the explicit allowBuilds/strictDepBuilds policy remains authoritative.
- **Browser launch fails on Linux:** inspect runner libraries. CI pins
  `ubuntu-24.04` and downloads Chromium only; it does not silently install OS
  packages or switch to an arbitrary system browser.
- **Unexpected full rebuild:** check cold/evicted cache, Node/dependency/shared
  config changes, output integrity and canonical origin. Fingerprints, not Git
  path filters, determine work. See [build contract](builds.md).
- **Stale deployment refused:** dispatch CI on current `main`, not an old run.
- **Wrong production routes:** confirm native builds are disabled, output is the
  complete `dist/`, and a root `404.html` prevents SPA fallback. Never upload an
  individual app output to replace the entire site.
- **Rollback:** with account authority, select a previously successful complete
  production deployment in Pages and use its dashboard rollback action. Verify
  root/catalogue/demo/nested routes and 404s, then fix/revert source through a new
  checked main change. No automatic destructive rollback is configured. Do not
  rebuild or splice old individual demos into an allegedly tested artifact.

Local YAML/structural tests cannot prove GitHub event dispatch, cache service
scoping in a live run, protected-environment approval, runner browser libraries,
Cloudflare credentials or actual Pages upload/serving. Record the first remote
run and live-route evidence after setup; do not infer it from local test results.

References: [Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/),
[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/),
[GitHub cache restrictions](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#restrictions-for-accessing-a-cache).
