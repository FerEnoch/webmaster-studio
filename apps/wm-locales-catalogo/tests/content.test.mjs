// Tests determinísticos de TELAR (catálogo, sin compra).
// node --test apps/wm-locales-catalogo/tests/
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AVAILABILITY_LABEL, COLECCIONES, PRODUCTS, availabilityOf, formatPrice, matchesFilters, productById } from "../src/lib/products.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("catalogo", () => {
  it("tiene ocho prendas con ids únicos y precios finales", () => {
    assert.equal(PRODUCTS.length, 8);
    assert.equal(new Set(PRODUCTS.map((p) => p.id)).size, 8);
    for (const p of PRODUCTS) {
      assert.ok(p.precio > 0, p.id);
      assert.ok(p.colores.length >= 2, p.id);
      assert.ok(p.talles.length >= 3, p.id);
      assert.ok(p.stock.length > 0, p.id);
    }
  });

  it("cubre los tres estados de disponibilidad", () => {
    const states = new Set(PRODUCTS.map(availabilityOf));
    assert.ok(states.has("en-stock"));
    assert.ok(states.has("ultimas"));
    assert.ok(states.has("agotado"));
  });

  it("combina talle, color y disponibilidad sobre la misma variante", () => {
    const shirt = productById("camisa-lino");
    const filters = { categoria: "Camisas", talle: "M", color: "arena", disponibilidad: "en-stock" };
    assert.equal(matchesFilters(shirt, filters), false);
    assert.equal(matchesFilters(shirt, { ...filters, disponibilidad: "agotado" }), true);
    assert.equal(matchesFilters(shirt, { ...filters, color: "crudo" }), true);
  });

  it("todas las colecciones referenciadas existen", () => {
    const ids = new Set(COLECCIONES.map((c) => c.id));
    for (const p of PRODUCTS) assert.ok(ids.has(p.coleccion), p.id);
    assert.equal(COLECCIONES.length, 3);
  });

  it("productById y formatPrice se comportan", () => {
    assert.equal(productById("camisa-lino")?.nombre, "Camisa de lino");
    assert.equal(productById("no-existe"), undefined);
    assert.equal(formatPrice(58000), "$ 58.000");
    assert.deepEqual(Object.keys(AVAILABILITY_LABEL).sort(), ["agotado", "en-stock", "ultimas"]);
  });
});

describe("sin funnel de compra", () => {
  const pages = readdirSync(join(root, "src/pages"), { recursive: true }).filter((f) => String(f).endsWith(".astro"));
  assert.ok(pages.length >= 6, `rutas: ${pages.length}`);
  for (const page of pages) {
    const src = readFileSync(join(root, "src/pages", String(page)), "utf8").toLowerCase();
    assert.ok(!src.includes("carrito"), `${page} no menciona carrito`);
    assert.ok(!src.includes("checkout"), `${page} no menciona checkout`);
    assert.ok(!src.includes("agregar a la bolsa"), `${page} sin CTA de compra`);
  }
});

describe("estudio y medios", () => {
  const layouts = readFileSync(join(root, "src/layouts/Base.astro"), "utf8");
  assert.ok(layouts.includes("Ir a Webmaster Studio"), "link al estudio en el layout");
  assert.ok(layouts.includes('data-astro-reload'), "recarga Astro en el link");
  const all = readdirSync(join(root, "src"), { recursive: true })
    .filter((f) => String(f).endsWith(".astro") || String(f).endsWith(".css"))
    // Deployment pins this unused kit snapshot byte-for-byte, including its font links.
    .filter((f) => f !== join("components", "ui", "BaseLayout.astro"))
    .map((f) => readFileSync(join(root, "src", String(f)), "utf8"))
    .join("\n");
  assert.doesNotMatch(all, /\bBaseLayout\b/, "el layout del kit no se usa en la tienda");
  for (const host of ["unsplash", "mixkit", "fonts.googleapis", "fonts.gstatic"]) {
    assert.ok(!all.toLowerCase().includes(host), `sin medios externos: ${host}`);
  }
});
