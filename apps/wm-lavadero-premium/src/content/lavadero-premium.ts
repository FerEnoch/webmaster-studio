/**
 * Contenido de GLOSS & GLASS — lavadero de autos con bar, edición PREMIUM.
 *
 * MARCA FICTICIA. Todos los datos (dirección, teléfonos, precios, CUIT,
 * horarios) son inventados para demostración de portfolio.
 *
 * Segundo ejemplo del rubro: la misma idea (el auto entra al lavado y la
 * espera se convierte en consumo en la barra) con tratamiento cinematográfico
 * —la luz como lenguaje—, configurador 3D único y reserva en 3 toques.
 * La seña es el 20% y el ticket final muestra ese monto, no el total.
 */

import { img, pex, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { CatalogItem, RubroContent, Section } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "lavadero-premium")!;

export const brand = "GLOSS & GLASS";

/** ── Formato de precio AR (determinista, sin depender del locale) ──── */
export function precio(n: number): string {
  return `$ ${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** ── Tamaños de auto (paso 1 de la reserva) ───────────────────────── */
export const tamanos: CatalogItem[] = [
  {
    id: "compacto",
    title: "Compacto",
    kicker: "Hatch o sedán",
    body: "Cronos, Gol, Onix, Corolla. Hasta 4,20 m de largo. Espuma activa, lavado a mano y secado sin contacto.",
    points: [
      "Espuma activa y lavado a mano",
      "Secado sin contacto con aire filtrado",
      "Vidrios y llantas con detalle",
    ],
    meta: [
      { label: "Lavado", value: "45 min" },
      { label: "Desde", value: precio(34900) },
    ],
    price: { amount: precio(34900), note: "lavado exterior, final con impuestos" },
    badge: "Más pedido",
  },
  {
    id: "camioneta",
    title: "Camioneta o SUV",
    kicker: "Desde 4,20 m",
    body: "Hilux, Ranger, Amarok o SUV mediano o grande. Doble pasada de espuma y aspiración completa de caja.",
    points: [
      "Doble pasada de espuma activa",
      "Secado sin contacto con aire filtrado",
      "Aire comprimido en burletes y rueda",
    ],
    meta: [
      { label: "Lavado", value: "60 min" },
      { label: "Desde", value: precio(44900) },
    ],
    price: { amount: precio(44900), note: "lavado exterior, final con impuestos" },
  },
  {
    id: "furgon",
    title: "Furgón o 7 plazas",
    kicker: "Utilitario",
    body: "Furgón, combi o SUV de 7 plazas. Equipo de dos técnicos y secado con doble pasada.",
    points: [
      "Equipo de dos técnicos",
      "Doble pasada de secado",
      "Interior de carga aspirado y perfumado",
    ],
    meta: [
      { label: "Lavado", value: "75 min" },
      { label: "Desde", value: precio(55900) },
    ],
    price: { amount: precio(55900), note: "lavado exterior, final con impuestos" },
  },
];

/** ── Niveles de lavado (paso 2 de la reserva) ──────────────────────── */
export const servicios: CatalogItem[] = [
  {
    id: "express",
    title: "Gloss Signature",
    kicker: "Nivel 1",
    body: "El lavado de todos los días con estándar de detalle: espuma activa, guante de microfibra, secado sin contacto y sellado rápido de brillo.",
    points: [
      "Espuma activa y lavado a mano",
      "Secado sin contacto con aire filtrado",
      "Sellado rápido de brillo (4 semanas)",
    ],
    meta: [
      { label: "Duración", value: "45 a 75 min" },
      { label: "Desde", value: precio(34900) },
    ],
    price: { amount: precio(34900), note: "desde, final con impuestos" },
    badge: "Más pedido",
  },
  {
    id: "completo",
    title: "Gloss Integral",
    kicker: "Nivel 2",
    body: "Exterior completo más interior de punta a punta: aspirado profundo, tapizados con vapor, cueros hidratados y cera de carnauba.",
    points: [
      "Todo lo del Signature",
      "Interior con vapor e hidratación de cueros",
      "Cera de carnauba en toda la carrocería",
    ],
    meta: [
      { label: "Duración", value: "90 a 120 min" },
      { label: "Desde", value: precio(52900) },
    ],
    price: { amount: precio(52900), note: "desde, final con impuestos" },
  },
  {
    id: "premium",
    title: "Gloss Cerámica",
    kicker: "Nivel 3",
    body: "Detalle técnico con corrección de pintura y sellado cerámico de 12 meses. El auto sale del box como de un salón.",
    points: [
      "Todo lo del Integral",
      "Corrección de micro-rayas",
      "Sellado cerámico de 12 meses",
    ],
    meta: [
      { label: "Duración", value: "180 a 240 min" },
      { label: "Desde", value: precio(89900) },
    ],
    price: { amount: precio(89900), note: "desde, final con impuestos" },
  },
];

/** ── Add-ons (paso 2 de la reserva) ────────────────────────────────── */
export const addons: CatalogItem[] = [
  {
    id: "encerado",
    title: "Sellado rápido de brillo",
    body: "Polímero en spray que sella la pintura: brillo espejo y protección por unas cuatro semanas.",
    price: { amount: precio(14900), note: "adicional, final" },
  },
  {
    id: "interior",
    title: "Interior profundo",
    body: "Butacas, alfombras, cielorraso y baúl con vapor seco y producto neutro. Sin perfumes invasivos.",
    price: { amount: precio(18900), note: "adicional, final" },
  },
  {
    id: "vapor",
    title: "Higienización con vapor",
    body: "Vapor a 140 grados en asientos, alfombras y climatizador. Saca olor, ácaros y bacterias.",
    price: { amount: precio(21900), note: "adicional, final" },
  },
  {
    id: "detalle",
    title: "Corrección + cerámico",
    body: "Pulido de corrección en un paso y sellado cerámico de 12 meses. Solo con turno de Cerámica.",
    price: { amount: precio(54900), note: "adicional, final" },
  },
];

/**
 * Precios finales por (servicio, tamaño). El precio publicado es el que se
 * paga: la app no recalcula nada al vuelo, salvo la seña (20%).
 */
export const PRECIOS: Record<string, Record<string, number>> = {
  express: { compacto: 34900, camioneta: 44900, furgon: 55900 },
  completo: { compacto: 52900, camioneta: 68900, furgon: 84900 },
  premium: { compacto: 89900, camioneta: 117900, furgon: 144900 },
};

/** Porcentaje de seña que se toma al reservar. */
export const SENIA_PORCENTAJE = 0.2;

/** Precios finales de cada add-on (monto fijo, igual para todos los autos). */
export const PRECIOS_ADDONS: Record<string, number> = {
  encerado: 14900,
  interior: 18900,
  vapor: 21900,
  detalle: 54900,
};

/** ── Club Gloss (membresía con turno fijo) ─────────────────────────── */
export const paquetes: CatalogItem[] = [
  {
    id: "semanal",
    title: "Club Gloss Mensual",
    kicker: "Para el auto que circula",
    body: "Un Signature por semana con turno fijo y café de especialidad incluido en cada visita.",
    points: [
      "4 lavados Signature al mes",
      "Turno fijo: siempre el mismo horario",
      "Café de especialidad de cortesía",
    ],
    meta: [
      { label: "Precio mensual", value: precio(104700) },
      { label: "Seña por turno", value: precio(6980) },
    ],
    price: { amount: precio(104700), note: "4 lavados al mes, final con impuestos" },
    badge: "Ahorrá 25%",
  },
  {
    id: "quincenal",
    title: "Club Gloss Integral",
    kicker: "Auto + interior, siempre",
    body: "Cada 15 días, Integral con interior y sellado. El auto vuelve a estar como el día que lo sacaste.",
    points: [
      "2 lavados Integrales al mes",
      "Turno fijo con prioridad de box",
      "Sellado rápido en cada visita",
    ],
    meta: [
      { label: "Precio mensual", value: precio(95200) },
      { label: "Seña por turno", value: precio(10580) },
    ],
    price: { amount: precio(95200), note: "2 lavados al mes, final con impuestos" },
    badge: "Más pedido",
  },
  {
    id: "detalle",
    title: "Cerámica Anual",
    kicker: "Una vez, bien hecho",
    body: "Un Gloss Cerámica al año con corrección y sellado. Con foto antes y después en tu pase.",
    points: [
      "1 lavado Cerámica por año",
      "Foto antes y después",
      "Prioridad de agenda todo el año",
    ],
    meta: [
      { label: "Precio", value: precio(89900) },
      { label: "Seña", value: precio(17980) },
    ],
    price: { amount: precio(89900), note: "un lavado, final con impuestos" },
  },
];

/** ── Carta del bar (cero alcohol con igual peso) ───────────────────── */
export const carta: CatalogItem[] = [
  {
    id: "espresso",
    title: "Espresso doble",
    kicker: "Café de especialidad",
    body: "Blend de la casa, tueste medio, extracción pesada. Sale con agua con gas.",
    price: { amount: precio(4200) },
  },
  {
    id: "cortado",
    title: "Cortado",
    kicker: "Café de especialidad",
    body: "Espresso cortado con leche vaporizada sedosa. Corto, como corresponde.",
    price: { amount: precio(4900) },
  },
  {
    id: "capuccino",
    title: "Cappuccino italiano",
    kicker: "Café de especialidad",
    body: "Espuma firme, cacao amargo y canela de Ceylán. Para esperar sin apuro.",
    price: { amount: precio(6800) },
  },
  {
    id: "medialunas",
    title: "Medialunas de manteca (x2)",
    kicker: "Para esperar",
    body: "Horneadas a las 9 y a las 16. Con dulce de leche o solas.",
    price: { amount: precio(5900) },
  },
  {
    id: "tostado",
    title: "Tostado de la casa",
    kicker: "Para esperar",
    body: "Queso brie y pesto sobre pan de masa madre. Se arma mientras tu auto entra al box.",
    price: { amount: precio(9900) },
  },
  {
    id: "limonada",
    title: "Tónica de la casa 0.0",
    kicker: "Sin alcohol",
    body: "Tónica artesanal, romero y pomelo rosado. La más pedida de la barra: manejar también es un plan.",
    price: { amount: precio(7500) },
  },
  {
    id: "cerveza",
    title: "Spritz sin alcohol",
    kicker: "Sin alcohol",
    body: "Aperitivo italiano 0.0 con espumante sin alcohol y naranja deshidratada. Mismo ritual, cero graduación.",
    price: { amount: precio(8900) },
  },
  {
    id: "vermut",
    title: "Vermut de la casa",
    kicker: "Con alcohol · +18",
    body: "Rosso con hielo, oliva y naranja. Solo de 17 a 21 h y solo si no manejás: te pedimos un taxi.",
    price: { amount: precio(9500) },
  },
];

/** ── Secciones estáticas ────────────────────────────────────────────── */
const lavados: Section = {
  id: "lavados",
  kicker: "Por tamaño de auto",
  title: "El precio depende del tamaño, no del apuro",
  body: "Decinos cuánto mide tu auto y te decimos cuánto sale. El precio publicado es final: sin sorpresas en el mostrador ni letra chica en el box.",
  layout: "grid",
  items: tamanos,
};

const serviciosSection: Section = {
  id: "servicios",
  kicker: "Tres niveles",
  title: "Elegí el tratamiento según el estado del auto",
  body: "Todos los niveles incluyen espuma activa, lavado a mano con guante de microfibra y secado sin contacto. La diferencia es hasta dónde se llega.",
  layout: "grid",
  items: servicios,
};

const paquetesSection: Section = {
  id: "paquetes",
  kicker: "Club Gloss",
  title: "Membresía con turno fijo y precio cerrado",
  body: "Producto listo, no un presupuesto a medir. Pagás el 20% de seña al reservar y el resto cuando retirás el auto.",
  layout: "grid",
  items: paquetes,
};

const barSection: Section = {
  id: "bar",
  kicker: "La barra",
  title: "Mientras tu auto se lava, la barra es tuya",
  body: "El bar no es la sala de espera: es la mitad del servicio. Carta corta, café de especialidad y opciones sin alcohol con el mismo cuidado que las con alcohol. Si tomás, no manejás: te pedimos el taxi.",
  layout: "list",
  items: carta,
};

const faq: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que todos preguntan antes de reservar",
  layout: "list",
  items: [
    {
      id: "f1",
      title: "¿Cuánto tarda el tratamiento?",
      body: "Un Signature de auto compacto tarda 45 minutos; una camioneta, 60. El Integral va de 90 a 120 minutos y el Cerámica de 180 a 240. Cuando reservás te decimos la hora exacta en que queda listo.",
    },
    {
      id: "f2",
      title: "¿Puedo esperar en la barra mientras lavan el auto?",
      body: "Es el plan: el turno incluye café de especialidad mientras dura el lavado. La barra abre de martes a domingo, de 10 a 22 h, y la carta sin alcohol tiene el mismo peso que la con alcohol.",
    },
    {
      id: "f3",
      title: "¿Cómo se paga la seña?",
      body: "La seña es el 20% del total y se toma al reservar, por transferencia o en efectivo cuando llegás. Se descuenta del total el día del lavado.",
    },
    {
      id: "f4",
      title: "¿Qué pasa si llego tarde?",
      body: "Podés dejar el auto con el responsable de turno hasta dos horas después de la hora reservada. Pasada esa ventana, el auto queda en el box hasta que llegues y te avisamos por WhatsApp.",
    },
    {
      id: "f5",
      title: "¿La seña se devuelve si cancelo?",
      body: "Si avisás con más de 4 horas de anticipación, te devolvemos la seña completa. Con menos de 4 horas, la seña se consume en el turno reservado.",
    },
    {
      id: "f6",
      title: "¿Los datos de esta web son reales?",
      body: "No. Es una demo de portfolio: la marca, los precios, la dirección y la carta son ficticios, y las reservas no envían datos a ningún servidor.",
    },
  ],
};

/** ── Contenido completo ────────────────────────────────────────────── */
export const lavadero: RubroContent = {
  id: rubro.id,
  brand,
  rubro: rubro.rubro,
  tagline: rubro.tagline,
  objeccion: rubro.objeccion,
  theme: {
    name: "gloss-glass",
    palette: { bg: "#101114", fg: "#F2EDE5", accent: "#D08A3E" },
    // BaseLayout respeta href: no pedir los pesos 700/800 del kit para la serif.
    fonts: {
      display: "Bodoni Moda",
      body: "Archivo",
      href: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400&family=Archivo:wght@400;500;600&display=swap",
    },
    radius: "0.15rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Bar", href: "/bar" },
    { label: "Reservar", href: "/reservar" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Lavadero + bar · Edición premium",
    title: ["El auto impecable.", "Vos, en la barra."],
    subtitle:
      "Reservás en 30 segundos, dejás el auto en el box y te sentás en la barra hasta que esté listo. Luz de salón sobre la pintura, café de especialidad en la mano.",
    cta: { label: "Reservar mi lavado", href: "/reservar" },
    secondaryCta: { label: "Armar mi tratamiento", href: "/servicios" },
    video: {
      src: video(47833),
      poster: poster(47833),
      alt: "Detalle de pulido sobre la pintura en el box de GLOSS & GLASS (imagen de demostración).",
      isVideo: true,
    },
    live: { label: "Abierto ahora", count: 4, min: 2, max: 6, unit: "mesas libres", interval: 4200 },
  },
  sections: [lavados, serviciosSection, paquetesSection, barSection, faq],
  conversion: {
    id: "reserva",
    kicker: "Reservá tu tratamiento",
    title: "Reservá tu tratamiento en cuatro pasos",
    body: "Elegís el tamaño de tu auto, el nivel con sus extras, el turno y pagás la seña. Te queda un pase con código, la hora exacta de entrega y el monto de la seña.",
    steps: ["Tu auto", "Tratamiento y extras", "Turno y seña", "Tu pase"],
    options: tamanos,
    slots: [
      { id: "h1", day: "Jueves 20", time: "09:00", places: 3 },
      { id: "h2", day: "Jueves 20", time: "11:30", places: 2 },
      { id: "h3", day: "Jueves 20", time: "15:00", places: 5 },
      { id: "h4", day: "Viernes 21", time: "08:30", places: 4 },
      { id: "h5", day: "Viernes 21", time: "10:45", places: 2 },
      { id: "h6", day: "Viernes 21", time: "13:15", places: 6 },
      { id: "h7", day: "Viernes 21", time: "17:30", places: 3 },
      { id: "h8", day: "Sábado 22", time: "09:30", places: 2 },
      { id: "h9", day: "Sábado 22", time: "14:00", places: 4 },
      { id: "h10", day: "Sábado 22", time: "16:00", places: 5 },
    ],
    demoNotice: "Demo: no se envían datos.",
  },
  legal: {
    company: "Gloss & Glass S.A.S. (ficticia)",
    cuit: "30-71988452-3",
    address: "Gorriti 4380, Palermo, CABA",
    email: "hola@glossandglass.demo",
    phone: "+54 11 4899-1122",
    pricesIncludeTaxes: true,
    taxNote:
      "Todos los precios publicados son precios finales e incluyen el IVA. La seña del 20% se descuenta del total y no se recarga con impuestos.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar una reserva online",
      note:
        "Si reservaste un tratamiento online, podés cancelarlo sin costo desde acá. Completá el código de tu pase y el email de la reserva: se anula el turno y se devuelve la seña si avisaste con más de 4 horas de anticipación.",
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
      { label: "Política de cancelaciones", href: "/legal#cancelaciones" },
    ],
    privacy: [
      "Los datos que dejás en esta web (nombre, teléfono, email y patente) se usan únicamente para coordinar tu turno y avisarte por WhatsApp o email.",
      "No se comparten con terceros ni con fines comerciales.",
      "Pedí la baja de tus datos desde el botón de baja del pie de página: se elimina todo en un plazo máximo de 10 días.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "La seña del 20% se toma al confirmar la reserva y se descuenta del precio final del tratamiento.",
      "El horario queda confirmado recién cuando recibís el pase con código.",
      "El tiempo de entrega es un estimado: puede variar según el estado del auto y la carga del box.",
      "Si no podés asistir, avisanos con al menos 4 horas de anticipación para liberar el turno y devolverte la seña.",
      "El tratamiento interior requiere que retires tus objetos personales del auto antes de dejarlo en el box.",
      "La barra es de consumo libre: el pase del tratamiento no incluye bebidas, salvo el café de especialidad del turno.",
      "Mayores de 18 años para el consumo de bebidas alcohólicas en la barra. Si tomás, no manejás.",
    ],
  },
  contact: {
    whatsapp: rubro.whatsapp.phone,
    phone: "+54 11 4899-1122",
    email: "hola@glossandglass.demo",
    address: "Gorriti 4380, Palermo, CABA",
    hours: "Lavadero: lunes a sábado de 8 a 20 h · Barra: martes a domingo de 10 a 22 h",
    mapsUrl: "https://maps.google.com/?q=Gorriti+4380+Palermo",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "AutomotiveBusiness"],
    priceRange: "$$$",
  },
};

/** Fotos de la app (pool verificado de `media.ts`). */
export const fotos = {
  tunel: img("1626668893632-6f3a4466d22f", 1200),
  box: img("1590362891991-f776e747a588", 1200),
  garage: img("1492144534655-ae79c964c9d7", 1200),
  tecnico: img("1625047509248-ec889cbff17f", 1200),
  /** Blanco descapotable en calle urbana (Pexels 18542767): tamaño Compacto premium, sin reusar el Fiat de concesionario. */
  chico: pex(18542767, 900),
  barra: img("1517248135467-4c7edcad34c4", 1200),
  medialunas: img("1530610476181-d83430b64dcd", 900),
  brindis: img("1470337458703-46ad1756a187", 900),
} as const;
