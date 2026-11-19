/**
 * Contenido de ESTUDIO VETA — edición PREMIUM del rubro arquitectura.
 *
 * MARCA FICTICIA. Todos los datos (obra, equipo, honorarios, CUIT, dirección)
 * son inventados para demostración.
 *
 * El objeto `arquitecturaPremium` cumple el contrato `RubroContent` del kit
 * (packages/webmaster-kit/types.ts). Los datos propios de esta edición —el
 * modelo 3D, los alcances, las obras, el equipo— se exportan como estructuras
 * propias de la app, siempre al lado del contrato.
 */

import { img, pex, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { CatalogItem, Conversion, RubroContent, Section } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "arquitectura-premium")!;

export const brand = "ESTUDIO VETA";

/* ─────────────────────────────────────────────────────────────────────────
   Tipos propios de la app
   ───────────────────────────────────────────────────────────────────────── */

/** Un ambiente del modelo 3D: una superficie navegable del inmueble. */
export interface Ambiente {
  id: string;
  /** Nombre del ambiente. */
  nombre: string;
  /** Metros cuadrados. */
  m2: number;
  /** Frase corta del ambiente. */
  detalle: string;
  /** Banda de escala que activa este ambiente en el cotizador. */
  escala: string;
  /** Geometría en la maqueta: porcentajes sobre el plano del inmueble. */
  caja: { x: number; y: number; w: number; h: number };
  /** Altura de la pared del ambiente, en unidades de la maqueta. */
  alto: number;
  /** Referencia de precio por m² en USD (mercado privado CABA/GBA 2026). */
  usdM2: number;
  /** Materiales declarados en el ambiente. */
  materiales: string[];
}

/** Una obra del estudio: la prueba que se vende. */
export interface Obra {
  id: string;
  title: string;
  year: string;
  superficie: string;
  estado: "Terminada" | "En obra" | "En anteproyecto";
  zona: string;
  resumen: string;
  /** Tipo de obra: alimenta el filtro del archivo. */
  tipo: "Vivienda" | "Comercial" | "Reforma" | "Obra nueva";
  equipo: string[];
  entregables: string[];
  antes?: { src: string; alt: string };
  despues?: { src: string; alt: string };
  nota?: string;
}

/** Una etapa del proceso: el mismo guion para todas las obras. */
export interface Etapa {
  id: string;
  title: string;
  body: string;
  puntos: string[];
  entrega: string;
  duracion: string;
}

/** Persona del equipo. */
export interface Integrante {
  id: string;
  nombre: string;
  rol: string;
  body: string;
}

/** Una escala de proyecto: define el honorario estimado y el plazo. */
export interface Alcance {
  id: string;
  title: string;
  body: string;
  incluye: string[];
  semanas: string;
}

/* ─────────────────────────────────────────────────────────────────────────
   Servicios (4 tipos de encargo)
   ───────────────────────────────────────────────────────────────────────── */

