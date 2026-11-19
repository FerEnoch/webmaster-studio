/**
 * Contenido de CLAVE — inmobiliaria.
 *
 * MARCA FICTICIA. Todos los datos (direcciones, teléfonos, precios, CUIT,
 * propiedades, agentes, reseñas) son inventados para demostración.
 *
 * Fotografías: pool verificado de `media.ts` (kit) + 4 IDs de Unsplash
 * verificados con `curl -sI` (HTTP 200) que se declaran acá para no divergir
 * del archivo del kit. Ver README del kit: máximo 8 fotos y 6 videos.
 */

import { img, pex, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { CatalogItem, RubroContent, Section } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "inmobiliaria")!;

export const brand = "CLAVE";

/**
 * Una propiedad de CLAVE.
 *
 * Extiende `CatalogItem` (el contrato del kit) con los datos que el
 * buscador y la ficha necesitan para filtrar y mostrar.
 */
export interface Propiedad extends CatalogItem {
  /** Barrio: se usa para filtrar y para el mensaje de WhatsApp. */
  zona: string;
  /** Tipo de unidad: se usa para filtrar. */
  tipo: "Casa" | "Departamento" | "PH" | "Local";
  /** Número de ambientes. */
  ambientes: number;
  /** Superficie en m². */
  m2: number;
  /** Precio en dólares, para ordenar y filtrar. */
  precioUsd: number;
  /** Imperfecciones reales: se publican, no se esconden. */
  imperfecciones: string[];
  /** Galería de la ficha. */
  fotos: string[];
  /** Las destacadas van antes en la portada. */
  destacado?: boolean;
}

/* ── Fotos (8 en total, todas verificadas con curl → HTTP 200) ────────── */

/** Casa moderna con pileta. */
const fotoCasaPiscina = img("1512917774080-9991f1c4c750", 1200);
/** Casa moderna con pileta y tobogán. */
const fotoCasaTobogan = img("1600596542815-ffad4c1539a9", 1200);
/** Living interior luminoso. */
const fotoLiving = img("1600607687939-ce8a6c25118c", 1200);
/** PH de ladrillo con cactus (Mercedes, AR): reemplaza la casa mínima de arquitectura. */
const fotoEdificioBlanco = pex(29810846, 1200);
/** Casa con patio de hiedra (Mendoza, AR): reemplaza la casa terminada de arquitectura. */
const fotoCasaJardin = pex(13944645, 1200);
/** Casa de piedra junto a vidrio moderno (Mar del Plata, AR): reemplaza la fachada de arquitectura. */
const fotoEdificioCurvo = pex(37136105, 1200);
/** Casa antigua de techo y reja (Córdoba, AR): local en construcción antigua, sin reusar el estudio de arquitectura. */
const fotoOficina = pex(31689258, 1200);
/** Casa modelo con llaves (sección "la entrega"). */
const fotoLlaves = img("1560518883-ce09059eeffa", 1200);

/* ── Propiedades ───────────────────────────────────────────────────────── */

