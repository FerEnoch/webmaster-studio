import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

// Reuse Astro's locked YAML peer; no additional parser dependency or ad-hoc YAML parser.
const appRequire = createRequire(new URL('../apps/wm-portfolio/package.json', import.meta.url));
const { parseDocument } = createRequire(appRequire.resolve('astro/package.json'))('yaml');
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function yaml(path) {
  const document = parseDocument(read(path), { uniqueKeys: true });
  assert.deepEqual(document.errors, [], `${path}: valid YAML without duplicate keys`);
  return document.toJS();
}
const workflow = () => yaml('.github/workflows/ci.yml');
const step = (job, id) => {
  const found = job.steps.find((candidate) => candidate.id === id);
  assert.ok(found, `missing step: ${id}`);
  return found;
};

test('Wrangler is exact, workerd approval is version-bound, and security gates remain enabled', () => {
  const pkg = JSON.parse(read('package.json'));
  const policy = yaml('pnpm-workspace.yaml');
  assert.equal(pkg.devDependencies.wrangler, '4.161.0');
  assert.equal(policy.allowBuilds['workerd@1.20261110.1'], true);
  assert.equal(policy.allowBuilds.workerd, undefined);
  assert.equal(policy.strictDepBuilds, true);
  assert.equal(policy.minimumReleaseAge, 4320);
  assert.equal(policy.minimumReleaseAgeStrict, true);
  assert.equal(policy.trustPolicy, 'no-downgrade');
  assert.equal(policy.blockExoticSubdeps, true);
  assert.equal(pkg.scripts.build, 'node scripts/build-site.mjs');
  assert.equal(pkg.scripts['test:e2e'], 'playwright test');
  assert.equal(pkg.scripts['test:e2e:selection'], 'node --test tests/e2e/selection.test.mjs');
});

test('CI uses only trusted triggers, read permissions and immutable action references', () => {
  const w = workflow();
  assert.deepEqual(Object.keys(w.on).sort(), ['pull_request', 'push', 'workflow_dispatch']);
  assert.deepEqual(w.on.push.branches, ['main']);
  assert.deepEqual(w.permissions, { contents: 'read' });
  assert.match(w.concurrency.group, /github\.event\.pull_request\.number.*github\.ref/);
  assert.match(w.concurrency['cancel-in-progress'], /github\.ref != 'refs\/heads\/main'/);
  for (const job of Object.values(w.jobs)) {
    assert.equal(job['runs-on'], 'ubuntu-24.04');
    assert.ok(job['timeout-minutes'] > 0);
    for (const s of job.steps) {
      if (s.uses) assert.match(s.uses, /^[\w-]+\/[\w/-]+@[0-9a-f]{40}$/, s.uses);
      if (s.uses?.startsWith('actions/checkout@')) assert.equal(s.with['persist-credentials'], false);
    }
  }
  assert.doesNotMatch(JSON.stringify(w.jobs.checks), /secrets\.|environment/);
});

test('checks run the implemented commands in order with one build and explicit E2E scope', () => {
  const w = workflow();
  const job = w.jobs.checks;
  assert.equal(job.name, 'Build, routes and browsers');
  const setup = job.steps.find((s) => s.uses?.startsWith('actions/setup-node@'));
  assert.equal(setup.with['node-version-file'], '.node-version');
  const pnpm = job.steps.find((s) => s.uses?.startsWith('pnpm/action-setup@'));
  assert.equal(pnpm.with.run_install, false);
  assert.equal(pnpm.with.version, undefined); // action reads the exact packageManager pin
  assert.match(JSON.parse(read('package.json')).packageManager, /^pnpm@\d+\.\d+\.\d+$/);
  const commands = ['pnpm install --frozen-lockfile', 'pnpm audit --audit-level high',
    'node --test scripts/*.test.mjs', 'pnpm test:e2e:selection', 'pnpm build --check',
    'pnpm check:site', 'pnpm exec playwright install chromium', 'pnpm test:e2e'];
  const runs = job.steps.map((s) => s.run).filter(Boolean);
  let previous = -1;
  for (const command of commands) {
    const index = runs.indexOf(command);
    assert.ok(index > previous, `${command}: ordered gate`);
    previous = index;
  }
  assert.equal(runs.filter((run) => /pnpm build/.test(run)).length, 1);
  assert.match(job.env.E2E_SCOPE, /workflow_dispatch.*'all'.*'affected'/);
  assert.equal(job.env.E2E_ARTIFACT_DIR, undefined); // runner context is unavailable in job-level env
  assert.doesNotMatch(JSON.stringify(job.env), /runner\./);
  const artifactDir = job.steps.find((s) => typeof s.run === 'string' && /E2E_ARTIFACT_DIR=.*RUNNER_TEMP/.test(s.run));
  assert.ok(artifactDir, 'a step defines E2E_ARTIFACT_DIR from $RUNNER_TEMP');
  assert.match(artifactDir.run, /GITHUB_ENV/);
  assert.ok(job.steps.indexOf(artifactDir) < job.steps.indexOf(step(job, 'browsers')));
  assert.match(w.env.PUBLIC_SITE_URL, /vars\.PUBLIC_SITE_URL.*https:\/\/webmaster-studio\.pages\.dev/);
});

