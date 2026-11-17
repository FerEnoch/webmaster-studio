#!/usr/bin/env node
/**
 * scaffolder de apps del kit webmaster.
 *
 * Crea el esqueleto de una app nueva COPIANDO DESDE `packages/webmaster-kit/`
 * (la fuente de verdad), NO copiando otra app: la app de referencia tiene
 * contenido propio y cada app nueva arrastraria textos viejos.
 *
 *   node scripts/new-app.mjs wm-concesionario
 *   node scripts/new-app.mjs --dry-run wm-concesionario
 *   node scripts/new-app.mjs --help
 *
 * Reglas:
 *   - No borra nada fuera del directorio destino.
 *   - Si el destino existe, falla con mensaje claro (no pisa trabajo).
 *   - No crea `src/content/<rubro>.ts` ni componentes de rubro: eso lo escribe
 *     el writer de la app.
 *   - Usa `fs.cp` / `fs.copyFile` de Node en modo "no sobrescribir".
 */

import {
  constants,
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { getRubro, APPS } from "../packages/webmaster-kit/rubros.ts";
import { siteOrigin } from "./site-config.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KIT = join(ROOT, "packages", "webmaster-kit");
const TEMPLATE = join(KIT, "app-template");
const APPS_DIR = join(ROOT, "apps");

// Keep scaffold ports and deployment routes aligned with the canonical catalogue.
const PORTS = Object.fromEntries(APPS.map((app) => [`wm-${app.id}`, app.port]));
function siteUrl(name) {
  const id = name.slice(3);
  return new URL(getRubro(id)?.demoUrl ?? (id === "portfolio" ? "/" : `/demos/${id}/`), siteOrigin()).href;
}

/** Archivos del kit que se copian tal cual (fuente -> destino). */
const KIT_FILES = [
  ["types.ts", "src/lib/types.ts"],
  ["rubros.ts", "src/lib/rubros.ts"],
  ["urls.ts", "src/lib/urls.ts"],
  ["whatsapp.ts", "src/lib/whatsapp.ts"],
  ["media.ts", "src/lib/media.ts"],
  ["styles/tokens.css", "src/styles/tokens.css"],
];

/** Archivos del esqueleto de app (fuente -> destino). */
const TEMPLATE_FILES = [
  ["package.json", "package.json"],
  ["astro.config.mjs", "astro.config.mjs"],
  ["tsconfig.json", "tsconfig.json"],
  [".gitignore", ".gitignore"],
  ["src/env.d.ts", "src/env.d.ts"],
  ["src/layouts/Base.astro", "src/layouts/Base.astro"],
  ["src/styles/global.css", "src/styles/global.css"],
  ["src/pages/index.astro", "src/pages/index.astro"],
  ["public/404.html", "public/404.html"],
];

function usage() {
  console.log(`
webmaster-kit scaffolder

  node scripts/new-app.mjs <app> [--dry-run] [--port <n>]

  <app>       nombre de la app. "wm-lavadero" o "lavadero" (se antepone "wm-").

Opciones:
  --dry-run   lista lo que crearia, sin escribir nada.
  --port n    puerto de la app (solo necesario para rubros nuevos).
  --help      esta ayuda.

Entorno:
  PUBLIC_SITE_URL origen HTTP(S) sin ruta, credenciales, query ni fragmento.
                  Se valida antes de escribir o mostrar el plan de dry-run.

Apps conocidas y sus puertos:
${Object.entries(PORTS)
  .map(([name, port]) => `  ${name.padEnd(20)} ${port}`)
  .join("\n")}

Ejemplo:
  node scripts/new-app.mjs wm-concesionario
`);
}

function fail(message) {
  console.error(`\n  Error: ${message}\n`);
  process.exit(1);
}

/** Lista recursiva de archivos de un directorio, relativos a `dir`. */
function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, base));
    else out.push(relative(base, full));
  }
  return out;
}