export const propiedades: Propiedad[] = [
  {
    id: "casa-palermo-hernando",
    title: "Casa de los años 30 con patio",
    kicker: "Palermo · Casa",
    body: "Casa de los años treinta en una cuadra arbolada: living con ventanal al patio, cocina comedor y dos dormitorios arriba. El patio tiene muro, parral y lugar para un auto.",
    points: [
      "Patio cercado con parral y deck de madera",
      "Cocina comedor con vitrocerámico y horno a gas",
      "Dos dormitorios en planta alta y un escritorio",
      "Calefacción por radiadores en todos los ambientes",
      "Cochera para un auto y走入ropes en la trastienda",
    ],
    meta: [
      { label: "Superficie", value: "148 m²" },
      { label: "Ambientes", value: "4" },
      { label: "Antigüedad", value: "38 años" },
      { label: "Orientación", value: "Norte" },
      { label: "Cuota estimada", value: "USD 1.180 / mes" },
    ],
    price: { amount: "USD 385.000", note: "precio final, impuestos incluidos" },
    badge: "Destacada",
    media: {
      src: fotoCasaPiscina,
      alt: "Casa moderna con pileta y deck de madera (imagen de demostración).",
    },
    zona: "Palermo",
    tipo: "Casa",
    ambientes: 4,
    m2: 148,
    precioUsd: 385000,
    destacado: true,
    imperfecciones: [
      "Mancha de humedad leve en la pared del lavadero, reparada en 2024.",
      "El techo del galpón tiene una infiltración estacional en lluvias fuertes.",
      "El piso de la cocina es de los años setenta y tiene desgaste visible.",
    ],
    fotos: [fotoCasaPiscina, fotoLiving, fotoCasaJardin],
  },
  {
    id: "depto-recoleta-edificio-70",
    title: "Departamento en edificio de los 70",
    kicker: "Recoleta · Departamento",
    body: "Tercer piso con balcón al frente y vista abierta. Cocina separada con piso de granito, dos dormitorios y un baño completo. En calle interna, a dos cuadras del subte.",
    points: [
      "Balcón de 4 metros de profundidad con baranda de vidrio",
      "Dos dormitorios con piso de madera",
      "Calefacción por split inverter en cada ambiente",
      "Sala de uso común, laundry y bike room",
      "Ascensor con servicio de mudanzas",
    ],
    meta: [
      { label: "Superficie", value: "92 m²" },
      { label: "Ambientes", value: "3" },
      { label: "Antigüedad", value: "54 años" },
      { label: "Expensas", value: "USD 190 / mes" },
      { label: "Cuota estimada", value: "USD 890 / mes" },
    ],
    price: { amount: "USD 285.000", note: "precio final, impuestos incluidos" },
    media: {
      src: fotoEdificioCurvo,
      alt: "Edificio moderno de líneas curvas (imagen de demostración).",
    },
    zona: "Recoleta",
    tipo: "Departamento",
    ambientes: 3,
    m2: 92,
    precioUsd: 285000,
    imperfecciones: [
      "El ascensor tiene capacidad para 4 personas: en hora pico hay que esperar.",
      "Los dormitorios dan a un patio interno: se escucha la caldera.",
      "El agua caliente es individual y tarda unos 8 minutos en calentar.",
    ],
    fotos: [fotoEdificioCurvo, fotoLiving, fotoCasaPiscina],
  },
  {
    id: "casa-villa-crespo-jardin",
    title: "Casa con jardín y escalera interna",
    kicker: "Villa Crespo · Casa",
    body: "Casa de los años cincuenta en una manzana tranquila. Planta baja con living, cocina y baño; arriba dos dormitorios con balcón. El jardín tiene un limonero y los vecinos dan la sombra.",
    points: [
      "Jardín de 8 × 12 metros con césped y canteros",
      "Escalera interior con guarda de caño",
      "Living con ventanal de piso a techo",
      "Dos dormitorios con placard empotrado",
      "Garage para dos autos con portón automático",
    ],
    meta: [
      { label: "Superficie", value: "172 m²" },
      { label: "Ambientes", value: "5" },
      { label: "Antigüedad", value: "61 años" },
      { label: "Terreno", value: "320 m²" },
      { label: "Cuota estimada", value: "USD 1.410 / mes" },
    ],
    price: { amount: "USD 465.000", note: "precio final, impuestos incluidos" },
    media: {
      src: fotoCasaJardin,
      alt: "Casa moderna al atardecer con jardín y deck (imagen de demostración).",
    },
    zona: "Villa Crespo",
    tipo: "Casa",
    ambientes: 5,
    m2: 172,
    precioUsd: 465000,
    destacado: true,
    imperfecciones: [
      "La pintura exterior necesita mano nueva en la fachada hacia la medianera.",
      "El cuarto de servicio tiene pendiente leve y retiene humedad en días de lluvia.",
      "La caldera es de 1998: hay que revisarla cada 6 meses.",
    ],
    fotos: [fotoCasaJardin, fotoLiving, fotoEdificioBlanco],
  },
  {
    id: "ph-palermo-boutique",
    title: "PH en edificio boutique de los 90",
    kicker: "Palermo · PH",
    body: "PH de dos ambientes en un edificio de seis pisos. Cocina integrada con isla, baño en suite y un balcón French que da a la calle interna. Se vende amueblado, como está.",
    points: [
      "Cocina integrada con isla y artefactos de acero",
      "Baño en suite con ducha tipo lluvia",
      "Balcón French con persiana automática",
      "Amueblado: se entrega con todo lo que se ve en las fotos",
      "Edificio de 6 unidades, ascensor y servicio de limpieza",
    ],
    meta: [
      { label: "Superficie", value: "68 m²" },
      { label: "Ambientes", value: "2" },
      { label: "Antigüedad", value: "29 años" },
      { label: "Expensas", value: "USD 165 / mes" },
      { label: "Cuota estimada", value: "USD 760 / mes" },
    ],
    price: { amount: "USD 245.000", note: "precio final, impuestos incluidos" },
    media: {
      src: fotoLiving,
      alt: "Living luminoso con ventanal y cocina abierta (imagen de demostración).",
    },
    zona: "Palermo",
    tipo: "PH",
    ambientes: 2,
    m2: 68,
    precioUsd: 245000,
    imperfecciones: [
      "El PH está en el segundo piso del edificio: no tiene ascensor.",
      "La calle es de vereda angosta y el acceso de cochera es compartido.",
      "La caldera es individual y hay que prenderla con anticipación.",
    ],
    fotos: [fotoLiving, fotoEdificioBlanco, fotoEdificioCurvo],
  },
  {
    id: "casa-villa-urquiza-pileta",
    title: "Casa con pileta y quincho",
    kicker: "Villa Urquiza · Casa",
    body: "Casa de dos plantas en el corazón de Villa Urquiza. Living de doble altura, cocina comedor y dos dormitorios; arriba un tercero con balcón. Quincho con pileta y deck.",
    points: [
      "Living de doble altura con ventanal al jardín",
      "Pileta de 6 × 3 metros con deck y sombra",
      "Quincho con parrilla y barra",
      "Tres dormitorios, dos con vestidor",
      "Calefacción central y agua caliente central",
    ],
    meta: [
      { label: "Superficie", value: "210 m²" },
      { label: "Ambientes", value: "5" },
      { label: "Antigüedad", value: "17 años" },
      { label: "Terreno", value: "410 m²" },
      { label: "Cuota estimada", value: "USD 1.640 / mes" },
    ],
    price: { amount: "USD 520.000", note: "precio final, impuestos incluidos" },
    badge: "Con pileta",
    media: {
      src: fotoCasaTobogan,
      alt: "Casa moderna con pileta y deck (imagen de demostración).",
    },
    zona: "Villa Urquiza",
    tipo: "Casa",
    ambientes: 5,
    m2: 210,
    precioUsd: 520000,
    destacado: true,
    imperfecciones: [
      "La pileta necesita filtro y cambio de cloro cada 15 días.",
      "La persiana del living es manual: hay que bajarla a mano.",
      "El garage es semi-subterráneo: en lluvias fuertes se humedece el piso.",
    ],
    fotos: [fotoCasaTobogan, fotoCasaPiscina, fotoLiving],
  },
  {
    id: "local-nunez-comercial",
    title: "Local comercial a media cuadra",
    kicker: "Núñez · Local",
    body: "Local en planta baja de un edificio residencial, sobre la avenida. Vidrio al frente, dos ambientes y un depósito. Apto de uso mixto en el mismo edificio.",
    points: [
      "Vidrio al frente con persiana enrollable",
      "Dos ambientes más depósito de 18 m²",
      "Piso de loseta pulida y artefacto de gas natural",
      "Aire acondicionado split en ambos ambientes",
      "Zona de carga y descarga por el pasillo lateral",
    ],
    meta: [
      { label: "Superficie", value: "74 m²" },
      { label: "Ambientes", value: "2" },
      { label: "Antigüedad", value: "44 años" },
      { label: "Expensas", value: "USD 140 / mes" },
      { label: "Alquiler", value: "USD 1.900 / mes" },
    ],
    price: { amount: "USD 195.000", note: "precio final, impuestos incluidos" },
    media: {
      src: fotoEdificioBlanco,
      alt: "Edificio moderno de líneas puras (imagen de demostración).",
    },
    zona: "Núñez",
    tipo: "Local",
    ambientes: 2,
    m2: 74,
    precioUsd: 195000,
    imperfecciones: [
      "El local tiene 2,60 m de alto: no entra un congelador de altura estándar.",
      "No tiene columna de gases: hay que instalar la campana sobre base.",
      "El vidriera tiene un golpe en la esquina inferior izquierda.",
    ],
    fotos: [fotoEdificioBlanco, fotoOficina, fotoEdificioCurvo],
  },
];

