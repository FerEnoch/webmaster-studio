// Tests determinísticos de TRAMA (carrito + checkout simulado).
// node --test apps/wm-tiendas-ecommerce/tests/*.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CART_KEY,
  DELIVERY,
  PAY_METHODS,
  PRODUCTS,
  addLine,
  formatPrice,
  parseCart,
  productById,
  setLineQty,
  stockOf,
  totals,
} from "../src/lib/shop.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("catalogo", () => {
  it("tiene seis prendas con variantes con stock", () => {
    assert.equal(PRODUCTS.length, 6);
    assert.equal(new Set(PRODUCTS.map((p) => p.id)).size, 6);
    for (const p of PRODUCTS) {
      assert.ok(p.colores.length >= 2, p.id);
      assert.ok(p.talles.length >= 2, p.id);
      assert.ok(p.stock.some((v) => v.qty > 0), p.id);
    }
  });

  it("formatPrice y stockOf", () => {
    assert.equal(formatPrice(32000), "$ 32.000");
    assert.equal(productById("gorra-bordada")?.nombre, "Gorra bordada");
    assert.equal(stockOf("hoodie-capucha", "gris", "L"), 0);
    assert.ok(stockOf("remera-pesada", "negro", "M") > 0);
  });
});

describe("carrito", () => {
  it("addLine respeta el stock de la variante", () => {
    const max = stockOf("remera-pesada", "verde", "L"); // 1
    let cart = addLine([], { producto: "remera-pesada", color: "verde", size: "L", qty: 5 });
    assert.equal(cart[0].qty, Math.min(5, max));
    cart = addLine(cart, { producto: "remera-pesada", color: "verde", size: "L", qty: 5 });
    assert.equal(cart[0].qty, max);
    assert.deepEqual(addLine([], { producto: "hoodie-capucha", color: "gris", size: "L", qty: 1 }), []);
  });

  it("setLineQty edita y elimina en cero", () => {
    let cart = [{ producto: "cargo-ancho", color: "negro", size: "M", qty: 1 }];
    cart = setLineQty(cart, "cargo-ancho", "negro", "M", 3);
    assert.equal(cart[0].qty, 3);
    cart = setLineQty(cart, "cargo-ancho", "negro", "M", 99);
    assert.equal(cart[0].qty, stockOf("cargo-ancho", "negro", "M"));
    assert.deepEqual(setLineQty(cart, "cargo-ancho", "negro", "M", 0), []);
  });

  it("totals suma subtotal y entrega determinística", () => {
    const cart = [
      { producto: "remera-pesada", color: "negro", size: "M", qty: 1 },
      { producto: "gorra-bordada", color: "negro", size: "M", qty: 2 },
    ];
    const retiro = totals(cart, "retiro");
    assert.equal(retiro.count, 3);
    assert.equal(retiro.subtotal, 32000 + 2 * 22000);
    assert.equal(retiro.shipping, 0);
    assert.equal(retiro.total, retiro.subtotal);
    assert.equal(totals(cart, "caba").shipping, 4900);
    assert.equal(totals(cart, "interior").shipping, 9900);
    assert.deepEqual(totals([], "caba"), { count: 0, subtotal: 0, shipping: 0, total: 0 });
  });

  it("parseCart solo conserva ids y cantidades válidas", () => {
    const cart = parseCart([
      { producto: "remera-pesada", color: "negro", size: "M", qty: 2 },
      { producto: "remera-pesada", color: "negro", size: "M", qty: 99 },
      { producto: "no-existe", color: "x", size: "M", qty: 1 },
      { producto: "hoodie-capucha", color: "gris", size: "L", qty: 1 },
      { nombre: "Ana", email: "ana@x.com", tarjeta: "1234" },
      "basura",
    ]);
    assert.equal(cart.length, 1);
    assert.deepEqual(Object.keys(cart[0]).sort(), ["color", "producto", "qty", "size"]);
    assert.ok(cart[0].qty <= stockOf("remera-pesada", "negro", "M"));
    assert.equal(CART_KEY, "trama-cart-v1");
  });
});

