/**
 * Contenido de AUTOPISTA — concesionario de autos nuevos y usados.
 *
 * MARCA FICTICIA. El concesionario, las sucursales, el stock, los precios, las
 * cuotas y los datos de contacto son inventados para demostrar el flujo.
 * Los modelos que aparecen son reales y las fotos vienen de Unsplash.
 */

import { img, imgCrop, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { CatalogItem, RubroContent, Section } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "concesionario")!;

export const brand = "AUTOPISTA";

/** ── Tipos propios del rubro ─────────────────────────────────────── */

/** Estado de la unidad en el stock. */
export type Estado = "Usado" | "Nuevo";

/** Combustible de la unidad. */
export type Combustible = "Nafta" | "Diésel" | "Híbrido" | "Eléctrico";

/** Caja del auto. */
export type Caja = "Manual" | "Automática";

/** Una unidad del stock: alimenta filtros, fichas y la reserva de test drive. */
export interface Auto {
  id: string;
  /** Marca del modelo (Volkswagen, BMW, ...). */
  marca: string;
  /** Modelo comercial. */
  modelo: string;
  /** Versión o thereof. */
  version: string;
  anio: number;
  /** Kilometraje (0 en los nuevos). */
  km: number;
  /** Precio final en pesos (IVA incluido). */
  precio: number;
  /** Cuota estimada en pesos por mes. */
  cuota: number;
  combustible: Combustible;
  caja: Caja;
  color: string;
  /** Sucursal donde está la unidad. */
  sucursal: string;
  estado: Estado;
  /** Foto principal (id de Unsplash). */
  foto: string;
  /** Alt de la foto principal. */
  fotoAlt: string;
  /** Datos de la ficha (motor, potencia, ...). */
  ficha: { label: string; value: string }[];
  /** Puntos fuertes de la unidad. */
  highlights: string[];
  /** Historial y estado (usados). */
  historial: string[];
  /** Etiqueta corta: "1 dueño", "Full". */
  badge?: string;
}

/** ── Helpers ─────────────────────────────────────────────────────── */

/** Formato de precio argentino: "$ 12.900.000". */
export function ars(monto: number): string {
  return `$ ${monto.toLocaleString("es-AR")}`;
}

/** Kilometraje con separador de miles. */
export function km(num: number): string {
  return `${num.toLocaleString("es-AR")} km`;
}

/** ── Stock de usados ─────────────────────────────────────────────── */