/* ── Secciones ─────────────────────────────────────────────────────────── */

const propiedadesSection: Section = {
  id: "propiedades",
  kicker: "Cartera",
  title: "Seis propiedades, seis fichas completas",
  body: "Cada ficha trae fotos reales, la superficie, las expensas, el precio final con impuestos y el mapa de imperfecciones. Lo que no te mostramos, no lo vas a descubrir en la visita.",
  layout: "grid",
  items: propiedades,
};

const imperfeccionesSection: Section = {
  id: "imperfecciones",
  kicker: "Transparencia",
  title: "Las imperfecciones van publicadas",
  body: "Un inmueble con humedad en un rincón o un ascensor chico no es una trampa: es información que te ahorra una visita perdida. Acá está, escrita, antes de que vengas.",
  layout: "list",
  items: propiedades.map((p) => ({
    id: `imp-${p.id}`,
    title: p.title,
    kicker: `${p.zona} · ${p.tipo}`,
    body: p.body,
    points: p.imperfecciones,
  })),
};

const financiacionSection: Section = {
  id: "financiacion",
  kicker: "Financiación",
  title: "Tres formas de pagarla, todas con números a la vista",
  body: "Los valores son estimaciones de la demo, calculadas sobre un plazo de 20 años y una tasa de referencia del 7,9% anual. Un asesor te arma el cuadro real en la primera visita.",
  layout: "grid",
  items: [
    {
      id: "hipotecario",
      title: "Crédito hipotecario",
      body: "Hasta el 70% del valor de la propiedad en 240 cuotas. Se pre-califica con DNI y recibo de sueldo en 48 horas.",
      points: ["Sin cargo de apertura hasta el 60% de anticipo", "Seguro de vida incluido en la cuota"],
      meta: [
        { label: "Anticipo mínimo", value: "30%" },
        { label: "Plazo máximo", value: "20 años" },
        { label: "Cuota estimada", value: "USD 1.180 / mes" },
      ],
    },
    {
      id: "cuota-pesos",
      title: "Cuota en pesos con ajuste",
      body: "Para quien no quiere exposición al dólar: la cuota se fija en pesos y se actualiza una vez por año.",
      points: ["El precio en dólares queda congelado", "Ajuste anual por índice"],
      meta: [
        { label: "Anticipo mínimo", value: "20%" },
        { label: "Plazo máximo", value: "10 años" },
        { label: "Cuota estimada", value: "USD 1.640 / mes" },
      ],
    },
    {
      id: "directo",
      title: "Plan directo con el propietario",
      body: "Negociación directo con el dueño: menos comisión, pero tenés que resolver vos el escribano y el plazo.",
      points: ["Sin comisión de intermediación", "Se entrega en 30 días"],
      meta: [
        { label: "Anticipo mínimo", value: "50%" },
        { label: "Plazo", value: "30 días" },
        { label: "Comisión CLAVE", value: "0%" },
      ],
    },
  ],
};

