// Configuracion base de una app del kit webmaster.
// El unico cambio por app es el puerto y la URL del sitio.
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { appConfig } from "../../scripts/site-config.mjs";

export default defineConfig({
  ...appConfig("__APP_NAME__".slice(3)),
  server: { port: __PORT__, host: true },
  preview: { port: __PORT__, host: true },
  integrations: [react()],
  vite: {
    // Tailwind v4 como plugin de Vite (no PostCSS).
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
      },
    },
  },
});
