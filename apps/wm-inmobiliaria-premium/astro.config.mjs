import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { appConfig } from "../../scripts/site-config.mjs";

export default defineConfig({
  ...appConfig("inmobiliaria-premium"),
  output: "static",
  server: { port: 3033, host: "127.0.0.1" },
  preview: { port: 3033, host: "127.0.0.1" },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
      },
    },
  },
});
