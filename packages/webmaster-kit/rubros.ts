/**
 * Catálogo de demos agrupadas por rubro + el id del portfolio madre.
 *
 * Fuente de verdad de: slug, nombre, rubro, bajada, objeción que responde
 * la web, URL de la demo, paleta (1 fondo + 1 claro + 1 acento) y el
 * mensaje prearmado de WhatsApp.
 *
 * Todos los datos son FICTICIOS (marcas, teléfonos, URLs).
 */

export interface Rubro {
  /** Id estable de la demo. Es el mismo que el nombre de la app (`wm-<id>`). */
  id: string;
  /** Id estable del rubro compartido por todas sus variantes. */
  rubroId: string;
  /** Slug de la app. */
  slug: string;
  /** Nombre del rubro, como lo muestra el portfolio. */
  nombre: string;
  /** Descripción corta del rubro. */
  rubro: string;
  /** Bajada de una línea. */
  tagline: string;
  /** Objeción del cliente que esta web responde. */
  objeccion: string;
  /** URL de la demo desplegada. */
  demoUrl: string;
  /** Puerto de desarrollo local. */
  port: number;
  /** 1 fondo + 1 claro + 1 acento. */
  palette: { bg: string; fg: string; accent: string };
  /** WhatsApp: número internacional sin signos + plantilla del mensaje. */
  whatsapp: { phone: string; template: string };
}

export const RUBROS: Rubro[] = [
  {
    id: "concesionario",
    rubroId: "concesionario",
    slug: "concesionario",
    nombre: "Concesionario",
    rubro: "Concesionario de autos nuevos y usados",
    tagline: "Elegí tu auto con la ficha completa, sin letra chica.",
    objeccion: "«No quiero surprises en la financing ni en el seguro»",
    demoUrl: "/demos/concesionario/",
    port: 3021,
    palette: { bg: "#17130E", fg: "#F1E9DC", accent: "#E3B23C" },
    whatsapp: {
      phone: "5491134567890",
      template: "Hola, consulto por {modelo}. ¿Tienen stock disponible?",
    },
  },
  {
    id: "lavadero",
    rubroId: "lavadero",
    slug: "lavadero",
    nombre: "Lavadero + bar",
    rubro: "Autolavado con bar",
    tagline: "Lavás tu auto, tomás algo y te vas.",
    objeccion: "«¿Me van a romper la pintura o el interior?»",
    demoUrl: "/demos/lavadero/",
    port: 3022,
    palette: { bg: "#0C1B26", fg: "#E4EEF4", accent: "#2FC2DA" },
    whatsapp: {
      phone: "5491145678901",
      template: "Hola, quiero reservar un lavado {tipo} el {dia}.",
    },
  },
  {
    id: "lavadero-premium",
    rubroId: "lavadero",
    slug: "lavadero-premium",
    nombre: "Lavadero Premium",
    rubro: "Centro de estética vehicular",
    tagline: "La experiencia Gloss & Glass: luz, bar y detalle.",
    objeccion: "«Quiero el lavado premium, no el básico»",
    demoUrl: "/demos/lavadero-premium/",
    port: 3031,
    palette: { bg: "#101114", fg: "#EDEAE2", accent: "#D08A3E" },
    whatsapp: {
      phone: "5491190123456",
      template: "Hola, quiero reservar la experiencia Gloss & Glass el {dia}.",
    },
  },
  {
    id: "estetica",
    rubroId: "estetica",
    slug: "estetica",
    nombre: "Estética + yoga",
    rubro: "Estudio de estética y yoga",
    tagline: "Un lugar para soltar, no para correr.",
    objeccion: "«¿Me van a retocar las fotos sin que me entere?»",
    demoUrl: "/demos/estetica/",
    port: 3023,
    palette: { bg: "#1C1518", fg: "#F3EAE6", accent: "#E4A0AE" },
    whatsapp: {
      phone: "5491156789012",
      template: "Hola, quiero reservar {servicio} para el {dia}.",
    },
  },
  {
    id: "universidad",
    rubroId: "universidad",
    slug: "universidad",
    nombre: "Universidad privada",
    rubro: "Universidad privada",
    tagline: "La carrera, la beca y la salida laboral, en una página.",
    objeccion: "«¿Termino la carrera y después qué hago?»",
    demoUrl: "/demos/universidad/",
    port: 3024,
    palette: { bg: "#141A24", fg: "#EAEFF6", accent: "#C9A227" },
    whatsapp: {
      phone: "5491167890123",
      template: "Hola, quiero información sobre {carrera} y las becas.",
    },
  },
  {
    id: "inmobiliaria",
    rubroId: "inmobiliaria",
    slug: "inmobiliaria",
    nombre: "Inmobiliaria",
    rubro: "Inmobiliaria",
    tagline: "Fichas completas, fotos reales y visita el fin de semana.",
    objeccion: "«Las fotos del aviso no son la casa»",
    demoUrl: "/demos/inmobiliaria/",
    port: 3025,
    palette: { bg: "#101A17", fg: "#E9F0EB", accent: "#8FC1A9" },
    whatsapp: {
      phone: "5491178901234",
      template: "Hola, consulto por la propiedad en {zona}.",
    },
  },
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
  {
    id: "arquitectura",
    rubroId: "arquitectura",
    slug: "arquitectura",
    nombre: "Arquitectura",
    rubro: "Estudio de arquitectura",
    tagline: "Del croquis a la obra: el proceso abierto.",
    objeccion: "«¿Cómo sé que no me va a explota el presupuesto?»",
    demoUrl: "/demos/arquitectura/",
    port: 3026,
    palette: { bg: "#0F1214", fg: "#F0EFEA", accent: "#7FA8C9" },
    whatsapp: {
      phone: "5491189012345",
      template: "Hola, quiero cotizar un proyecto de {tipo}.",
    },
  },
  {
    id: "arquitectura-premium",
    rubroId: "arquitectura",
    slug: "arquitectura-premium",
    nombre: "Arquitectura Premium",
    rubro: "Premium Arq. con 3D y tour",
    tagline: "La obra se recorre: 3D en vivo, tour y cotización al instante.",
    objeccion: "«Quiero ver la obra terminada antes de firmar»",
    demoUrl: "/demos/arquitectura-premium/",
    port: 3032,
    palette: { bg: "#14110D", fg: "#EFE9DC", accent: "#D9A441" },
    whatsapp: {
      phone: "5491190123456",
      template: "Hola, quiero cotizar un proyecto de {tipo} en la edición premium.",
    },
  },
];

