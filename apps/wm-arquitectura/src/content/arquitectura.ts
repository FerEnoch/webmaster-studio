/**
 * Contenido de ESTUDIO TRAZO — estudio de arquitectura y diseño.
 *
 * MARCA FICTICIA. Todos los datos (obra, equipo, premios, honorarios, CUIT,
 * dirección) son inventados para demostración.
 *
 * El objeto `arquitectura` cumple el contrato `RubroContent` del kit
 * (packages/webmaster-kit/types.ts). Los datos que el contrato no modela
 * (obras con antes/después, equipo, premios, alcances de la cotización) se
 * exportan como estructuras propias de la app, siempre al lado del contrato.
 */

import { img, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { CatalogItem, Conversion, RubroContent, Section } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "arquitectura")!;

export const brand = "ESTUDIO TRAZO";

/* ─────────────────────────────────────────────────────────────────────────
   Tipos propios de la app
   ───────────────────────────────────────────────────────────────────────── */

/** Una obra del estudio: la prueba que se vende. */
export interface Obra {
  id: string;
  title: string;
  /** Año de proyecto. */
  year: string;
  /** Superficie en m². */
  superficie: string;
  /** Estado de la obra. */
  estado: "Terminada" | "En curso" | "En anteproyecto";
  /** Dónde está. */
  zona: string;
  /** Resumen de una línea. */
  resumen: string;
  /** Quiénes hicieron la obra. */
  equipo: string[];
  /** Qué se entrega. */
  entregables: string[];
  /** Foto del estado anterior (para el par antes/después). */
  antes?: { src: string; alt: string };
  /** Foto del estado final. */
  despues?: { src: string; alt: string };
  /** Pie de foto honesto cuando la imagen no es un estado real de la obra. */
  nota?: string;
}

/** Una etapa del proceso: el mismo guion para todas las obras. */
export interface Etapa {
  id: string;
  title: string;
  body: string;
  /** Qué pasa en la etapa. */
  puntos: string[];
  /** Qué te llevás de esa etapa. */
  entrega: string;
  /** Duración. */
  duracion: string;
}

/** Persona del equipo. */
export interface Integrante {
  id: string;
  nombre: string;
  rol: string;
  body: string;
}

/** Premio o mención (ficticios). */
export interface Premio {
  id: string;
  anio: string;
  titulo: string;
  obra: string;
  tipo: "Premio" | "Mención";
}

/** Escala del proyecto: el paso 2 de la cotización. */
export interface Alcance {
  /** Coincide con el `id` del `Slot` correspondiente. */
  id: string;
  title: string;
  body: string;
  /** Qué incluye en esta escala. */
  incluye: string[];
  /** Plazo estimado de proyecto. */
  semanas: string;
}

/** Conversión del rubro: el `Conversion` del kit + los alcances del paso 2. */
export interface ConversionArq extends Conversion {
  alcances: Alcance[];
}

/* ─────────────────────────────────────────────────────────────────────────
   Servicios (los 4 tipos de proyecto = paso 1 de la cotización)
   ───────────────────────────────────────────────────────────────────────── */

const serviciosItems: CatalogItem[] = [
  {
    id: "proyecto",
    title: "Proyecto completo",
    kicker: "De la idea al permiso",
    body: "Anteproyecto, documentación para obra y seguimiento. Un solo estudio responsable de todo el camino.",
    points: [
      "Croquis y tres esquemas antes de definir el proyecto",
      "Planos, pliego de especificaciones y cómputo de materiales",
      "Informe quincenal con fotos de avance durante la obra",
    ],
    meta: [
      { label: "Plazo", value: "10 a 16 semanas" },
      { label: "Entregable", value: "Anteproyecto + proyecto + permisos" },
    ],
    price: { amount: "desde $ 1.850.000", note: "final, IVA incluido" },
    badge: "Más pedido",
  },
  {
    id: "direccion",
    title: "Dirección de obra",
    kicker: "Alguien del estudio en obra",
    body: "No es un teléfono sin respuesta: el estudio va, mira, corrige y avisa antes de que el problema crezca.",
    points: [
      "Visitas semanales con acta y fotos",
      "Control de calidad y de subcontratos",
      "Informes de avance con cronograma actualizado",
    ],
    meta: [
      { label: "Plazo", value: "Durante toda la obra" },
      { label: "Entregable", value: "Informes quincenales + cierre" },
    ],
    price: { amount: "desde $ 980.000", note: "final, IVA incluido" },
  },
  {
    id: "interiorismo",
    title: "Interiorismo",
    kicker: "Cómo se vive el espacio",
    body: "Distribución, materiales y luz. Sin demoler estructura: el proyecto se hace habitable, no bonito de foto.",
    points: [
      "Plano de mobiliario y jerarquía de circulaciones",
      "Paleta de materiales con muestras físicas",
      "Dirección de montaje y compras acompañadas",
    ],
    meta: [
      { label: "Plazo", value: "6 a 10 semanas" },
      { label: "Entregable", value: "Planos + paleta + montaje" },
    ],
    price: { amount: "desde $ 640.000", note: "final, IVA incluido" },
  },
  {
    id: "permisos",
    title: "Permisos y habilitaciones",
    kicker: "Papeles sin sorpresas",
    body: "Relevamiento normativo, presentación y seguimiento hasta la habilitación final, con el expediente ordenado.",
    points: [
      "Relevamiento de normativa municipal y restricciones",
      "Presentación, subsanaciones y seguimiento",
      "Gestión de habilitación final de uso",
    ],
    meta: [
      { label: "Plazo", value: "4 a 10 semanas" },
      { label: "Entregable", value: "Expediente aprobado + habilitación" },
    ],
    price: { amount: "desde $ 320.000", note: "final, IVA incluido" },
  },
];

