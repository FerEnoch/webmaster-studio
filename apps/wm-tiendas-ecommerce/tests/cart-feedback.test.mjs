// Tests determinísticos del feedback de carrito (T8 / S11-S13): portadas
// reales del portfolio, copy "carrito" y confirmación accesible en TRAMA.
// node --test apps/wm-tiendas-ecommerce/tests/*.test.mjs
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const has = (path) => existsSync(new URL(path, import.meta.url));

// Fuentes TRAMA tocadas por el renombre a carrito (legal.astro y
// CheckoutReceipt.astro autorizados por el coordinador, solo wording).
const tramaTouched = [
  "src/layouts/Base.astro",
  "src/pages/index.astro",
  "src/pages/catalogo.astro",
  "src/pages/producto/[id].astro",
  "src/pages/carrito.astro",
  "src/pages/checkout.astro",
  "src/pages/legal.astro",
  "src/components/CheckoutReceipt.astro",
];

test("S12: cero 'bolsa' user-facing en las fuentes TRAMA tocadas, el portfolio y los docs", () => {
  const files = [
    ...tramaTouched.map((p) => `../${p}`),
    "../../wm-portfolio/src/content/portfolio.ts",
    "../../../docs/e2e.md",
    "../../../tests/e2e/tiendas.spec.mjs",
    "../../../tests/e2e/catalogue-capabilities.spec.mjs",
  ];
  for (const file of files) {
    assert.ok(has(file), `Falta el archivo: ${file}`);
    assert.doesNotMatch(read(file), /bolsa/i, `${file} todavía habla de bolsa`);
  }
});

test("S12: el copy visible dice carrito (es-AR) y la clave interna no cambia", () => {
  assert.match(read("../src/layouts/Base.astro"), />Carrito </);
  assert.match(read("../src/layouts/Base.astro"), /aria-label="Ver carrito"/);
  assert.match(read("../src/pages/carrito.astro"), /Mi carrito · Trama/);
  assert.match(read("../src/pages/carrito.astro"), /Tu carrito está vacío\./);
  assert.match(read("../src/pages/carrito.astro"), /Vaciar el carrito/);
  assert.match(read("../src/pages/producto/[id].astro"), /Agregar al carrito/);
  assert.match(read("../src/pages/producto/[id].astro"), /Ver mi carrito/);
  assert.match(read("../src/pages/checkout.astro"), /Carrito \/ Entrega y pago/);
  assert.match(read("../src/pages/checkout.astro"), /Editar carrito/);
  assert.match(read("../src/components/CheckoutReceipt.astro"), /El carrito quedó vacío\./);
  assert.match(read("../src/lib/shop.ts"), /CART_KEY = "trama-cart-v1"/);
});

