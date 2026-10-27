import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const slugs = ["clinica", "concesionario", "lavadero", "estetica", "universidad", "inmobiliaria", "arquitectura", "portfolio"];
const run = (cwd, script, args = [], env = {}) => spawnSync(process.execPath, [join(cwd, "scripts", script), ...args], {
  cwd, encoding: "utf8", env: { ...process.env, ...env },
});
const put = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};
function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "wm-deployment-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, "scripts"));
  for (const name of readdirSync(join(root, "scripts")).filter((name) => name.endsWith(".mjs") && !name.endsWith(".test.mjs"))) {
    cpSync(join(root, "scripts", name), join(dir, "scripts", name));
  }
  cpSync(join(root, "packages/webmaster-kit"), join(dir, "packages/webmaster-kit"), { recursive: true });
  // A fake package runner exercises the public aggregate command without dependencies.
  put(dir, "bin/pnpm", `#!${process.execPath}
const fs = require('node:fs');
const path = require('node:path');
const slug = process.argv[3].slice(3);
if (process.env.FAIL_APP === slug) { console.error('simulated app failure'); process.exit(7); }
const out = process.env.WM_BUILD_DIR;
fs.mkdirSync(path.join(out, '_astro'), { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), slug);
fs.writeFileSync(path.join(out, '_astro', 'same.js'), slug);
if (slug === 'portfolio') {
 fs.mkdirSync(path.join(out, 'demos'), { recursive: true });
 fs.writeFileSync(path.join(out, 'demos/index.html'), 'catalogue');
 fs.writeFileSync(path.join(out, '404.html'), 'Not found');
 if (process.env.COLLISION) {
  fs.mkdirSync(path.join(out, 'demos/clinica'), { recursive: true });
  fs.writeFileSync(path.join(out, 'demos/clinica/index.html'), 'collision');
 }
}
`);
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", "import {chmodSync} from 'node:fs'; chmodSync(process.argv[1], 0o755)", join(dir, "bin/pnpm")]);
  assert.equal(result.status, 0);
  return { dir, env: { PATH: `${join(dir, "bin")}:${process.env.PATH}`, PUBLIC_SITE_URL: "https://studio.example" } };
}

test("aggregate build publishes eight isolated apps without replacing the catalogue", (t) => {
  const { dir, env } = fixture(t);
  const result = run(dir, "build-site.mjs", [], env);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim().split("\n").at(-1), "Built 8 apps into dist/.");
  assert.equal(result.stderr, "");
  assert.equal(readFileSync(join(dir, "dist/demos/index.html"), "utf8"), "catalogue");
  for (const slug of slugs) {
    const base = slug === "portfolio" ? "" : `demos/${slug}/`;
    assert.equal(readFileSync(join(dir, `dist/${base}index.html`), "utf8"), slug);
    assert.equal(readFileSync(join(dir, `dist/${base}_astro/same.js`), "utf8"), slug);
  }
  // A subsequent complete build replaces the previous full output.
  const again = run(dir, "build-site.mjs", [], env);
  assert.equal(again.status, 0, again.stderr);
  assert.equal(again.stderr, "");
  assert.equal(existsSync(join(dir, "dist/404.html")), true);
});

test("failed app build preserves the last complete output and leaves no partial output", (t) => {
  const { dir, env } = fixture(t);
  put(dir, "dist/previous.txt", "last complete build");
  const result = run(dir, "build-site.mjs", [], { ...env, FAIL_APP: "estetica" });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "simulated app failure\nError: Build failed: wm-estetica (exit 7).\n");
  assert.deepEqual(readdirSync(join(dir, "dist")), ["previous.txt"]);
  assert.equal(readFileSync(join(dir, "dist/previous.txt"), "utf8"), "last complete build");
  assert.deepEqual(readdirSync(dir).filter((name) => name.startsWith(".dist-")), []);
});

