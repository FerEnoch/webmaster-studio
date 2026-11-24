/** T3: recorridos, lote solar y simuladores locales. Fotos solo del manifiesto verificado. */

export type TourHotspot = { label: string; target: string };

export type TourRoom = {
  id: string;
  nombre: string;
  imagen: string;
  alt: string;
  m2: number;
  descripcion: string;
  /** Posición en el plano (porcentaje 0-100). */
  plan: [number, number];
  hotspots: TourHotspot[];
};

export const CASA_LAGUNA_TOUR: TourRoom[] = [
  {
    id: "llegada",
    nombre: "Llegada",
    imagen: "hero-arrival",
    alt: "Acceso arbolado a Casa Laguna al atardecer",
    m2: 32,
    descripcion: "Entrás por el paseo arbolado. El volumen de hormigón se abre hacia la laguna.",
    plan: [18, 72],
    hotspots: [{ label: "Entrar al living", target: "living" }],
  },
  {
    id: "living",
    nombre: "Living",
    imagen: "laguna-living",
    alt: "Living contemporáneo conectado con la galería",
    m2: 58,
    descripcion: "Planta baja integrada con ventanales de piso a techo. El living mira a la pileta.",
    plan: [44, 52],
    hotspots: [
      { label: "Ir a la cocina", target: "cocina" },
      { label: "Salir a la galería", target: "galeria" },
    ],
  },
  {
    id: "cocina",
    nombre: "Cocina",
    imagen: "laguna-kitchen",
    alt: "Cocina abierta con isla y luz natural",
    m2: 34,
    descripcion: "Cocina abierta con isla, guardado hasta el techo y ventilación cruzada.",
    plan: [66, 38],
    hotspots: [
      { label: "Volver al living", target: "living" },
      { label: "Salir a la pileta", target: "galeria" },
    ],
  },
  {
    id: "galeria",
    nombre: "Galería y pileta",
    imagen: "laguna-pool",
    alt: "Casa contemporánea junto a una piscina",
    m2: 96,
    descripcion: "Salí al jardín: la galería conecta la casa con la pileta y el verde.",
    plan: [78, 66],
    hotspots: [
      { label: "Volver al living", target: "living" },
      { label: "Ver el atardecer", target: "atardecer" },
    ],
  },
  {
    id: "atardecer",
    nombre: "Atardecer",
    imagen: "hero-villa-pool",
    alt: "Villa iluminada junto a la pileta al atardecer",
    m2: 100,
    descripcion: "De noche la casa se ilumina desde adentro. La secuencia termina donde empieza la visita.",
    plan: [52, 84],
    hotspots: [{ label: "Volver a la llegada", target: "llegada" }],
  },
];

/** Recorrido ilustrativo de 3 pasos para el resto de las fichas con tour. Reusa fotos verificadas de la demo. */
function trio(exterior: { imagen: string; alt: string; nombre: string }, m2Total: number): TourRoom[] {
  const estar = Math.round(m2Total * 0.42);
  const cocina = Math.round(m2Total * 0.22);
  const llegada = Math.max(12, m2Total - estar - cocina);
  return [
    {
      id: "llegada",
      nombre: exterior.nombre,
      imagen: exterior.imagen,
      alt: exterior.alt,
      m2: llegada,
      descripcion: "Foto editorial de la demo: mirá escala, accesos y luz antes de visitar.",
      plan: [22, 70],
      hotspots: [{ label: "Pasar al estar", target: "estar" }],
    },
    {
      id: "estar",
      nombre: "Estar",
      imagen: "laguna-living",
      alt: "Estar luminoso con salida al exterior, foto ilustrativa de la demo",
      m2: estar,
      descripcion: "Ambiente de estar de referencia: altura, aventanamientos y continuidad con el afuera.",
      plan: [52, 48],
      hotspots: [
        { label: "Ver la cocina", target: "cocina" },
        { label: "Volver a la llegada", target: "llegada" },
      ],
    },
    {
      id: "cocina",
      nombre: "Cocina",
      imagen: "laguna-kitchen",
      alt: "Cocina con isla, foto ilustrativa de la demo",
      m2: cocina,
      descripcion: "Cocina de referencia: isla de trabajo, guardado y luz natural.",
      plan: [74, 34],
      hotspots: [{ label: "Volver al estar", target: "estar" }],
    },
  ];
}