describe("checkout simulado", () => {
  it("entregas determinísticas y dos medios completos", () => {
    assert.deepEqual(DELIVERY.map((d) => d.id), ["retiro", "caba", "interior"]);
    assert.deepEqual(DELIVERY.map((d) => d.costo), [0, 4900, 9900]);
    assert.deepEqual(PAY_METHODS.map((m) => m.id), ["mercadopago", "modo"]);
  });

  it("el copy de tienda dice carrito en es-AR", () => {
    const page = (path) => readFileSync(join(root, path), "utf8");
    assert.match(page("src/layouts/Base.astro"), />Carrito </);
    assert.match(page("src/layouts/Base.astro"), /aria-label="Ver carrito"/);
    assert.match(page("src/pages/carrito.astro"), /Mi carrito · Trama/);
    assert.match(page("src/pages/carrito.astro"), /Tu carrito está vacío\./);
    assert.match(page("src/pages/carrito.astro"), /Vaciar el carrito/);
    assert.match(page("src/pages/index.astro"), /Armá el carrito/);
    assert.match(page("src/pages/index.astro"), /Ver mi carrito/);
    assert.match(page("src/pages/catalogo.astro"), /agregar al carrito/);
    assert.match(page("src/pages/producto/[id].astro"), /Agregar al carrito/);
    assert.match(page("src/pages/producto/[id].astro"), /aria-label="Agregar al carrito"/);
    assert.match(page("src/pages/producto/[id].astro"), /ya está en tu carrito/);
    assert.match(page("src/pages/checkout.astro"), /Carrito \/ Entrega y pago/);
    assert.match(page("src/pages/checkout.astro"), /Editar carrito/);
    assert.match(page("src/pages/checkout.astro"), /Tu carrito está vacío\./);
    assert.match(page("src/pages/legal.astro"), /del carrito en tu navegador/);
    assert.match(page("src/components/CheckoutReceipt.astro"), /El carrito quedó vacío\./);
  });

  it("checkout admite un solo correo de prueba sin formulario ni persistencia", () => {
    const src = readFileSync(join(root, "src/pages/checkout.astro"), "utf8");
    const fields = (src.match(/<input\b[^>]*>/gi) ?? []).filter((tag) => !/type="radio"/i.test(tag));
    assert.equal(fields.length, 1);
    assert.match(fields[0], /type="email"/);
    assert.match(fields[0], /\brequired\b/);
    assert.match(fields[0], /autocomplete="off"/);
    assert.doesNotMatch(fields[0], /\bname\s*=/);
    const receipt = readFileSync(join(root, "src/components/CheckoutReceipt.astro"), "utf8");
    assert.doesNotMatch(src + receipt, /<form\b|<textarea\b|contenteditable|\.setItem\s*\(|\bsessionStorage\b|\bindexedDB\b|\bdocument\.cookie\b/i);
  });

  it("las páginas de pago no usan red ni piden datos de pago", () => {
    for (const file of ["pages/checkout.astro", "pages/carrito.astro", "components/CheckoutReceipt.astro"]) {
      const src = readFileSync(join(root, "src", file), "utf8");
      assert.doesNotMatch(src, /\bfetch\s*\(|\b(?:XMLHttpRequest|sendBeacon|WebSocket|EventSource)\b|(?:https?:\/\/|mailto:)/i, `${file} sin red ni correo real`);
      assert.doesNotMatch(src, /type="(?:tel|password)"|name="tarjeta"|card-number|cc-number/i, `${file} sin datos de pago`);
      if (!file.endsWith("/checkout.astro")) assert.doesNotMatch(src, /type="email"/i);
      assert.match(src, /Simulaci/i, `${file} declara la simulación`);
    }
  });
});

describe("estudio y medios", () => {
  it("un solo link al estudio y arte local", () => {
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
    const layout = readFileSync(join(root, "src/layouts/Base.astro"), "utf8");
    assert.equal(layout.match(/>Ir a Webmaster Studio\b/g)?.length, 1);
  });
});
