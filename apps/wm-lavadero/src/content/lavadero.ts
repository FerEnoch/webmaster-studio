/**
 * Contenido de ESQUINA BRILLO — lavadero de autos con bar.
 *
 * MARCA FICTICIA. Todos los datos (dirección, teléfonos, precios, CUIT,
 * horarios) son inventados para demostración de portfolio.
 *
 * Rubro con una idea propia: el auto entra al lavado y la espera se
 * convierte en consumo en la barra. Por eso la seña es el 20% y el ticket
 * final muestra ese monto, no el total.
 */

import { img, pex, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { CatalogItem, RubroContent, Section } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "lavadero")!;

export const brand = "ESQUINA BRILLO";

/** ── Formato de precio AR (determinista, sin depender del locale) ──── */
export function precio(n: number): string {
  return `$ ${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** ── Tamaños de auto (paso 1 de la reserva) ───────────────────────── */
export const tamanos: CatalogItem[] = [
  {
    id: "compacto",
    title: "Compacto",
    kicker: "Hatch o sedan",
    body: "Fiat Cronos, Gol, Onix, Corolla. Hasta 4,20 m de largo.",
    points: [
      "Espuma activa y lavado a mano",
      "Secado con toalla de microfibra",
      "Limpieza de cauces y paragolpes",
    ],
    meta: [
      { label: "Lavado", value: "35 min" },
      { label: "Desde", value: precio(18500) },
    ],
    price: { amount: precio(18500), note: "lavado exterior, final con impuestos" },
    badge: "Más pedido",
  },
  {
    id: "camioneta",
    title: "Camioneta o SUV",
    kicker: "Desde 4,20 m",
    body: "Hilux, Ranger, Amarok o un SUV mediano o grande.",
    points: [
      "Espuma activa y lavado a mano",
      "Secado con toalla de microfibra",
      "Aire comprimido para la rueda",
    ],
    meta: [
      { label: "Lavado", value: "45 min" },
      { label: "Desde", value: precio(24900) },
    ],
    price: { amount: precio(24900), note: "lavado exterior, final con impuestos" },
  },
  {
    id: "furgon",
    title: "Furgón o 7 plazas",
    kicker: "Utilitario",
    body: "Furgón, combi, camioneta con capota, SUV de 7 plazas.",
    points: [
      "Espuma activa y lavado a mano",
      "Doble pasada de secado",
      "Interior de carga aspirado",
    ],
    meta: [
      { label: "Lavado", value: "55 min" },
      { label: "Desde", value: precio(31900) },
    ],
    price: { amount: precio(31900), note: "lavado exterior, final con impuestos" },
  },
];

/** ── Niveles de lavado (paso 2 de la reserva) ──────────────────────── */
export const servicios: CatalogItem[] = [
  {
    id: "express",
    title: "Brillo Express",
    kicker: "Nivel 1",
    body: "El lavado de siempre, sin vueltas: espuma activa, lavado a mano, secado sin contacto y una pasada final de brillo.",
    points: [
      "Espuma activa y lavado a mano",
      "Secado sin contacto con aire comprimido",
      "Aroma de Cotton en el habitáculo",
    ],
    meta: [
      { label: "Duración", value: "35 a 55 min" },
      { label: "Desde", value: precio(18500) },
    ],
    price: { amount: precio(18500), note: "desde, final con impuestos" },
  },
  {
    id: "completo",
    title: "Brillo Completo",
    kicker: "Nivel 2",
    body: "Todo el exterior más el interior: aspirado, limpieza de tapizados, alfombras, molduras y encerado.",
    points: [
      "Exterior completo",
      "Interior aspirado y tapizados limpios",
      "Encerado de carnauba",
    ],
    meta: [
      { label: "Duración", value: "75 a 100 min" },
      { label: "Desde", value: precio(32900) },
    ],
    price: { amount: precio(32900), note: "desde, final con impuestos" },
    badge: "Más pedido",
  },
  {
    id: "premium",
    title: "Brillo Premium",
    kicker: "Nivel 3",
    body: "Detalle técnico: vapor sobre tapizados, pulido de pintura y sellado cerámico. El auto sale como nuevo.",
    points: [
      "Todo lo del nivel 2",
      "Higienización con vapor",
      "Pulido y sellado cerámico",
    ],
    meta: [
      { label: "Duración", value: "150 a 210 min" },
      { label: "Desde", value: precio(58900) },
    ],
    price: { amount: precio(58900), note: "desde, final con impuestos" },
  },
];

/** ── Add-ons (paso 2 de la reserva) ────────────────────────────────── */
export const addons: CatalogItem[] = [
  {
    id: "encerado",
    title: "Encerado de carnauba",
    body: "Capa de cera que sella la pintura: brillo y protección por unas semanas.",
    price: { amount: precio(9900), note: "adicional, final" },
  },
  {
    id: "interior",
    title: "Limpieza interior profunda",
    body: "Alfombras, tapizados, filtros de aire y vidrios con producto y vapor seco.",
    price: { amount: precio(12500), note: "adicional, final" },
  },
  {
    id: "vapor",
    title: "Higienización con vapor",
    body: "Vapor a 140 grados en asientos, alfombras y ruedas. Saca olor y ácaros.",
    price: { amount: precio(14900), note: "adicional, final" },
  },
  {
    id: "detalle",
    title: "Detalle premium de pintura",
    body: "Pulido de pintura, corrección de rayas finas y sellado cerámico de 12 meses.",
    price: { amount: precio(39900), note: "adicional, final" },
  },
];

/**
 * Precios finales por (servicio, tamaño). El precio publicado es el que se
 * paga: la app no recalcula nada al vuelo, salvo la seña (20%).
 */
export const PRECIOS: Record<string, Record<string, number>> = {
  express: { compacto: 18500, camioneta: 24900, furgon: 31900 },
  completo: { compacto: 32900, camioneta: 42900, furgon: 51900 },
  premium: { compacto: 58900, camioneta: 76900, furgon: 92900 },
};

/** Porcentaje de seña que se toma al reservar. */
export const SENIA_PORCENTAJE = 0.2;

/** Precios finales de cada add-on (monto fijo, igual para todos los autos). */
export const PRECIOS_ADDONS: Record<string, number> = {
  encerado: 9900,
  interior: 12500,
  vapor: 14900,
  detalle: 39900,
};

/** ── Paquetes productizados (precio fijo + seña) ───────────────────── */
export const paquetes: CatalogItem[] = [
  {
    id: "semanal",
    title: "Brillo Semanal",
    kicker: "Para el auto que circula",
    body: "Lavadito de afuera, todos los lunes. El café de cortesía viene incluido en cada turno.",
    points: [
      "4 lavados Express al mes",
      "Turno fijo: siempre el mismo horario",
      "Seña del 20% por cada turno",
    ],
    meta: [
      { label: "Precio mensual", value: precio(55500) },
      { label: "Seña por turno", value: precio(2800) },
    ],
    price: { amount: precio(55500), note: "4 lavados al mes, final con impuestos" },
    badge: "Ahorra 25%",
  },
  {
    id: "quincenal",
    title: "Esquina Quincenal",
    kicker: "Auto + interior",
    body: "Cada 15 días, lavado completo con interior y encerado. El auto vuelve a estar como el día que lo compraste.",
    points: [
      "2 lavados Completos al mes",
      "Turno fijo con prioridad",
      "Encerado en cada lavado",
    ],
    meta: [
      { label: "Precio mensual", value: precio(65800) },
      { label: "Seña por turno", value: precio(6600) },
    ],
    price: { amount: precio(65800), note: "2 lavados al mes, final con impuestos" },
    badge: "Más pedido",
  },
  {
    id: "detalle",
    title: "Carta de Detalle",
    kicker: "Una vez, bien hecho",
    body: "Un Premium al año, con pulido y sellado. Con foto antes y después en tu pase.",
    points: [
      "1 lavado Premium por año",
      "Foto antes y después",
      "Seña del 20% para reservar el turno",
    ],
    meta: [
      { label: "Precio", value: precio(58900) },
      { label: "Seña", value: precio(11800) },
    ],
    price: { amount: precio(58900), note: "un lavado, final con impuestos" },
  },
];

/** ── Carta del bar ─────────────────────────────────────────────────── */
export const carta: CatalogItem[] = [
  {
    id: "espresso",
    title: "Espresso doble",
    kicker: "Café de barra",
    body: "Blend de la casa, tueste medio. Sale con un vasito de agua.",
    price: { amount: precio(3200) },
  },
  {
    id: "cortado",
    title: "Cortado",
    kicker: "Café de barra",
    body: "Espresso cortado con un hilo de leche. Corto, como corresponde.",
    price: { amount: precio(3900) },
  },
  {
    id: "capuccino",
    title: "Cappuccino",
    kicker: "Café de barra",
    body: "Espuma firme y canela. Para esperar sin apuro.",
    price: { amount: precio(5400) },
  },
  {
    id: "medialunas",
    title: "Medialunas de manteca (x2)",
    kicker: "Para esperar",
    body: "Recién hechas a las 9 y a las 16. Con dulce de leche o solas.",
    price: { amount: precio(4800) },
  },
  {
    id: "tostado",
    title: "Tostado de la casa",
    kicker: "Para esperar",
    body: "Miga de queso y pesto sobre pan de piedra. Se arma mientras tu auto entra.",
    price: { amount: precio(7900) },
  },
  {
    id: "limonada",
    title: "Limonada de la casa",
    kicker: "Sin alcohol",
    body: "Limón, menta y hielo. La más pedida en verano.",
    price: { amount: precio(6200) },
  },
  {
    id: "cerveza",
    title: "Cerveza tirada",
    kicker: "Algo más",
    body: "Dos opciones, 330 ml. Para quedarse un rato largo.",
    price: { amount: precio(4500) },
  },
  {
    id: "vermut",
    title: "Vermut de la casa",
    kicker: "Algo más",
    body: "Con hielo, oliva y naranja. De 11 a 19 h.",
    price: { amount: precio(7500) },
  },
];

/** ── Secciones estáticas ────────────────────────────────────────────── */
const lavados: Section = {
  id: "lavados",
  kicker: "Por tamaño de auto",
  title: "El precio depende del tamaño, no del humo",
  body: "Decinos cuánto mide tu auto y te decimos cuánto sale. Sin sorpresas en el mostrador: el precio publicado es el que pagás.",
  layout: "grid",
  items: tamanos,
};

const serviciosSection: Section = {
  id: "servicios",
  kicker: "Tres niveles",
  title: "Elegí el lavado según el estado del auto",
  body: "Todos los niveles incluyen espuma activa, lavado a mano y secado sin contacto. La diferencia es cuánto se abre el auto.",
  layout: "grid",
  items: servicios,
};

const paquetesSection: Section = {
  id: "paquetes",
  kicker: "Turno fijo",
  title: "Paquetes con precio fijo y turno reservado",
  body: "Producto listo, no un presupuesto a medir. Pagás el 20% de seña al reservar y el resto cuando retirás el auto.",
  layout: "grid",
  items: paquetes,
};

const barSection: Section = {
  id: "bar",
  kicker: "La barra",
  title: "Mientras tu auto se lava, la barra está abierta",
  body: "El bar no es un extra: es la mitad del servicio. Por eso lo limpiamos, lo iluminamos y siempre hay alguien en la barra.",
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
      title: "¿Cuánto tarda el lavado?",
      body: "Un Express de auto compacto tarda 35 minutos; una camioneta, 45. El Completo va de 75 a 100 minutos y el Premium de 150 a 210. Cuando reservás te decimos la hora exacta en que queda listo.",
    },
    {
      id: "f2",
      title: "¿Puedo esperar adentro mientras lavan el auto?",
      body: "Sí, y es lo que más nos gusta. El turno incluye café de cortesía mientras dura el lavado. La barra atiende de martes a domingo, de 10 a 22 h.",
    },
    {
      id: "f3",
      title: "¿Cómo se paga la seña?",
      body: "La seña es el 20% del total y se toma al reservar, por transferencia o en efectivo cuando llegás. Se descuenta del total el día del lavado.",
    },
    {
      id: "f4",
      title: "¿Qué pasa si llego tarde?",
      body: "Podés dejar el auto con el responsable de turno hasta dos horas después de la hora reservada. Pasada esa ventana, el auto queda en el box hasta que llegues.",
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
    name: "esquina-brillo",
    palette: { ...rubro.palette },
    fonts: { display: "Fraunces", body: "Archivo" },
    radius: "0.6rem",
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
    kicker: "Lavadero de autos con bar",
    title: ["Lavá tu auto.", "Tomá algo.", "Te vas."],
    subtitle:
      "Reservás el turno, dejás el auto en el box y te sentás en la barra hasta que esté listo. El lavado sale con pase, la espera sale con café.",
    cta: { label: "Reservar mi lavado", href: "/reservar" },
    secondaryCta: { label: "Ver los servicios", href: "/servicios" },
    video: {
      src: video(4307),
      poster: poster(4307),
      alt: "Agua a presión en el box de lavado de ESQUINA BRILLO (imagen de demostración).",
      isVideo: true,
    },
    live: { label: "Abierto ahora", count: 2, min: 1, max: 3, unit: "lugares en la barra", interval: 3800 },
  },
  sections: [lavados, serviciosSection, paquetesSection, barSection, faq],
  conversion: {
    id: "reserva",
    kicker: "Reservá tu lavado",
    title: "Reservá tu lavado en cuatro pasos",
    body: "Elegís el tamaño de tu auto, el nivel de lavado con sus extras, el turno y pagás la seña. Te queda un pase con código, la hora exacta de entrega y el monto de la seña.",
    steps: ["Tu auto", "Lavado y extras", "Turno y seña", "Tu pase"],
    options: tamanos,
    slots: [
      { id: "h1", day: "Martes 21", time: "09:00", places: 3 },
      { id: "h2", day: "Martes 21", time: "11:30", places: 2 },
      { id: "h3", day: "Martes 21", time: "15:00", places: 5 },
      { id: "h4", day: "Miércoles 22", time: "08:30", places: 4 },
      { id: "h5", day: "Miércoles 22", time: "10:45", places: 2 },
      { id: "h6", day: "Miércoles 22", time: "13:15", places: 6 },
      { id: "h7", day: "Miércoles 22", time: "17:30", places: 3 },
      { id: "h8", day: "Jueves 23", time: "09:30", places: 2 },
      { id: "h9", day: "Jueves 23", time: "14:00", places: 4 },
      { id: "h10", day: "Viernes 24", time: "10:00", places: 5 },
    ],
    demoNotice: "Demo: no se envían datos.",
  },
  legal: {
    company: "Esquina Brillo S.A.S. (ficticia)",
    cuit: "30-71845321-7",
    address: "Av. Independencia 1420, Barracas, CABA",
    email: "hola@esquinabrillo.demo",
    phone: "+54 11 4567-8901",
    pricesIncludeTaxes: true,
    taxNote:
      "Todos los precios publicados son precios finales e incluyen el IVA. La seña del 20% se descuenta del total y no se recarga con impuestos.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar una reserva online",
      note:
        "Si reservaste un lavado online, podés cancelarlo sin costo desde acá. Completá el código de tu pase y el email de la reserva: se anula el turno y se devuelve la seña si avisaste con más de 4 horas de anticipación.",
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
      "Los datos que dejás en esta web (nombre, teléfono, email y patente) se usan únicamente para coordinar tu turno de lavado y avisarte por WhatsApp o email.",
      "No se comparten con terceros ni con fines comerciales.",
      "Pedí la baja de tus datos desde el botón de baja del pie de página: se elimina todo en un plazo máximo de 10 días.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "La seña del 20% se toma al confirmar la reserva y se descuenta del precio final del lavado.",
      "El horario queda confirmado recién cuando recibís el pase con código.",
      "El tiempo de entrega es un estimado: puede variar según el estado del auto y la carga del box.",
      "Si no podés asistir, avisanos con al menos 4 horas de anticipación para liberar el turno y devolverte la seña.",
      "El lavado interior requiere que retires tus objetos personales del auto antes de dejarlo en el box.",
      "La barra es de consumo libre: el pase del lavado no incluye bebidas, salvo el café de cortesía del turno.",
      "Mayores de 18 años para el consumo de bebidas alcohólicas en la barra.",
    ],
  },
  contact: {
    whatsapp: rubro.whatsapp.phone,
    phone: "+54 11 4567-8901",
    email: "hola@esquinabrillo.demo",
    address: "Av. Independencia 1420, Barracas, CABA",
    hours: "Lavadero: lunes a sábado de 8 a 20 h · Barra: martes a domingo de 10 a 22 h",
    mapsUrl: "https://maps.google.com/?q=Av+Independencia+1420+Barracas",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "AutomotiveBusiness"],
    priceRange: "$$",
  },
};

/** Fotos de la app (pool verificado de `media.ts`). */
export const fotos = {
  tunel: img("1626668893632-6f3a4466d22f", 1200),
  box: img("1590362891991-f776e747a588", 1200),
  garage: img("1492144534655-ae79c964c9d7", 1200),
  tecnico: img("1625047509248-ec889cbff17f", 1200),
  /** Compacto en calle urbana (Pexels 30782480): único del estándar, sin reusar el Fiat de concesionario. */
  chico: pex(30782480, 900),
  barra: img("1517248135467-4c7edcad34c4", 1200),
  medialunas: img("1530610476181-d83430b64dcd", 900),
  brindis: img("1470337458703-46ad1756a187", 900),
} as const;
