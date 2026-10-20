/**
 * Contenido de TU NOMBRE — portfolio madre de demos por rubro.
 *
 * MARCA FICTICIA / PLACEHOLDER: `TU NOMBRE` es el nombre del estudio.
 * Reemplazalo por el tuyo (en `brand`) y los textos que lo mencionan.
 *
 * TODO lo que hay acá es DEMO: no hay clientes reales, no hay logos, no hay
 * testimonios y no hay cifras de clientes. La prueba que se muestra es la del
 * PROCESO (entrega, Lighthouse, un solo CTA, un solo ticket), y está marcada
 * como demo en la propia interfaz.
 *
 * Precios: los del plan de negocios (05-plan-negocios.md), con precios finales
 * e impuestos incluidos.
 */

import { img, poster, video } from "@lib/media";
import { PORTFOLIO, RUBROS } from "@lib/rubros";
import type { CatalogItem, RubroContent, Section } from "@lib/types";

export const brand = "TU NOMBRE";

/** ── Servicios: qué hago ─────────────────────────────────────────────── */
const servicios: Section = {
  id: "servicios",
  kicker: "Qué hago",
  title: "Cuatro servicios, cero vueltas de agencia",
  body: "No vendo plantillas: cada web se escribe para el rubro que la usa. Todo lo que ves en este portfolio es una demo viva que podés abrir ahora mismo.",
  layout: "grid",
  items: [
    {
      id: "demo-gratis",
      title: "Demo gratis en 48 h",
      body: "Elegís el rubro, me contás del negocio y te mando una home armada con tu contenido. Sin costo y sin compromiso.",
      points: [
        "No es una plantilla cambiada: es tu rubro",
        "Te la mando con un código de demo",
        "Si no te sirve, no pasa nada",
      ],
      meta: [{ label: "Plazo", value: "48 h hábiles" }],
      badge: "Empezá por acá",
    },
    {
      id: "sitio",
      title: "Sitio por rubro",
      body: "Home, secciones y una conversión real: turno, reserva, presupuesto o inscripción, siempre con ticket.",
      points: [
        "Copy del rubro, no texto genérico",
        "Fotos y video con la misma gradación",
        "Un CTA sobre el fold",
      ],
      meta: [{ label: "Plazo", value: "1 a 2 semanas" }],
    },
    {
      id: "conversion",
      title: "Sitio con conversión conectada",
      body: "Lo mismo, pero con backend de verdad: el formulario llega, el turno se agenda y se cobra, y los avisos salen.",
      points: [
        "Backend, base de datos y correos",
        "Agenda o sistema de turnos real",
        "Medios de pago si el rubro los necesita",
      ],
      meta: [{ label: "Plazo", value: "3 a 5 semanas" }],
    },
    {
      id: "mantenimiento",
      title: "Mantenimiento",
      body: "Hosting, backups, cambios menores y un chequeo mensual de rendimiento. Para el que no quiere pensar en la web.",
      points: [
        "Backups y monitoreo",
        "Certificado y deploy sin sorpresas",
        "Un canal directo de consultas",
      ],
      meta: [{ label: "Compromiso", value: "Mensual" }],
    },
  ],
};