export const usados: Auto[] = [
  {
    id: "fiat-500-lounge-2019",
    marca: "Fiat",
    modelo: "500",
    version: "Lounge",
    anio: 2019,
    km: 62_400,
    precio: 6_900_000,
    cuota: 145_000,
    combustible: "Nafta",
    caja: "Manual",
    color: "Celeste",
    sucursal: "Dock Sud",
    estado: "Usado",
    foto: "1549317661-bd32c8ce0db2",
    fotoAlt: "Fiat 500 celeste estacionado en la calle (imagen de demostración).",
    ficha: [
      { label: "Motor", value: "1.2 8v" },
      { label: "Potencia", value: "77 CV" },
      { label: "Caja", value: "Manual 5 velocidades" },
      { label: "Combustible", value: "Nafta" },
      { label: "Puertas", value: "5" },
      { label: "Airbags", value: "6" },
    ],
    highlights: [
      "Un solo dueño desde 2021",
      "Service al día en el taller de la casa",
      "Neumáticos nuevos de cuatro marcas",
      "Sin smokers, sin pets",
    ],
    historial: [
      "Ingresó a nuestro taller en marzo de 2026: revisión general, cambio de belts y service completo.",
      "Peritaje de chassis sin millaje: así se encontró la unidad.",
      "Se ofrece con documentación al día y transferencia inmediata en el acto.",
    ],
    badge: "1 dueño",
  },
  {
    id: "vw-golf-trendline-2021",
    marca: "Volkswagen",
    modelo: "Golf",
    version: "Trendline",
    anio: 2021,
    km: 48_500,
    precio: 12_900_000,
    cuota: 268_000,
    combustible: "Nafta",
    caja: "Manual",
    color: "Azul",
    sucursal: "Dock Sud",
    estado: "Usado",
    foto: "1541899481282-d53bffe3c35d",
    fotoAlt: "Hatchback azul estacionado en una calle (imagen de demostración).",
    ficha: [
      { label: "Motor", value: "1.4 TSI" },
      { label: "Potencia", value: "150 CV" },
      { label: "Caja", value: "Manual 6 velocidades" },
      { label: "Combustible", value: "Nafta" },
      { label: "Puertas", value: "5" },
      { label: "Airbags", value: "6" },
    ],
    highlights: [
      "Service oficial registrado hasta 2025",
      "Cuatro neumáticos del mismo modelo",
      "Manual de service completo",
      "Aceptamos tu auto en parte de pago",
    ],
    historial: [
      "Peritaje independiente en el centro de peritaje de Avellaneda: motor y caja sin observaciones.",
      "Se recibió en parte de pago por un utilitario en 2024.",
      "El precio publicado ya incluye IVA: en el acto te damos la factura.",
    ],
    badge: "Service oficial",
  },
  {
    id: "hyundai-tucson-smart-2020",
    marca: "Hyundai",
    modelo: "Tucson",
    version: "Smart",
    anio: 2020,
    km: 96_200,
    precio: 19_400_000,
    cuota: 372_000,
    combustible: "Nafta",
    caja: "Automática",
    color: "Rojo",
    sucursal: "La Plata",
    estado: "Usado",
    foto: "1550355291-bbee04a92027",
    fotoAlt: "SUV rojo estacionado frente a un terreno con árboles sin hojas (imagen de demostración).",
    ficha: [
      { label: "Motor", value: "2.0 MPI" },
      { label: "Potencia", value: "150 CV" },
      { label: "Caja", value: "Automática 6 velocidades" },
      { label: "Combustible", value: "Nafta" },
      { label: "Puertas", value: "5" },
      { label: "Airbags", value: "6" },
    ],
    highlights: [
      "Tracción integral (AWD)",
      "Cámara 360° y sensores de reversa",
      "Mantenimiento al día con el service de la casa",
      "Aceptamos parte de pago",
    ],
    historial: [
      "Revisado en nuestro taller: tren delantero y Frenos, todo en orden.",
      "Dos services registrados en el service oficial.",
      "Se ofrece con transferencia inmediata en el acto.",
    ],
    badge: "360°",
  },
  {
    id: "ford-expedition-xlt-2019",
    marca: "Ford",
    modelo: "Expedition",
    version: "XLT",
    anio: 2019,
    km: 71_300,
    precio: 27_800_000,
    cuota: 530_000,
    combustible: "Nafta",
    caja: "Automática",
    color: "Blanco",
    sucursal: "San Isidro",
    estado: "Usado",
    foto: "1533473359331-0135ef1b58bf",
    fotoAlt: "SUV blanco detenido en una carretera entre cerros rojizos (imagen de demostración).",
    ficha: [
      { label: "Motor", value: "3.5 EcoBoost V6" },
      { label: "Potencia", value: "380 CV" },
      { label: "Caja", value: "Automática 10 velocidades" },
      { label: "Combustible", value: "Nafta" },
      { label: "Puertas", value: "5" },
      { label: "Airbags", value: "7" },
    ],
    highlights: [
      "Tracción integral y bloqueo de diferencial",
      "Butacas de cuero con calefacción y ventilación",
      "Seguro de la casa por 6 meses incluido",
      "Aceptamos parte de pago",
    ],
    historial: [
      "Ingresó a taller en enero de 2026: service completo y cambio de fluidos.",
      "Peritaje sin observaciones de chasis.",
      "El precio publicado ya incluye IVA: en el acto te damos la factura.",
    ],
    badge: "4x4",
  },
];

/** ── Stock de nuevos ─────────────────────────────────────────────── */