export const serviciosItems: CatalogItem[] = [
  {
    id: "proyecto",
    title: "Proyecto completo",
    kicker: "De la idea al permiso",
    body: "El proyecto entero en una sola mano: croquis, anteproyecto, documentación ejecutable y el expediente municipal. Cuando la obra arranca, no hay páginas en el aire.",
    points: [
      "Tres esquemas comparados antes de definir el proyecto",
      "Documentación lista para construir y presupuestar",
      "Presentación municipal y seguimiento del expediente",
    ],
    meta: [
      { label: "Plazo", value: "12 a 20 semanas" },
      { label: "Entregable", value: "Proyecto + permisos + seguimiento" },
    ],
    price: { amount: "desde $ 2.150.000", note: "estimación orientativa, IVA incluido" },
    badge: "Más pedido",
  },
  {
    id: "direccion",
    title: "Dirección de obra",
    kicker: "Alguien del estudio en obra",
    body: "Visitas semanales, control de calidad y informes con foto. El mismo profesional que proyectó la obra es el que verifica que se construya como se proyectó.",
    points: [
      "Visitas semanales con acta y registro fotográfico",
      "Control de materiales y de subcontratos",
      "Informes quincenales con cronograma actualizado",
    ],
    meta: [
      { label: "Plazo", value: "Durante toda la obra" },
      { label: "Entregable", value: "Informes + control documentado" },
    ],
    price: { amount: "desde $ 980.000", note: "estimación orientativa, IVA incluido" },
  },
  {
    id: "interiorismo",
    title: "Interiorismo",
    kicker: "Cómo se vive el espacio",
    body: "Distribución, materiales y luz. Sin demoler estructura: el proyecto se vuelve habitable antes que bonito de foto.",
    points: [
      "Plano de mobiliario y jerarquía de circulaciones",
      "Paleta de materiales con muestras físicas",
      "Dirección de montaje y compras acompañadas",
    ],
    meta: [
      { label: "Plazo", value: "8 a 12 semanas" },
      { label: "Entregable", value: "Planos + paleta + montaje" },
    ],
    price: { amount: "desde $ 720.000", note: "estimación orientativa, IVA incluido" },
  },
  {
    id: "permisos",
    title: "Permisos y habilitaciones",
    kicker: "Papeles sin sorpresas",
    body: "Relevamiento normativo, presentación y seguimiento hasta la habilitación final, con el expediente ordenado y las_subsanaciones resueltas.",
    points: [
      "Relevamiento de normativa municipal y restricciones",
      "Presentación, subsanaciones y seguimiento",
      "Gestión de habilitación final de uso",
    ],
    meta: [
      { label: "Plazo", value: "6 a 12 semanas" },
      { label: "Entregable", value: "Expediente aprobado + habilitación" },
    ],
    price: { amount: "desde $ 420.000", note: "estimación orientativa, IVA incluido" },
  },
];

const servicios: Section = {
  id: "servicios",
  kicker: "Qué hacemos",
  title: "Cuatro encargos, un solo equipo",
  body: "Podés contratar uno o todos. El proyecto no cambia de manos a mitad de camino: el que dibuja el proyecto es el que está en la obra.",
  layout: "grid",
  items: serviciosItems,
};

/* ─────────────────────────────────────────────────────────────────────────
   Proceso por etapas
   ───────────────────────────────────────────────────────────────────────── */

export const etapas: Etapa[] = [
  {
    id: "escucha",
    title: "Escucha y visita",
    body: "Dos semanas para entender el encargo, medir el sitio y leer la normativa. Salís con un croquis a escala, no con una carpeta de promesas.",
    puntos: [
      "Relevamiento del sitio y análisis normativo",
      "Lectura de restricciones ykemisos municipales",
      "Presupuesto de obra estimado por metro cuadrado",
    ],
    entrega: "Croquis + números de referencia",
    duracion: "2 a 3 semanas",
  },
  {
    id: "esquemas",
    title: "Tres esquemas",
    body: "Tres soluciones distintas sobre el mismo programa, con la misma superficie útil. Se comparan juntas, con sus costos y sus consecuencias, antes de elegir.",
    puntos: [
      "Tres esquemas con usos y superficies comparados",
      "Estimación de costo y plazo para cada alternativa",
      "Decisión tomada con vos, no por nosotros",
    ],
    entrega: "Esquema elegido + número de consulta",
    duracion: "3 a 4 semanas",
  },
  {
    id: "proyecto",
    title: "Proyecto y permisos",
    body: "La documentación que va a construir: planos, estructura, instalaciones, pliego y cómputo. El presupuesto se cierra por escrito y con eso trabaja la obra.",
    puntos: [
      "Planos de arquitectura, estructura e instalaciones",
      "Pliego de especificaciones y cómputo de materiales",
      "Presupuesto cerrado por escrito, con contingencias a la vista",
    ],
    entrega: "Legajo de proyecto + presupuesto + cronograma",
    duracion: "7 a 10 semanas",
  },
  {
    id: "obra",
    title: "Obra y entrega",
    body: "Dirección de obra, control de calidad e informes. Cada quince días recibís fotos, avance y las decisiones pendientes que necesitan tu firma.",
    puntos: [
      "Visitas semanales con acta y registro fotográfico",
      "Control de subcontratos y cumplimiento del pliego",
      "Informe quincenal con avance y cronograma revisado",
    ],
    entrega: "Obra terminada + documentación conforme",
    duracion: "La que dura la obra",
  },
];

