// Standalone snapshot of this storefront's identity. App discovery uses the shared registry.
export const RUBROS = [
  {
    id: "locales-catalogo",
    rubroId: "locales-y-tiendas",
    slug: "locales-catalogo",
    nombre: "Catalogo online",
    rubro: "Catálogo digital de indumentaria",
    tagline: "Telar: mostrá prendas, variantes y disponibilidad sin vender en línea.",
    objeccion: "«¿Cómo muestro lo que tengo en el local sin sumar una tienda online?»",
    demoUrl: "/demos/locales-catalogo/",
    port: 3028,
    palette: { bg: "#FAF6EE", fg: "#1E1B16", accent: "#A34A24" },
    // Existing kit placeholder for the unused local helper; storefront pages do not use it.
    whatsapp: {
      phone: "5491100000000",
      template: "Hola, quería consultar por {prenda} en Telar.",
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
