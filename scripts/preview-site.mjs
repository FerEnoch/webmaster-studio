import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./site-config.mjs";

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon", ".mp4": "video/mp4" };

export function createPreviewServer(directory = join(ROOT, "dist")) {
  const root = resolve(directory);
  return createServer((request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      let file = resolve(root, `.${pathname}`);
      if (file !== root && !file.startsWith(root + sep)) {
        response.writeHead(404).end();
        return;
      }
      if (existsSync(file) && statSync(file).isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          response.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end();
          return;
        }
        file = join(file, "index.html");
      }
      const found = existsSync(file) && statSync(file).isFile();
      if (!found) file = join(root, "404.html");
      response.writeHead(found ? 200 : 404, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
      response.end(request.method === "HEAD" ? undefined : readFileSync(file));
    } catch {
      response.writeHead(400).end("Bad request");
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    let port = 4321;
    if (args.length === 1 && args[0] === "--help") {
      console.log("Usage: node scripts/preview-site.mjs [--port <1-65535>] [--help]\nServe the integrated dist/ on 127.0.0.1 (default port 4321), with real 404 responses.");
    } else {
      if (args[0] === "--port") {
        port = Number(args[1]);
        if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("--port requires an integer between 1 and 65535.");
        args.splice(0, 2);
      }
      if (args.length) throw new Error(`Unknown argument: ${args[0]}. Use --help.`);
      if (!existsSync(join(ROOT, "dist/index.html"))) throw new Error("Missing dist/. Run pnpm build first.");
      const server = createPreviewServer();
      server.on("error", (error) => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
      server.listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}/`));
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}