function parseArgs(argv) {
  const options = { dryRun: false, port: undefined, name: undefined, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--port") {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value <= 0) fail("--port necesita un numero entero positivo.");
      options.port = value;
      i += 1;
    } else if (arg.startsWith("-")) fail(`Opcion desconocida: ${arg}. Usá --help.`);
    else if (!options.name) options.name = arg;
    else fail(`Argumento inesperado: ${arg}.`);
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || !options.name) {
    usage();
    process.exit(options.help ? 0 : 1);
  }

  if (!existsSync(KIT)) fail(`No existe el kit en ${KIT}.`);
  if (!existsSync(TEMPLATE)) fail(`No existe la plantilla de app en ${TEMPLATE}.`);

  const raw = options.name.trim();
  const name = raw.startsWith("wm-") ? raw : `wm-${raw}`;

  if (!/^wm-[a-z0-9-]+$/.test(name)) {
    fail(`Nombre de app invalido: "${raw}". Debe ser tipo "wm-lavadero".`);
  }

  const port = options.port ?? PORTS[name];
  if (!port) {
    fail(
      `No conozco el puerto de "${name}". Agregalo a la tabla PORTS de scripts/new-app.mjs ` +
        `o pasá --port <n>. Apps conocidas: ${Object.keys(PORTS).join(", ")}`,
    );
  }

  const dest = join(APPS_DIR, name);
  if (existsSync(dest)) {
    fail(
      `El destino ya existe: ${relative(ROOT, dest)}\n` +
        `  No se pisa nada. Borralo a mano si querés regenerarlo (o usá otra app).`,
    );
  }

  // ── Plan de escritura ──────────────────────────────────────────────
  const plan = [];

  for (const [from, to] of TEMPLATE_FILES) {
    plan.push({ kind: "template", from: join(TEMPLATE, from), to: join(dest, to) });
  }
  for (const [from, to] of KIT_FILES) {
    plan.push({ kind: "kit", from: join(KIT, from), to: join(dest, to) });
  }
  for (const file of listFiles(join(KIT, "components"))) {
    plan.push({
      kind: "kit-components",
      from: join(KIT, "components", file),
      to: join(dest, "src", "components", "ui", file),
    });
  }

  for (const item of plan) {
    if (!existsSync(item.from)) fail(`Falta el archivo fuente: ${relative(ROOT, item.from)}`);
    if (existsSync(item.to)) fail(`Ya existe ${relative(ROOT, item.to)}. Aborto para no pisar nada.`);
  }

  let site;
  try {
    site = siteUrl(name);
  } catch (error) {
    fail(error.message);
  }

  const rel = (p) => relative(ROOT, p).split(sep).join("/");
  const render = (value) =>
    String(value)
      .replaceAll("__APP_NAME__", name)
      .replaceAll("__PORT__", String(port))
      .replaceAll("__SITE_URL__", site);

  if (options.dryRun) {
    console.log(`\n  Dry run: se crearia ${rel(dest)}/ con ${plan.length} archivos:\n`);
    for (const item of plan) console.log(`    ${rel(item.to)}`);
    console.log(`\n  Puerto: ${port}   Site: ${site}`);
    console.log("\n  No se escribio nada.\n");
    return;
  }

  // ── Escritura ──────────────────────────────────────────────────────
  mkdirSync(dest, { recursive: true });

  for (const item of plan) {
    if (item.kind === "kit-components") continue;
    mkdirSync(dirname(item.to), { recursive: true });
    // COPYFILE_EXCL: falla si el destino existe. No se pisa nada.
    copyFileSync(item.from, item.to, constants.COPYFILE_EXCL);
  }

  // Componentes del kit: `fs.cp` recursivo, sin sobrescribir.
  cpSync(join(KIT, "components"), join(dest, "src", "components", "ui"), {
    recursive: true,
    force: false,
    errorOnExist: true,
  });

  // ── Placeholders con el nombre y el puerto de esta app ─────────────
  const pkgPath = join(dest, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.name = name;
  for (const [key, value] of Object.entries(pkg.scripts)) pkg.scripts[key] = render(value);
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

  const configPath = join(dest, "astro.config.mjs");
  writeFileSync(configPath, render(readFileSync(configPath, "utf8")), "utf8");

  console.log(`\n  App creada: ${rel(dest)}`);
  console.log(`  Puerto: ${port}`);
  console.log(`  Site: ${site}`);
  console.log(`  Archivos: ${plan.length}\n`);
  console.log("  Siguiente paso (lo escribe el writer de la app):");
  console.log(`    1. Crear ${rel(join(dest, "src", "content", "<rubro>.ts"))} con el RubroContent.`);
  console.log(`    2. Reemplazar ${rel(join(dest, "src", "pages", "index.astro"))} por la portada.`);
  console.log(`    3. pnpm install && pnpm --filter ${name} run check\n`);
}

main();