test("failed first build and failed assembly never publish partial output", (t) => {
  const { dir, env } = fixture(t);
  const failure = run(dir, "build-site.mjs", [], { ...env, FAIL_APP: "estetica" });
  assert.equal(failure.status, 1);
  assert.equal(failure.stdout, "");
  assert.equal(failure.stderr, "simulated app failure\nError: Build failed: wm-estetica (exit 7).\n");
  assert.equal(existsSync(join(dir, "dist")), false);
  put(dir, "dist/previous.txt", "complete");
  const collision = run(dir, "build-site.mjs", [], { ...env, COLLISION: "1" });
  assert.equal(collision.status, 1);
  assert.equal(collision.stdout, "");
  assert.match(collision.stderr, /^Error: Output collision: .*\/demos\/clinica\/index.html\n$/);
  assert.deepEqual(readdirSync(join(dir, "dist")), ["previous.txt"]);
  assert.equal(readFileSync(join(dir, "dist/previous.txt"), "utf8"), "complete");
  assert.deepEqual(readdirSync(dir).filter((name) => name.startsWith(".dist-")), []);
});

test("invalid production origins and unsupported build arguments fail before generating output", (t) => {
  const { dir, env } = fixture(t);
  for (const origin of ["not a URL", "https://studio.example/path", "https://user:password@studio.example", "ftp://studio.example", "https://studio.example/?x=1", "https://studio.example/#x"]) {
    const result = run(dir, "build-site.mjs", [], { ...env, PUBLIC_SITE_URL: origin });
    assert.equal(result.status, 1, origin);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, "Error: PUBLIC_SITE_URL must be an http(s) origin without credentials, path, query or fragment.\n");
    assert.equal(existsSync(join(dir, "dist")), false);
  }
  const result = run(dir, "build-site.mjs", ["--unknown"], env);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "Error: Unknown argument: --unknown. Use --help.\n");
  assert.equal(existsSync(join(dir, "dist")), false);
});

test("scaffolding preserves names, ports, no-overwrite and read-only dry-run while copying deployment helpers", (t) => {
  const { dir, env } = fixture(t);
  const before = readdirSync(dir);
  const dry = run(dir, "new-app.mjs", ["new-demo", "--port", "3030", "--dry-run"], env);
  assert.equal(dry.status, 0, dry.stderr);
  assert.equal(dry.stderr, "");
  assert.match(dry.stdout, /Puerto: 3030/);
  assert.match(dry.stdout, /src\/lib\/urls.ts/);
  assert.deepEqual(readdirSync(dir), before);
  const created = run(dir, "new-app.mjs", ["new-demo", "--port", "3030"], env);
  assert.equal(created.status, 0, created.stderr);
  assert.equal(created.stderr, "");
  const app = join(dir, "apps/wm-new-demo");
  assert.equal(JSON.parse(readFileSync(join(app, "package.json"))).name, "wm-new-demo");
  assert.match(readFileSync(join(app, "package.json"), "utf8"), /3030/);
  assert.equal(readFileSync(join(app, "src/lib/urls.ts"), "utf8"), readFileSync(join(dir, "packages/webmaster-kit/urls.ts"), "utf8"));
  assert.equal(existsSync(join(app, "public/404.html")), true);
  const snapshot = readFileSync(join(app, "astro.config.mjs"), "utf8");
  const repeat = run(dir, "new-app.mjs", ["new-demo", "--port", "3030"], env);
  assert.equal(repeat.status, 1);
  assert.equal(repeat.stdout, "");
  assert.equal(repeat.stderr, "\n  Error: El destino ya existe: apps/wm-new-demo\n  No se pisa nada. Borralo a mano si querés regenerarlo (o usá otra app).\n\n");
  assert.equal(readFileSync(join(app, "astro.config.mjs"), "utf8"), snapshot);
  const invalid = run(dir, "new-app.mjs", ["../bad", "--port", "3030"], env);
  assert.equal(invalid.status, 1);
  assert.equal(invalid.stdout, "");
  assert.equal(invalid.stderr, '\n  Error: Nombre de app invalido: "../bad". Debe ser tipo "wm-lavadero".\n\n');
});

test("scaffolding rejects invalid origins before creating a destination or printing a dry-run plan", (t) => {
  const { dir, env } = fixture(t);
  const before = readdirSync(dir);
  for (const origin of ["not a URL", "https://studio.example/path", "https://user:password@studio.example", "ftp://studio.example", "https://studio.example/?x=1", "https://studio.example/#x"]) {
    for (const flags of [[], ["--dry-run"]]) {
      const result = run(dir, "new-app.mjs", ["new-demo", "--port", "3030", ...flags], { ...env, PUBLIC_SITE_URL: origin });
      assert.deepEqual({
        exit: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
        destinationExists: existsSync(join(dir, "apps/wm-new-demo")),
        entries: readdirSync(dir),
      }, {
        exit: 1,
        stdout: "",
        stderr: "\n  Error: PUBLIC_SITE_URL must be an http(s) origin without credentials, path, query or fragment.\n\n",
        destinationExists: false,
        entries: before,
      }, `${origin} ${flags.join(" ")}`);
    }
  }
});

