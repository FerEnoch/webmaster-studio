// Catálogo de TELAR — tienda de ropa (solo catálogo, sin compra).
// Fictional catalogue with ARS prices and editorial reference photography.
// El stock es por variante color+talle y alimenta los filtros.

export interface TelarColor {
  id: string;
  nombre: string;
  hex: string;
}

export interface TelarVariant {
  color: string;
  size: string;
  qty: number;
}

export interface TelarPhoto {
  file: string;
  alt: string;
}

export interface TelarProduct {
  id: string;
  nombre: string;
  categoria: (typeof CATEGORIAS)[number];
  coleccion: string;
  precio: number;
  descripcion: string;
  detalles: string[];
  photo: TelarPhoto;
  motivo: "remera" | "camisa" | "pantalon" | "vestido" | "campera" | "sweater" | "pollera";
  colores: TelarColor[];
  talles: string[];
  stock: TelarVariant[];
}

export const COLECCIONES = [
  {
    id: "lino-de-verano",
    nombre: "Lino de verano",
    bajada: "Fibras naturales que respiran: lino y algodón peinado en cortes sueltos.",
  },
  {
    id: "oficina-flexible",
    nombre: "Oficina flexible",
    bajada: "Sastrería sin rigidez: prendas que van de la reunión al bar.",
  },
  {
    id: "noche-simple",
    nombre: "Noche simple",
    bajada: "Pocas piezas, buen calce: lo justo para salir sin pensar dos veces.",
  },
] as const;

export const CATEGORIAS = ["Remeras", "Camisas", "Pantalones", "Polleras", "Vestidos", "Abrigos"] as const;