export const nuevos: Auto[] = [
  {
    id: "tesla-model-3-long-range",
    marca: "Tesla",
    modelo: "Model 3",
    version: "Long Range",
    anio: 2026,
    km: 0,
    precio: 52_900_000,
    cuota: 1_080_000,
    combustible: "Eléctrico",
    caja: "Automática",
    color: "Blanco perla",
    sucursal: "Dock Sud",
    estado: "Nuevo",
    foto: "1560958089-b8a1929cea89",
    fotoAlt: "Sedán eléctrico blanco estacionado en un camino de montaña (imagen de demostración).",
    ficha: [
      { label: "Autonomía", value: "545 km" },
      { label: "Carga", value: "Supercharger 250 kW" },
      { label: "Potencia", value: "384 CV" },
      { label: "Tracción", value: "RWD" },
      { label: "Garantía", value: "4 años / 160.000 km" },
      { label: "Entrega", value: "Inmediata" },
    ],
    highlights: [
      "Carga en 27 minutos en el centro de carga de Dock Sud",
      "Prueba de manejo de 45 minutos sin cargo",
      "Bonificación de patente por 2026",
    ],
    historial: [
      "Unidad 0 km, lista para entrega inmediata en Dock Sud.",
      "Documentación y patentaria gestionadas por la casa.",
    ],
    badge: "0 km",
  },
  {
    id: "tesla-model-y-long-range-2026",
    marca: "Tesla",
    modelo: "Model Y",
    version: "Long Range AWD",
    anio: 2026,
    km: 0,
    precio: 57_400_000,
    cuota: 1_170_000,
    combustible: "Eléctrico",
    caja: "Automática",
    color: "Blanco perla",
    sucursal: "San Isidro",
    estado: "Nuevo",
    foto: "1600661653561-629509216228",
    fotoAlt: "SUV eléctrico blanco estacionado en un terreno de obra (imagen de demostración).",
    ficha: [
      { label: "Autonomía", value: "545 km" },
      { label: "Carga", value: "Supercharger 250 kW" },
      { label: "Potencia", value: "384 CV" },
      { label: "Tracción", value: "AWD" },
      { label: "Garantía", value: "4 años / 160.000 km" },
      { label: "Entrega", value: "En 15 días" },
    ],
    highlights: [
      "Carga en 27 minutos en el centro de carga de San Isidro",
      "Prueba de manejo de 45 minutos sin cargo",
      "Butacas calefaccionadas y techo panorámico de serie",
    ],
    historial: [
      "Unidad 0 km, color de fábrica y matriculación a nombre del comprador.",
      "Precio final con IVA: sin cargos extra en el acto.",
    ],
    badge: "AWD",
  },
  {
    id: "bmw-m4-competition-2026",
    marca: "BMW",
    modelo: "M4",
    version: "Competition xDrive",
    anio: 2026,
    km: 0,
    precio: 78_500_000,
    cuota: 1_590_000,
    combustible: "Nafta",
    caja: "Automática",
    color: "Azul",
    sucursal: "La Plata",
    estado: "Nuevo",
    foto: "1502877338535-766e1452684a",
    fotoAlt: "Coupé azul estacionado frente a una fachada industrial (imagen de demostración).",
    ficha: [
      { label: "Motor", value: "3.0 Turbo" },
      { label: "Potencia", value: "510 CV" },
      { label: "Tracción", value: "xDrive" },
      { label: "Caja", value: "Automática 8 velocidades" },
      { label: "Garantía", value: "3 años / 100.000 km" },
      { label: "Entrega", value: "En 45 días" },
    ],
    highlights: [
      "Paquete M Carbon sin cargo",
      "Financiación con tasa preferencial de la casa",
      "Entrega en La Plata o Dock Sud a elección",
    ],
    historial: [
      "Unidad 0 km: el precio incluye IVA y patentaria del primer año.",
      "Se entrega con Service de cortesía de 60.000 km.",
    ],
    badge: "510 CV",
  },
];

/** Todo el stock, para el buscador y la reserva. */
export const stock: Auto[] = [...usados, ...nuevos];

/** ── Secciones del contenido ─────────────────────────────────────── */