test("S13: la ficha dispara el aviso con el detalle de la línea agregada", () => {
  const page = read("../src/pages/producto/[id].astro");
  assert.match(page, /<CartToast\s/);
  assert.match(page, /new CustomEvent\("trama:cart", \{ detail: \{ line/);
  assert.match(page, /Agregar al carrito/);
});

test("S13: el panel de confirmación existe, es educado y no roba foco ni usa red", () => {
  assert.ok(has("../src/components/CartToast.astro"), "Falta CartToast.astro");
  const toast = read("../src/components/CartToast.astro");
  assert.match(toast, /role="status"/);
  assert.match(toast, /aria-live="polite"/);
  assert.match(toast, /Agregado a tu carrito/);
  assert.match(toast, />Ver tu carrito</);
  assert.match(toast, /appUrl\("\/carrito"\)/);
  assert.match(toast, />Seguir explorando</);
  assert.match(toast, /appUrl\("\/catalogo"\)/);
  assert.match(toast, /data-cart-toast-close/);
  assert.match(toast, /Cerrar aviso de carrito/);
  assert.match(toast, /Escape/);
  assert.doesNotMatch(toast, /\.focus\(/);
  assert.doesNotMatch(toast, /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|https?:\/\/\//);
});

test("S13: estilos fijos (sin corrimiento), motion-safe y objetivos de 44px", () => {
  const css = read("../src/styles/global.css");
  assert.match(css, /\.wm-toast\s*\{[^}]*position:\s*fixed/);
  assert.match(css, /\.wm-toast\s+\.wm-btn\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\.wm-toast__close\s*\{[^}]*width:\s*44px[^}]*height:\s*44px/);
  const gate = css.lastIndexOf("@media (prefers-reduced-motion: no-preference)");
  assert.ok(gate >= 0, "falta el gate de prefers-reduced-motion");
  const gated = css.slice(gate);
  assert.match(gated, /animation:\s*wm-toast-in\b/);
  assert.match(gated, /animation:\s*wm-bump\b/);
  // Los keyframes del bloque animado solo tocan transform/opacity.
  for (const chunk of gated.split("@keyframes").slice(1)) {
    const props = [...chunk.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
    assert.ok(props.length > 0, "keyframe vacío");
    for (const prop of props) {
      assert.match(prop, /^(opacity|transform)$/, `keyframe anima layout: ${prop}`);
    }
  }
});

test("S13: el contador del header queda veraz y avisa con bump solo por CSS", () => {
  const base = read("../src/layouts/Base.astro");
  assert.match(base, /data-wm-cartcount/);
  assert.match(base, /dataset\.bump/, "falta el disparo del bump en el header");
  assert.match(base, /addEventListener\("trama:cart"/);
  assert.match(base, /addEventListener\("storage"/);
  assert.match(base, /addEventListener\("pageshow"/);
  assert.match(base, /localStorage\.getItem\(CART_KEY\)/);
  assert.doesNotMatch(base, /localStorage\.(setItem|removeItem)/);
});

test("S11: portadas reales, locales, óptimas, distintas y acreditadas", () => {
  const media = read("../../wm-portfolio/src/lib/media.ts");
  assert.doesNotMatch(media, /data:image\/svg\+xml/, "la portada sigue siendo SVG");
  assert.match(media, /locales-catalogo-cover/);
  assert.match(media, /tiendas-ecommerce-cover/);
  const portfolio = read("../../wm-portfolio/src/content/portfolio.ts");
  assert.match(portfolio, /apparelCovers\["locales-catalogo"\]/);
  assert.match(portfolio, /apparelCovers\["tiendas-ecommerce"\]/);

  const credits = read("../../wm-portfolio/public/media/ATTRIBUTION.txt");
  const covers = [
    ["locales-catalogo-cover", "mwa_nzFpnJw"],
    ["tiendas-ecommerce-cover", "15694146"],
  ];
  const bytes = {};
  for (const [file, source] of covers) {
    assert.ok(credits.includes(file), `Falta crédito: ${file}`);
    assert.ok(credits.includes(source), `Falta fuente: ${file}`);
    assert.match(credits, /unsplash\.com\/license|Pexels License/);
    for (const width of [480, 800]) {
      const name = `../../wm-portfolio/public/media/${file}-${width}.webp`;
      assert.ok(has(name), `Falta ${name}`);
      const asset = readFileSync(new URL(name, import.meta.url));
      assert.equal(asset.toString("ascii", 0, 4), "RIFF", `${name} no es WebP`);
      assert.equal(asset.toString("ascii", 8, 12), "WEBP", `${name} no es WebP`);
      assert.ok(asset.length < 240_000, `${name} pesa demasiado`);
      if (width === 800) bytes[file] = asset;
    }
  }
  assert.ok(!bytes[covers[0][0]].equals(bytes[covers[1][0]]), "las portadas deben ser distintas");

  // La tarjeta renderiza las portadas con dimensiones y carga diferida.
  const card = read("../../wm-portfolio/src/components/SolutionCard.astro");
  assert.match(card, /apparelCovers/);
  assert.match(card, /loading="lazy"/);
  assert.match(card, /width=\{800\}/);
  assert.match(card, /height=\{500\}/);
});
