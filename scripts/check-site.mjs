import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { once } from "node:events";
import { createPreviewServer } from "./preview-site.mjs";
import { apps, ROOT, siteOrigin } from "./site-config.mjs";

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}
const decode = (text) => text.replaceAll("&amp;", "&").replaceAll("&#38;", "&").replaceAll("&quot;", '"');
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map((match) => [match[1], decode(match[2] ?? "")]));
const owner = (path) => apps.find((app) => app.base !== "/" && path.startsWith(app.base))?.base ?? "/";

let server;
try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    console.log("Usage: node scripts/check-site.mjs [--url <http(s)-origin>] [--help]\nCheck every built route, local link/anchor, canonical, isolated asset and HTTP 404/MIME.\nWithout --url, start a temporary loopback preview. PUBLIC_SITE_URL is the expected canonical origin.");
  } else {
    let origin;
    if (args[0] === "--url" && args[1]) {
      origin = siteOrigin(args[1]);
      args.splice(0, 2);
    }
    if (args.length) throw new Error(`Unknown argument: ${args[0]}. Use --help.`);
    const canonicalOrigin = siteOrigin();
    const directory = join(ROOT, "dist");
    const paths = files(directory).map((file) => "/" + relative(directory, file).split("\\").join("/"));
    const routes = paths.filter((path) => path.endsWith("/index.html")).map((path) => path.slice(0, -10));
    for (const app of apps) {
      assert.ok(routes.includes(app.base), `Missing app root: ${app.base}`);
      assert.ok(routes.some((route) => route.startsWith(app.base) && route !== app.base && owner(route) === app.base), `Missing nested pages: ${app.name}`);
    }
    assert.ok(routes.includes("/demos/"), "Missing portfolio catalogue: /demos/");
    if (!origin) {
      server = createPreviewServer(directory);
      server.listen(0, "127.0.0.1");
      await once(server, "listening");
      origin = `http://127.0.0.1:${server.address().port}`;
    }
    const responses = new Map();
    async function get(path) {
      if (!responses.has(path)) {
        const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(10000) });
        responses.set(path, { status: response.status, type: response.headers.get("content-type") ?? "", text: await response.text() });
      }
      return responses.get(path);
    }
    const pages = new Map();
    for (const route of routes) {
      const page = await get(route);
      assert.equal(page.status, 200, `Route: ${route}`);
      assert.match(page.type, /^text\/html/, `HTML MIME: ${route}`);
      const tags = [...page.text.matchAll(/<(?:a|link|script|astro-island|img|video|source)\b[^>]*>/g)].map(([tag]) => ({ tag, attrs: attributes(tag) }));
      const canonical = tags.find(({ attrs }) => attrs.rel === "canonical")?.attrs.href;
      assert.equal(canonical, canonicalOrigin + route, `Canonical: ${route}`);
      assert.ok(page.text.includes(`property="og:url" content="${canonical}"`), `OG URL: ${route}`);
      pages.set(route, { ...page, tags });
    }
    let links = 0;
    for (const [route, page] of pages) {
      for (const { tag, attrs } of page.tags) {
        if (tag.startsWith("<a") && !tag.startsWith("<astro-")) {
          if (!attrs.href || /^(?:https?:|mailto:|tel:|\/\/)/.test(attrs.href)) {
            assert.ok(!attrs.href?.includes(".vercel.app"), `Obsolete demo origin: ${route}`);
            continue;
          }
          const target = new URL(attrs.href, origin + route);
          const destination = await get(target.pathname);
          assert.equal(destination.status, 200, `Link: ${route} -> ${attrs.href}`);
          if (target.hash) {
            const id = decodeURIComponent(target.hash.slice(1));
            assert.ok(destination.text.includes(`id="${id}"`), `Anchor: ${route} -> ${attrs.href}`);
          }
          if (owner(route) !== owner(target.pathname)) assert.ok(Object.hasOwn(attrs, "data-astro-reload"), `Cross-app router boundary: ${route} -> ${attrs.href}`);
          links += 1;
        }
        const assets = [attrs.src, attrs.poster, attrs["component-url"], attrs["renderer-url"], attrs.rel === "stylesheet" ? attrs.href : undefined].filter((href) => href?.startsWith("/") && !href.startsWith("//"));
        for (const asset of assets) {
          const response = await get(asset);
          assert.equal(response.status, 200, `Asset: ${route} -> ${asset}`);
          if (asset.includes("/_astro/")) assert.ok(asset.startsWith(owner(route) + "_astro/"), `Asset isolation: ${route} -> ${asset}`);
        }
      }
    }
    for (const app of apps.filter((app) => app.base !== "/")) {
      assert.ok(pages.get("/demos/").tags.some(({ attrs }) => attrs.href === app.base), `Catalogue link: ${app.base}`);
    }
    const assets = paths.filter((path) => /\.(?:js|css)$/.test(path));
    for (const asset of assets) {
      const response = await get(asset);
      assert.equal(response.status, 200, `Asset: ${asset}`);
      assert.match(response.type, asset.endsWith(".css") ? /^text\/css/ : /^(?:text|application)\/javascript/, `Asset MIME: ${asset}`);
    }
    for (const base of ["/", ...apps.filter((app) => app.base !== "/").map((app) => app.base)]) {
      for (const unknown of ["not-a-real-route/", "_astro/missing.js"]) {
        const response = await get(base + unknown);
        assert.equal(response.status, 404, `Unknown route must not fall back to index: ${base + unknown}`);
        assert.match(response.type, /^text\/html/, "404 MIME");
      }
    }
    console.log(`Checked 8 roots, ${routes.length} pages, ${assets.length} JS/CSS assets and ${links} links/anchors; canonical origin ${canonicalOrigin}; unknown routes return 404.`);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