const zonasSection: Section = {
  id: "zonas",
  kicker: "Zonas",
  title: "Cinco barrios donde realmente trabajamos",
  body: "No publicamos en toda la ciudad: publicamos donde sabemos el precio real del metro cuadrado, qué expensas cobran y cuánto cuesta llegar a la oficina. Eso es lo que hace un buen dato.",
  layout: "grid",
  items: [
    {
      id: "palermo",
      title: "Palermo",
      body: "Casas de los años treinta y PHs nuevos en la misma cuadra. Es el barrio donde más rápido se vende y donde más caro se entra.",
      points: ["Ocho propiedades activas", "Mercado orgánico a cuatro cuadras"],
      meta: [
        { label: "Precio medio", value: "USD 2.480 / m²" },
        { label: "A la oficina", value: "9 min" },
        { label: "Perfil", value: "Residencial y diseño" },
      ],
    },
    {
      id: "recoleta",
      title: "Recoleta",
      body: "Edificios de los setenta con expensas razonables y un stock de departamentos que no se publica en portales.",
      points: ["Cinco propiedades activas", "El subte está a dos cuadras en tres de ellas"],
      meta: [
        { label: "Precio medio", value: "USD 2.050 / m²" },
        { label: "A la oficina", value: "12 min" },
        { label: "Perfil", value: "Departamentos e inversión" },
      ],
    },
    {
      id: "villa-crespo",
      title: "Villa Crespo",
      body: "Casas con jardín y PHs renovados. La demanda viene de gente que busca altura, verde y un metro cuadrado más sin salir de la ciudad.",
      points: ["Cuatro propiedades activas", "Obras abiertas en dos calles principales"],
      meta: [
        { label: "Precio medio", value: "USD 2.320 / m²" },
        { label: "A la oficina", value: "7 min" },
        { label: "Perfil", value: "Familiar y verde" },
      ],
    },
    {
      id: "villa-urquiza",
      title: "Villa Urquiza",
      body: "La zona de casas con pileta y terreno. Los precios son los más altos del radio y también los que menos se ajustan a la baja.",
      points: ["Tres propiedades activas", "Dos escuelas a cinco minutos"],
      meta: [
        { label: "Precio medio", value: "USD 2.760 / m²" },
        { label: "A la oficina", value: "22 min" },
        { label: "Perfil", value: "Casas con jardín" },
      ],
    },
    {
      id: "nunez",
      title: "Núñez",
      body: "Locales y departamentos sobre la avenida. Es la zona donde más rápido se alquila y donde conviene mirar contrato y destino de uso antes de comprar.",
      points: ["Tres propiedades activas", "Dos locales con contrato de alquiler pendiente"],
      meta: [
        { label: "Precio medio", value: "USD 1.740 / m²" },
        { label: "A la oficina", value: "18 min" },
        { label: "Perfil", value: "Comercial y mixtos" },
      ],
    },
  ],
};