/** Un auto del stock como item de catálogo (contrato del kit). */
export function autoComoItem(auto: Auto): CatalogItem {
  return {
    id: auto.id,
    title: `${auto.marca} ${auto.modelo} ${auto.anio}`,
    kicker: auto.version,
    body: auto.estado === "Nuevo" ? "0 km · listo para entrega" : `${km(auto.km)} · ${auto.sucursal}`,
    points: auto.highlights,
    meta: [
      { label: "Combustible", value: auto.combustible },
      { label: "Caja", value: auto.caja },
      { label: "Color", value: auto.color },
    ],
    price: { amount: ars(auto.precio), note: "final, IVA incluido" },
    media: { src: img(auto.foto, 1200, 800), alt: auto.fotoAlt },
    badge: auto.badge,
  };
}

const usadosItems: Section = {
  id: "usados",
  kicker: "Stock de usados",
  title: "Usados con peritaje, precio final y cuota a la vista",
  body: "Cada unidad publicada tiene el peritaje hecho, el service al día y el precio con IVA incluido. La cuota que ves es la cuota real: sin letras chicas ni sorpresas en el papel.",
  layout: "grid",
  items: usados.map(autoComoItem),
};

const nuevosItems: Section = {
  id: "nuevos",
  kicker: "Cero kilómetros",
  title: "Nuevos con entrega y transferable en el acto",
  body: "Las unidades 0 km salen de la casa con documentación, patentaria gestionada y service de cortesía. Sin recargos de flete ni de gestoría.",
  layout: "grid",
  items: nuevos.map(autoComoItem),
};

const financiacionItems: Section = {
  id: "financiacion",
  kicker: "Financiación",
  title: "Tres formas de pagar, todas con el mismo criterio",
  body: "La cuota se calcula con la tasa real del mes, no con una tabla de precios de vidriera. Si el auto no te cierra, te lo decimos en la primera charla.",
  layout: "list",
  items: [
    {
      id: "credito",
      title: "Crédito prendario",
      body: "Financiamos hasta el 70% del valor final del auto. Plazos de 12, 24, 36 o 48 meses con tasa fija.",
      points: [
        "Tasa fija: la cuota no cambia durante todo el plazo",
        "Hasta el 70% de financiación sobre el precio final",
        "Se necesita DNI, constancia de ingresos y un comprobante de vivienda",
      ],
      meta: [
        { label: "Plazos", value: "12 a 48 meses" },
        { label: "Anticipo mínimo", value: "30%" },
      ],
    },
    {
      id: "plan",
      title: "Plan de pago directo",
      body: "Reservás con el 20% y completás el saldo en 3, 6 o 9 cuotas fijas. Sin interés de financiera.",
      points: [
        "Sin informe crediticio",
        "El auto queda reservado 72 h con seña",
        "La documentación se firma al completar el saldo",
      ],
      meta: [
        { label: "Anticipo", value: "20%" },
        { label: "Cuotas", value: "3 a 9" },
      ],
    },
    {
      id: "canje",
      title: "Tomamos tu auto",
      body: "Tasamos tu auto en el momento y el valor se descuenta de la operación. Sin traslado y sin esperas.",
      points: [
        "Tasación presencial en 30 minutos",
        "El valor de tasación es el mismo que el del mercado",
        "Podés tomar el usado tasado como parte de pago",
      ],
      meta: [
        { label: "Tasación", value: "Sin cargo" },
        { label: "Plazo", value: "El mismo día" },
      ],
    },
  ],
};

const sucursalesItems: Section = {
  id: "sucursales",
  kicker: "Dónde",
  title: "Tres casas y un solo equipo",
  body: "Podés ver la unidad en cualquiera de las tres, aunque lo compres en otra. El service y la garantía son los mismos en todas.",
  layout: "grid",
  items: [
    {
      id: "dock-sud",
      title: "AUTOPISTA Dock Sud",
      body: "Av. Hipólito Yrigoyen 1200, Dock Sud, Avellaneda. Showroom y taller propio.",
      points: ["Taller de service propio", "Tapicería y accesorios", "Estacionamiento para clientes"],
      meta: [{ label: "Horario", value: "Lun a Sáb de 9 a 19 h" }],
    },
    {
      id: "san-isidro",
      title: "AUTOPISTA Norte",
      body: "Av. Centenario 1420, Beccar, San Isidro. Todos los modelos premium y los importados.",
      points: ["Prueba de manejo en circuito cerrado", "Café y sala de espera", "Estacionamiento propio"],
      meta: [{ label: "Horario", value: "Lun a Sáb de 9 a 19 h" }],
    },
    {
      id: "la-plata",
      title: "AUTOPISTA Sur",
      body: "Calle 52 Nº 1180, La Plata. Entrega inmediata de 0 km y retiros de usados.",
      points: ["Entrega en el día", "Transferencia con escribano propio", "Sábados de 9 a 13 h"],
      meta: [{ label: "Horario", value: "Lun a Sáb de 9 a 19 h" }],
    },
  ],
};