export const PRODUCTS: TelarProduct[] = [
  {
    id: "camisa-lino",
    photo: { file: "camisa-lino", alt: "Camisa clara abotonada en una percha de madera" },
    nombre: "Camisa de lino",
    categoria: "Camisas",
    coleccion: "lino-de-verano",
    precio: 58000,
    descripcion:
      "Camisa recta de lino con botones de coco. Se usa suelta o fajada; con el lavado se pone cada vez más suave.",
    detalles: ["100 % lino", "Botones de coco", "Calce recto"],
    motivo: "camisa",
    colores: [
      { id: "crudo", nombre: "Crudo", hex: "#EDE4D3" },
      { id: "arena", nombre: "Arena", hex: "#D9BE8E" },
      { id: "oliva", nombre: "Oliva", hex: "#7A7A52" },
    ],
    talles: ["XS", "S", "M", "L", "XL"],
    stock: [
      { color: "crudo", size: "XS", qty: 4 },
      { color: "crudo", size: "S", qty: 6 },
      { color: "crudo", size: "M", qty: 8 },
      { color: "crudo", size: "L", qty: 5 },
      { color: "crudo", size: "XL", qty: 2 },
      { color: "arena", size: "XS", qty: 3 },
      { color: "arena", size: "S", qty: 5 },
      { color: "arena", size: "M", qty: 0 },
      { color: "arena", size: "L", qty: 4 },
      { color: "arena", size: "XL", qty: 1 },
      { color: "oliva", size: "XS", qty: 0 },
      { color: "oliva", size: "S", qty: 2 },
      { color: "oliva", size: "M", qty: 3 },
      { color: "oliva", size: "L", qty: 2 },
      { color: "oliva", size: "XL", qty: 0 },
    ],
  },
  {
    id: "remera-esencial",
    photo: { file: "remera-esencial", alt: "Remera blanca lisa de cuello redondo" },
    nombre: "Remera esencial",
    categoria: "Remeras",
    coleccion: "oficina-flexible",
    precio: 24000,
    descripcion:
      "Remera de algodón peinado, cuello reforzado que no se estira. La base de cualquier semana.",
    detalles: ["Algodón peinado 24.1", "Cuello reforzado", "Calce clásico"],
    motivo: "remera",
    colores: [
      { id: "blanco", nombre: "Blanco", hex: "#F7F5F0" },
      { id: "negro", nombre: "Negro", hex: "#2B2B2B" },
      { id: "terracota", nombre: "Terracota", hex: "#C96F4A" },
    ],
    talles: ["S", "M", "L", "XL"],
    stock: [
      { color: "blanco", size: "S", qty: 10 },
      { color: "blanco", size: "M", qty: 12 },
      { color: "blanco", size: "L", qty: 9 },
      { color: "blanco", size: "XL", qty: 4 },
      { color: "negro", size: "S", qty: 7 },
      { color: "negro", size: "M", qty: 8 },
      { color: "negro", size: "L", qty: 6 },
      { color: "negro", size: "XL", qty: 3 },
      { color: "terracota", size: "S", qty: 2 },
      { color: "terracota", size: "M", qty: 1 },
      { color: "terracota", size: "L", qty: 1 },
      { color: "terracota", size: "XL", qty: 0 },
    ],
  },
  {
    id: "pantalon-sastrero",
    photo: { file: "pantalon-sastrero", alt: "Pantalón negro de pierna ancha combinado con un saco" },
    nombre: "Pantalón sastrero",
    categoria: "Pantalones",
    coleccion: "oficina-flexible",
    precio: 72000,
    descripcion:
      "Pantalón de tiro medio con pinzas y ruedo ancho. Estructura sin rigidez: se mueve con vos.",
    detalles: ["Tiro medio con pinzas", "Ruedo ancho", "Bolsillos funcionales"],
    motivo: "pantalon",
    colores: [
      { id: "negro", nombre: "Negro", hex: "#2B2B2B" },
      { id: "arena", nombre: "Arena", hex: "#D9BE8E" },
    ],
    talles: ["XS", "S", "M", "L", "XL"],
    stock: [
      { color: "negro", size: "XS", qty: 2 },
      { color: "negro", size: "S", qty: 4 },
      { color: "negro", size: "M", qty: 5 },
      { color: "negro", size: "L", qty: 3 },
      { color: "negro", size: "XL", qty: 1 },
      { color: "arena", size: "XS", qty: 1 },
      { color: "arena", size: "S", qty: 2 },
      { color: "arena", size: "M", qty: 2 },
      { color: "arena", size: "L", qty: 0 },
      { color: "arena", size: "XL", qty: 0 },
    ],
  },
  {
    id: "vestido-marta",
    photo: { file: "vestido-marta", alt: "Vestido negro midi sin mangas, con abertura lateral" },
    nombre: "Vestido Marta",
    categoria: "Vestidos",
    coleccion: "noche-simple",
    precio: 86000,
    descripcion:
      "Vestido midi con escote en V y falda con vuelo. Un solo gesto y lista.",
    detalles: ["Largo midi", "Escote en V", "Cierre lateral invisible"],
    motivo: "vestido",
    colores: [
      { id: "terracota", nombre: "Terracota", hex: "#C96F4A" },
      { id: "negro", nombre: "Negro", hex: "#2B2B2B" },
    ],
    talles: ["XS", "S", "M", "L"],
    stock: [
      { color: "terracota", size: "XS", qty: 3 },
      { color: "terracota", size: "S", qty: 4 },
      { color: "terracota", size: "M", qty: 2 },
      { color: "terracota", size: "L", qty: 1 },
      { color: "negro", size: "XS", qty: 2 },
      { color: "negro", size: "S", qty: 3 },
      { color: "negro", size: "M", qty: 3 },
      { color: "negro", size: "L", qty: 0 },
    ],
  },
  {
    id: "campera-campo",
    photo: { file: "campera-campo", alt: "Campera verde oliva abierta sobre un top azul" },
    nombre: "Campera de campo",
    categoria: "Abrigos",
    coleccion: "oficina-flexible",
    precio: 98000,
    descripcion: "Campera de gabardina con bolsillos de fuelle y forro liviano. Quedan pocas unidades.",
    detalles: ["Gabardina de algodón", "4 bolsillos de fuelle", "Forro liviano"],
    motivo: "campera",
    colores: [
      { id: "oliva", nombre: "Oliva", hex: "#7A7A52" },
      { id: "arena", nombre: "Arena", hex: "#D9BE8E" },
    ],
    talles: ["S", "M", "L", "XL"],
    stock: [
      { color: "oliva", size: "S", qty: 1 },
      { color: "oliva", size: "M", qty: 1 },
      { color: "oliva", size: "L", qty: 0 },
      { color: "oliva", size: "XL", qty: 0 },
      { color: "arena", size: "S", qty: 0 },
      { color: "arena", size: "M", qty: 1 },
      { color: "arena", size: "L", qty: 0 },
      { color: "arena", size: "XL", qty: 0 },
    ],
  },
  {
    id: "pollera-tubo",
    photo: { file: "pollera-tubo", alt: "Pollera negra ajustada de cintura alta" },
    nombre: "Pollera tubo",
    categoria: "Polleras",
    coleccion: "noche-simple",
    precio: 48000,
    descripcion:
      "Pollera tubo de punto grueso con tajo trasero. Cómoda para caminar, prolija para salir.",
    detalles: ["Punto grueso", "Tajo trasero", "Cintura alta"],
    motivo: "pollera",
    colores: [
      { id: "negro", nombre: "Negro", hex: "#2B2B2B" },
      { id: "terracota", nombre: "Terracota", hex: "#C96F4A" },
    ],
    talles: ["XS", "S", "M", "L"],
    stock: [
      { color: "negro", size: "XS", qty: 4 },
      { color: "negro", size: "S", qty: 5 },
      { color: "negro", size: "M", qty: 4 },
      { color: "negro", size: "L", qty: 2 },
      { color: "terracota", size: "XS", qty: 2 },
      { color: "terracota", size: "S", qty: 1 },
      { color: "terracota", size: "M", qty: 0 },
      { color: "terracota", size: "L", qty: 0 },
    ],
  },
  {
    id: "sweater-nordico",
    photo: { file: "sweater-nordico", alt: "Sweater grueso con guardas geométricas en crudo y marrón" },
    nombre: "Sweater nórdico",
    categoria: "Abrigos",
    coleccion: "noche-simple",
    precio: 64000,
   descripcion: "Sweater de punto grueso con guarda geométrica. Abriga de verdad.",
    detalles: ["Punto grueso", "Guarda geométrica", "Cuello redondo"],
    motivo: "sweater",
    colores: [
      { id: "crudo", nombre: "Crudo", hex: "#EDE4D3" },
      { id: "azul", nombre: "Azul noche", hex: "#2F4A5E" },
    ],
    talles: ["S", "M", "L"],
    stock: [
      { color: "crudo", size: "S", qty: 0 },
      { color: "crudo", size: "M", qty: 0 },
      { color: "crudo", size: "L", qty: 0 },
      { color: "azul", size: "S", qty: 0 },
      { color: "azul", size: "M", qty: 0 },
      { color: "azul", size: "L", qty: 0 },
    ],
  },
  {
    id: "vestido-lino-largo",
    photo: { file: "vestido-lino-largo", alt: "Vestido largo blanco con breteles anchos, visto de perfil" },
    nombre: "Vestido largo de lino",
    categoria: "Vestidos",
    coleccion: "lino-de-verano",
    precio: 92000,
    descripcion:
      "Vestido largo de lino con breteles anchos y espalda descubierta. El favorito del verano.",
    detalles: ["100 % lino", "Breteles anchos", "Bolsillos laterales"],
    motivo: "vestido",
    colores: [
      { id: "blanco", nombre: "Blanco", hex: "#F7F5F0" },
      { id: "arena", nombre: "Arena", hex: "#D9BE8E" },
      { id: "oliva", nombre: "Oliva", hex: "#7A7A52" },
    ],
    talles: ["XS", "S", "M", "L"],
    stock: [
      { color: "blanco", size: "XS", qty: 3 },
      { color: "blanco", size: "S", qty: 5 },
      { color: "blanco", size: "M", qty: 4 },
      { color: "blanco", size: "L", qty: 2 },
      { color: "arena", size: "XS", qty: 2 },
      { color: "arena", size: "S", qty: 3 },
      { color: "arena", size: "M", qty: 0 },
      { color: "arena", size: "L", qty: 1 },
      { color: "oliva", size: "XS", qty: 0 },
      { color: "oliva", size: "S", qty: 0 },
      { color: "oliva", size: "M", qty: 0 },
      { color: "oliva", size: "L", qty: 0 },
    ],
  },
];