const faqSection: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que todos preguntan antes de agendar una visita",
  layout: "list",
  items: [
    {
      id: "f1",
      title: "¿El precio publicado es el que pago?",
      body: "Sí. Todos los precios son finales e incluyen impuestos, gastos de escribana y nuestra comisión. No hay sorpresas en el escribano ni un número que aparece después.",
    },
    {
      id: "f2",
      title: "¿Las fotos son de la propiedad?",
      body: "Son imágenes de demostración de esta web de portfolio: en una implementación real serían fotos tomadas en la visita técnica, con fecha. Acá reemplazamos todo el material por fotos de stock.",
    },
    {
      id: "f3",
      title: "¿Cómo es la visita?",
      body: "Dura entre 30 y 45 minutos. Vamos con el informe impreso, un metro y una linterna: no es una recorrida rápida. Podés ir con un asesor propio si querés.",
    },
    {
      id: "f4",
      title: "¿Cobran comisión?",
      body: "El 3% del valor de la operación, con un mínimo fijo. Si comprás directo con el propietario, no cobramos nada: por eso el plan directo existe y está publicado.",
    },
    {
      id: "f5",
      title: "¿Puedo ver la propiedad sin agendar?",
      body: "No. Publicamos visitas coordinadas con el dueño: si vas sin aviso, casi nunca vas a poder entrar. Agendá el turno y te lo preparo.",
    },
    {
      id: "f6",
      title: "¿Los datos de esta web son reales?",
      body: "No. Es una demostración de portfolio: CLAVE, las propiedades, los precios, los agentes y las reseñas son ficticios.",
    },
  ],
};