test("deployment help is read-only and copied kit sources stay consistent", (t) => {
  const { dir, env } = fixture(t);
  const before = readdirSync(dir);
  for (const script of ["build-site.mjs", "preview-site.mjs", "check-site.mjs", "new-app.mjs"]) {
    const result = run(dir, script, ["--help"], env);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    assert.ok(result.stdout.includes("--help"));
  }
  assert.deepEqual(readdirSync(dir), before);
  for (const slug of slugs) {
    for (const file of ["rubros.ts", "urls.ts"]) {
      assert.equal(readFileSync(join(root, `apps/wm-${slug}/src/lib/${file}`), "utf8"), readFileSync(join(root, `packages/webmaster-kit/${file}`), "utf8"));
    }
    for (const file of ["BaseLayout.astro", "Nav.astro", "Footer.astro", "RubroCard.astro", "PageHero.astro"]) {
      assert.equal(readFileSync(join(root, `apps/wm-${slug}/src/components/ui/${file}`), "utf8"), readFileSync(join(root, `packages/webmaster-kit/components/${file}`), "utf8"));
    }
    assert.equal(readFileSync(join(root, `apps/wm-${slug}/public/404.html`), "utf8"), readFileSync(join(root, "packages/webmaster-kit/app-template/public/404.html"), "utf8"));
  }
});

test("preview serves direct routes, slash redirects, MIME and real 404 through its CLI", async (t) => {
  const { dir, env } = fixture(t);
  put(dir, "dist/index.html", "portfolio");
  put(dir, "dist/404.html", "not found");
  put(dir, "dist/demos/index.html", "catalogue");
  put(dir, "dist/demos/clinica/estudios/index.html", "studies");
  put(dir, "dist/demos/clinica/_astro/client.js", "export default 1;");
  put(dir, "dist/demos/clinica/_astro/style.css", "body {}");
  const probe = createServer();
  probe.listen(0, "127.0.0.1");
  await once(probe, "listening");
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  const child = spawn(process.execPath, [join(dir, "scripts/preview-site.mjs"), "--port", String(port)], { cwd: dir, env, stdio: ["ignore", "pipe", "pipe"] });
  let stderr = "";
  child.stderr.on("data", (data) => { stderr += data; });
  t.after(async () => { child.kill(); await once(child, "exit"); assert.equal(stderr, ""); });
  const [ready] = await once(child.stdout, "data", { signal: AbortSignal.timeout(10000) });
  assert.equal(String(ready), `Preview: http://127.0.0.1:${port}/\n`);
  const origin = `http://127.0.0.1:${port}`;
  for (const [path, status, text, mime] of [
    ["/", 200, "portfolio", "text/html"],
    ["/demos/", 200, "catalogue", "text/html"],
    ["/demos/clinica/estudios/", 200, "studies", "text/html"],
    ["/demos/clinica/_astro/client.js", 200, "export default 1;", "text/javascript"],
    ["/demos/clinica/_astro/style.css", 200, "body {}", "text/css"],
    ["/unknown", 404, "not found", "text/html"],
    ["/demos/clinica/unknown/", 404, "not found", "text/html"],
    ["/demos/clinica/_astro/missing.js", 404, "not found", "text/html"],
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, status, path);
    assert.equal(await response.text(), text, path);
    assert.equal(response.headers.get("content-type").split(";")[0], mime);
  }
  const redirect = await fetch(origin + "/demos?x=1", { redirect: "manual" });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get("location"), "/demos/?x=1");
  assert.equal(await (await fetch(origin + "/", { method: "HEAD" })).text(), "");
});

test("preview rejects invalid ports or flags without creating output", (t) => {
  const { dir, env } = fixture(t);
  for (const args of [["--port", "0"], ["--port", "65536"], ["--port", "word"], ["--port"]]) {
    const result = run(dir, "preview-site.mjs", args, env);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, "Error: --port requires an integer between 1 and 65535.\n");
    assert.equal(existsSync(join(dir, "dist")), false);
  }
  const result = run(dir, "preview-site.mjs", ["--unknown"], env);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "Error: Unknown argument: --unknown. Use --help.\n");
});