const proceso: Section = {
  id: "proceso",
  kicker: "El proceso",
  title: "Cuatro etapas, siempre las mismas",
  body: "El orden no cambia nunca. Es lo que permite decirte cuándo vas a tener cada cosa y cuánto cuesta hasta ese momento.",
  layout: "timeline",
  items: etapas.map((e) => ({
    id: e.id,
    title: e.title,
    body: e.body,
    points: e.puntos,
    meta: [
      { label: "Duración", value: e.duracion },
      { label: "Te llevás", value: e.entrega },
    ],
  })),
};

/* ─────────────────────────────────────────────────────────────────────────
   Obras (la prueba)
   ───────────────────────────────────────────────────────────────────────── */

export const fotos = {
  vacia: img("1560448204-e02f11c3d0e2", 1200),
  casaTerminada: img("1600585154340-be6161a56a0c", 1200),
  interior: img("1600210492486-724fe5c67fb0", 1200),
  piso: img("1616486338812-3dadae4b4ace", 1200),
  obra: img("1541888946425-d81bb19240f5", 1200),
  fachada: img("1518005020951-eccb494ad742", 1200),
  linea: img("1487958449943-2429e8be8625", 1200),
  estudio: img("1497366754035-f200968a6e72", 1200),
  /** Interior porteño de hormigón y vidrio (Pexels 18204484, CABA): Galería Norte, único del premium. */
  galeriaBA: pex(18204484, 1200),
  /** Concreto con luz cenital (Pexels 38344729): Local Mitre en obra, único del premium. */
  localConcreto: pex(38344729, 1200),
  /** Hormigón y techo vidriado (Pexels 10301540): después de Casa Alameda, único del premium. */
  alamedaInterior: pex(10301540, 1200),
  /** Muros altos y asiento simple (Pexels 28993989): después de Piso Vélez, único del premium. */
  velezReforma: pex(28993989, 1200),
} as const;