/** ── Precios ─────────────────────────────────────────────────────────── */
const precios: Section = {
  id: "precios",
  kicker: "Precios",
  title: "Los precios, antes de la llamada",
  body: "Son los valores de referencia del plan de negocios, con impuestos incluidos. La demo gratis de 48 h no se cobra: es la puerta de entrada.",
  layout: "grid",
  items: [
    {
      id: "plan-home",
      title: "Home por rubro",
      body: "La home que ves en las demos, con tu contenido, tu color y un CTA que funciona.",
      points: [
        "1 a 2 semanas",
        "Hasta 5 secciones",
        "1 conversión simple (form, WhatsApp o reserva)",
      ],
      meta: [{ label: "Incluye", value: "SEO base y despliegue" }],
      price: { amount: "desde USD 300", note: "final, impuestos incluidos" },
      badge: "El más pedido",
    },
    {
      id: "plan-conversion",
      title: "Home + conversión real",
      body: "Con backend: lo que la gente completa en la web llega a tu email o a tu agenda.",
      points: [
        "3 a 5 semanas",
        "Turnos, reservas o carritos",
        "Avisos automáticos por email y WhatsApp",
      ],
      meta: [{ label: "Incluye", value: "Panel o base de datos" }],
      price: { amount: "USD 600 a 1.200", note: "final, impuestos incluidos" },
    },
    {
      id: "plan-pack",
      title: "Pack fotos, copy y SEO local",
      body: "Lo que casi siempre falta: fotos Presentables, textos que venden y que te encuentren en Google.",
      points: [
        "Sesión de fotos o banco curado",
        "Copy por sección",
        "Ficha de Google y SEO local",
      ],
      meta: [{ label: "Duración", value: "1 semana" }],
      price: { amount: "+ USD 200", note: "final, impuestos incluidos" },
    },
    {
      id: "plan-mantenimiento",
      title: "Mantenimiento",
      body: "Todo lo técnico ordenado, con alguien que conteste cuando algo se rompe.",
      points: [
        "Hosting y backups",
        "Cambios menores incluidos",
        "Chequeo mensual de rendimiento",
      ],
      meta: [{ label: "Compromiso", value: "Mensual" }],
      price: { amount: "USD 30 a 60 / mes", note: "final, impuestos incluidos" },
    },
  ],
};

/** ── Proceso 48 h ─────────────────────────────────────────────────────── */
const proceso: Section = {
  id: "proceso",
  kicker: "El proceso",
  title: "De la objeción al ticket en 48 horas",
  body: "Es el mismo camino que recorriste en las demos, pero con tu negocio. Sin reunión de dos horas: cuatro pasos y un código.",
  layout: "timeline",
  items: [
    {
      id: "p1",
      title: "Elegís el rubro",
      body: "Abrís las demos, comparás y decís cuál se parece a lo tuyo. Si no sabés, lo resolvemos por WhatsApp.",
      points: ["7 demos vivas para comparar", "La objeción de cada una, escrita"],
      meta: [{ label: "Dura", value: "5 min" }],
    },
    {
      id: "p2",
      title: "Me contás del negocio",
      body: "Nombre, a qué se dedica, dónde estás y qué objeción te frena hoy. Con eso alcanza.",
      points: ["Nombre y actividad", "Ciudad o zona", "La objeción principal"],
      meta: [{ label: "Dura", value: "10 min" }],
    },
    {
      id: "p3",
      title: "Armo la home",
      body: "Copy del rubro, fotos y video consistentes, un CTA y un ticket. Todo con la misma firma visual de las demos.",
      points: ["Sin placeholders", "Un solo CTA sobre el fold", "Ticket animado al final"],
      meta: [{ label: "Dura", value: "24 h" }],
    },
    {
      id: "p4",
      title: "Te la mando con un código",
      body: "Te paso el link con tu código de demo y un WhatsApp prearmado para que sigamos sin vueltas.",
      points: ["Link con código", "WhatsApp prearmado", "El código queda en tu ticket"],
      meta: [{ label: "Dura", value: "24 h" }],
    },
  ],
};

/** ── Prueba honesta: del PROCESO, no de clientes ─────────────────────── */
const prueba: Section = {
  id: "prueba",
  kicker: "Prueba",
  title: "Lo único que puedo probar hoy",
  body: "No tengo clientes a los que pedirle testimonio, así que no te voy a inventar logos ni cifras. Lo de abajo es el estándar con el que trabajo y lo que se puede verificar de mi propio trabajo.",
  layout: "grid",
  items: [
    {
      id: "lighthouse",
      title: "Lighthouse 95+ antes de entregar",
      body: "Es mi línea de base: mido performance, accesibilidad y SEO de cada demo antes de mandarla. Si no llega, no sale.",
      points: ["Performance, accesibilidad y SEO verificados"],
      meta: [{ label: "Medido en", value: "Mobile, 375 px" }],
    },
    {
      id: "un-cta",
      title: "Un solo CTA sobre el fold",
      body: "En las 7 demos hay una sola acción principal. No cinco botones compitiendo por el mismo click.",
      points: ["Acción única arriba", "Secundarias fuera del fold"],
      meta: [{ label: "Regla", value: "1 CTA" }],
    },
    {
      id: "consola",
      title: "Cero errores de consola",
      body: "Pruebo cada ruta en 375×812 y en 1440×900 antes de entregarla, con la consola abierta.",
      points: ["Mobile y desktop", "Typecheck sin errores"],
      meta: [{ label: "Checklist", value: "Antes de entregar" }],
    },
    {
      id: "entrega",
      title: "Entrega en 48 horas",
      body: "Es el plazo del proceso de demo, y es verificable: la fecha la ponés vos en el formulario.",
      points: ["Home armada con tu contenido", "Código de demo en el ticket"],
      meta: [{ label: "Plazo", value: "48 h hábiles" }],
    },
  ],
};

