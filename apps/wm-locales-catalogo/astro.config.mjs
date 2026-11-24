// Configuracion base de la app Telar (catálogo online).
// Igual que el resto del kit: solo cambian el puerto y el id del rubro.
// Sin integraciones cliente: CSS propio + JS vanilla. Sin fuentes ni
// medios externos (todo el arte es SVG original en src/components).
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import { appConfig } from "../../scripts/site-config.mjs";

export default defineConfig({
  ...appConfig("locales-catalogo"),
  server: { port: 3028, host: true },
  preview: { port: 3028, host: true },
  vite: {
    resolve: {
      alias: {
        "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
      },
    },
  },
});