const equipoSection: Section = {
  id: "equipo",
  kicker: "El equipo",
  title: "Tres personas, un solo teléfono",
  body: "No hay call center. Escribís a una persona del equipo y te responde esa misma persona. Si la visita no nos cierra, te lo decimos nosotros.",
  layout: "grid",
  items: [
    {
      id: "sofia",
      title: "Sofía Ferrari",
      body: "Broker titular. Lleva las operaciones de Palermo y Recoleta y es la que negocia los precios de la cartera.",
      points: ["Habla con vos directo por WhatsApp", "Te acompaña en la visita de cierre"],
      meta: [
        { label: "Zonas", value: "Palermo y Recoleta" },
        { label: "Horario", value: "Lun a Vie de 10 a 19 h" },
        { label: "Contacto", value: "WhatsApp directo" },
      ],
    },
    {
      id: "tomas",
      title: "Tomás Iriarte",
      body: "Asesor técnico. Hace las visitas, arma el informe con las imperfecciones y calcula el precio de mercado de cada unidad.",
      points: ["Lleva el informe impreso a cada visita", "Responde consultas técnicas por WhatsApp"],
      meta: [
        { label: "Zonas", value: "Villa Crespo y Villa Urquiza" },
        { label: "Horario", value: "Lun a Sáb de 10 a 18 h" },
        { label: "Contacto", value: "WhatsApp directo" },
      ],
    },
    {
      id: "marina",
      title: "Marina Ocampo",
      body: "Coordinadora. Maneja los turnos, los papeles y la reserva. Si hay que anular o reprogramar una visita, hablas con ella.",
      points: ["Confirma el turno en el momento", "Coordina escribanos y expensas"],
      meta: [
        { label: "Zonas", value: "Toda la ciudad" },
        { label: "Horario", value: "Lun a Vie de 9 a 18 h" },
        { label: "Contacto", value: "WhatsApp directo" },
      ],
    },
  ],
};

/* ── Contenido completo ────────────────────────────────────────────────── */