/** ── Preguntas frecuentes ─────────────────────────────────────────────── */
const faq: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que todos preguntan antes de escribir",
  layout: "list",
  items: [
    {
      id: "f1",
      title: "¿Esto es un portfolio o son webs de verdad?",
      body: "Es un portfolio de demos: las 7 webs que ves funcionan y se pueden recorrer, pero son demos con marcas, precios y datos inventados. Sirven para que veas cómo trabajo, no para que un cliente final las use.",
    },
    {
      id: "f2",
      title: "¿La demo gratis es gratis de verdad?",
      body: "Sí. Armo una home con tu rubro, tu nombre y tu contenido, y te la mando con un código. Sin costo, sin contrato y sin compromiso de hiring.",
    },
    {
      id: "f3",
      title: "¿En 48 horas sale mi web completa?",
      body: "No: en 48 horas sale la home, que es lo que ves en las demos (lo que tenés arriba del todo, más una conversión). El sitio completo, con todas las secciones y el backend conectado, se cotiza aparte.",
    },
    {
      id: "f4",
      title: "¿Trabajás con contrato y factura?",
      body: "Sí: factura A, B o C según corresponda, y los precios que ves publicados son finales, con impuestos incluidos.",
    },
    {
      id: "f5",
      title: "¿Qué pasa con mis fotos y mi marca?",
      body: "Si ya tenés fotos, usámelas. Si no, uso bancos de stock curados por rubro y te entrego los archivos para que los reemplaces cuando quieras.",
    },
    {
      id: "f6",
      title: "¿Y si la demo no me gusta?",
      body: "No pasa nada: no pagaste nada y no hay compromiso. Si después querés avanzar, el primer pago se descuenta del precio del proyecto.",
    },
  ],
};

/** ── Opciones del paso 1 del formulario: los 7 rubros ─────────────────── */
const rubroOptions: CatalogItem[] = RUBROS.map((r) => ({
  id: r.id,
  kicker: r.nombre,
  title: r.rubro,
  body: r.tagline,
  points: [r.objeccion],
  badge: "48 h",
}));