const faqItems: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que todos preguntan antes de firmar",
  layout: "list",
  items: [
    {
      id: "f1",
      title: "¿El precio que veo incluye impuestos?",
      body: "Sí. Todos los precios publicados son finales e incluyen IVA. La patentaria, el seguro y los consumibles se cotizan aparte y te los informamos por escrito antes de firmar.",
    },
    {
      id: "f2",
      title: "¿Puedo pagar una parte y el resto financiado?",
      body: "Sí. Aceptamos anticipo, crédito prendario y plan de pago directo. La calculadora de la página de financiación te muestra la cuota antes de que vengas a la casa.",
    },
    {
      id: "f3",
      title: "¿El test drive se agenda por la web?",
      body: "Sí. Elegís la unidad, el día y la hora, y te damos un pase con código. Es una demostración: no se envían datos, pero es el mismo flujo que usamos en el mostrador.",
    },
    {
      id: "f4",
      title: "¿Aceptan mi auto en parte de pago?",
      body: "Sí. La tasación es presencial, sin cargo y en el momento. Si el valor no te cierra, no avanzamos con la operación.",
    },
    {
      id: "f5",
      title: "¿Qué garantía tienen los usados?",
      body: "Todos los usados salen con 6 meses de garantía de motor y caja, o 12 meses si la financiación la hacés con la casa.",
    },
    {
      id: "f6",
      title: "¿Los datos de esta web son reales?",
      body: "No. Es una demostración de portfolio: el concesionario, el stock, los precios, las cuotas y las reseñas son ficticios.",
    },
  ],
};

/** ── Contenido completo ──────────────────────────────────────────── */

