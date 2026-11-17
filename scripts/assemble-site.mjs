import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { apps } from "./site-config.mjs";

// Merge the portfolio catalogue and demo subtrees; never overwrite an asset.
function copyTree(source, destination) {
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const target = join(destination, entry.name);
    if (entry.isDirectory()) copyTree(join(source, entry.name), target);
    else {
      if (existsSync(target)) throw new Error(`Output collision: ${target}`);
      cpSync(join(source, entry.name), target, { errorOnExist: true, force: false });
    }
  }
}

export function assembleSite(builds, destination) {
  for (const app of apps) {
    const source = join(builds, app.name);
    if (!existsSync(join(source, "index.html"))) throw new Error(`Missing build: ${app.name}`);
    copyTree(source, join(destination, app.base));
  }
  if (!existsSync(join(destination, "404.html"))) throw new Error("Missing root 404.html.");
}
