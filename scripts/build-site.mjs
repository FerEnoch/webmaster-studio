import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { assembleSite } from "./assemble-site.mjs";
import { apps, noArguments, ROOT, siteOrigin } from "./site-config.mjs";
import { buildPlan } from "./build-plan.mjs";
import { reuseBuild, storeBuild, writeReport } from "./build-cache.mjs";

let stage;
try {
  const args = process.argv.slice(2);
  const check = args[0] === "--check";
  if (noArguments(check ? args.slice(1) : args, "Usage: node scripts/build-site.mjs [--check] [--help]\nBuild all registered apps for one Pages deployment into dist/, reusing integrity-verified matching outputs.\n--check runs Astro check for affected apps before building. Set PUBLIC_SITE_URL for canonical URLs.\nReport: .build-cache/build-report.json (built/reused/affected app ids). See docs/builds.md.")) {
    const origin = siteOrigin();
    const plan = buildPlan(origin);
    const built = [], reused = [];
    // Astro moves prerendered CSS with rename from the app's .astro directory.
    // Keep generated staging output on the repository filesystem (EXDEV otherwise).
    stage = mkdtempSync(join(ROOT, ".dist-stage-"));
    for (const app of plan) {
      const output = join(stage, app.name);
      if (reuseBuild(app, output)) {
        reused.push(app.id);
        continue;
      }
      for (const command of check ? ["check", "build"] : ["build"]) {
        const result = spawnSync("pnpm", ["--filter", app.name, "run", command], {
          cwd: ROOT, encoding: "utf8", stdio: "inherit", timeout: 300000,
          env: { ...process.env, PUBLIC_SITE_URL: origin, WM_DEPLOYMENT: "1", WM_BUILD_DIR: output },
        });
        if (result.error) throw result.error;
        if (result.status !== 0) throw new Error(`${command === "build" ? "Build" : "Check"} failed: ${app.name} (exit ${result.status}).`);
      }
      built.push(app.id);
    }
    const assembled = join(stage, "site");
    assembleSite(stage, assembled);
    // Cache writes happen only after the entire tree passes assembly validation.
    for (const app of plan.filter((app) => built.includes(app.id))) storeBuild(app, join(stage, app.name), stage);
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
    writeReport(plan, built, reused, origin, stage);
    console.log(`Built ${apps.length} apps into dist/.`);
    console.log(`Cache: built ${built.length}, reused ${reused.length}. Report: .build-cache/build-report.json`);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (stage) rmSync(stage, { recursive: true, force: true });
}
