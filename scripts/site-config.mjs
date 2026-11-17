import { fileURLToPath } from "node:url";
import { APPS, getRubro } from "../packages/webmaster-kit/rubros.ts";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
export const apps = APPS.map((app) => ({
  name: `wm-${app.id}`,
  base: getRubro(app.id)?.demoUrl ?? "/",
}));

export function siteOrigin(value = process.env.PUBLIC_SITE_URL ?? "https://webmaster-studio.pages.dev") {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error();
    return url.origin;
  } catch {
    throw new Error("PUBLIC_SITE_URL must be an http(s) origin without credentials, path, query or fragment.");
  }
}

export function appConfig(id) {
  return {
    site: siteOrigin(),
    base: process.env.WM_DEPLOYMENT === "1" ? getRubro(id)?.demoUrl ?? (id === "portfolio" ? "/" : `/demos/${id}/`) : "/",
    trailingSlash: "always",
    ...(process.env.WM_BUILD_DIR ? { outDir: process.env.WM_BUILD_DIR } : {}),
  };
}

export function noArguments(args, usage) {
  if (args.length === 1 && args[0] === "--help") {
    console.log(usage);
    return false;
  }
  if (args.length) throw new Error(`Unknown argument: ${args[0]}. Use --help.`);
  return true;
}
