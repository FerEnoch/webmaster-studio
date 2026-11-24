import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PRODUCTS } from "../src/lib/products.ts";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("TELAR renders local reference photography on the landing, catalogue, collections and product pages", () => {
  for (const page of ["index", "catalogo", "colecciones", "producto/[id]"]) {
    const source = read(`../src/pages/${page}.astro`);
    assert.match(source, /<ProductPhoto\s/, page);
    assert.doesNotMatch(source, /<GarmentArt\s/, page);
  }
  const component = read("../src/components/ProductPhoto.astro");
  assert.match(component, /<img\s/);
  assert.match(component, /appUrl\(`\/media\//);
  assert.match(component, /alt=\{photo\.alt\}/);
  assert.match(read("../src/pages/producto/[id].astro"), /Foto de referencia/);

  const credits = read("../public/media/ATTRIBUTION.txt");
  const used = new Set();
  for (const { id, photo } of PRODUCTS) {
    assert.ok(photo?.alt, id);
    assert.ok(!used.has(photo.file), `Duplicate photo: ${id}`);
    used.add(photo.file);
    for (const size of [480, 960]) {
      const file = `${photo.file}-${size}.webp`;
      const asset = readFileSync(new URL(`../public/media/${file}`, import.meta.url));
      assert.equal(asset.toString("ascii", 8, 12), "WEBP", file);
      assert.ok(asset.length < 200_000, file);
      assert.ok(credits.includes(file), `Missing credit: ${file}`);
    }
  }
});
