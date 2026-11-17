import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { APPS } from "../packages/webmaster-kit/rubros.ts";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const pkg = JSON.parse(read("package.json"));
const apps = readdirSync(new URL("apps/", root), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith("wm-"))
  .map((entry) => {
    const path = `apps/${entry.name}/package.json`;
    return { directory: entry.name, ...JSON.parse(read(path)) };
  });

test("las apps anteriores y su documentación ya no están en benchmark/", () => {
  assert.equal(existsSync(new URL("benchmark/", root)), false, "benchmark/ debe eliminarse");
});

test("pnpm dev abre el portfolio Astro", () => {
  assert.equal(pkg.scripts.dev, "pnpm --filter wm-portfolio run dev");
});

test("cada app Astro tiene aliases dev y build válidos en la raíz", () => {
  assert.deepEqual(apps.map((app) => app.name).sort(), APPS.map((app) => `wm-${app.id}`).sort());
  const missing = [];
  for (const app of apps) {
    const alias = app.directory.slice(3);
    for (const command of ["dev", "build"]) {
      const key = `${command}:${alias}`;
      const expected = `pnpm --filter ${app.name} run ${command}`;
      if (pkg.scripts[key] !== expected) missing.push(`${key}: ${expected}`);
      assert.ok(app.scripts[command], `${app.name} debe definir ${command}`);
    }
  }
  assert.deepEqual(missing, [], "aliases faltantes o incorrectos");
});

test("todos los filtros raíz apuntan a una app actual y a un script existente", () => {
  const invalid = [];
  for (const [alias, command] of Object.entries(pkg.scripts)) {
    if (!command.includes("--filter")) continue;
    const match = /^pnpm --filter (\S+) run (\S+)$/.exec(command);
    const app = match && apps.find((candidate) => candidate.name === match[1]);
    if (!app?.scripts[match?.[2]]) invalid.push(`${alias}: ${command}`);
  }
  assert.deepEqual(invalid, [], "filtros sin destino válido");
});

test("se retiran los aliases de las apps anteriores", () => {
  const obsolete = ["thaloz", "invgate", "constructora", "salud", "autos", "fitness", "veterinaria", "vinos"];
  const remaining = obsolete.flatMap((app) => ["dev", "build"].map((command) => `${command}:${app}`))
    .filter((alias) => Object.hasOwn(pkg.scripts, alias));
  assert.deepEqual(remaining, []);
});

test("se conservan build recursivo y build agregado", () => {
  assert.equal(pkg.scripts["build:apps"], "pnpm -r run build");
  assert.equal(pkg.scripts.build, "node scripts/build-site.mjs");
});

test("el workspace no ofrece reactivar las apps retiradas", () => {
  const workspace = read("pnpm-workspace.yaml");
  assert.match(workspace, /packages:\s*\n\s*- 'apps\/\*'/);
  assert.doesNotMatch(workspace, /benchmark/);
});

test("la documentación operativa no remite a las apps ni a los briefs retirados", () => {
  const obsolete = /benchmark\/|apps\/(?:thaloz|invgate|constructora|inmobiliaria|salud|autos|fitness|veterinaria|vinos)(?:\/|`)|(?:dev|build):(?:thaloz|invgate|constructora|salud|autos|fitness|veterinaria|vinos)|docs\/(?:prompt-nuevos-rubros|(?:fitness|veterinaria|vinos)-investigacion)\.md/;
  for (const path of ["README.md", "docs/builds.md"]) {
    assert.doesNotMatch(read(path), obsolete, path);
  }
  const readme = read("README.md");
  for (const [, alias] of readme.matchAll(/pnpm run ((?:dev|build|check):[a-z-]+)/g)) {
    assert.ok(Object.hasOwn(pkg.scripts, alias), `README: ${alias} debe existir`);
  }
  assert.match(readme, /demos de rubro/);
  for (const path of ["packages/webmaster-kit/README.md", "packages/webmaster-kit/app-template/", "scripts/new-app.mjs"]) {
    assert.ok(existsSync(new URL(path, root)), fileURLToPath(new URL(path, root)));
  }
});