export const productById = (id: string): TelarProduct | undefined =>
  PRODUCTS.find((p) => p.id === id);

export const collectionById = (id: string) =>
  COLECCIONES.find((c) => c.id === id);

export const totalStock = (p: TelarProduct): number =>
  p.stock.reduce((acc, v) => acc + v.qty, 0);

/** Estado de disponibilidad de una prenda completa. */
export const availabilityOf = (p: TelarProduct): "en-stock" | "ultimas" | "agotado" => {
  const total = totalStock(p);
  if (total <= 0) return "agotado";
  if (total <= 3) return "ultimas";
  return "en-stock";
};

export const AVAILABILITY_LABEL: Record<string, string> = {
  "en-stock": "En stock",
  "ultimas": "Últimas unidades",
  "agotado": "Agotado",
};

export const formatPrice = (n: number): string =>
  "$ " + n.toLocaleString("es-AR");

export function matchesFilters(p: TelarProduct, filters: { categoria: string; talle: string; color: string; disponibilidad: string }): boolean {
  const { categoria, talle, color, disponibilidad } = filters;
  if (categoria && categoria !== p.categoria) return false;
  const variants = p.stock.filter((v) => (!talle || v.size === talle) && (!color || v.color === color));
  if (!variants.length) return false;
  const qty = variants.reduce((sum, v) => sum + v.qty, 0);
  if (!disponibilidad) return !(talle || color) || qty > 0;
  return disponibilidad === (qty === 0 ? "agotado" : qty <= 3 ? "ultimas" : "en-stock");
}
