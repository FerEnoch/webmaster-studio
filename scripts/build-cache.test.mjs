import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { APPS } from "../packages/webmaster-kit/rubros.ts";

const root = new URL("../", import.meta.url);
const demos = APPS.filter((app) => app.id !== "portfolio").slice(0, 2);
const ids = [...demos.map((app) => app.id), "portfolio"];
const put = (dir, file, text) => { mkdirSync(dirname(join(dir, file)), { recursive: true }); writeFileSync(join(dir, file), text); };
function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "wm-cache-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  cpSync(new URL("scripts/", root), join(dir, "scripts"), { recursive: true });
  const registry = (list) => put(dir, "packages/webmaster-kit/rubros.ts", `export const APPS = ${JSON.stringify(list.map((id) => ({ id, demoUrl: id === "portfolio" ? "/" : `/demos/${id}/` })))}; export const getRubro = id => APPS.find(a => a.id === id);`);
  registry(ids);
  for (const id of ids) put(dir, `apps/wm-${id}/src/page.astro`, id);
  // A tiny pnpm v9 graph: two distinct consumers plus shared root tooling.
  const lock = (extra = "", integrity = "old") => `lockfileVersion: '9.0'\nimporters:\n  .: {}\n${ids.map((id, i) => `  apps/wm-${id}:\n    dependencies:\n      dep${i}:\n        specifier: '1'\n        version: '1'\n`).join("")}${extra}\npackages:\n${ids.map((_, i) => `  dep${i}@1:\n    resolution: {integrity: ${i === 0 ? integrity : "stable"}}\n`).join("")}snapshots:\n${ids.map((_, i) => `  dep${i}@1: {}\n`).join("")}`;
  put(dir, "pnpm-lock.yaml", lock());
  // Keep the fake runner CommonJS even when the root tooling fixture uses ESM.
  put(dir, "bin/package.json", JSON.stringify({ type: "commonjs" }));
  put(dir, "bin/pnpm", `#!${process.execPath}
const fs = require('node:fs'), p = require('node:path');
const id = process.argv[3].slice(3), command = process.argv[5];
fs.appendFileSync('calls', id + ':' + command + '\\n');
if (process.env.FAIL_APP === id) { console.error('simulated app failure'); process.exit(7); }
if (command === 'check') process.exit(0);
const out = process.env.WM_BUILD_DIR;
fs.mkdirSync(out, {recursive:true}); fs.writeFileSync(p.join(out,'index.html'), id);
if(id === 'portfolio') fs.writeFileSync(p.join(out,'404.html'),'not found');
`);
  chmodSync(join(dir, "bin/pnpm"), 0o755);
  const env = { ...process.env, PATH: `${join(dir, "bin")}:${process.env.PATH}`, PUBLIC_SITE_URL: "https://studio.example" };
  const run = (args = [], extra = {}) => spawnSync(process.execPath, ["scripts/build-site.mjs", ...args], { cwd: dir, env: { ...env, ...extra }, encoding: "utf8", timeout: 20000 });
  const report = () => JSON.parse(readFileSync(join(dir, ".build-cache/build-report.json"), "utf8"));
  const calls = () => existsSync(join(dir, "calls")) ? readFileSync(join(dir, "calls"), "utf8") : "";
  const pass = (built, reused, args = [], extra = {}) => {
    const result = run(args, extra);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    assert.equal(result.stdout, `Built ${ids.length + (built.includes("new-demo") ? 1 : 0)} apps into dist/.\nCache: built ${built.length}, reused ${reused.length}. Report: .build-cache/build-report.json\n`);
    assert.deepEqual(report().built, built); assert.deepEqual(report().affected, built); assert.deepEqual(report().reused, reused);
  };
  return { dir, run, report, calls, pass, registry, lock };
}

test("cold/full and warm/no-op builds expose a complete report and ignore docs/internal metadata", (t) => {
  const f = fixture(t); f.pass(ids, []);
  const before = f.calls();
  put(f.dir, "docs/notes.md", "docs"); put(f.dir, "odd/task.md", "internal");
  f.pass([], ids); assert.equal(f.calls(), before);
  assert.equal(f.report().origin, "https://studio.example");
  assert.equal(f.report().version, 1);
  for (const id of ids) assert.equal(readFileSync(join(f.dir, "dist", id === "portfolio" ? "index.html" : `demos/${id}/index.html`), "utf8"), id);
});

test("current source edits, deletions, renames and branch reversions affect only their consumer", (t) => {
  const f = fixture(t); f.pass(ids, []);
  const id = ids[0], others = ids.slice(1);
  put(f.dir, `apps/wm-${id}/src/page.astro`, "edited"); f.pass([id], others);
  renameSync(join(f.dir, `apps/wm-${id}/src/page.astro`), join(f.dir, `apps/wm-${id}/src/renamed.astro`)); f.pass([id], others);
  rmSync(join(f.dir, `apps/wm-${id}/src/renamed.astro`)); f.pass([id], others);
  put(f.dir, `apps/wm-${id}/src/page.astro`, id); f.pass([], ids);
  put(f.dir, "apps/wm-portfolio/src/page.astro", "portfolio edit"); f.pass(["portfolio"], ids.slice(0, 2));
});

