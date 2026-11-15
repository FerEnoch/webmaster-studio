import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { assembleSite } from "./assemble-site.mjs";
import { apps, noArguments, ROOT, siteOrigin } from "./site-config.mjs";

let stage;
try {
  if (noArguments(process.argv.slice(2), "Usage: node scripts/build-site.mjs [--help]\nBuild all seven apps for one Pages deployment into dist/. Set PUBLIC_SITE_URL for canonical URLs.")) {
    const origin = siteOrigin();
    // Astro moves prerendered CSS with rename from the app's .astro directory.
    // Keep generated staging output on the repository filesystem (EXDEV otherwise).
    stage = mkdtempSync(join(ROOT, ".dist-stage-"));
    for (const app of apps) {
      const result = spawnSync("pnpm", ["--filter", app.name, "run", "build"], {
        cwd: ROOT, encoding: "utf8", stdio: "inherit",
        env: { ...process.env, PUBLIC_SITE_URL: origin, WM_DEPLOYMENT: "1", WM_BUILD_DIR: join(stage, app.name) },
      });
      if (result.error) throw result.error;
      if (result.status !== 0) throw new Error(`Build failed: ${app.name} (exit ${result.status}).`);
    }
    const assembled = join(stage, "site");
    assembleSite(stage, assembled);
    const destination = join(ROOT, "dist");
    const previous = join(stage, "previous");
    const hadPrevious = existsSync(destination);
    if (hadPrevious) renameSync(destination, previous);
    try {
      renameSync(assembled, destination);
    } catch (error) {
      if (hadPrevious) renameSync(previous, destination);
      throw error;
    }
    console.log(`Built ${apps.length} apps into dist/.`);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (stage) rmSync(stage, { recursive: true, force: true });
}
