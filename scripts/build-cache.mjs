import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { digest } from "./build-plan.mjs";
import { ROOT } from "./site-config.mjs";

export const CACHE = join(ROOT, ".build-cache");

function contentKey(directory) {
  const files = [];
  function visit(path, prefix = "") {
    if (!lstatSync(path).isDirectory() || lstatSync(path).isSymbolicLink()) throw new Error("Invalid cached directory.");
    for (const name of readdirSync(path).sort()) {
      const file = join(path, name), stat = lstatSync(file), key = prefix + name;
      if (stat.isSymbolicLink()) throw new Error("Cached output must not contain symlinks.");
      if (stat.isDirectory()) visit(file, key + "/");
      else if (stat.isFile()) files.push([key, digest(readFileSync(file))]);
      else throw new Error("Cached output must contain regular files only.");
    }
  }
  visit(directory);
  if (!files.some(([name]) => name === "index.html")) throw new Error("Missing cached index.html.");
  return digest(JSON.stringify(files));
}

export function reuseBuild(app, destination) {
  const directory = join(CACHE, "outputs", app.fingerprint);
  try {
    const metadata = JSON.parse(readFileSync(directory + ".json", "utf8"));
    if (metadata.fingerprint !== app.fingerprint || metadata.content !== contentKey(directory)) return false;
    cpSync(directory, destination, { recursive: true, errorOnExist: true, force: false });
    return true;
  } catch {
    return false; // Missing, obsolete or corrupt cache is never authoritative.
  }
}

export function storeBuild(app, source, stage) {
  const content = contentKey(source);
  mkdirSync(join(CACHE, "outputs"), { recursive: true });
  const target = join(CACHE, "outputs", app.fingerprint);
  const pending = join(stage, "cache-" + app.name);
  cpSync(source, pending, { recursive: true });
  if (existsSync(target)) renameSync(target, join(stage, "obsolete-" + app.name));
  renameSync(pending, target);
  const metadata = join(stage, "metadata-" + app.name + ".json");
  writeFileSync(metadata, JSON.stringify({ fingerprint: app.fingerprint, content }));
  renameSync(metadata, target + ".json");
}

export function writeReport(plan, built, reused, origin, stage) {
  mkdirSync(CACHE, { recursive: true });
  const pending = join(stage, "build-report.json");
  writeFileSync(pending, JSON.stringify({ version: 1, origin, built, reused, affected: built,
    apps: plan.map(({ id, name, base, fingerprint }) => ({ id, name, base, fingerprint })),
  }, null, 2) + "\n");
  renameSync(pending, join(CACHE, "build-report.json"));
}
