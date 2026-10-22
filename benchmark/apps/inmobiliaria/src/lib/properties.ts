export const photo = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;

/** Banco de fotos clasificadas por ambiente. */
const P = {
  extPool: "1600596542815-ffad4c1539a9",
  extGarden: "1512917774080-9991f1c4c750",
  extDusk: "1568605114967-8130f3a36994",
  extClassic: "1570129477492-45c003edd2be",
  extPool2: "1564013799919-ab600027ffc6",
  extForest: "1449844908441-8829872d2607",
  extMinimal: "1523217582562-09d0def993a6",
  extNight: "1600585154526-990dced4db0d",
  extModern: "1580587771525-78b9dba3b914",
  extModernDusk: "1600585154340-be6161a56a0c",
  extCube: "1600047509807-ba8f99d2cdde",
  villaPool: "1613490493576-7fde63acd811",
  building: "1574958269340-fa927503f3dd",
  city: "1582407947304-fd86f028f716",
  livingWhite: "1600566753086-00f18fb6b3ea",
  bed6: "1600607687644-c7171b42498f",
  livingArch: "1600210491892-03d54c0aaf87",
  livingPlants: "1502672260266-1c1ef2d93688",
  livingBright: "1560448204-e02f11c3d0e2",
  livingBlue: "1493809842364-78817add7ffb",
  livingDark: "1600121848594-d8644e57abab",
  livingGreen: "1616046229478-9901c5536a45",
  livingOpen: "1600607687939-ce8a6c25118c",
  extWood: "1600566753190-17f0baa2a6c3",
  livingWarm: "1600210492486-724fe5c67fb0",
  livingSoft: "1554995207-c18c203602cb",
  stairs: "1600573472550-8090b5e0745e",
  kitchenWhite: "1556912173-46c336c7fd55",
  kitchen2: "1556911220-bff31c812dba",
  kitchenDark: "1484154218962-a197022b5858",
  dining: "1560185007-cde436f6a4d0",
  diningGreen: "1617806118233-18e1de247200",
  bed1: "1505693416388-ac5ce068fe85",
  bed2: "1615874959474-d609969a20ed",
  bed3: "1616594039964-ae9021a400a0",
  bed4: "1540518614846-7eded433c457",
  bed5: "1631049307264-da0ec9d70304",
  studio: "1522708323590-d24dbb6b0267",
  bath1: "1552321554-5fefe8c9ef14",
  bath2: "1584622650111-993a426fbf0a",
  field: "1500382017468-9049fed747ef",
  lake: "1506744038136-46273834b3fb",
  lakeMountain: "1501785888041-af3ef285b470",
  hills: "1472214103451-9374bd1c798e",
  lawn: "1558904541-efa843a96f01",
};

/** Puerta/acceso dentro de una foto del recorrido (x, y en % de la imagen). */
export type Hotspot = { to: string; x: number; y: number; label: string };
export type TourRoom = { id: string; name: string; img: string; hotspots: Hotspot[] };
/** Rectángulo de la planta en un lienzo de 100 × 60. */
export type PlanRoom = { id: string; name: string; x: number; y: number; w: number; h: number; m2: number };
export type Lot = {
  frente: number;
  fondo: number;
  /** Grados: hacia dónde mira el frente (0 = norte). */
  orientacion: number;
  pendiente: number;
  fos: number;
  alturaMax: number;
  retiroFrente: number;
  retiroLateral: number;
  entorno: "barrio" | "bosque" | "lago";
};