export const TOUR_BY_SLUG: Record<string, TourRoom[]> = {
  "casa-laguna-nordelta": CASA_LAGUNA_TOUR,
  "departamento-palermo-soho": trio(
    { imagen: "palermo-building", alt: "Edificio contemporáneo con fachada vidriada", nombre: "Frente" },
    78,
  ),
  "casa-clasica-san-isidro": trio(
    { imagen: "san-isidro-classic", alt: "Casa clásica rodeada de jardín", nombre: "Frente y jardín" },
    280,
  ),
  "loft-colegiales": trio(
    { imagen: "colegiales-stairs", alt: "Interior de doble altura con escalera industrial", nombre: "Acceso" },
    64,
  ),
  "casa-minimal-canning": trio(
    { imagen: "canning-minimal", alt: "Casa minimalista iluminada al atardecer", nombre: "Frente" },
    210,
  ),
  "casa-de-campo-exaltacion": trio(
    { imagen: "exaltacion-forest", alt: "Casa de madera integrada a un bosque", nombre: "El bosque" },
    190,
  ),
};

export function roomsFor(slug: string): TourRoom[] | null {
  return TOUR_BY_SLUG[slug] ?? null;
}

export type SolarLot = {
  slug: string;
  titulo: string;
  ancho: number;
  fondo: number;
  nota: string;
  /** Elevación inicial de referencia (grados) para los presets del baseline. */
  presets: { invierno1530: number; verano1000: number };
};

export const SOLAR_BY_SLUG: Record<string, SolarLot> = {
  "lote-pilar-del-este": {
    slug: "lote-pilar-del-este",
    titulo: "Lote 30 × 40 m",
    ancho: 30,
    fondo: 40,
    nota: "Esquema ilustrativo, no métrico para obra. Orientación norte al contrafrente.",
    presets: { invierno1530: 22, verano1000: 61 },
  },
  "lote-villa-la-angostura": {
    slug: "lote-villa-la-angostura",
    titulo: "Lote en pendiente suave",
    ancho: 62,
    fondo: 80,
    nota: "Esquema ilustrativo con bosque nativo y vista al lago. No apto para replanteo.",
    presets: { invierno1530: 18, verano1000: 55 },
  },
  "casa-laguna-nordelta": {
    slug: "casa-laguna-nordelta",
    titulo: "Lote sintético 22 × 41 m",
    ancho: 22,
    fondo: 41,
    nota: "Volumen sintético para estudiar sombras. No representa la construcción real.",
    presets: { invierno1530: 22, verano1000: 61 },
  },
};

export function solarFor(slug: string): SolarLot | null {
  return SOLAR_BY_SLUG[slug] ?? null;
}

/** Posición solar aproximada y didáctica (no apta para cálculo profesional). */
export function sunElevation(hora: number, estacion: "invierno" | "verano"): number {
  const base = estacion === "invierno" ? 22 : 61;
  const ref = estacion === "invierno" ? 15.5 : 10;
  const elev = base - Math.abs(hora - ref) * (estacion === "invierno" ? 7.5 : 9);
  return Math.max(2, Math.round(elev));
}

export function sunAzimuth(hora: number, orientacion: number): number {
  const az = 180 + (hora - 12) * 15 + orientacion;
  return Math.round(((az % 360) + 360) % 360);
}

/* ---------- Simuladores 100% locales ---------- */

export function estimarValuacion(m2: number, tipo: string, barrio: string): number {
  const basePorM2 = tipo === "Terreno" ? 320 : tipo === "Departamento" ? 2100 : tipo === "Loft" ? 1900 : 2400;
  const factorBarrio = /nordelta|palermo|san isidro/i.test(barrio) ? 1.18 : /canning|pilar/i.test(barrio) ? 1.05 : 0.92;
  return Math.round(m2 * basePorM2 * factorBarrio);
}

export function cuotaMensual(precioUSD: number, entradaPct: number, tasaAnualPct: number, anos: number): number {
  const capital = Math.max(0, precioUSD * (1 - entradaPct / 100));
  const r = tasaAnualPct / 100 / 12;
  const n = Math.max(1, anos * 12);
  if (r <= 0) return Math.round(capital / n);
  const cuota = (capital * r) / (1 - Math.pow(1 + r, -n));
  return Math.round(cuota);
}

export function alquilerSugerido(precioUSD: number, moneda: "USD" | "ARS"): number {
  const baseUSD = Math.round(precioUSD * 0.0045);
  return moneda === "USD" ? baseUSD : baseUSD * 1200;
}