/** El portfolio madre: no es un rubro, es el índice de las demos. */
export const PORTFOLIO = {
  id: "portfolio",
  slug: "portfolio",
  nombre: "Portfolio",
  rubro: "Portfolio de demos por rubro",
  tagline: "Seis rubros, una sola firma visual.",
  objeccion: "«¿Cada web es un template o está hecha para mi rubro?»",
  demoUrl: "/",
  port: 3027,
  palette: { bg: "#111113", fg: "#EFEFEA", accent: "#D7FF4A" },
} as const;

/** Todas las apps del monorepo (demos + portfolio madre). */
export const APPS: { id: string; nombre: string; rubro: string; demoUrl: string; port: number }[] = [
  ...RUBROS.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    rubro: r.rubro,
    demoUrl: r.demoUrl,
    port: r.port,
  })),
  { id: PORTFOLIO.id, nombre: PORTFOLIO.nombre, rubro: PORTFOLIO.rubro, demoUrl: PORTFOLIO.demoUrl, port: PORTFOLIO.port },
];

/** Devuelve un rubro por id. `undefined` si no existe. */
export function getRubro(id: string): Rubro | undefined {
  return RUBROS.find((r) => r.id === id);
}

/** Igual que `getRubro` pero lanza si el id no existe (para contenido de app). */
export function requireRubro(id: string): Rubro {
  const r = getRubro(id);
  if (!r) throw new Error(`Rubro desconocido: "${id}". Revisar packages/webmaster-kit/rubros.ts`);
  return r;
}

/** Un chip por rubro; las demos conservan su identidad y orden originales. */
export interface RubroGroup {
  id: string;
  nombre: string;
  accent: string;
  demos: Rubro[];
}

/** Nombres de familia: no alteran los nombres ni los metadatos de cada demo. */
const familyNames = new Map<string, string>([
  ["concesionario", "Concesionarios"],
  ["lavadero", "Multiservicios"],
  ["estetica", "Estética"],
  ["universidad", "Institucional y educativo"],
  ["arquitectura", "Estudios profesionales"],
]);

export function getRubroGroups(demos: readonly Rubro[] = RUBROS): RubroGroup[] {
  const groups = new Map<string, RubroGroup>();
  for (const demo of demos) {
    let group = groups.get(demo.rubroId);
    if (!group) {
      const base = demos.find((item) => item.id === demo.rubroId) ?? demo;
      group = { id: demo.rubroId, nombre: familyNames.get(demo.rubroId) ?? base.nombre, accent: base.palette.accent, demos: [] };
      groups.set(group.id, group);
    }
    group.demos.push(demo);
  }
  return [...groups.values()];
}

/** Acepta ids de rubro y los enlaces históricos a una demo concreta. */
export function resolveRubroFilter(requested: string | null | undefined, demos: readonly Rubro[] = RUBROS): string {
  return requested && demos.some((demo) => demo.id === requested || demo.rubroId === requested)
    ? requested
    : "todos";
}

/** Contrato compartido por el catálogo y los atributos data-wm-rubro-*. */
export function matchesRubroFilter(demo: Pick<Rubro, "id" | "rubroId">, filter: string): boolean {
  return filter === "todos" || demo.id === filter || demo.rubroId === filter;
}