export type Property = {
  slug: string;
  title: string;
  op: "Venta" | "Alquiler";
  type: "Casa" | "Departamento" | "Terreno" | "Loft";
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
  gallery: string[];
  blurb: string;
  features: string[];
  tour?: TourRoom[];
  plan?: PlanRoom[];
  lot?: Lot;
  /** Posición en el mapa estilizado (0..100). */
  map: [number, number];
  tag?: string;
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
    cover: P.extPool,
    gallery: [P.extPool, P.livingWhite, P.kitchenWhite, P.bed1, P.bath1, P.villaPool],
    blurb:
      "Arquitectura contemporánea frente a la laguna. Planta baja integrada con ventanales de piso a techo, galería con parrilla y pileta climatizada.",
    features: ["Pileta climatizada", "Muelle propio", "Domótica", "Losa radiante", "Galería con parrilla", "Seguridad 24 h"],
    tour: [
      { id: "ext", name: "Llegada", img: P.extPool, hotspots: [{ to: "living", x: 52, y: 58, label: "Entrar" }] },
      {
        id: "living",
        name: "Living",
        img: P.livingWhite,
        hotspots: [
          { to: "cocina", x: 78, y: 52, label: "Cocina" },
          { to: "dorm", x: 22, y: 50, label: "Dormitorio" },
          { to: "pileta", x: 50, y: 45, label: "Galería" },
        ],
      },
      { id: "cocina", name: "Cocina", img: P.kitchenWhite, hotspots: [{ to: "living", x: 15, y: 55, label: "Living" }] },
      {
        id: "dorm",
        name: "Suite principal",
        img: P.bed1,
        hotspots: [
          { to: "bano", x: 80, y: 48, label: "Baño" },
          { to: "living", x: 12, y: 55, label: "Living" },
        ],
      },
      { id: "bano", name: "Baño en suite", img: P.bath1, hotspots: [{ to: "dorm", x: 20, y: 55, label: "Suite" }] },
      { id: "pileta", name: "Galería y pileta", img: P.villaPool, hotspots: [{ to: "living", x: 40, y: 50, label: "Volver al living" }] },
    ],
    plan: [
      { id: "living", name: "Living", x: 2, y: 2, w: 46, h: 30, m2: 62 },
      { id: "cocina", name: "Cocina", x: 48, y: 2, w: 22, h: 30, m2: 24 },
      { id: "dorm", name: "Suite", x: 70, y: 2, w: 28, h: 30, m2: 28 },
      { id: "bano", name: "Baño", x: 70, y: 32, w: 28, h: 14, m2: 9 },
      { id: "pileta", name: "Galería", x: 2, y: 32, w: 68, h: 26, m2: 70 },
      { id: "ext", name: "Acceso", x: 70, y: 46, w: 28, h: 12, m2: 12 },
    ],
    map: [70, 18],
    tag: "Destacada",
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
    cover: P.building,
    gallery: [P.building, P.livingBlue, P.kitchenDark, P.bed2, P.bath2, P.city],
    blurb: "Piso alto con balcón corrido y vista abierta. Edificio con amenities: SUM, gimnasio y terraza con solárium.",
    features: ["Balcón corrido", "Amenities", "Apto mascotas", "Laundry", "Seguridad 24 h", "Cerca del subte D"],
    tour: [
      { id: "ext", name: "Edificio", img: P.building, hotspots: [{ to: "living", x: 50, y: 70, label: "Subir al 9°" }] },
      {
        id: "living",
        name: "Living",
        img: P.livingBlue,
        hotspots: [
          { to: "cocina", x: 75, y: 50, label: "Cocina" },
          { to: "dorm", x: 18, y: 50, label: "Dormitorio" },
          { to: "balcon", x: 50, y: 40, label: "Balcón" },
        ],
      },
      { id: "cocina", name: "Cocina", img: P.kitchenDark, hotspots: [{ to: "living", x: 20, y: 55, label: "Living" }] },
      {
        id: "dorm",
        name: "Dormitorio",
        img: P.bed2,
        hotspots: [
          { to: "bano", x: 82, y: 50, label: "Baño" },
          { to: "living", x: 15, y: 55, label: "Living" },
        ],
      },
      { id: "bano", name: "Baño", img: P.bath2, hotspots: [{ to: "dorm", x: 25, y: 55, label: "Dormitorio" }] },
      { id: "balcon", name: "Vista desde el balcón", img: P.city, hotspots: [{ to: "living", x: 50, y: 75, label: "Volver" }] },
    ],
    plan: [
      { id: "living", name: "Living", x: 2, y: 2, w: 48, h: 34, m2: 28 },
      { id: "cocina", name: "Cocina", x: 50, y: 2, w: 20, h: 22, m2: 9 },
      { id: "bano", name: "Baño", x: 50, y: 24, w: 20, h: 12, m2: 5 },
      { id: "dorm", name: "Dormitorio", x: 70, y: 2, w: 28, h: 34, m2: 15 },
      { id: "balcon", name: "Balcón", x: 2, y: 36, w: 96, h: 12, m2: 12 },
      { id: "ext", name: "Palier", x: 70, y: 48, w: 28, h: 10, m2: 4 },
    ],
    map: [38, 46],
    tag: "Nuevo",
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
    cover: P.lawn,
    gallery: [P.lawn, P.field, P.hills, P.extGarden],
    blurb: "Lote central de 30 × 40 m con orientación norte al contrafrente. Listo para escriturar, con todos los servicios.",
    features: ["Orientación norte", "Todos los servicios", "Apto crédito", "Escritura inmediata", "Barrio cerrado", "Club house"],
    lot: { frente: 30, fondo: 40, orientacion: 180, pendiente: 0, fos: 0.3, alturaMax: 8.5, retiroFrente: 6, retiroLateral: 3, entorno: "barrio" },
    map: [18, 22],
    tag: "Terreno 3D",
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
    cover: P.extClassic,
    gallery: [P.extClassic, P.livingArch, P.dining, P.kitchen2, P.bed3, P.bath1],
    blurb: "Estilo colonial reciclado a nuevo. Jardín parquizado con añosos árboles, comedor diario y escritorio con biblioteca.",
    features: ["Jardín parquizado", "Escritorio", "Hogar a leña", "Dependencia", "Parrilla", "Cerca de colegios"],
    tour: [
      { id: "ext", name: "Fachada", img: P.extClassic, hotspots: [{ to: "living", x: 50, y: 62, label: "Entrar" }] },
      {
        id: "living",
        name: "Living",
        img: P.livingArch,
        hotspots: [
          { to: "comedor", x: 70, y: 50, label: "Comedor" },
          { to: "dorm", x: 25, y: 48, label: "Planta alta" },
        ],
      },
      {
        id: "comedor",
        name: "Comedor",
        img: P.dining,
        hotspots: [
          { to: "cocina", x: 80, y: 50, label: "Cocina" },
          { to: "living", x: 15, y: 55, label: "Living" },
        ],
      },
      { id: "cocina", name: "Cocina", img: P.kitchen2, hotspots: [{ to: "comedor", x: 20, y: 55, label: "Comedor" }] },
      {
        id: "dorm",
        name: "Dormitorio principal",
        img: P.bed3,
        hotspots: [
          { to: "bano", x: 80, y: 50, label: "Baño" },
          { to: "living", x: 15, y: 60, label: "Bajar" },
        ],
      },
      { id: "bano", name: "Baño", img: P.bath1, hotspots: [{ to: "dorm", x: 20, y: 55, label: "Dormitorio" }] },
    ],
    plan: [
      { id: "living", name: "Living", x: 2, y: 2, w: 40, h: 28, m2: 42 },
      { id: "comedor", name: "Comedor", x: 42, y: 2, w: 28, h: 28, m2: 26 },
      { id: "cocina", name: "Cocina", x: 70, y: 2, w: 28, h: 28, m2: 22 },
      { id: "dorm", name: "Dormitorio", x: 2, y: 30, w: 40, h: 28, m2: 24 },
      { id: "bano", name: "Baño", x: 42, y: 30, w: 20, h: 28, m2: 8 },
      { id: "ext", name: "Hall", x: 62, y: 30, w: 36, h: 28, m2: 18 },
    ],
    map: [48, 16],
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
    cover: P.stairs,
    gallery: [P.stairs, P.livingOpen, P.bed4, P.bath2],
    blurb: "Ex fábrica reciclada con doble altura, entrepiso de hierro y vidrio, y terraza propia. Ideal home office.",
    features: ["Doble altura", "Terraza propia", "Entrepiso", "Apto profesional", "Amoblado opcional", "Sin expensas extraordinarias"],
    tour: [
      {
        id: "living",
        name: "Planta baja",
        img: P.stairs,
        hotspots: [
          { to: "cocina", x: 75, y: 55, label: "Cocina" },
          { to: "dorm", x: 35, y: 35, label: "Subir al entrepiso" },
        ],
      },
      { id: "cocina", name: "Cocina y estar", img: P.livingOpen, hotspots: [{ to: "living", x: 20, y: 55, label: "Volver" }] },
      {
        id: "dorm",
        name: "Entrepiso",
        img: P.bed4,
        hotspots: [
          { to: "bano", x: 80, y: 50, label: "Baño" },
          { to: "living", x: 20, y: 65, label: "Bajar" },
        ],
      },
      { id: "bano", name: "Baño", img: P.bath2, hotspots: [{ to: "dorm", x: 25, y: 55, label: "Entrepiso" }] },
    ],
    plan: [
      { id: "living", name: "Doble altura", x: 2, y: 2, w: 56, h: 56, m2: 34 },
      { id: "cocina", name: "Cocina", x: 58, y: 2, w: 40, h: 26, m2: 12 },
      { id: "dorm", name: "Entrepiso", x: 58, y: 28, w: 40, h: 18, m2: 12 },
      { id: "bano", name: "Baño", x: 58, y: 46, w: 40, h: 12, m2: 5 },
    ],
    map: [30, 36],
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
    cover: P.extModern,
    gallery: [P.extModern, P.livingWarm, P.kitchenWhite, P.bed5, P.extModernDusk],
    blurb: "Volúmenes puros de hormigón visto y madera. Living a doble altura que se abre por completo al jardín.",
    features: ["Hormigón visto", "Paneles solares", "Pileta", "Jardín", "Aberturas DVH", "Carga para auto eléctrico"],
    tour: [
      { id: "ext", name: "Fachada", img: P.extModern, hotspots: [{ to: "living", x: 45, y: 60, label: "Entrar" }] },
      {
        id: "living",
        name: "Living",
        img: P.livingWarm,
        hotspots: [
          { to: "cocina", x: 75, y: 52, label: "Cocina" },
          { to: "dorm", x: 22, y: 48, label: "Dormitorio" },
          { to: "jardin", x: 50, y: 45, label: "Jardín" },
        ],
      },
      { id: "cocina", name: "Cocina", img: P.kitchenWhite, hotspots: [{ to: "living", x: 15, y: 55, label: "Living" }] },
      { id: "dorm", name: "Dormitorio", img: P.bed5, hotspots: [{ to: "living", x: 15, y: 55, label: "Living" }] },
      { id: "jardin", name: "Jardín al atardecer", img: P.extModernDusk, hotspots: [{ to: "living", x: 50, y: 60, label: "Volver" }] },
    ],
    plan: [
      { id: "living", name: "Living", x: 2, y: 2, w: 50, h: 32, m2: 48 },
      { id: "cocina", name: "Cocina", x: 52, y: 2, w: 22, h: 32, m2: 20 },
      { id: "dorm", name: "Dormitorio", x: 74, y: 2, w: 24, h: 32, m2: 18 },
      { id: "jardin", name: "Jardín", x: 2, y: 34, w: 72, h: 24, m2: 180 },
      { id: "ext", name: "Acceso", x: 74, y: 34, w: 24, h: 24, m2: 16 },
    ],
    map: [44, 80],
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
    cover: P.lake,
    gallery: [P.lake, P.lakeMountain, P.extForest],
    blurb: "Lote en pendiente suave con bosque nativo y vista abierta al Nahuel Huapi. Acceso por camino consolidado.",
    features: ["Vista al lago", "Bosque nativo", "Pendiente suave", "Luz y agua", "A 5 km del centro", "Apto cabañas"],
    lot: { frente: 50, fondo: 100, orientacion: 20, pendiente: 6, fos: 0.15, alturaMax: 7, retiroFrente: 10, retiroLateral: 5, entorno: "lago" },
    map: [8, 70],
    tag: "Terreno 3D",
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
    cover: P.extForest,
    gallery: [P.extForest, P.livingPlants, P.diningGreen, P.bed2, P.bath2],
    blurb: "Casa de madera y piedra rodeada de bosque. Hogar a leña, deck con quincho y huerta. Alquiler anual.",
    features: ["Hogar a leña", "Quincho", "Huerta", "Deck", "Bosque propio", "Apto mascotas"],
    tour: [
      { id: "ext", name: "Llegada", img: P.extForest, hotspots: [{ to: "living", x: 50, y: 60, label: "Entrar" }] },
      {
        id: "living",
        name: "Living con hogar",
        img: P.livingPlants,
        hotspots: [
          { to: "comedor", x: 75, y: 52, label: "Comedor" },
          { to: "dorm", x: 22, y: 50, label: "Dormitorio" },
        ],
      },
      { id: "comedor", name: "Comedor", img: P.diningGreen, hotspots: [{ to: "living", x: 15, y: 55, label: "Living" }] },
      {
        id: "dorm",
        name: "Dormitorio",
        img: P.bed2,
        hotspots: [
          { to: "bano", x: 80, y: 50, label: "Baño" },
          { to: "living", x: 15, y: 55, label: "Living" },
        ],
      },
      { id: "bano", name: "Baño", img: P.bath2, hotspots: [{ to: "dorm", x: 25, y: 55, label: "Dormitorio" }] },
    ],
    plan: [
      { id: "living", name: "Living", x: 2, y: 2, w: 44, h: 32, m2: 40 },
      { id: "comedor", name: "Comedor", x: 46, y: 2, w: 26, h: 32, m2: 22 },
      { id: "dorm", name: "Dormitorio", x: 72, y: 2, w: 26, h: 32, m2: 18 },
      { id: "bano", name: "Baño", x: 72, y: 34, w: 26, h: 12, m2: 7 },
      { id: "ext", name: "Deck", x: 2, y: 34, w: 70, h: 24, m2: 60 },
    ],
    map: [22, 8],
  },
];

export const heroWalk = [
  { img: P.extModernDusk, kicker: "01 — Llegás", title: "La casa te espera", focus: [50, 62] as [number, number] },
  { img: P.stairs, kicker: "02 — Entrás", title: "Cruzás la puerta", focus: [42, 55] as [number, number] },
  { img: P.livingWarm, kicker: "03 — Recorrés", title: "Cada ambiente, en primera persona", focus: [60, 50] as [number, number] },
  { img: P.kitchenWhite, kicker: "04 — Imaginás", title: "Tu vida, acá", focus: [50, 50] as [number, number] },
  { img: P.villaPool, kicker: "05 — Te quedás", title: "Antes de visitarla", focus: [50, 50] as [number, number] },
];

export const formatPrice = (p: Property) =>
  `${p.currency} ${p.price.toLocaleString("es-AR")}${p.op === "Alquiler" ? " /mes" : ""}`;
