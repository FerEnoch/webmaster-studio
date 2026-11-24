// Catálogo y lógica de TRAMA — tienda con carrito y pago simulado.
// Marca ficticia. Precios ARS finales. Arte 100 % original (SVG local).
// Only cart variant identifiers and quantities persist. Checkout is local and ephemeral.

export interface TramaColor {
  id: string;
  nombre: string;
  hex: string;
}

export interface TramaVariant {
  color: string;
  size: string;
  qty: number;
}

export interface TramaProduct {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  detalles: string[];
  motivo: "remera" | "hoodie" | "cargo" | "campera" | "vestido" | "gorra";
  colores: TramaColor[];
  talles: string[];
  stock: TramaVariant[];
}

export interface CartLine {
  producto: string;
  color: string;
  size: string;
  qty: number;
}

export type DeliveryId = "retiro" | "caba" | "interior";
export type PayMethod = "mercadopago" | "modo";

export const DELIVERY = [
  { id: "retiro", nombre: "Retiro por el local", detalle: "Palermo, lunes a sábado de 10 a 20 h", costo: 0 },
  { id: "caba", nombre: "Envío CABA", detalle: "Correo local, 24 a 48 h hábiles", costo: 4900 },
  { id: "interior", nombre: "Envío al interior", detalle: "Correo, 3 a 6 días hábiles", costo: 9900 },
] as const;

export const PAY_METHODS = [
  { id: "mercadopago", nombre: "Mercado Pago", bajada: "Saldo o tarjeta en el paso de revisión." },
  { id: "modo", nombre: "MODO", bajada: "Aprobación desde la billetera." },
] as const;

export const PRODUCTS: TramaProduct[] = [
  {
    id: "remera-pesada",
    nombre: "Remera pesada 220",
    categoria: "Remeras",
    precio: 32000,
    descripcion: "Jersey pesado de 220 gramos, hombros caídos y cuello que aguanta.",
    detalles: ["Algodón 220 g", "Hombros caídos", "Calce oversize"],
    motivo: "remera",
    colores: [
      { id: "negro", nombre: "Negro", hex: "#232326" },
      { id: "crudo", nombre: "Crudo", hex: "#E8E0CE" },
      { id: "verde", nombre: "Verde", hex: "#3E5C43" },
    ],
    talles: ["S", "M", "L", "XL"],
    stock: [
      { color: "negro", size: "S", qty: 8 },
      { color: "negro", size: "M", qty: 10 },
      { color: "negro", size: "L", qty: 6 },
      { color: "negro", size: "XL", qty: 3 },
      { color: "crudo", size: "S", qty: 5 },
      { color: "crudo", size: "M", qty: 7 },
      { color: "crudo", size: "L", qty: 4 },
      { color: "crudo", size: "XL", qty: 0 },
      { color: "verde", size: "S", qty: 2 },
      { color: "verde", size: "M", qty: 3 },
      { color: "verde", size: "L", qty: 1 },
      { color: "verde", size: "XL", qty: 0 },
    ],
  },
  {
    id: "hoodie-capucha",
    nombre: "Hoodie con capucha",
    categoria: "Abrigos",
    precio: 78000,
    descripcion: "Frisa invisible, capucha doble y bolsillo canguro. El uniforme.",
    detalles: ["Frisa invisible", "Capucha doble", "Bolsillo canguro"],
    motivo: "hoodie",
    colores: [
      { id: "negro", nombre: "Negro", hex: "#232326" },
      { id: "gris", nombre: "Gris", hex: "#8A8A90" },
      { id: "terracota", nombre: "Terracota", hex: "#C96F4A" },
    ],
    talles: ["S", "M", "L", "XL"],
    stock: [
      { color: "negro", size: "S", qty: 4 },
      { color: "negro", size: "M", qty: 6 },
      { color: "negro", size: "L", qty: 5 },
      { color: "negro", size: "XL", qty: 2 },
      { color: "gris", size: "S", qty: 3 },
      { color: "gris", size: "M", qty: 5 },
      { color: "gris", size: "L", qty: 0 },
      { color: "gris", size: "XL", qty: 1 },
      { color: "terracota", size: "S", qty: 1 },
      { color: "terracota", size: "M", qty: 2 },
      { color: "terracota", size: "L", qty: 1 },
      { color: "terracota", size: "XL", qty: 0 },
    ],
  },
  {
    id: "cargo-ancho",
    nombre: "Cargo ancho",
    categoria: "Pantalones",
    precio: 69000,
    descripcion: "Gabardina con seis bolsillos y ruedo regulable. Hecho para durar.",
    detalles: ["Gabardina", "6 bolsillos", "Ruedo regulable"],
    motivo: "cargo",
    colores: [
      { id: "negro", nombre: "Negro", hex: "#232326" },
      { id: "arena", nombre: "Arena", hex: "#C9B183" },
    ],
    talles: ["S", "M", "L", "XL"],
    stock: [
      { color: "negro", size: "S", qty: 3 },
      { color: "negro", size: "M", qty: 5 },
      { color: "negro", size: "L", qty: 4 },
      { color: "negro", size: "XL", qty: 2 },
      { color: "arena", size: "S", qty: 2 },
      { color: "arena", size: "M", qty: 3 },
      { color: "arena", size: "L", qty: 1 },
      { color: "arena", size: "XL", qty: 0 },
    ],
  },
  {
    id: "campera-rompeviento",
    nombre: "Campera rompeviento",
    categoria: "Abrigos",
    precio: 95000,
    descripcion: "Liviana, impermeable y plegable en su propio bolsillo.",
    detalles: ["Impermeable", "Se pliega en el bolsillo", "Capucha regulable"],
    motivo: "campera",
    colores: [
      { id: "negro", nombre: "Negro", hex: "#232326" },
      { id: "azul", nombre: "Azul", hex: "#2F4A5E" },
    ],
    talles: ["S", "M", "L"],
    stock: [
      { color: "negro", size: "S", qty: 2 },
      { color: "negro", size: "M", qty: 3 },
      { color: "negro", size: "L", qty: 2 },
      { color: "azul", size: "S", qty: 1 },
      { color: "azul", size: "M", qty: 2 },
      { color: "azul", size: "L", qty: 0 },
    ],
  },
  {
    id: "vestido-utilitario",
    nombre: "Vestido utilitario",
    categoria: "Vestidos",
    precio: 74000,
    descripcion: "Escote cruzado y falda con bolsillos de verdad. Simple y útil.",
    detalles: ["Escote cruzado", "Bolsillos laterales", "Largo midi"],
    motivo: "vestido",
    colores: [
      { id: "negro", nombre: "Negro", hex: "#232326" },
      { id: "verde", nombre: "Verde", hex: "#3E5C43" },
    ],
    talles: ["XS", "S", "M", "L"],
    stock: [
      { color: "negro", size: "XS", qty: 2 },
      { color: "negro", size: "S", qty: 4 },
      { color: "negro", size: "M", qty: 3 },
      { color: "negro", size: "L", qty: 1 },
      { color: "verde", size: "XS", qty: 1 },
      { color: "verde", size: "S", qty: 2 },
      { color: "verde", size: "M", qty: 1 },
      { color: "verde", size: "L", qty: 0 },
    ],
  },
  {
    id: "gorra-bordada",
    nombre: "Gorra bordada",
    categoria: "Accesorios",
    precio: 22000,
    descripcion: "Cinco gajos con bordado frontal y hebilla regulable.",
    detalles: ["5 gajos", "Bordado frontal", "Talle regulable"],
    motivo: "gorra",
    colores: [
      { id: "negro", nombre: "Negro", hex: "#232326" },
      { id: "crudo", nombre: "Crudo", hex: "#E8E0CE" },
    ],
    talles: ["S", "M", "L"],
    stock: [
      { color: "negro", size: "S", qty: 6 },
      { color: "negro", size: "M", qty: 8 },
      { color: "negro", size: "L", qty: 5 },
      { color: "crudo", size: "S", qty: 3 },
      { color: "crudo", size: "M", qty: 4 },
      { color: "crudo", size: "L", qty: 0 },
    ],
  },
];