export const obras: Obra[] = [
  {
    id: "casa-alameda",
    title: "Casa Alameda",
    year: "2025",
    superficie: "212 m²",
    estado: "Terminada",
    zona: "San Isidro",
    tipo: "Obra nueva",
    resumen: "Casa de tres dormitorios sobre un lote en esquina, con un patio central que ordena los ambientes alrededor.",
    equipo: ["Estudio Veta", "Ingeniería Costera (estructura)", "Constructora del Sur (ejecución)"],
    entregables: ["Croquis y anteproyecto", "Proyecto con permisos", "Dirección de obra", "Documentación conforme a obra"],
    antes: {
      src: fotos.piso,
      alt: "Ambiente vacío de una vivienda en estado previo a la obra (imagen de demostración).",
    },
    despues: {
      src: fotos.alamedaInterior,
      alt: "Interior de hormigón con techo vidriado y luz cenital (imagen de demostración).",
    },
    nota: "Imágenes de demostración: ilustran estados de obra, no son fotos de esta obra.",
  },
  {
    id: "local-mitre",
    title: "Local Mitre",
    year: "2026",
    superficie: "96 m²",
    estado: "En obra",
    zona: "Palermo",
    tipo: "Comercial",
    resumen: "Un local de esquina reconvertido a cafeteria: vidriera continua, barra de acero y cocina a la vista.",
    equipo: ["Estudio Veta", "Cálculo & Estructuras", "Carpintería Costa"],
    entregables: ["Proyecto", "Licencia de obra", "Dirección de obra", "Habilitación de uso"],
    despues: {
      src: fotos.localConcreto,
      alt: "Interior de hormigón con luz natural en obra (imagen de demostración).",
    },
    nota: "Obra en curso: la foto muestra el estado actual de un obra de demostración.",
  },
  {
    id: "piso-velez",
    title: "Piso Vélez",
    year: "2024",
    superficie: "124 m²",
    estado: "Terminada",
    zona: "Villa Crespo",
    tipo: "Reforma",
    resumen: "Reforma integral de un piso de los años 40: se liberaron dos machones y la luz del patio cruzó todo el living.",
    equipo: ["Estudio Veta", "Ingeniería Almendral (estructura)"],
    entregables: ["Croquis", "Proyecto", "Permisos", "Dirección de obra"],
    antes: {
      src: fotos.vacia,
      alt: "Ambiente vacío y luminoso en el estado previo a la reforma (imagen de demostración).",
    },
    despues: {
      src: fotos.velezReforma,
      alt: "Reforma con muros de hormigón y estar minimalista (imagen de demostración).",
    },
    nota: "Imágenes de demostración: ilustran estados de obra, no son fotos de esta obra.",
  },
  {
    id: "galeria-norte",
    title: "Galería Norte",
    year: "2025",
    superficie: "640 m²",
    estado: "En anteproyecto",
    zona: "La Boca",
    tipo: "Comercial",
    resumen: "Un galpóntodo de los años 60 reconvertido en galería: se cubrió el patio y se liberó la planta libre.",
    equipo: ["Estudio Veta", "Ingeniería Sparse", "Carpintería Costa"],
    entregables: ["Factibilidad y programa", "Anteproyecto", "Proyecto de reciclaje"],
    despues: {
      src: fotos.galeriaBA,
      alt: "Interior moderno de hormigón y vidrio en Buenos Aires (imagen de demostración).",
    },
    nota: "En anteproyecto: la imagen es una referencia del tipo de arquitectura, no del proyecto.",
  },
];

const obrasSection: Section = {
  id: "obras",
  kicker: "Obras",
  title: "Cada obra con su ficha y su antes y su después",
  body: "No mostramos renders: mostramos proyectos con año, superficie, estado, tipo y equipo. La obra terminada es la prueba; el proceso es lo que se compra.",
  layout: "grid",
  items: obras.map((o) => ({
    id: o.id,
    title: o.title,
    kicker: `${o.year} · ${o.zona}`,
    body: o.resumen,
    points: o.entregables,
    meta: [
      { label: "Superficie", value: o.superficie },
      { label: "Tipo", value: o.tipo },
      { label: "Estado", value: o.estado },
    ],
    badge: o.estado === "En obra" ? "En obra" : undefined,
  })),
};

/* ─────────────────────────────────────────────────────────────────────────
   Equipo
   ───────────────────────────────────────────────────────────────────────── */

export const equipo: Integrante[] = [
  {
    id: "malena",
    nombre: "Malena Ferreyra",
    rol: "Arquitecta, socia fundadora",
    body: "Hace el anteproyecto y el proyecto. Es la que corta: si una idea no se sostiene en el croquis, se cae antes de gastar en dibujarla.",
  },
  {
    id: "santiago",
    nombre: "Santiago Ocampo",
    rol: "Arquitecto, jefe de proyecto",
    body: "Traduce el proyecto a obra: cronograma, compras y los imprevistos que aparecen cuando la obra se desvía del plano.",
  },
  {
    id: "renata",
    nombre: "Renata Ocampo",
    rol: "Arquitecta, interiorismo y equipamiento",
    body: "Materiales, luz y mobiliario. Arma las paletas con muestras físicas antes de que se apruebe un solo metro.",
  },
  {
    id: "nicanor",
    nombre: "Nicanor Paiva",
    rol: "Director de obra e ingeniería",
    body: "Calcula, coordina subcontratos y está en obra todas las semanas. Es el que avisa cuando un plazo ya no cierra.",
  },
];

