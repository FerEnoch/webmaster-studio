export type Operation = "Venta" | "Alquiler";
export type PropertyType = "Casa" | "Departamento" | "Terreno" | "Loft";

export type Property = {
  slug: string;
  title: string;
  op: Operation;
  type: PropertyType;
  price: number;
  currency: "USD" | "ARS";
  expensas?: number;
  barrio: string;
  ciudad: string;
  m2: number;
  m2Lote?: number;
  amb?: number;
  dorm?: number;
  banos?: number;
  cochera?: number;
  antiguedad?: string;
  cover: string;
  coverAlt: string;
  blurb: string;
  features: string[];
  map: [number, number];
  tag?: string;
  /** T3 attaches the room-tour or solar-lot model to this stable seam. */
  experience?: "tour" | "lot";
};

export const properties: Property[] = [
  {
    slug: "casa-laguna-nordelta",
    title: "Casa Laguna",
    op: "Venta",
    type: "Casa",
    price: 680000,
    currency: "USD",
    expensas: 420000,
    barrio: "Nordelta",
    ciudad: "Tigre",
    m2: 320,
    m2Lote: 900,
    amb: 5,
    dorm: 4,
    banos: 3,
    cochera: 2,
    antiguedad: "A estrenar",
    cover: "laguna-pool",
    coverAlt: "Casa contemporánea de líneas puras junto a una piscina",
    blurb: "Arquitectura contemporánea frente a la laguna. Planta baja integrada con ventanales de piso a techo, galería con parrilla y pileta climatizada.",
    features: ["Pileta climatizada", "Muelle propio", "Domótica", "Losa radiante", "Galería con parrilla", "Seguridad 24 h"],
    map: [70, 18],
    tag: "Destacada",
    experience: "tour",
  },
  {
    slug: "departamento-palermo-soho",
    title: "Piso en Palermo Soho",
    op: "Alquiler",
    type: "Departamento",
    price: 1250000,
    currency: "ARS",
    expensas: 185000,
    barrio: "Palermo Soho",
    ciudad: "CABA",
    m2: 78,
    amb: 3,
    dorm: 2,
    banos: 1,
    cochera: 1,
    antiguedad: "5 años",
    cover: "palermo-building",
    coverAlt: "Edificio contemporáneo de departamentos con fachada vidriada",
    blurb: "Piso alto con balcón corrido y vista abierta. Edificio con amenities: SUM, gimnasio y terraza con solárium.",
    features: ["Balcón corrido", "Amenities", "Apto mascotas", "Laundry", "Seguridad 24 h", "Cerca del subte D"],
    map: [38, 46],
    tag: "Nuevo",
    experience: "tour",
  },
  {
    slug: "lote-pilar-del-este",
    title: "Lote en Pilar del Este",
    op: "Venta",
    type: "Terreno",
    price: 145000,
    currency: "USD",
    expensas: 160000,
    barrio: "Pilar del Este",
    ciudad: "Pilar",
    m2: 1200,
    m2Lote: 1200,
    cover: "pilar-lawn",
    coverAlt: "Terreno verde y abierto dentro de un barrio residencial",
    blurb: "Lote central de 30 × 40 m con orientación norte al contrafrente. Listo para escriturar, con todos los servicios.",
    features: ["Orientación norte", "Todos los servicios", "Apto crédito", "Escritura inmediata", "Barrio cerrado", "Club house"],
    map: [18, 22],
    tag: "Terreno 3D",
    experience: "lot",
  },
  {
    slug: "casa-clasica-san-isidro",
    title: "Casa clásica en San Isidro",
    op: "Venta",
    type: "Casa",
    price: 520000,
    currency: "USD",
    barrio: "Las Lomas",
    ciudad: "San Isidro",
    m2: 280,
    m2Lote: 650,
    amb: 6,
    dorm: 4,
    banos: 3,
    cochera: 2,
    antiguedad: "Reciclada 2023",
    cover: "san-isidro-classic",
    coverAlt: "Casa clásica rodeada de jardín y árboles añejos",
    blurb: "Estilo colonial reciclado a nuevo. Jardín parquizado con añosos árboles, comedor diario y escritorio con biblioteca.",
    features: ["Jardín parquizado", "Escritorio", "Hogar a leña", "Dependencia", "Parrilla", "Cerca de colegios"],
    map: [48, 16],
    experience: "tour",
  },
  {
    slug: "loft-colegiales",
    title: "Loft doble altura",
    op: "Alquiler",
    type: "Loft",
    price: 980000,
    currency: "ARS",
    expensas: 90000,
    barrio: "Colegiales",
    ciudad: "CABA",
    m2: 64,
    amb: 2,
    dorm: 1,
    banos: 1,
    antiguedad: "Reciclado",
    cover: "colegiales-stairs",
    coverAlt: "Interior de doble altura con escalera de estilo industrial",
    blurb: "Ex fábrica reciclada con doble altura, entrepiso de hierro y vidrio, y terraza propia. Ideal home office.",
    features: ["Doble altura", "Terraza propia", "Entrepiso", "Apto profesional", "Amoblado opcional", "Sin expensas extraordinarias"],
    map: [30, 36],
    experience: "tour",
  },
  {
    slug: "casa-minimal-canning",
    title: "Casa Minimal",
    op: "Venta",
    type: "Casa",
    price: 390000,
    currency: "USD",
    expensas: 210000,
    barrio: "Canning",
    ciudad: "Ezeiza",
    m2: 210,
    m2Lote: 600,
    amb: 4,
    dorm: 3,
    banos: 2,
    cochera: 2,
    antiguedad: "A estrenar",
    cover: "canning-minimal",
    coverAlt: "Casa minimalista iluminada al atardecer",
    blurb: "Volúmenes puros de hormigón visto y madera. Living a doble altura que se abre por completo al jardín.",
    features: ["Hormigón visto", "Paneles solares", "Pileta", "Jardín", "Aberturas DVH", "Carga para auto eléctrico"],
    map: [44, 80],
    experience: "tour",
  },
  {
    slug: "lote-villa-la-angostura",
    title: "Terreno con vista al lago",
    op: "Venta",
    type: "Terreno",
    price: 210000,
    currency: "USD",
    barrio: "Puerto Manzano",
    ciudad: "Villa La Angostura",
    m2: 5000,
    m2Lote: 5000,
    cover: "angostura-lake",
    coverAlt: "Paisaje de montañas, bosque y lago en Patagonia",
    blurb: "Lote en pendiente suave con bosque nativo y vista abierta al Nahuel Huapi. Acceso por camino consolidado.",
    features: ["Vista al lago", "Bosque nativo", "Pendiente suave", "Luz y agua", "A 5 km del centro", "Apto cabañas"],
    map: [8, 70],
    tag: "Terreno 3D",
    experience: "lot",
  },
  {
    slug: "casa-de-campo-exaltacion",
    title: "Casa de campo en el bosque",
    op: "Alquiler",
    type: "Casa",
    price: 2900000,
    currency: "ARS",
    barrio: "Los Cardales",
    ciudad: "Exaltación de la Cruz",
    m2: 190,
    m2Lote: 3000,
    amb: 4,
    dorm: 3,
    banos: 2,
    cochera: 3,
    antiguedad: "15 años",
    cover: "exaltacion-forest",
    coverAlt: "Casa de madera y piedra integrada a un bosque",
    blurb: "Casa de madera y piedra rodeada de bosque. Hogar a leña, deck con quincho y huerta. Alquiler anual.",
    features: ["Hogar a leña", "Quincho", "Huerta", "Deck", "Bosque propio", "Apto mascotas"],
    map: [22, 8],
    experience: "tour",
  },
];

export const heroWalk = [
  { image: "hero-arrival", kicker: "01 — Llegás", title: "La casa te espera", focus: [50, 58] as [number, number] },
  { image: "colegiales-stairs", kicker: "02 — Entrás", title: "Cruzás la puerta", focus: [46, 52] as [number, number] },
  { image: "laguna-living", kicker: "03 — Recorrés", title: "Cada ambiente, en primera persona", focus: [58, 50] as [number, number] },
  { image: "laguna-kitchen", kicker: "04 — Imaginás", title: "Tu vida, acá", focus: [52, 50] as [number, number] },
  { image: "hero-villa-pool", kicker: "05 — Te quedás", title: "Antes de visitarla", focus: [60, 50] as [number, number] },
];

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
export const formatPrice = (property: Property) =>
  `${property.currency} ${numberFormat.format(property.price)}${property.op === "Alquiler" ? " /mes" : ""}`;

export const propertySlugs = new Set(properties.map((property) => property.slug));