/** ── Contenido completo ───────────────────────────────────────────────── */
export const portfolio: RubroContent = {
  id: PORTFOLIO.id,
  brand,
  rubro: PORTFOLIO.rubro,
  tagline: "Webs por rubro que responden la objeción real y cierran en un ticket.",
  objeccion: PORTFOLIO.objeccion,
  theme: {
    name: "portfolio",
    palette: { ...PORTFOLIO.palette },
    fonts: {
      display: "Archivo Black",
      body: "Hanken Grotesk",
      // URL completa: `Archivo Black` tiene un solo peso y el layout arma
      // siempre `wght@400;500;700;800`, que Google no resuelve para esa familia.
      href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hanken+Grotesk:wght@400;500;600;700&display=swap",
    },
    radius: "0.6rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Demos", href: "/demos" },
    { label: "Servicios", href: "/servicios" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Portfolio · demos vivas por rubro",
    title: ["Siete rubros,", "siete webs", "que ya funcionan"],
    subtitle:
      "Cada demo responde la objeción real de un rubro: la sala de espera, la letra chica, la pintura rayada. Abrilas, probalas y pedí la tuya: te la armo en 48 horas.",
    cta: { label: "Pedir mi demo gratis", href: "#demo" },
    secondaryCta: { label: "Ver las 7 demos", href: "/demos" },
    video: {
      src: video(3256),
      poster: poster(3256),
      alt: "Plano de una obra en curso que se usa de fondo en el portfolio (imagen de demostración).",
      isVideo: true,
    },
    live: { label: "Rubros con demo", count: 7, min: 7, max: 7, unit: "rubros", interval: 3400 },
  },
  sections: [servicios, precios, proceso, prueba, faq],
  conversion: {
    id: "demo",
    kicker: "Demo gratis",
    title: "Pedí tu demo y te la armo en 48 horas",
    body: "Cuatro pasos: el rubro, tu negocio, tu contacto y listo. Te devuelvo un ticket con el código de la demo para que la abras cuando quieras.",
    steps: ["Tu rubro", "Tu negocio", "Contacto", "Confirmación"],
    options: rubroOptions,
    // Ventanas de entrega: el plazo que elige el cliente para la demo.
    slots: [
      { id: "v1", day: "Mañana", time: "18:00 h", places: 3 },
      { id: "v2", day: "En 48 h", time: "12:00 h", places: 5 },
      { id: "v3", day: "La semana", time: "10:00 h", places: 8 },
    ],
    demoNotice: "Demo: no se envían datos.",
  },
  legal: {
    company: "TU NOMBRE Servicios Web (ficticia)",
    cuit: "30-70987654-3",
    address: "Av. Corrientes 1234, CABA · atención con cita",
    email: "hola@tunombre.demo",
    phone: "+54 11 0000-0000",
    pricesIncludeTaxes: true,
    taxNote:
      "Todos los precios publicados son precios finales e incluyen impuestos. Los valores en dólares se cobran al tipo de cambio del momento de la factura.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar un servicio online",
      note:
        "Si contrataste un servicio online, podés cancelarlo sin costo desde acá. Completá los datos del servicio y se anula en el momento.",
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
      "Los datos que dejás en esta web se usan solo para preparar tu demo y avisarte por WhatsApp o email.",
      "No se comparten con terceros ni se usan con fines comerciales.",
      "Pedí la baja de tus datos desde el botón de baja del pie de página: se elimina todo en un plazo máximo de 10 días.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "La demo gratuita se entrega dentro de las 48 horas hábiles siguientes a recibir los datos del negocio.",
      "La demo es una muestra de diseño con contenido de ejemplo: no incluye el backend ni los servicios conectados.",
      "El precio de los planes publicados es final e incluye impuestos; los trabajos que no entren en un plan se cotizan aparte.",
      "Si el proyecto se cancela después de arrancar, se entrega todo lo hecho hasta ese momento.",
    ],
  },
  contact: {
    whatsapp: "5491100000000",
    phone: "+54 11 0000-0000",
    email: "hola@tunombre.demo",
    address: "Av. Corrientes 1234, CABA · atención con cita",
    hours: "Lunes a viernes de 9 a 19 h · respuesta en el día",
    mapsUrl: "https://maps.google.com/?q=Av+Corrientes+1234+CABA",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "ProfessionalService"],
    areaServed: "AR",
  },
};

/**
 * Foto de portada de cada demo (7 rubros).
 *
 * IDs del pool verificado de `media.ts`. Cada URL fue verificada con
 * `curl -sI -m 15` (HTTP 200).
 */
export const demoImages: Record<string, string> = {
  clinica: img("1553877522-43269d4ea984", 1200),
  concesionario: img("1503376780353-7e6692767b70", 1200),
  lavadero: img("1637430308606-86576d8fef3c", 1200),
  estetica: img("1596178065887-1198b6148b2b", 1200),
  universidad: img("1562774053-701939374585", 1200),
  inmobiliaria: img("1512917774080-9991f1c4c750", 1200),
  arquitectura: img("1487958449943-2429e8be8625", 1200),
};

/** Foto del estudio (sección del proceso). */
export const fotoEstudio = img("1497366754035-f200968a6e72", 1200);
