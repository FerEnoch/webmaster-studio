import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { PRODUCTS } from "../src/lib/shop.ts";

// Run against a deployment-mode build, optionally overriding its output directory.
const output = process.env.WM_PHOTO_BUILD_DIR ?? fileURLToPath(new URL("../dist/deployed", import.meta.url));
const base = "/demos/tiendas-ecommerce/";
const readPage = (route = "") => readFileSync(resolve(output, route, "index.html"), "utf8");
const photos = (html) => [...html.matchAll(/<img\b[^>]*>/g)]
  .map(([tag]) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])))
  .filter(({ src }) => src?.includes("/media/"));

function checkPhoto(photo, priority) {
  assert.match(photo.alt, /\S/);
  assert.ok(Number(photo.width) > 0 && Number(photo.height) > 0, "Reserve image space");
  assert.equal(photo.loading, priority === "high" ? "eager" : "lazy");
  assert.equal(photo.fetchpriority === "high", priority === "high");
  assert.match(photo.sizes, /\S/);
  const candidates = photo.srcset.split(", ").map((entry) => entry.split(" "));
  assert.ok(candidates.length >= 2, "Offer at least two widths");
  assert.ok(candidates.some(([path, width]) => path === photo.src && width === photo.width + "w"));
  for (const path of [photo.src, ...candidates.map(([path]) => path)]) {
    assert.ok(path.startsWith(base + "media/"), path + " must be self-hosted under the deployed base");
    const bytes = readFileSync(resolve(output, path.slice(base.length)));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.ok(bytes.length < 240_000, path + " is too large");
  }
}

test("home has a priority editorial photo and three lazy featured product photos", () => {
  const images = photos(readPage());
  assert.equal(images.length, 4);
  checkPhoto(images[0], "high");
  images.slice(1).forEach((photo) => checkPhoto(photo));
});

test("all six catalogue cards show distinct local product photos", () => {
  const images = photos(readPage("catalogo"));
  assert.equal(images.length, PRODUCTS.length);
  assert.equal(new Set(images.map(({ src }) => src)).size, PRODUCTS.length);
  images.forEach((photo, index) => checkPhoto(photo, index === 0 ? "high" : undefined));
});

test("each detail describes its reference photo without replacing variant choices or stock", () => {
  const catalogue = photos(readPage("catalogo"));
  PRODUCTS.forEach((product, index) => {
    const html = readPage("producto/" + product.id);
    const [main, ...related] = photos(html);
    assert.ok(main, product.id + " needs a detail photo");
    checkPhoto(main, "high");
    assert.equal(main.alt, catalogue[index].alt);
    assert.match(html, /<figcaption[^>]*>Foto ilustrativa\.[^<]*<\/figcaption>/);
    assert.equal(related.length, 3);
    related.forEach((photo) => checkPhoto(photo));
    const stock = html.match(/<script[^>]*data-variantes[^>]*>([^<]*)<\/script>/);
    assert.deepEqual(JSON.parse(stock[1]), product.stock);
    for (const color of product.colores) assert.ok(html.includes('name="color" value="' + color.id + '"'));
    assert.doesNotMatch(html, /ilustración original/i);
  });
});