test('only verified main outputs seed cache; report never restores with outputs', () => {
  const job = workflow().jobs.checks;
  const restore = step(job, 'restore');
  const save = step(job, 'save');
  assert.match(restore.uses, /^actions\/cache\/restore@/);
  assert.match(save.uses, /^actions\/cache\/save@/);
  assert.equal(restore.with.path, '.build-cache/outputs');
  assert.equal(save.with.path, restore.with.path);
  assert.match(restore.with['restore-keys'], /-main-/);
  assert.match(restore.with.key, /github\.run_id.*github\.run_attempt/);
  assert.equal(save.with.key, '${{ steps.restore.outputs.cache-primary-key }}');
  assert.match(save.if, /success\(\).*github\.ref == 'refs\/heads\/main'.*github\.event_name != 'pull_request'/);
  assert.ok(job.steps.indexOf(save) > job.steps.indexOf(step(job, 'browsers')));
});

test('complete tested dist is the sole same-run deployment input; diagnostics survive failure', () => {
  const w = workflow();
  const artifact = step(w.jobs.checks, 'site');
  assert.equal(artifact.with.path, 'dist/');
  assert.equal(artifact.with['if-no-files-found'], 'error');
  assert.equal(artifact.with['retention-days'], 7);
  assert.match(artifact.with.name, /github\.run_id.*github\.run_attempt/);
  assert.ok(w.jobs.checks.steps.indexOf(artifact) > w.jobs.checks.steps.indexOf(step(w.jobs.checks, 'browsers')));
  const diagnostics = step(w.jobs.checks, 'diagnostics');
  assert.equal(diagnostics.if, 'always()');
  assert.equal(diagnostics.with['retention-days'], 14);
  assert.match(diagnostics.with.path, /E2E_ARTIFACT_DIR/);
  assert.match(diagnostics.with.path, /\.build-cache\/build-report\.json/);
  const download = step(w.jobs.deploy, 'download');
  assert.equal(download.with.name, artifact.with.name);
  assert.equal(download.with.path, 'dist/');
  assert.equal(download.with['run-id'], undefined);
  assert.equal(download.with['github-token'], undefined);
  assert.doesNotMatch(JSON.stringify(w.jobs.deploy.steps), /pnpm build|playwright|check:site/);
});

test('deployment requires successful same-run checks, main, explicit enablement and production protection', () => {
  const job = workflow().jobs.deploy;
  assert.equal(job.needs, 'checks');
  for (const gate of ["needs.checks.result == 'success'", "github.ref == 'refs/heads/main'",
    "github.event_name == 'push'", "github.event_name == 'workflow_dispatch'", "vars.CLOUDFLARE_DEPLOY_ENABLED == 'true'"]) {
    assert.ok(job.if.includes(gate), gate);
  }
  assert.equal(job.environment, 'production');
  const fresh = step(job, 'fresh');
  assert.match(fresh.run, /gh api.*git\/ref\/heads\/main/);
  assert.match(fresh.run, /GITHUB_SHA/);
  const publish = step(job, 'publish');
  assert.match(publish.run, /pnpm exec wrangler pages deploy dist --project-name "\$CLOUDFLARE_PAGES_PROJECT" --branch main/);
  assert.match(publish.run, /Missing required deployment setting:/);
  for (const name of ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID']) {
    assert.equal(publish.env[name], `\${{ secrets.${name} }}`);
  }
  assert.match(publish.run, /siteOrigin/);
  assert.equal(publish.env.TESTED_ORIGIN, '${{ needs.checks.outputs.origin }}');
  assert.ok(job.steps.indexOf(fresh) < job.steps.indexOf(publish));
  assert.match(step(workflow().jobs.checks, 'deployment-status').run, /disabled.*not published/i);
});

test('public onboarding links to implemented guides and deployment names/configuration stay consistent', () => {
  const readme = read('README.md');
  const docs = read('docs/deployment.md');
  for (const link of ['docs/catalogue.md', 'docs/builds.md', 'docs/e2e.md', 'docs/deployment.md']) {
    assert.ok(readme.includes(`](${link})`), link);
  }
  for (const name of ['CLOUDFLARE_DEPLOY_ENABLED', 'CLOUDFLARE_PAGES_PROJECT', 'PUBLIC_SITE_URL',
    'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID', 'Build, routes and browsers', 'production']) {
    assert.ok(docs.includes(name), name);
  }
  for (const text of [readme, docs]) {
    assert.doesNotMatch(text, /\]\([^)]*(?:research\/|odd\/|design\/|opencode\.json)/);
  }
  assert.match(docs, /automatic.*(?:disabled|disable)|disable.*automatic/i);
  assert.match(docs, /rollback/i);
  assert.match(read('wrangler.toml'), /pages_build_output_dir\s*=\s*"\.\/dist"/);
});
