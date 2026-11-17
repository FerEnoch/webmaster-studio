import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { ROOT, apps } from "./site-config.mjs";

export const digest = (value) => createHash("sha256").update(value).digest("hex");
const read = (file) => existsSync(file) ? readFileSync(file, "utf8") : "";
const unquote = (value) => value.replace(/^['"]|['"]$/g, "");

// Read only pnpm v9's generated block maps, not arbitrary YAML. Unknown layouts
// conservatively use the entire lockfile instead of risking a false cache hit.
function resolutionKey(text, importer) {
  try {
    const documents = text.split(/^---\s*$/m).filter((doc) => doc.trim());
    const doc = documents.at(-1) ?? "";
    if (!/^lockfileVersion: ['"]?9\.0['"]?$/m.test(doc)) throw new Error();
    const sections = new Map();
    for (const match of doc.matchAll(/^(\w+):[^\n]*\n([\s\S]*?)(?=^\w+:|$(?![\s\S]))/gm)) sections.set(match[1], match[0]);
    const blocks = (section) => new Map([...(sections.get(section) ?? "").matchAll(/^  (.+?):(?: \{\})?\n([\s\S]*?)(?=^  \S|$(?![\s\S]))/gm)].map((m) => [unquote(m[1]), m[0].trimEnd() + "\n"]));
    const importers = blocks("importers"), packages = blocks("packages"), snapshots = blocks("snapshots");
    if (!importers.has(importer)) throw new Error();
    const selected = new Map();
    function visit(name, version) {
      version = unquote(version);
      const key = `${unquote(name)}@${version}`;
      if (selected.has(key)) return;
      const snapshot = snapshots.get(key), pkg = packages.get(key.split("(")[0]);
      if (!snapshot || !pkg) throw new Error(); // links/exotic sources: safe whole-lock fallback
      selected.set(key, snapshot + pkg);
      for (const dep of snapshot.matchAll(/^      ('[^']+'|[^ :]+): (.+)$/gm)) visit(dep[1], dep[2]);
    }
    for (const id of [".", importer]) {
      const block = importers.get(id) ?? "";
      selected.set(`importer:${id}`, block);
      for (const dep of block.matchAll(/^      ('[^']+'|[^ :]+):\n\s+specifier: [^\n]*\n        version: (.+)$/gm)) visit(dep[1], dep[2]);
      // Refuse to silently skip any dependency entry in an unfamiliar format.
      const declared = [...block.matchAll(/^      ('[^']+'|[^ :]+):/gm)].length;
      if (declared !== [...block.matchAll(/^        version: /gm)].length) throw new Error();
    }
    return JSON.stringify([
      documents.slice(0, -1),
      [...sections].filter(([key]) => !["importers", "packages", "snapshots"].includes(key)),
      [...selected].sort(([a], [b]) => a.localeCompare(b)),
    ]);
  } catch {
    return text;
  }
}

const generated = new Set(["node_modules", "dist", ".astro", ".git", ".cache"]);
function inputFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (generated.has(entry.name) || entry.name.startsWith(".env") || entry.name === "docs" || /\.md$/.test(entry.name)) return [];
    const file = join(directory, entry.name);
    return entry.isDirectory() ? inputFiles(file) : [file];
  });
}

function sourceKey(app) {
  const files = new Map();
  function add(file) {
    if (files.has(file)) return;
    if (lstatSync(file).isSymbolicLink()) throw new Error(`Build input must not be a symlink: ${relative(ROOT, file)}`);
    const content = readFileSync(file);
    files.set(file, digest(content));
    // site-config consumes only this app's route from the registry; that route is
    // already in the key. Other direct consumers (portfolio) hash the full registry.
    if (file === join(ROOT, "scripts/site-config.mjs") || !/\.(?:[cm]?[jt]sx?|astro|css)$/.test(file)) return;
    for (const match of content.toString().matchAll(/(?:from\s*|import\s*\(?\s*|@import\s*|new URL\(\s*)["'](\.[^"']+)["']/g)) {
      const target = resolve(dirname(file), match[1]);
      if (!target.startsWith(ROOT) || target.includes(`${sep}node_modules${sep}`)) throw new Error("Shared build inputs must be inside the repository.");
      const found = [target, ...[".ts", ".tsx", ".js", ".mjs", ".css", "/index.ts"].map((ext) => target + ext)].find((candidate) => existsSync(candidate) && lstatSync(candidate).isFile());
      if (found) add(found);
    }
  }
  for (const file of inputFiles(join(ROOT, "apps", app.name))) add(file);
  for (const name of ["build-site.mjs", "build-plan.mjs", "build-cache.mjs", "assemble-site.mjs", "site-config.mjs"]) add(join(ROOT, "scripts", name));
  // Root build configuration is shared; docs, scripts for scaffolding, and metadata
  // are not build inputs. Environment files are never read into the cache key.
  for (const entry of readdirSync(ROOT)) {
    if (/^(?:.*\.config\.[cm]?[jt]s|tsconfig.*\.json|pnpm-workspace\.yaml)$/.test(entry)) add(join(ROOT, entry));
  }
  return [...files].map(([file, hash]) => [relative(ROOT, file), hash]).sort(([a], [b]) => a.localeCompare(b));
}

export function buildPlan(origin) {
  const lock = read(join(ROOT, "pnpm-lock.yaml"));
  const pkg = JSON.parse(read(join(ROOT, "package.json")) || "{}");
  const tooling = Object.fromEntries(["packageManager", "engines", "dependencies", "devDependencies", "pnpm", "overrides"].map((key) => [key, pkg[key]]));
  return apps.map((app) => ({
    ...app, id: app.name.slice(3),
    fingerprint: digest(JSON.stringify({ version: 1, origin, base: app.base, name: app.name,
      node: process.version, platform: process.platform, arch: process.arch, tooling,
      resolution: resolutionKey(lock, `apps/${app.name}`), inputs: sourceKey(app) })),
  }));
}
