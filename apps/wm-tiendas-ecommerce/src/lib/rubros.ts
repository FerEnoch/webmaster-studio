// Standalone snapshot of this storefront's identity. App discovery uses the shared registry.
export const RUBROS = [
  {
    id: "tiendas-ecommerce",
    rubroId: "locales-y-tiendas",
    slug: "tiendas-ecommerce",
    nombre: "Ecommerce",
    rubro: "Tienda online de ropa urbana",
    tagline: "TRAMA: de la variante en stock a un checkout con entrega y pago simulado.",
    objeccion: "«¿Puedo ofrecer retiro y envío sin que se complique el checkout?»",
    demoUrl: "/demos/tiendas-ecommerce/",
    port: 3029,
    palette: { bg: "#14110F", fg: "#F4EFE4", accent: "#FF4D6D" },
    // Existing kit placeholder for the unused local helper; storefront pages do not use it.
    whatsapp: {
      phone: "5491100000000",
      template: "Hola, quería consultar por {prenda} en TRAMA.",
    },
  },
] as const;

export type Rubro = (typeof RUBROS)[number];

export function getRubro(id: string): Rubro | undefined {
  return RUBROS.find((rubro) => rubro.id === id);
}

export function requireRubro(id: string): Rubro {
  const rubro = getRubro(id);
  if (!rubro) throw new Error(`Rubro desconocido: "${id}".`);
  return rubro;
}
