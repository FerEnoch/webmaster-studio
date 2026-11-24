// Standalone snapshot of this demo's identity. App discovery uses the shared registry.
export const RUBROS = [
  {
    id: "inmobiliaria-premium",
    rubroId: "inmobiliaria",
    slug: "inmobiliaria-premium",
    nombre: "Estudio Real State",
    rubro: "Inmobiliaria premium",
    tagline: "Recorridos interactivos, asoleamiento 3D y simuladores.",
    objeccion: "Recorré la propiedad antes de coordinar una visita.",
    demoUrl: "/demos/inmobiliaria-premium/",
    port: 3033,
    palette: { bg: "#14130F", fg: "#F4F1EA", accent: "#B18A52" },
    // La demo no tiene un canal de contacto: este número no es marcable.
    whatsapp: { phone: "0000000000000", template: "Consulta de demostración (no se envía)." },
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