export const concesionario: RubroContent = {
  id: rubro.id,
  brand,
  rubro: rubro.rubro,
  tagline: rubro.tagline,
  objeccion: "«No quiero sorpresas en la financiación ni en el seguro»",
  theme: {
    name: "autopista",
    palette: { ...rubro.palette },
    fonts: { display: "Saira Condensed", body: "Archivo" },
    radius: "0.5rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Usados", href: "/usados" },
    { label: "Nuevos", href: "/nuevos" },
    { label: "Financiación", href: "/financiacion" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Concesionario · Nuevos y usados",
    title: ["El auto que", "estabas", "buscando"],
    subtitle:
      "Stock real, peritaje hecho y precio final con IVA incluido. Agendá tu test drive, mirá la unidad y decidí con todos los números a la vista.",
    cta: { label: "Agendar test drive", href: "#testdrive" },
    secondaryCta: { label: "Ver usados", href: "/usados" },
    video: {
      src: video(4189),
      poster: poster(4189),
      alt: "Auto convertible recorriendo una ruta con el mar a la vista (imagen de demostración).",
      isVideo: true,
    },
    live: {
      label: "Abierto ahora",
      count: 3,
      min: 2,
      max: 3,
      unit: "unidades 0 km listas para entrega",
      interval: 4200,
    },
  },
  sections: [usadosItems, nuevosItems, financiacionItems, sucursalesItems, faqItems],
  conversion: {
    id: "testdrive",
    kicker: "Test drive",
    title: "Elegí la unidad, el turno y llevate el pase",
    body: "Tres pasos: la unidad que querés probar, el día y la hora, y tu pase con código para mostrar en el mostrador.",
    steps: ["La unidad", "El turno", "Tu pase"],
    options: stock.map(autoComoItem),
    slots: [
      { id: "s1", day: "Martes 21", time: "10:00", places: 2 },
      { id: "s2", day: "Martes 21", time: "12:30", places: 3 },
      { id: "s3", day: "Martes 21", time: "16:00", places: 1 },
      { id: "s4", day: "Miércoles 22", time: "09:30", places: 4 },
      { id: "s5", day: "Miércoles 22", time: "11:00", places: 2 },
      { id: "s6", day: "Miércoles 22", time: "15:30", places: 5 },
      { id: "s7", day: "Jueves 23", time: "10:30", places: 3 },
      { id: "s8", day: "Jueves 23", time: "14:00", places: 2 },
      { id: "s9", day: "Sábado 24", time: "11:00", places: 4 },
      { id: "s10", day: "Sábado 24", time: "13:00", places: 1 },
    ],
    demoNotice: "Demo: no se envían datos.",
  },
  legal: {
    company: "AUTOPISTA Automotores S.A. (ficticia)",
    cuit: "30-71567890-4",
    address: "Av. Hipólito Yrigoyen 1200, Dock Sud, Avellaneda, Buenos Aires",
    email: "ventas@autopista.demo",
    phone: "+54 11 3456-7890",
    pricesIncludeTaxes: true,
    taxNote:
      "Todos los precios publicados son precios finales e incluyen IVA (10,5%). La patentaria, el seguro y los consumibles se cotizan por separado y se informan por escrito antes de firmar.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar una reserva online",
      note:
        "Si reservaste un test drive o una unidad online, podés cancelarla sin costo desde acá. Completá el código de reserva y la baja se tramita en el momento.",
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
      "Los datos que dejás en esta web se usan únicamente para coordinar el test drive y avisarte por WhatsApp o email.",
      "No se comparten con terceros ni con fines comerciales.",
      "Pedí la baja de tus datos desde el botón de baja del pie de página: se elimina todo en un plazo máximo de 10 días.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "El turno queda confirmado recién cuando recibís el pase con código.",
      "Si no podés asistir, avisanos con al menos 4 horas de anticipación para liberar el turno.",
      "El precio publicado es final e incluye IVA; patentaria, seguro y consumibles se cotizan aparte y por escrito.",
      "La financiación queda sujeta a aprobación crediticia y a la documentación que se solicite en el mostrador.",
      "El valor de tasación de un usado en parte de pago es orientativo hasta la inspección presencial.",
    ],
  },
  contact: {
    whatsapp: rubro.whatsapp.phone,
    phone: "+54 11 3456-7890",
    email: "ventas@autopista.demo",
    address: "Av. Hipólito Yrigoyen 1200, Dock Sud, Avellaneda",
    hours: "Lunes a sábado de 9 a 19 h · Sábados de test drive de 10 a 14 h",
    mapsUrl: "https://maps.google.com/?q=Av+Hipolito+Yrigoyen+1200+Dock+Sud",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "AutomotiveBusiness"],
    areaServed: "Buenos Aires",
    currenciesAccepted: "ARS",
  },
};

/** ── Fotos de la app (pool verificado de `media.ts`) ───────────────── */

export const fotos = {
  /** Manos al volante: el bloque de la promesa. */
  testDrive: img("1449965408869-eaa3f722e40d", 1200),
} as const;

/**
 * Crops para la galería de la ficha de un usado.
 *
 * Tres encuadres de la misma foto (el CDN no necesita más imágenes):
 * la principal en 16:10, un detalle vertical y una franja panorámica.
 */
export function galeria(auto: Auto): { src: string; alt: string; aspect: string }[] {
  return [
    { src: img(auto.foto, 1400, 900), alt: auto.fotoAlt, aspect: "aspect-[16/10]" },
    {
      src: imgCrop(auto.foto, 800, 1000, "entropy"),
      alt: `${auto.marca} ${auto.modelo}: primer plano (imagen de demostración).`,
      aspect: "aspect-[4/5]",
    },
    {
      src: imgCrop(auto.foto, 1200, 600, "top"),
      alt: `${auto.marca} ${auto.modelo}: detalle superior (imagen de demostración).`,
      aspect: "aspect-[2/1]",
    },
  ];
}
