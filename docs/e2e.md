# Production browser checks

Use the root's pinned pnpm 12.11.2 with Node >=22.22 (TypeScript registry imports
use Node's native type stripping). `@playwright/test`, `playwright` and
`playwright-core` are locked to **1.58.2**, with Chromium 145.0.7632.6 (revision
1208). No browser, OS package or sudo installation happens during a test run.

## Local and CI baseline

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
node --test scripts/*.test.mjs
pnpm test:e2e:selection
pnpm build
pnpm check:site
pnpm exec playwright test
```

`pnpm test:e2e` is an alias for the last command. Build the integrated production
`dist/` first, not individual dev servers. The default `E2E_SCOPE=all` ignores
build-report selectivity: every discovered HTML page is tested on both desktop
Chrome (1280×720) and mobile Chromium (Pixel 7, 412×839). A new app in canonical
`APPS` and its emitted HTML routes need no E2E route-list edit. `404.html` (and
`404/index.html`) are error documents, not ordinary successful routes.

Playwright starts **its own** `scripts/preview-site.mjs` on `127.0.0.1:4173` and
stops it afterward. Existing listeners are never reused: a busy port fails
instead of silently testing somebody else's server. It does not build `dist/`.
Two workers, no retries, 30-second tests, 15-second navigation/server timeouts,
8-second assertions/actions and a 10-minute suite limit bound execution.

The suite verifies HTTP 200 and HTML, direct navigation **and reload**, visible
main/heading content, lazy-visible island hydration, same-origin emitted JS/CSS
status/MIME and request failures, uncaught JavaScript, per-app asset bases and
cross-app full-navigation boundaries. Every selected app also gets real missing
page and missing-script 404 checks. Catalogue flows use hydrated React controls:
derived family chips, counts/visibility/ARIA announcements, all-results reset,
family and historical premium deep links, reload, unknown fallback, preserved
query/hash state, and actual premium-card navigation. The financing demo changes
its term and verifies that payments change and restore, without submitting any
form or contacting WhatsApp.

### Explicit offline scope

All external requests are blocked; images, video, fonts and the Google Fonts
stylesheet are **non-gating**. Their resource types/origins are recorded in each
browser test's `browser-scope` attachment. This is not a visual/media availability
check. Unexpected external scripts, APIs or documents fail; same-origin scripts,
styles and all uncaught JS errors always gate. No local resource error is masked.
There are no arbitrary sleeps, network-idle waits or screenshot baselines.

## Optional affected-only CI step

```sh
E2E_SCOPE=affected pnpm exec playwright test
```

Opt in only after the **last successful complete build** in the same job. The
version-1 `.build-cache/build-report.json` must describe the complete current
registry (IDs, names, bases and fingerprints), with unique known IDs, a complete
disjoint built/reused partition and `affected == built`. Missing, unreadable,
malformed or registry-mismatched reports fall back to **all**, never zero tests.
Invalid scope values fail. Do not restore a standalone stale report from another
artifact or run a second warm build before selection: the report is the build
layer's last-successful-build contract, not a git diff or deployment history.

Only the affected apps' route/404/interaction tests run. Unchanged cases remain
explicit Playwright skips. A valid warm no-op may skip all app tests; two scope
inventory tests still pass and print/attach selected apps, skipped apps, route
lists/counts and the reason. This is an intentional no-op, **not full browser
coverage**. Keep a default all-route baseline for integration/periodic checks.
The deterministic selection policy has six Node tests via
`pnpm test:e2e:selection`; run them in CI as well as the existing script suite.

## Artifacts and diagnosis

By default a fresh system temp directory `webmaster-e2e-*` holds each run's
`results/` and HTML `report/`; the exact absolute path is printed. No tool output
or cache is written into the checkout. CI can choose a fresh external path with
`E2E_ARTIFACT_DIR` (for example under `$RUNNER_TEMP`) and upload it even on failure.
Preserve `report/`, `results/**/trace.zip`, `test-failed-*.png`, `error-context.md`
and scope attachments. Remove the temporary artifact directory after collecting
it; failed runs deliberately retain their evidence.

```sh
pnpm exec playwright show-report /absolute/artifact/path/report
pnpm exec playwright show-trace /absolute/artifact/path/results/test-name/trace.zip
```

CI must provide Linux libraries required by Chromium in its runner image; use the
explicit browser download above, not an unreviewed dependency/OS install fallback.
The normal pnpm quarantine, trust and build-script gates remain enabled. A browser
cache must match the locked Playwright revision, not an arbitrary system Chrome.
