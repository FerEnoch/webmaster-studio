/**
 * Los 7 rubros del portfolio + el id del portfolio madre.
 *
 * Fuente de verdad de: slug, nombre, rubro, bajada, objeción que responde
 * la web, URL de la demo, paleta (1 fondo + 1 claro + 1 acento) y el
 * mensaje prearmado de WhatsApp.
 *
 * Todos los datos son FICTICIOS (marcas, teléfonos, URLs).
 */

export interface Rubro {
  /** Id estable. Es el mismo que el nombre de la app (`wm-<id>`). */
  id: string;
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
    id: "clinica",
    slug: "clinica",
    nombre: "Clínica + diagnóstico",
    rubro: "Clínica general y diagnóstico por imágenes",
    tagline: "Tu estudio en un mismo lugar, sin esperas.",
    objeccion: "«No quiero pasar tres horas en una sala de espera»",
    demoUrl: "/demos/clinica/",
    port: 3020,
    palette: { bg: "#0E1A1C", fg: "#E9F0EC", accent: "#FF6B4A" },
    whatsapp: {
      phone: "5491123456789",
      template: "Hola, quiero sacar un turno en {sucursal} para {estudio}.",
    },
  },
  {
    id: "concesionario",
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
    slug: "lavadero",
    nombre: "Lavadero + bar",
    rubro: "Lavadero de autos con bar",
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
    id: "estetica",
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
    id: "arquitectura",
    slug: "arquitectura",
    nombre: "Arquitectura",
    rubro: "Estudio de arquitectura y diseño",
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
];

/** El portfolio madre: no es un rubro, es el índice de las 7 demos. */
export const PORTFOLIO = {
  id: "portfolio",
  slug: "portfolio",
  nombre: "Portfolio",
  rubro: "Portfolio de demos por rubro",
  tagline: "Ocho webs, ocho rubros, una sola firma visual.",
  objeccion: "«¿Cada web es un template o está hecha para mi rubro?»",
  demoUrl: "/",
  port: 3027,
  palette: { bg: "#111113", fg: "#EFEFEA", accent: "#D7FF4A" },
} as const;

/** Todas las apps del monorepo (7 rubros + portfolio madre). */
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