export const productById = (id: string): TramaProduct | undefined =>
  PRODUCTS.find((p) => p.id === id);

export const stockOf = (producto: string, color: string, size: string): number =>
  productById(producto)?.stock.find((v) => v.color === color && v.size === size)?.qty ?? 0;

export const formatPrice = (n: number): string => "$ " + n.toLocaleString("es-AR");

/** Suma unidades y subtotal; el envío se agrega aparte (determinístico). */
export function totals(
  cart: CartLine[],
  delivery: DeliveryId,
): { count: number; subtotal: number; shipping: number; total: number } {
  let count = 0;
  let subtotal = 0;
  for (const line of cart) {
    const p = productById(line.producto);
    if (!p) continue;
    count += line.qty;
    subtotal += p.precio * line.qty;
  }
  const shipping =
    count === 0 ? 0 : (DELIVERY.find((d) => d.id === delivery)?.costo ?? 0);
  return { count, subtotal, shipping, total: subtotal + shipping };
}

/** Agrega respetando el stock de la variante; devuelve el carrito nuevo. */
export function addLine(cart: CartLine[], line: CartLine): CartLine[] {
  const max = stockOf(line.producto, line.color, line.size);
  if (max <= 0 || !Number.isSafeInteger(line.qty) || line.qty < 1) return cart;
  const qty = Math.min(line.qty, max);
  const i = cart.findIndex(
    (l) => l.producto === line.producto && l.color === line.color && l.size === line.size,
  );
  if (i < 0) return [...cart, { ...line, qty }];
  const next = [...cart];
  next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, max) };
  return next;
}

export function setLineQty(
  cart: CartLine[],
  producto: string,
  color: string,
  size: string,
  qty: number,
): CartLine[] {
  const max = stockOf(producto, color, size);
  if (!Number.isSafeInteger(qty)) return cart;
  if (qty <= 0 || max === 0) return cart.filter((l) => !(l.producto === producto && l.color === color && l.size === size));
  return cart.map((l) =>
    l.producto === producto && l.color === color && l.size === size
      ? { ...l, qty: Math.min(qty, max) }
      : l,
  );
}

export const CART_KEY = "trama-cart-v1";

export function parseCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  let out: CartLine[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const { producto, color, size, qty } = item as Record<string, unknown>;
    if (typeof producto !== "string" || typeof color !== "string" || typeof size !== "string") continue;
    if (typeof qty !== "number") continue;
    out = addLine(out, { producto, color, size, qty });
  }
  return out;
}