export const inmobiliaria: RubroContent = {
  id: rubro.id,
  brand,
  rubro: rubro.rubro,
  tagline: rubro.tagline,
  objeccion: rubro.objeccion,
  theme: {
    name: "clave",
    palette: { ...rubro.palette },
    fonts: { display: "Fraunces", body: "Archivo" },
    radius: "0.5rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Propiedades", href: "/propiedades" },
    { label: "Zonas", href: "/zonas" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Inmobiliaria · CABA",
    title: ["Las fotos", "no son", "la casa"],
    subtitle:
      "Publicamos cada propiedad con fotos reales, el mapa de imperfecciones y el precio final con impuestos. Agendá la visita en cuatro pasos y recibí tu pase al instante.",
    cta: { label: "Agendar una visita", href: "#visita" },
    secondaryCta: { label: "Ver las 6 propiedades", href: "/propiedades" },
    video: {
      src: video(3090),
      poster: poster(3090),
      alt: "Living de una casa moderna con ventanal al jardín (imagen de demostración).",
      isVideo: true,
    },
    live: { label: "Nuevas hoy", count: 3, min: 1, max: 5, unit: "propiedades", interval: 3600 },
  },
  sections: [
    propiedadesSection,
    imperfeccionesSection,
    financiacionSection,
    zonasSection,
    faqSection,
    equipoSection,
  ],
  conversion: {
    id: "visita",
    kicker: "Visita agendada",
    title: "Agendá tu visita en cuatro pasos",
    body: "Elegís la propiedad, el día y la hora, dejás tus datos y te damos el pase de la visita. Sin llamadas, sin esperas y sin que nadie te insista.",
    steps: ["Propiedad", "Día y hora", "Tus datos", "Confirmación"],
    options: propiedades,
    slots: [
      { id: "s1", day: "Martes 21", time: "10:00", places: 3 },
      { id: "s2", day: "Martes 21", time: "12:30", places: 2 },
      { id: "s3", day: "Martes 21", time: "17:00", places: 4 },
      { id: "s4", day: "Miércoles 22", time: "10:30", places: 5 },
      { id: "s5", day: "Miércoles 22", time: "15:00", places: 2 },
      { id: "s6", day: "Jueves 23", time: "11:00", places: 3 },
      { id: "s7", day: "Jueves 23", time: "18:30", places: 1 },
      { id: "s8", day: "Viernes 24", time: "10:00", places: 4 },
    ],
    demoNotice: "Demo: no se envían datos.",
  },
  legal: {
    company: "CLAVE Inmobiliaria S.A. (ficticia)",
    cuit: "30-71445566-8",
    address: "Av. Córdoba 4820, Palermo, CABA",
    email: "visitas@claveinmobiliaria.demo",
    phone: "+54 11 4789-0123",
    pricesIncludeTaxes: true,
    taxNote:
      "Todos los precios publicados son precios finales e incluyen impuestos, gastos de escribana y comisión. En una operación de venta, el precio publicado es el precio total.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar una visita online",
      note:
        "Si agendaste una visita online y no podés ir, cancelala sin costo desde acá. Completá los datos de la visita y se anula en el momento, sin costo ni llamadas.",
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
      "Los datos que dejás en esta web se usan únicamente para coordinar tu visita y avisarte por WhatsApp o email.",
      "No se comparten con terceros ni con fines comerciales.",
      "Pedí la baja de tus datos desde el botón de baja del pie de página: se elimina todo en un plazo máximo de 10 días.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "La visita queda confirmada recién cuando recibís el pase con código.",
      "Si no podés asistir, avisanos con al menos 4 horas de anticipación para liberar el turno.",
      "Las medidas, superficies y expensas son las informadas por el propietario y se verifican en la visita.",
      "Las imperfecciones publicadas son las detectadas por nuestro asesor: no son un inventario técnico de obra.",
    ],
  },
  contact: {
    whatsapp: rubro.whatsapp.phone,
    phone: "+54 11 4789-0123",
    email: "visitas@claveinmobiliaria.demo",
    address: "Av. Córdoba 4820, Palermo, CABA",
    hours: "Lunes a viernes de 10 a 19 h · Sábados de 10 a 14 h",
    mapsUrl: "https://maps.google.com/?q=Av+Córdoba+4820+Palermo",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "RealEstateAgent"],
    areaServed: "Ciudad de Buenos Aires",
  },
};

/** Fotos sueltas de la app (secciones que no son propiedades). */
export const fotos = {
  oficina: fotoOficina,
  llaves: fotoLlaves,
} as const;

/** Videos de apoyo (bandas). Todos verificados con curl → HTTP 200. */
export const clips = {
  /** Oficina: mesa, sillas, luz de mañana. */
  oficina: { src: video(3092), poster: poster(3092) },
  /** Barrio: casas con jardines desde arriba (único de inmobiliaria, sin reusar la obra 3093 de arquitectura). */
  edificio: { src: video(42337), poster: poster(42337) },
} as const;
