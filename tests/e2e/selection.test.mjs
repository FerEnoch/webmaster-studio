import assert from 'node:assert/strict';
import test from 'node:test';
import { selectApps } from './inventory.mjs';

const apps = [{ name: 'wm-one', base: '/demos/one/' }, { name: 'wm-portfolio', base: '/' }];
const report = {
  version: 1, origin: 'https://studio.example', built: ['one'], reused: ['portfolio'], affected: ['one'],
  apps: apps.map((app) => ({ ...app, id: app.name.slice(3), fingerprint: 'a'.repeat(64) })),
};

test('default and explicit all preserve every app regardless of a warm report', () => {
  for (const scope of [undefined, 'all']) assert.deepEqual(selectApps(apps, scope, report).selected, apps);
});
test('affected selects exact app identities, not the portfolio prefix', () => {
  assert.deepEqual(selectApps(apps, 'affected', report).selected, [apps[0]]);
  assert.deepEqual(selectApps(apps, 'affected', report).skipped, [apps[1]]);
});
test('only a valid complete warm report can select zero apps', () => {
  const warm = { ...report, built: [], affected: [], reused: ['one', 'portfolio'] };
  assert.deepEqual(selectApps(apps, 'affected', warm).selected, []);
  assert.deepEqual(selectApps(apps, 'affected', warm).skipped, apps);
});
test('missing, malformed, obsolete or mismatched reports fall back to all with a reason', () => {
  for (const invalid of [undefined, null, {}, { ...report, version: 2 }, { ...report, origin: 'bad' },
    { ...report, apps: report.apps.slice(1) }, { ...report, affected: [] },
    { ...report, built: ['other'], affected: ['other'] }, { ...report, reused: [] },
    { ...report, reused: ['one', 'portfolio'] }, { ...report, built: ['one', 'one'] },
    { ...report, apps: report.apps.map((app) => ({ ...app, fingerprint: '' })) },
    { ...report, apps: report.apps.map((app) => ({ ...app, base: '/' })) }]) {
    const result = selectApps(apps, 'affected', invalid);
    assert.deepEqual(result.selected, apps);
    assert.deepEqual(result.skipped, []);
    assert.match(result.reason, /invalid.*all/i);
  }
});
test('new registry apps invalidate older reports instead of silently disappearing', () => {
  const extended = [...apps, { name: 'wm-two', base: '/demos/two/' }];
  assert.deepEqual(selectApps(extended, 'affected', report).selected, extended);
});
test('unsupported scope is an error rather than a successful empty run', () => {
  assert.throws(() => selectApps(apps, 'typo', report), /E2E_SCOPE must be all or affected/);
});