const servicios: Section = {
  id: "servicios",
  kicker: "Qué hacemos",
  title: "Cuatro servicios, un solo responsable",
  body: "Podés contratar uno o todos. El proyecto no cambia de manos a mitad de camino: el que dibuja el proyecto es el que está en la obra.",
  layout: "grid",
  items: serviciosItems,
};

/* ─────────────────────────────────────────────────────────────────────────
   Proceso por etapas (la sección pinned)
   ───────────────────────────────────────────────────────────────────────── */

export const etapas: Etapa[] = [
  {
    id: "anteproyecto",
    title: "Anteproyecto",
    body: "Dos o tres semanas para entender el encargo, medir el sitio y probar tres esquemas en croquis. Salís con una decisión tomada, no con un PDF de ochenta páginas.",
    puntos: [
      "Relevamiento del sitio y análisis normativo",
      "Tres esquemas con usos y superficies comparados",
      "Estimación de costo por metro cuadrado",
    ],
    entrega: "Croquis + esquema elegido + número de consulta",
    duracion: "2 a 3 semanas",
  },
  {
    id: "proyecto",
    title: "Proyecto",
    body: "La documentación que va a construir: planos, estructura, instalaciones, pliego y cómputo. El presupuesto se cierra por escrito y con eso trabaja la obra.",
    puntos: [
      "Planos de arquitectura, estructura e instalaciones",
      "Pliego de especificaciones y cómputo de materiales",
      "Presupuesto cerrado por escrito, con contingencias a la vista",
    ],
    entrega: "Legajo de proyecto + presupuesto + cronograma",
    duracion: "6 a 8 semanas",
  },
  {
    id: "obra",
    title: "Obra",
    body: "Dirección de obra, control de calidad e informes. Cada quince días recibís fotos, avance y las decisiones pendientes que necesitan tu firma.",
    puntos: [
      "Visitas semanales con acta y registro fotográfico",
      "Control de subcontratos y cumplimiento del pliego",
      "Informe quincenal con avance y cronograma revisado",
    ],
    entrega: "Informes + control de calidad documentado",
    duracion: "La que dura la obra",
  },
  {
    id: "entrega",
    title: "Entrega",
    body: "Recepción con vos, documentación conforme a obra y manual de uso del edificio. Te avisamos qué quedó pendiente y por qué, con fecha de cierre.",
    puntos: [
      "Recepción conjunta con acta y fotos de terminación",
      "Planos conformes a obra y manual de uso",
      "Garantía de obra por un año y agenda de mantenimiento",
    ],
    entrega: "Acta de recepción + documentación final",
    duracion: "2 semanas",
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
  dunaAntes: img("1560448204-e02f11c3d0e2", 1200),
  dunaDespues: img("1600585154340-be6161a56a0c", 1200),
  azcuenagaAntes: img("1616486338812-3dadae4b4ace", 1200),
  azcuenagaDespues: img("1600210492486-724fe5c67fb0", 1200),
  galeria: img("1487958449943-2429e8be8625", 1200),
  curva: img("1518005020951-eccb494ad742", 1200),
  obra: img("1541888946425-d81bb19240f5", 1200),
  estudio: img("1497366754035-f200968a6e72", 1200),
} as const;

export const obras: Obra[] = [
  {
    id: "casa-duna",
    title: "Casa Duna",
    year: "2024",
    superficie: "186 m²",
    estado: "Terminada",
    zona: "San Isidro",
    resumen: "Casa de dos dormitorios sobre un lote en esquina, con un patio que hace de segundo living.",
    equipo: ["Estudio Trazo", "Ingeniería Almendral (estructura)", "Constructora del Sur (ejecución)"],
    entregables: ["Anteproyecto", "Proyecto con permisos", "Dirección de obra", "Documentación conforme a obra"],
    antes: {
      src: fotos.dunaAntes,
      alt: "Ambiente vacío y luminoso en el estado previo de la Casa Duna (imagen de demostración).",
    },
    despues: {
      src: fotos.dunaDespues,
      alt: "Casa Duna terminada al atardecer, con volumen de vidrio y patio (imagen de demostración).",
    },
    nota: "Imágenes de demostración: ilustran el estado previo y la obra terminada.",
  },
  {
    id: "colectivo-azcuenaga",
    title: "Colectivo Azcuénaga",
    year: "2025",
    superficie: "420 m² · 8 unidades",
    estado: "Terminada",
    zona: "Villa Crespo",
    resumen: "Ocho unidades de 52 m² alrededor de un patio común, con lavadero compartido y bicicletero.",
    equipo: ["Estudio Trazo", "Cálculo & Estructuras", "Marmolería Sur"],
    entregables: [
      "Proyecto de vivienda multifamiliar",
      "Licencia de obra",
      "Dirección de obra",
      "Gestión de habilitación",
    ],
    antes: {
      src: fotos.azcuenagaAntes,
      alt: "Sala vacía del primer piso del Colectivo Azcuénaga antes de la obra (imagen de demostración).",
    },
    despues: {
      src: fotos.azcuenagaDespues,
      alt: "Interior terminado del Colectivo Azcuénaga con mobiliario y luz natural (imagen de demostración).",
    },
    nota: "Imágenes de demostración: ilustran el estado previo y la obra terminada.",
  },
  {
    id: "galeria-curva",
    title: "Galería Curva",
    year: "2023",
    superficie: "1.240 m²",
    estado: "Terminada",
    zona: "La Boca",
    resumen: "Galería de arte en un galpón: se cubrió el patio y se liberó la planta libre para las salas de exposición.",
    equipo: ["Estudio Trazo", "Ingeniería Sparse", "Carpintería Costa"],
    entregables: ["Proyecto de reciclaje", "Habilitación cultural", "Interiorismo expositivo"],
    despues: {
      src: fotos.galeria,
      alt: "Fachada angular de la Galería Curva ya terminada (imagen de demostración).",
    },
    nota: "Obra terminada: la foto muestra el edificio una vez finalizado.",
  },
  {
    id: "casa-portico",
    title: "Casa Pórtico",
    year: "2026",
    superficie: "240 m²",
    estado: "En curso",
    zona: "Palermo",
    resumen: "Reforma y ampliación de una casa de los años 60: se abre al patio y se recupera la terraza.",
    equipo: ["Estudio Trazo", "Ingeniería Almendral (estructura)"],
    entregables: ["Anteproyecto", "Proyecto", "Permisos", "Dirección de obra"],
    despues: {
      src: fotos.obra,
      alt: "Casa Pórtico en etapa de obra gruesa, con equipo de obra en el terreno (imagen de demostración).",
    },
    nota: "Obra en curso: la foto muestra el estado actual de la obra.",
  },
];

const obrasSection: Section = {
  id: "obras",
  kicker: "Obras",
  title: "Cada obra con su ficha, su antes y su después",
  body: "No mostramos renders: mostramos proyectos con año, superficie, estado y equipo. La obra terminada es la prueba; el proceso es lo que se compra.",
  layout: "grid",
  items: obras.map((o) => ({
    id: o.id,
    title: o.title,
    kicker: `${o.year} · ${o.zona}`,
    body: o.resumen,
    points: o.entregables,
    meta: [
      { label: "Año", value: o.year },
      { label: "Superficie", value: o.superficie },
      { label: "Estado", value: o.estado },
    ],
    badge: o.estado === "En curso" ? "En obra" : undefined,
  })),
};

/* ─────────────────────────────────────────────────────────────────────────
   Equipo, premios y dudas
   ───────────────────────────────────────────────────────────────────────── */

export const equipo: Integrante[] = [
  {
    id: "lucia",
    nombre: "Lucía Bandeira",
    rol: "Arquitecta, socia fundadora",
    body: "Hace el anteproyecto y el proyecto. Es la que corta: si una idea no se sostiene en el croquis, se cae antes de gastar en dibujarla.",
  },
  {
    id: "tomas",
    nombre: "Tomás Ocampo",
    rol: "Arquitecto, jefe de proyecto",
    body: "Traduce el proyecto a obra: cronograma, compras y los imprevistos que aparecen cuando la obra se desvía del plano.",
  },
  {
    id: "irina",
    nombre: "Irina Sokolova",
    rol: "Arquitecta, interiorismo y equipamiento",
    body: "Materiales, luz y mobiliario. Arma las paletas con muestras físicas antes de que se apruebe un solo metro.",
  },
  {
    id: "gonzalo",
    nombre: "Gonzalo Paiva",
    rol: "Director de obra e ingeniería",
    body: "Calcula, coordina subcontratos y está en obra todas las semanas. Es el que avisa cuando un plazo ya no cierra.",
  },
];

export const premios: Premio[] = [
  {
    id: "p1",
    anio: "2025",
    titulo: "Premio Urbano de Arquitectura Argentina",
    obra: "Colectivo Azcuénaga",
    tipo: "Mención",
  },
  {
    id: "p2",
    anio: "2024",
    titulo: "Bienal de Arquitectura Domesticada",
    obra: "Casa Duna",
    tipo: "Premio",
  },
  {
    id: "p3",
    anio: "2023",
    titulo: "Premio de Adecuación de Edificios Existentes",
    obra: "Galería Curva",
    tipo: "Premio",
  },
  {
    id: "p4",
    anio: "2022",
    titulo: "Muestra de Arquitectura y Regeneración",
    obra: "Vivienda en Ladera",
    tipo: "Mención",
  },
];

const premiosSection: Section = {
  id: "premios",
  kicker: "Premios",
  title: "Lo que ganamos, dónde y por qué",
  body: "Los premios no sustituyen el proyecto: lo orderly. Mirá las fechas, las obras y el tipo de distinción.",
  layout: "list",
  items: premios.map((p) => ({
    id: p.id,
    title: p.titulo,
    kicker: `${p.anio} · ${p.tipo}`,
    body: `Obra: ${p.obra}.`,
    meta: [{ label: "Año", value: p.anio }],
  })),
};

const faq: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que todos preguntan antes de arrancar",
  layout: "list",
  items: [
    {
      id: "f1",
      title: "¿Cuánto cuesta un proyecto?",
      body: "Depende de la escala y del servicio contratado. En la web ves los honorarios de referencia de cada tipo de trabajo y, con la superficie a mano, te damos un número cerrado. Nunca cobramos un porcentaje de la obra sin avisarte antes.",
    },
    {
      id: "f2",
      title: "¿Cuánto tarda?",
      body: "Entre 2 y 3 semanas para el anteproyecto, 6 a 8 semanas para el proyecto y el tiempo de obra. Lo que no depende del estudio son los tiempos municipales: por eso el cronograma va con holgura y lo vas a ver en cada informe.",
    },
    {
      id: "f3",
      title: "¿Trabajan con la municipalidad?",
      body: "Sí. Relevamos la normativa del municipio, presentamos el expediente, seguimos las subsanaciones y tramitamos la habilitación final de uso. Te avisamos cada vez que el expediente cambia de estado.",
    },
    {
      id: "f4",
      title: "¿Puedo entrar en la obra mientras avanza?",
      body: "Sí, coordinando las visitas y con un aviso previo. Si preferís no entrar, te mandamos el informe quincenal con fotos, avance y las decisiones que necesitan tu firma.",
    },
    {
      id: "f5",
      title: "¿Qué pasa si el presupuesto se desvía?",
      body: "Se avisa el mismo día, con el número y la causa. Los cambios en obra se cotizan aparte y no se ejecutan hasta que los aprobás por escrito.",
    },
    {
      id: "f6",
      title: "¿Los datos de esta web son reales?",
      body: "No. Es una demostración de portfolio: la marca, las obras, el equipo, los premios y los honorarios son ficticios.",
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
   Conversión: cotizar un proyecto
   ───────────────────────────────────────────────────────────────────────── */

export const alcances: Alcance[] = [
  {
    id: "a1",
    title: "Hasta 80 m²",
    body: "Reforma chica, ampliación o studio. Una decisión de layout y las herramientas bien afiladas.",
    incluye: ["Anteproyecto de 2 croquis", "Documentación para obra", "Presupuesto cerrado"],
    semanas: "6 a 8 semanas",
  },
  {
    id: "a2",
    title: "80 a 150 m²",
    body: "Casa de 2 o 3 dormitorios. El rango más pedido: entra el proyecto completo con permisos.",
    incluye: ["3 esquemas de anteproyecto", "Proyecto y permisos", "Dirección de obra"],
    semanas: "10 a 14 semanas",
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
    semanas: "14 a 20 semanas",
  },
  {
    id: "a4",
    title: "Más de 300 m²",
    body: "Obra mayor: varias unidades, un local grande o un galpón. El proyecto se divide en etapas con hitos.",
    incluye: ["Programa y factibilidad", "Proyecto por etapas con hitos", "Seguimiento de obra y habilitación"],
    semanas: "20 a 32 semanas",
  },
  {
    id: "a5",
    title: "Todavía no sé la superficie",
    body: "Perfecto: arrancamos con un anteproyecto corto para medirla y recién ahí cotizamos el resto.",
    incluye: ["Visita y relevamiento", "Croquis de escala", "Número cerrado para decidir"],
    semanas: "2 a 3 semanas",
  },
];

export const conversion: ConversionArq = {
  id: "cotizacion",
  kicker: "Cotización online",
  title: "Cotizá tu proyecto en cuatro pasos",
  body: "Tipo de trabajo, escala, tus datos. Al final te queda un número de consulta para el estudio: el mismo que usamos nosotros para ordenar el encargo.",
  steps: ["Tipo de proyecto", "Superficie y alcance", "Tus datos", "Confirmación"],
  options: serviciosItems,
  slots: alcances.map((a) => ({
    id: a.id,
    day: a.title,
    time: a.semanas,
    places: a.id === "a2" || a.id === "a5" ? 3 : 2,
  })),
  demoNotice: "Demo: no se envían datos.",
  alcances,
};

/* ─────────────────────────────────────────────────────────────────────────
   Contenido completo
   ───────────────────────────────────────────────────────────────────────── */

export const arquitectura: RubroContent = {
  id: rubro.id,
  brand,
  rubro: rubro.rubro,
  tagline: rubro.tagline,
  objeccion: rubro.objeccion,
  theme: {
    name: "trazo",
    palette: { ...rubro.palette },
    fonts: { display: "Archivo", body: "Karla" },
    radius: "0.25rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Obras", href: "/obras" },
    { label: "Estudio", href: "/estudio" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Estudio de arquitectura y diseño · Buenos Aires",
    title: ["Del croquis", "a la obra"],
    subtitle:
      "Proyecto, dirección de obra, interiorismo y permisos. Sin misterio: cada etapa con su costo y su plazo, el presupuesto cerrado por escrito y la obra terminada con su ficha completa.",
    cta: { label: "Cotizar mi proyecto", href: "#cotizacion" },
    secondaryCta: { label: "Ver las obras", href: "/obras" },
    video: {
      src: video(3093),
      poster: poster(3093),
      alt: "Escalera de hormigón visto de un edificio en obra (imagen de demostración).",
      isVideo: true,
    },
    live: { label: "Obras en curso", count: 3, min: 2, max: 4, unit: "en el estudio", interval: 4200 },
  },
  sections: [servicios, proceso, obrasSection, premiosSection, faq],
  conversion,
  legal: {
    company: "Estudio Trazo Arquitectura (ficticio)",
    cuit: "30-70987654-3",
    address: "Av. Del Libertador 1420, Palermo, CABA",
    email: "proyectos@estudiotrazo.demo",
    phone: "+54 11 4788-1200",
    pricesIncludeTaxes: true,
    taxNote:
      "Los honorarios publicados son precios finales e incluyen el IVA. El valor de la obra se cotiza aparte, por escrito, antes de firmar el encargo.",
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
    phone: "+54 11 4788-1200",
    email: "proyectos@estudiotrazo.demo",
    address: "Av. Del Libertador 1420, Palermo, CABA",
    hours: "Lunes a viernes de 9 a 19 h · Consultas hasta las 19 h",
    mapsUrl: "https://maps.google.com/?q=Av+Del+Libertador+1420+Palermo",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "Architect"],
    foundingDate: "2014",
    areaServed: "CABA y GBA",
  },
};