const equipoSection: Section = {
  id: "equipo",
  kicker: "El equipo",
  title: "Cuatro personas, un mismo teléfono",
  body: "El que proyecta es el que está en la obra. No hay cadena de mensajes ni nadie que se pase el bastón.",
  layout: "grid",
  items: equipo.map((p) => ({
    id: p.id,
    title: p.nombre,
    kicker: p.rol,
    body: p.body,
  })),
};

/* ─────────────────────────────────────────────────────────────────────────
   FAQ
   ───────────────────────────────────────────────────────────────────────── */

const faq: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que preguntan antes de firmar",
  layout: "list",
  items: [
    {
      id: "f1",
      title: "¿Cuánto cuesta un proyecto?",
      body: "Depende de la escala, la complejidad y el alcance. En el cotizador ves una estimación orientativa por tipo de trabajo y superficie; el honorario definitivo se cierra por escrito después de la visita, con la lista de tareas incluida.",
    },
    {
      id: "f2",
      title: "¿Cuánto tarda?",
      body: "Entre 2 y 3 semanas para la escucha y el croquis, 7 a 10 semanas para el proyecto y el tiempo de la obra. Lo que no depende del estudio son los tiempos municipales: por eso el cronograma va con holgura.",
    },
    {
      id: "f3",
      title: "¿Por qué el 3D y no un render?",
      body: "El modelo navegable es el proyecto con sus medidas reales: se puede recorrer ambiente por ambiente antes de firmarlo. Un render muestra una imagen; esto muestra una superficie y sus limites.",
    },
    {
      id: "f4",
      title: "¿Trabajan con la municipalidad?",
      body: "Sí. Relevamos la normativa del municipio, presentamos el expediente, seguimos las subsanaciones y tramitamos la habilitación final de uso.",
    },
    {
      id: "f5",
      title: "¿Qué pasa si el presupuesto se desvía?",
      body: "Se avisa el mismo día, con el número y la causa. Los cambios en obra se cotizan aparte y no se ejecutan hasta que los aprobás por escrito.",
    },
    {
      id: "f6",
      title: "¿Los datos de esta web son reales?",
      body: "No. Es una demostración de portfolio: la marca, las obras, el equipo, los honorarios y los datos de contacto son ficticios.",
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
   Maqueta 3D: ambientes y planos de referencia
   ───────────────────────────────────────────────────────────────────────── */

export const ambientes: Ambiente[] = [
  {
    id: "estar",
    nombre: "Estar",
    m2: 38,
    detalle: "Doble altura, ventanal al patio y cocina abierta de cuatro metros.",
    escala: "a2",
    caja: { x: 8, y: 10, w: 40, h: 36 },
    alto: 26,
    usdM2: 1450,
    materiales: ["Cemento pulido", "Vidrio fijo", "Robinia"],
  },
  {
    id: "cocina",
    nombre: "Cocina",
    m2: 16,
    detalle: "Isla de hormigón de dos metros, bacha al patio y luz cenital.",
    escala: "a2",
    caja: { x: 52, y: 10, w: 22, h: 24 },
    alto: 19,
    usdM2: 1850,
    materiales: ["Mármol Carrara", "Acero inoxidable", "Luz natural"],
  },
  {
    id: "dormitorio",
    nombre: "Dormitorio",
    m2: 22,
    detalle: "Vestidor walk-in y luz cenital; la medianera queda liberada.",
    escala: "a2",
    caja: { x: 52, y: 38, w: 22, h: 30 },
    alto: 19,
    usdM2: 1320,
    materiales: ["Losa de cerámica", "Vestidor a medida", "Lino"],
  },
  {
    id: "patio",
    nombre: "Patio",
    m2: 54,
    detalle: "Deck de quebracho, pérgola de acero y un árbol existente.",
    escala: "a3",
    caja: { x: 8, y: 50, w: 40, h: 36 },
    alto: 8,
    usdM2: 980,
    materiales: ["Deck de quebracho", "Pérgola de acero", "Vegetación nativa"],
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Alcances (bandas de escala del cotizador)
   ───────────────────────────────────────────────────────────────────────── */

export const alcances: Alcance[] = [
  {
    id: "a1",
    title: "Hasta 80 m²",
    body: "Reforma chica, ampliación o monoambiente. Una decisión de layout y las herramientas bien afiladas.",
    incluye: ["Croquis y dos esquemas", "Documentación para obra", "Presupuesto cerrado"],
    semanas: "6 a 8 semanas",
  },
  {
    id: "a2",
    title: "80 a 150 m²",
    body: "Casa de 2 o 3 dormitorios. El rango más pedido: entra el proyecto completo con permisos.",
    incluye: ["Tres esquemas de anteproyecto", "Proyecto y permisos", "Dirección de obra"],
    semanas: "12 a 16 semanas",
  },
  {
    id: "a3",
    title: "150 a 300 m²",
    body: "Casa grande, local o vivienda con cochera. Más documentación, más reuniones, el mismo ritmo.",
    incluye: [
      "Anteproyecto de arquitectura y de interiorismo",
      "Proyecto y permisos",
      "Dirección de obra y control de subcontratos",
    ],
    semanas: "16 a 22 semanas",
  },
  {
    id: "a4",
    title: "Más de 300 m²",
    body: "Obra mayor: varias unidades, un local grande o un galpón. El proyecto se divide en etapas con hitos.",
    incluye: ["Programa y factibilidad", "Proyecto por etapas con hitos", "Seguimiento de obra y habilitación"],
    semanas: "22 a 32 semanas",
  },
  {
    id: "a5",
    title: "Todavía no sé la superficie",
    body: "Perfecto: arrancamos con un anteproyecto corto para medirla y recién ahí cotizamos el resto.",
    incluye: ["Visita y relevamiento", "Croquis a escala", "Número cerrado para decidir"],
    semanas: "2 a 3 semanas",
  },
];

/** Honorarios estimados por tipo de encargo y banda de escala (ARS, IVA incluido). */
export const PRECIOS: Record<string, Record<string, number>> = {
  proyecto: { a1: 2150000, a2: 2850000, a3: 4200000, a4: 6400000, a5: 0 },
  direccion: { a1: 780000, a2: 1150000, a3: 1700000, a4: 2600000, a5: 0 },
  interiorismo: { a1: 720000, a2: 980000, a3: 1450000, a4: 2200000, a5: 0 },
  permisos: { a1: 420000, a2: 480000, a3: 690000, a4: 950000, a5: 0 },
};

/** Porcentaje de seña que se toma al reservar la visita. */
export const SENA = 0.2;

/** Visitas al sitio disponibles para reservar. */
export const visitas: { id: string; day: string; time: string; places: number }[] = [
  { id: "v1", day: "Martes 24", time: "10:00", places: 2 },
  { id: "v2", day: "Martes 24", time: "16:30", places: 1 },
  { id: "v3", day: "Miércoles 25", time: "09:30", places: 3 },
  { id: "v4", day: "Jueves 26", time: "11:00", places: 2 },
  { id: "v5", day: "Jueves 26", time: "17:00", places: 1 },
];

/** Formatea un número como pesos argentinos. */
export function precio(n: number): string {
  return `$$ ${n.toLocaleString("es-AR")}`;
}

/* ─────────────────────────────────────────────────────────────────────────
   Contenido completo
   ───────────────────────────────────────────────────────────────────────── */

export const arquitecturaPremium: RubroContent = {
  id: rubro.id,
  brand,
  rubro: rubro.rubro,
  tagline: rubro.tagline,
  objeccion: rubro.objeccion,
  theme: {
    name: "veta",
    palette: { ...rubro.palette },
    fonts: {
      display: "Fraunces",
      body: "Outfit",
      // Fraunces tiene eje óptico: se declara la URL exacta para no perder el
      // peso variable ni el recorte por tamaño.
      href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Outfit:wght@400;500;600&display=swap",
    },
    radius: "0.25rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Obras", href: "/obras" },
    { label: "Servicios", href: "/servicios" },
    { label: "Cotizar", href: "/cotizar" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Estudio de arquitectura · Buenos Aires",
    title: ["Recorré", "la obra", "antes de firmarla"],
    subtitle:
      "Un modelo navegable de tu proyecto, las obras reales con su antes y su después, y un cotizador que te da un número antes de la primera visita. Sin misterio: cada etapa con su costo y su plazo.",
    cta: { label: "Cotizar mi proyecto", href: "/cotizar" },
    secondaryCta: { label: "Ver las obras", href: "/obras" },
    video: {
      src: video(3091),
      poster: poster(3091),
      alt: "Interior terminado con luz natural y mobiliario (imagen de demostración).",
      isVideo: true,
    },
    live: { label: "Visitas al sitio", count: 3, min: 1, max: 5, unit: "esta semana", interval: 4600 },
  },
  sections: [servicios, proceso, obrasSection, equipoSection, faq],
  conversion: {
    id: "cotizacion",
    kicker: "Cotización",
    title: "Cotizá tu proyecto en cuatro pasos",
    body: "Tipo de trabajo, escala, tus datos y listo: te queda un número de consulta para el estudio, con la seña de la visita y el pase. Sin registro y sin esperas.",
    steps: ["Tipo de trabajo", "Escala", "Visita", "Tu pase"],
    options: serviciosItems,
    slots: visitas,
    demoNotice: "Demo: no se envían datos ni se cobra nada.",
  },
  legal: {
    company: "Estudio Veta Arquitectura (ficticio)",
    cuit: "30-71234567-4",
    address: "Av. Alvear 1880, Palermo, CABA",
    email: "proyectos@estudioveta.demo",
    phone: "+54 11 4899-2200",
    pricesIncludeTaxes: true,
    taxNote:
      "Los valores publicados son estimaciones orientativas y incluyen impuestos. El honorario definitivo se cierra por escrito, con el alcance detallado, antes de firmar el encargo.",
    withdrawal: {
      enabled: true,
      label: "Baja de consulta online · Dar de baja mis datos",
      note:
        "Podés dar de baja una consulta enviada desde esta web y pedir que borremos tus datos. Al confirmar queda registrada la solicitud de baja; en esta demostración no se guarda ningún dato porque los formularios no envían información a ningún servidor.",
      resolution: "Resolución 316/2018 y 271/2020 — Botón de arrepentimiento para compras online.",
    },
    consumerDefense: {
      label: "Defensa del Consumidor",
      url: "https://www.argentina.gob.ar/produccion/defensadelconsumidor",
    },
    documents: [
      { label: "Términos y condiciones", href: "/legal#terminos" },
      { label: "Política de privacidad", href: "/legal#privacidad" },
      { label: "Información sobre precios", href: "/legal#precios" },
    ],
    privacy: [
      "Los datos que dejás en esta web se usan solo para responder tu consulta y preparar una propuesta.",
      "No se comparten con terceros ni se usan con fines comerciales.",
      "Pedí la baja desde el botón de baja del pie de página: el borrado se completa en un plazo máximo de 10 días.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "La cotización online es una simulación: no genera contrato ni reserva horas de trabajo.",
      "Los honorarios de proyecto se pagan por etapa, contra entrega de cada etapa documentada.",
      "Los tiempos municipales dependen de cada comuna y no están garantizados por el estudio.",
      "Cualquier modificación de alcance en obra se cotiza aparte y no se ejecuta hasta su aprobación por escrito.",
    ],
  },
  contact: {
    whatsapp: rubro.whatsapp.phone,
    phone: "+54 11 4899-2200",
    email: "proyectos@estudioveta.demo",
    address: "Av. Alvear 1880, Palermo, CABA",
    hours: "Lunes a viernes de 9 a 19 h · Consultas hasta las 19 h",
    mapsUrl: "https://maps.google.com/?q=Av+Alvear+1880+Palermo",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "Architect"],
    foundingDate: "2017",
    areaServed: "CABA y GBA",
  },
};

export const conversion = arquitecturaPremium.conversion as Conversion;
