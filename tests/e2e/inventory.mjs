import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { apps, ROOT, siteOrigin } from '../../scripts/site-config.mjs';

export function selectApps(catalogue, scope = 'all', report) {
  if (!['all', 'affected'].includes(scope)) throw new Error('E2E_SCOPE must be all or affected');
  const all = (reason) => ({ selected: catalogue, skipped: [], reason });
  if (scope === 'all') return all('all apps (default baseline)');
  try {
    if (report.version !== 1 || siteOrigin(report.origin) !== report.origin) throw new Error();
    if (!Array.isArray(report.apps) || report.apps.length !== catalogue.length) throw new Error();
    for (const app of catalogue) {
      const matches = report.apps.filter((item) => item.id === app.name.slice(3));
      if (matches.length !== 1 || matches[0].name !== app.name || matches[0].base !== app.base ||
          !/^[a-f0-9]{64}$/.test(matches[0].fingerprint)) throw new Error();
    }
    const ids = catalogue.map((app) => app.name.slice(3));
    for (const key of ['built', 'reused', 'affected']) {
      const list = report[key];
      if (!Array.isArray(list) || new Set(list).size !== list.length || list.some((id) => !ids.includes(id))) throw new Error();
    }
    if (report.built.length !== report.affected.length || report.built.some((id) => !report.affected.includes(id)) ||
        report.built.length + report.reused.length !== ids.length || report.built.some((id) => report.reused.includes(id))) throw new Error();
    return {
      selected: catalogue.filter((app) => report.affected.includes(app.name.slice(3))),
      skipped: catalogue.filter((app) => !report.affected.includes(app.name.slice(3))),
      reason: 'affected apps from complete version-1 build report',
    };
  } catch {
    return all('missing/invalid build report: falling back to all apps');
  }
}

export function owner(pathname) {
  return [...apps].sort((a, b) => b.base.length - a.base.length).find((app) => pathname.startsWith(app.base));
}

export function inventory() {
  const directory = join(ROOT, 'dist');
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
  const routes = walk(directory).filter((file) => file.endsWith('.html') && !/(?:^|[/\\])404(?:[/\\]index)?\.html$/.test(file))
    .map((file) => '/' + relative(directory, file).split('\\').join('/'))
    .map((route) => route.endsWith('/index.html') ? route.slice(0, -10) : route).sort();
  for (const app of apps) if (!routes.includes(app.base)) throw new Error(`Missing built app root: ${app.base}; run pnpm build`);
  let report;
  try { report = JSON.parse(readFileSync(join(ROOT, '.build-cache/build-report.json'), 'utf8')); } catch { /* fail open to all */ }
  const selection = selectApps(apps, process.env.E2E_SCOPE, report);
  return { ...selection, apps, routes, selectedRoutes: routes.filter((route) => selection.selected.includes(owner(route))) };
}