test("catalogue and new importer rebuild portfolio/new demo, not stable demo snapshots; removal prunes dist", (t) => {
  const f = fixture(t); f.pass(ids, []);
  // Portfolio's real re-export is a build input, unlike copied demo registries.
  put(f.dir, "apps/wm-portfolio/src/registry.ts", 'export * from "../../../packages/webmaster-kit/rubros.ts";');
  f.pass(["portfolio"], ids.slice(0, 2));
  f.registry([...ids, "new-demo"]);
  put(f.dir, "apps/wm-new-demo/src/page.astro", "new demo");
  put(f.dir, "pnpm-lock.yaml", f.lock("  apps/wm-new-demo: {}\n"));
  f.pass(["portfolio", "new-demo"], ids.slice(0, 2));
  f.registry(ids);
  const result = f.run(); assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(f.report().built, []); assert.deepEqual(f.report().reused, ids);
  assert.equal(existsSync(join(f.dir, "dist/demos/new-demo")), false);
});

test("dependency resolution integrity is isolated per importer while root tooling/config invalidates all", (t) => {
  const f = fixture(t); f.pass(ids, []);
  put(f.dir, "pnpm-lock.yaml", f.lock("  apps/unrelated: {}\n")); f.pass([], ids);
  put(f.dir, "pnpm-lock.yaml", f.lock("", "changed")); f.pass([ids[0]], ids.slice(1));
  put(f.dir, "pnpm-workspace.yaml", "overrides: {dep0: '2'}"); f.pass(ids, []);
  put(f.dir, "package.json", JSON.stringify({ type: "module", packageManager: "pnpm@12.11.3" })); f.pass(ids, []);
});

test("shared imported code invalidates its consumers only; origin and base belong to the key", (t) => {
  const f = fixture(t);
  put(f.dir, `apps/wm-${ids[0]}/src/shared.ts`, 'export * from "../../../packages/shared.ts";');
  put(f.dir, "packages/shared.ts", "export const value = 1;"); f.pass(ids, []);
  put(f.dir, "packages/shared.ts", "export const value = 2;"); f.pass([ids[0]], ids.slice(1));
  f.pass(ids, [], [], { PUBLIC_SITE_URL: "https://other.example" });
  // Route changes are per-app even though site-config imports the whole registry.
  const file = join(f.dir, "packages/webmaster-kit/rubros.ts");
  writeFileSync(file, readFileSync(file, "utf8").replace(`/demos/${ids[0]}/`, `/demos/renamed/`));
  f.pass([ids[0]], ids.slice(1), [], { PUBLIC_SITE_URL: "https://other.example" });
  assert.equal(existsSync(join(f.dir, `dist/demos/${ids[0]}`)), false);
  assert.equal(existsSync(join(f.dir, "dist/demos/renamed/index.html")), true);
});

test("missing/corrupt cached output is rebuilt; failed build preserves dist/report and rejected input preserves counters", (t) => {
  const f = fixture(t); f.pass(ids, []);
  const entry = f.report().apps[0];
  put(f.dir, `.build-cache/outputs/${entry.fingerprint}/index.html`, "corrupt"); f.pass([ids[0]], ids.slice(1));
  rmSync(join(f.dir, ".build-cache/outputs"), { recursive: true }); f.pass(ids, []);
  const before = { report: readFileSync(join(f.dir, ".build-cache/build-report.json"), "utf8"), calls: f.calls(), index: readFileSync(join(f.dir, "dist/index.html"), "utf8") };
  for (const [args, extra, error] of [
    [["--unknown"], {}, "Unknown argument: --unknown. Use --help."],
    [[], { PUBLIC_SITE_URL: "invalid" }, "PUBLIC_SITE_URL must be an http(s) origin without credentials, path, query or fragment."],
  ]) {
    const result = f.run(args, extra); assert.equal(result.status, 1); assert.equal(result.stdout, ""); assert.equal(result.stderr, `Error: ${error}\n`);
    assert.equal(f.calls(), before.calls); assert.equal(readFileSync(join(f.dir, ".build-cache/build-report.json"), "utf8"), before.report);
  }
  put(f.dir, `apps/wm-${ids[0]}/src/page.astro`, "failure");
  const fail = f.run([], { FAIL_APP: ids[0] });
  assert.equal(fail.status, 1); assert.equal(fail.stdout, ""); assert.equal(fail.stderr, `simulated app failure\nError: Build failed: wm-${ids[0]} (exit 7).\n`);
  assert.equal(readFileSync(join(f.dir, "dist/index.html"), "utf8"), before.index);
  assert.equal(readFileSync(join(f.dir, ".build-cache/build-report.json"), "utf8"), before.report);
  assert.deepEqual(readdirSync(f.dir).filter((name) => name.startsWith(".dist-")), []);
});

test("--check runs Astro checks only for affected apps; failed checks never publish", (t) => {
  const f = fixture(t); f.pass(ids, [], ["--check"]);
  assert.equal(f.calls(), ids.map((id) => `${id}:check\n${id}:build\n`).join(""));
  const before = f.calls(); f.pass([], ids, ["--check"]); assert.equal(f.calls(), before);
  put(f.dir, `apps/wm-${ids[0]}/src/page.astro`, "changed");
  const result = f.run(["--check"], { FAIL_APP: ids[0] });
  assert.equal(result.status, 1); assert.equal(result.stdout, ""); assert.equal(result.stderr, `simulated app failure\nError: Check failed: wm-${ids[0]} (exit 7).\n`);
  assert.equal(f.calls(), before + `${ids[0]}:check\n`);
  assert.deepEqual(f.report().built, []);
});
