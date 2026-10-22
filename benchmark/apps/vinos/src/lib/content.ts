/* Contenido de ALTURA — boutique de vinos y viajes en Mendoza (plantilla de demostración, marcas ficticias). */

export const video = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
export const poster = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`;
export const img = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

/** Videos Mixkit (HTTP 200, revisados por póster). */
export const V = {
  aerial: 14704, // viñedo aéreo
  sunshine: 8188,
  dusk: 8198,
  lines: 8291,
  rows: 26539,
  manGlass: 26544,
  girlGlass: 46906,
  harvest: 26559,
  agronomist: 47663,
  grapes: 6968,
  grapes2: 7159,
  grapesClose: 34630,
  grapesWind: 17729,
  pourRed: 43893,
  serveRed: 43896,
  pourGlass: 15788,
  stream: 52406, // chorro de vino sobre negro
  glassCenter: 52412,
  redBlack: 22735,
  corks: 28977,
  road: 48489, // ruta recta hacia la montaña
  arid: 50199, // vuelo bajo sobre paisaje árido con montañas
  aridSunset: 41366,
  mountainRoad: 2392,
} as const;

/** Fotos Unsplash (HTTP 200 y revisadas a ojo). */
export const P = {
  andesVines: "1765574782003-75d8f507f939",
  ucoVines: "1764259474889-77caaca5aff8",
  ucoRows: "1764259422787-6eec5afad1cb",
  vineMountain: "1690742135975-f04123a1c471",
  sunsetVines: "1765899951869-ea3f2837689b",
  glassView: "1506377247377-2a5b3b417ebb",
  cellarChalk: "1765850258591-ac294919250b",
  bottlesStack: "1765850257843-aa029ab7769c",
  toneles: "1765850258873-d9c59119c24b",
  mendozaSign: "1765850257842-fcf66573c543",
  barrels: "1561906814-23da9a8bfee0",
  barrelRoom: "1724082111671-eb2a4c01d40d",
  barrelTunnel: "1692274073394-6ebd6a68d535",
  archCellar: "1783443799503-e1587f423bd0",
  archCellar2: "1783443799512-c9aeb557496f",
  darkBottles: "1554230561-31bdc707b537",
  bottleGrapes: "1656235123277-9ac111857004",
  cheers: "1510812431401-41d2bd2722f3",
  tastingTable: "1558670460-cad0c19b1840",
  cheeseBoard: "1598306442928-4d90f32c6866",
  pourRed: "1553361371-9b22f78e8b1d",
  flight: "1568213816046-0ee1c42bd559",
  picnic: "1566995541428-f2246c17cda1",
  shelf: "1516594915697-87eb3b1c14ea",
  shop: "1724398931548-1738e808c640",
  rack: "1622726196151-bfa9875199b0",
  gaucho: "1624125278860-381b6acd3b44",
  horsePath: "1777694572065-933530058bb2",
  asado: "1586058584825-c1e87ed735b4",
  parrilla: "1633309343061-29cdc618d5e9",
  asador: "1673491100948-8ef540ceedf4",
  sommPour: "1737904942495-8612f6b923a6",
  dinner: "1737904942580-d4d977de99bf",
  toast: "1737904942594-4f1317473c31",
  gift: "1761095596627-a9ec41ed313b",
  choosing: "1787861277997-fa5b2286b5da",
  barrelPour: "1712645376049-a8d414d4a364",
  oldBottles: "1771846954643-6cf7a8dba814",
} as const;

export const brand = {
  name: "ALTURA",
  tagline: "Vinos de altura y viajes por Mendoza.",
  address: "Arístides Villanueva 480, Ciudad de Mendoza",
  hours: "Lun a sáb · 11 a 21 h",
  whatsapp: "+54 9 261 400-1200",
  evt: "EVT Legajo N° 0000 (demo)",
};

/* ---------------- Regiones (el altímetro) ---------------- */

export const regions = [
  {
    id: "maipu",
    name: "Maipú",
    altitude: 750,
    text: "La cuna del vino mendocino, a 20 minutos de la ciudad. Bodegas centenarias, olivares y caminos para recorrer en bici.",
    climate: "Días cálidos, vinos amables",
    grape: "Malbec y Bonarda",
    img: P.toneles,
  },
  {
    id: "lujan",
    name: "Luján de Cuyo",
    altitude: 950,
    text: "La primera zona del Malbec argentino. Viñedos viejos, suelos pedregosos y la cordillera siempre de fondo.",
    climate: "Noches frescas, taninos firmes",
    grape: "Malbec y Cabernet",
    img: P.vineMountain,
  },
  {
    id: "uco",
    name: "Valle de Uco",
    altitude: 1400,
    text: "El valle más alto: sol intenso, noches heladas y agua de deshielo. Acá nacen los vinos con más frescura y tensión.",
    climate: "Amplitud térmica de 20 °C",
    grape: "Malbec, Cab. Franc, Chardonnay",
    img: P.ucoVines,
  },
] as const;

/* ---------------- Vinos ---------------- */

export type WineType = "tinto" | "blanco" | "rosado" | "espumante";
export type Wine = {
  id: string;
  name: string;
  producer: string;
  varietal: string;
  type: WineType;
  region: (typeof regions)[number]["id"];
  altitude: number;
  year: number;
  price: number;
  liquid: string; // color del vino en la copa
  glass: string; // color del vidrio
  capsule: string;
  notes: { cuerpo: number; taninos: number; acidez: number; fruta: number };
  pairing: string[];
  text: string;
  pick?: boolean;
};

export const wines: Wine[] = [
  { id: "uco-malbec", name: "Cumbre", producer: "Finca Ceibo", varietal: "Malbec", type: "tinto", region: "uco", altitude: 1350, year: 2022, price: 28500, liquid: "#5b0f22", glass: "#18231c", capsule: "#5a1426", notes: { cuerpo: 4, taninos: 4, acidez: 4, fruta: 5 }, pairing: ["Asado", "Cordero", "Quesos duros"], text: "Violetas, ciruela fresca y una acidez que pide otra copa. Malbec de altura en estado puro.", pick: true },
  { id: "chacayes-blend", name: "Los Chacayes", producer: "Puesto Alto", varietal: "Blend de tintas", type: "tinto", region: "uco", altitude: 1250, year: 2021, price: 46900, liquid: "#4a0d1c", glass: "#141c17", capsule: "#c19a5b", notes: { cuerpo: 5, taninos: 5, acidez: 3, fruta: 4 }, pairing: ["Ojo de bife", "Hongos", "Guisos"], text: "Malbec, Cabernet Franc y Petit Verdot de suelos pedregosos. Profundo, especiado, para guardar.", pick: true },
  { id: "franc", name: "Piedra Fría", producer: "Finca Ceibo", varietal: "Cabernet Franc", type: "tinto", region: "uco", altitude: 1450, year: 2022, price: 34200, liquid: "#521024", glass: "#18231c", capsule: "#3a4a2f", notes: { cuerpo: 3, taninos: 3, acidez: 5, fruta: 4 }, pairing: ["Pastas", "Pollo al horno", "Empanadas"], text: "Pimiento asado, frutos rojos y hierbas de montaña. Fresco y vibrante." },
  { id: "agrelo-malbec", name: "Agrelo Viejo", producer: "Los Tres Álamos", varietal: "Malbec", type: "tinto", region: "lujan", altitude: 980, year: 2020, price: 39800, liquid: "#4a0b1a", glass: "#141c17", capsule: "#1b1416", notes: { cuerpo: 5, taninos: 4, acidez: 3, fruta: 4 }, pairing: ["Asado", "Carnes braseadas"], text: "Viñedos de 80 años. Fruta negra, chocolate amargo y 14 meses de barrica francesa.", pick: true },
  { id: "cabernet", name: "Perdriel", producer: "Los Tres Álamos", varietal: "Cabernet Sauvignon", type: "tinto", region: "lujan", altitude: 960, year: 2021, price: 31500, liquid: "#3f0a18", glass: "#141c17", capsule: "#6b7a4b", notes: { cuerpo: 4, taninos: 5, acidez: 3, fruta: 3 }, pairing: ["Vacío", "Quesos estacionados"], text: "Cassis, pimienta negra y taninos firmes. Un clásico de Luján." },
  { id: "bonarda", name: "Callejón", producer: "Casa Quintana", varietal: "Bonarda", type: "tinto", region: "maipu", altitude: 760, year: 2023, price: 16900, liquid: "#5e1330", glass: "#18231c", capsule: "#b5532f", notes: { cuerpo: 3, taninos: 2, acidez: 3, fruta: 5 }, pairing: ["Pizza", "Picadas", "Pastas"], text: "Jugoso y fácil: frutas rojas, flores y nada de madera. El vino del día a día." },
  { id: "syrah", name: "Barrancas", producer: "Casa Quintana", varietal: "Syrah", type: "tinto", region: "maipu", altitude: 740, year: 2021, price: 21400, liquid: "#4d0c22", glass: "#141c17", capsule: "#5a1426", notes: { cuerpo: 4, taninos: 3, acidez: 3, fruta: 4 }, pairing: ["Cerdo", "Barbacoa", "Chivito"], text: "Especiado, con aceituna negra y un final ahumado. Ideal para el fuego." },
  { id: "chardonnay", name: "Gualtallary", producer: "Puesto Alto", varietal: "Chardonnay", type: "blanco", region: "uco", altitude: 1500, year: 2023, price: 32800, liquid: "#e9d48a", glass: "#b9c49a", capsule: "#c19a5b", notes: { cuerpo: 3, taninos: 1, acidez: 5, fruta: 4 }, pairing: ["Pescados", "Risotto", "Quesos blandos"], text: "Tiza, pera y limón. Un Chardonnay tenso, de suelo calcáreo y mucha altura.", pick: true },
  { id: "sauvignon", name: "Deshielo", producer: "Finca Ceibo", varietal: "Sauvignon Blanc", type: "blanco", region: "uco", altitude: 1300, year: 2024, price: 19800, liquid: "#efe2a2", glass: "#c7d1a4", capsule: "#6b7a4b", notes: { cuerpo: 2, taninos: 1, acidez: 5, fruta: 5 }, pairing: ["Ceviche", "Ensaladas", "Mariscos"], text: "Pomelo, ruda y hierba recién cortada. Fresco como el agua de la cordillera." },
  { id: "semillon", name: "Semillón Viejo", producer: "Los Tres Álamos", varietal: "Semillón", type: "blanco", region: "lujan", altitude: 940, year: 2022, price: 27600, liquid: "#e3c66a", glass: "#b9c49a", capsule: "#1b1416", notes: { cuerpo: 3, taninos: 1, acidez: 4, fruta: 3 }, pairing: ["Pollo", "Cocina asiática"], text: "Parral de 1948. Miel, cera y cítricos maduros: un blanco con historia." },
  { id: "rosado", name: "Rosa de Altura", producer: "Puesto Alto", varietal: "Rosado de Malbec", type: "rosado", region: "uco", altitude: 1200, year: 2024, price: 17500, liquid: "#e7998d", glass: "#e8c7c2", capsule: "#b5532f", notes: { cuerpo: 2, taninos: 1, acidez: 4, fruta: 5 }, pairing: ["Sushi", "Tapas", "Tardes de sol"], text: "Frutilla, pomelo rosado y un final salino. Para tomar bien frío." },
  { id: "nature", name: "Brut Nature", producer: "Finca Ceibo", varietal: "Espumante", type: "espumante", region: "uco", altitude: 1350, year: 2021, price: 36900, liquid: "#efe0a8", glass: "#2a3424", capsule: "#c19a5b", notes: { cuerpo: 2, taninos: 1, acidez: 5, fruta: 3 }, pairing: ["Brindis", "Ostras", "Entradas"], text: "Método tradicional, 30 meses sobre lías. Burbuja fina, pan tostado y manzana verde." },
];

export const TYPE_LABEL: Record<WineType, string> = { tinto: "Tintos", blanco: "Blancos", rosado: "Rosados", espumante: "Espumantes" };

/* ---------------- Sommelier virtual ---------------- */

export const quiz = [
  {
    id: "con",
    q: "¿Con qué lo vas a tomar?",
    options: [
      { id: "asado", label: "Asado o carnes", icon: "🔥" },
      { id: "pastas", label: "Pastas o pizza", icon: "🍝" },
      { id: "pescado", label: "Pescado o algo liviano", icon: "🐟" },
      { id: "solo", label: "Solo, charlando", icon: "🥂" },
    ],
  },
  {
    id: "estilo",
    q: "¿Cómo te gusta?",
    options: [
      { id: "intenso", label: "Intenso y con cuerpo", icon: "◼" },
      { id: "fresco", label: "Fresco y vibrante", icon: "❄" },
      { id: "suave", label: "Suave y frutado", icon: "🍒" },
    ],
  },
  {
    id: "precio",
    q: "¿Cuánto querés gastar?",
    options: [
      { id: "bajo", label: "Hasta $ 20.000", icon: "$" },
      { id: "medio", label: "$ 20.000 a $ 35.000", icon: "$$" },
      { id: "alto", label: "Me doy un gusto", icon: "$$$" },
    ],
  },
] as const;

export type QuizAnswers = Partial<Record<(typeof quiz)[number]["id"], string>>;

/** Puntaje simple y explicable: maridaje + estilo + precio. */
export function recommend(a: QuizAnswers): Wine {
  const score = (w: Wine) => {
    let s = 0;
    if (a.con === "asado") s += w.type === "tinto" ? 3 + w.notes.cuerpo / 2 : -4;
    if (a.con === "pastas") s += w.type === "tinto" ? 3 - Math.abs(3 - w.notes.cuerpo) : 0;
    if (a.con === "pescado") s += w.type === "blanco" || w.type === "rosado" ? 4 : w.type === "espumante" ? 3 : -3;
    if (a.con === "solo") s += w.type === "espumante" || w.pick ? 2 : 0;
    if (a.estilo === "intenso") s += w.notes.cuerpo + w.notes.taninos / 2;
    if (a.estilo === "fresco") s += w.notes.acidez * 1.2;
    if (a.estilo === "suave") s += w.notes.fruta - w.notes.taninos / 2;
    const p = w.price;
    if (a.precio === "bajo") s += p <= 20000 ? 4 : -3;
    if (a.precio === "medio") s += p > 20000 && p <= 35000 ? 4 : -1;
    if (a.precio === "alto") s += p > 35000 ? 4 : 0;
    return s;
  };
  return [...wines].sort((x, y) => score(y) - score(x))[0];
}

/* ---------------- Viajes ---------------- */

export type Stop = { time: string; title: string; text: string; at: [number, number] };
export type Trip = {
  id: string;
  name: string;
  kicker: string;
  hours: string;
  price: number; // USD por persona
  min: number;
  img: string;
  video?: number;
  includes: string[];
  season?: string;
  stops: Stop[];
};

/** Lugares sobre el mapa estilizado (viewBox 100 × 120). */
export const PLACES: Record<string, [number, number]> = {
  ciudad: [66, 18],
  maipu: [80, 30],
  lujan: [62, 36],
  agrelo: [56, 47],
  perdriel: [66, 46],
  gualtallary: [36, 66],
  tupungato: [42, 72],
  chacayes: [34, 88],
  altamira: [44, 104],
  potrerillos: [40, 38],
};

export const trips: Trip[] = [
  {
    id: "uco",
    name: "Valle de Uco, día completo",
    kicker: "El clásico de altura",
    hours: "9 h",
    price: 190,
    min: 2,
    img: P.ucoRows,
    video: V.road,
    includes: ["Traslado ida y vuelta desde tu hotel", "3 bodegas con degustación", "Almuerzo de pasos con maridaje", "Guía sommelier bilingüe"],
    stops: [
      { time: "08:30", title: "Te buscamos", text: "Pick-up en tu hotel de Ciudad, Chacras o Luján.", at: PLACES.ciudad },
      { time: "10:00", title: "Gualtallary", text: "Primera bodega: Chardonnay y Malbec de 1.500 m, en el viñedo.", at: PLACES.gualtallary },
      { time: "12:00", title: "Los Chacayes", text: "Cava subterránea y cata de barricas.", at: PLACES.chacayes },
      { time: "13:30", title: "Almuerzo de pasos", text: "Cinco pasos con vinos de la casa y vista a la cordillera.", at: PLACES.tupungato },
      { time: "16:30", title: "Paraje Altamira", text: "Última parada: el Malbec más mineral del valle.", at: PLACES.altamira },
      { time: "18:30", title: "Vuelta al hotel", text: "Con las botellas que compraste, bien embaladas.", at: PLACES.ciudad },
    ],
  },
  {
    id: "bici",
    name: "Maipú y Luján en bici",
    kicker: "Pedaleando entre viñedos",
    hours: "6 h",
    price: 95,
    min: 2,
    img: P.toneles,
    video: V.sunshine,
    includes: ["Bicicleta, casco y candado", "2 bodegas + almacén de aceite de oliva", "Picada regional", "Van de apoyo"],
    stops: [
      { time: "10:00", title: "Base en Maipú", text: "Te damos la bici y el mapa de caminos rurales.", at: PLACES.maipu },
      { time: "10:45", title: "Bodega centenaria", text: "Toneles de roble de 1905 y cata de Bonarda.", at: [76, 34] },
      { time: "12:30", title: "Olivícola", text: "Aceites, aceitunas y una picada a la sombra.", at: [72, 40] },
      { time: "14:30", title: "Luján de Cuyo", text: "La van te acerca a la última bodega: Malbec de viñedo viejo.", at: PLACES.perdriel },
      { time: "16:00", title: "Vuelta", text: "Te dejamos en tu hotel.", at: PLACES.ciudad },
    ],
  },
  {
    id: "cabalgata",
    name: "Cabalgata y asado en la precordillera",
    kicker: "Atardecer gaucho",
    hours: "7 h",
    price: 160,
    min: 2,
    img: P.gaucho,
    video: V.arid,
    includes: ["Traslado desde tu hotel", "Cabalgata de 2 h con baqueano", "Asado al asador con vinos", "Apto principiantes"],
    stops: [
      { time: "14:00", title: "Salida", text: "Te buscamos por el hotel rumbo a Potrerillos.", at: PLACES.ciudad },
      { time: "15:30", title: "Puesto de montaña", text: "Mate, caballos criollos y charla de seguridad.", at: PLACES.potrerillos },
      { time: "16:00", title: "Cabalgata", text: "Dos horas por quebradas con vista al Cordón del Plata.", at: [32, 44] },
      { time: "18:30", title: "Asado al asador", text: "Cordero y vacío al fuego, con tintos de Luján.", at: PLACES.potrerillos },
      { time: "21:00", title: "Vuelta", text: "Bajamos con las estrellas.", at: PLACES.ciudad },
    ],
  },
  {
    id: "vendimia",
    name: "Vendimia: cosechá tu vino",
    kicker: "Solo de febrero a abril",
    hours: "5 h",
    price: 130,
    min: 1,
    img: P.vineMountain,
    video: V.harvest,
    season: "feb–abr",
    includes: ["Traslado desde tu hotel", "Cosecha en el viñedo con tijera y gamela", "Pisada y mosto", "Almuerzo en la finca + botella con tu nombre"],
    stops: [
      { time: "08:00", title: "Al viñedo", text: "Salimos temprano, antes del calor.", at: PLACES.ciudad },
      { time: "09:00", title: "Cosecha", text: "Tijera, gamela y racimos de Malbec en Agrelo.", at: PLACES.agrelo },
      { time: "11:00", title: "Bodega", text: "Seguís la uva: despalillado, pisada y primer mosto.", at: [58, 50] },
      { time: "12:30", title: "Almuerzo en la finca", text: "Y una botella etiquetada con tu nombre.", at: PLACES.agrelo },
    ],
  },
];

export const DAYS_AHEAD = 14;

/* ---------------- Calendario de la vid ---------------- */

export const seasons = [
  { months: "Jun–Ago", name: "Poda", text: "Viñedos dormidos, nieve en la cordillera. Ideal para catas en cava y fuegos.", tone: "#8aa0b0" },
  { months: "Sep–Nov", name: "Brotación", text: "Todo reverdece. Primavera de bici y picnic entre hileras.", tone: "#6b7a4b" },
  { months: "Dic–Ene", name: "Envero", text: "La uva cambia de color. Atardeceres eternos y blancos bien fríos.", tone: "#b5532f" },
  { months: "Feb–Abr", name: "Vendimia", text: "Cosecha, fiestas y bodegas a pleno. Temporada alta: reservá antes.", tone: "#5a1426" },
  { months: "May", name: "Otoño", text: "Viñedos dorados y rojos. El mes más lindo para fotos.", tone: "#c19a5b" },
] as const;

/* ---------------- Servicios ---------------- */

export const services = [
  { id: "catas", name: "Catas privadas", text: "En la boutique o en tu casa: un sommelier, seis vinos y una mesa para hasta 12 personas. Armamos la cata según el grupo.", from: "desde $ 38.000 por persona", img: P.tastingTable, video: V.pourGlass, points: ["6 vinos + quesos y fiambres", "Sommelier certificado", "En español, inglés o portugués"] },
  { id: "eventos", name: "Eventos y empresas", text: "Team building, lanzamientos y cenas de fin de año con estación de vinos, cata guiada o maridaje.", from: "a medida", img: P.toast, video: V.serveRed, points: ["De 10 a 200 personas", "Barra de vinos con servicio", "Logística resuelta"] },
  { id: "regalos", name: "Regalos empresariales", text: "Cajas de madera con grabado láser, tarjeta personalizada y envío a cada destinatario en todo el país.", from: "desde $ 42.000 por caja", img: P.gift, points: ["Grabado con tu logo", "Envíos masivos con seguimiento", "Factura A"] },
  { id: "envios", name: "Envíos a todo el país", text: "Embalaje especial para botellas y entrega en 24 a 72 h. Gratis desde 6 botellas.", from: "gratis desde 6 botellas", img: P.rack, video: V.corks, points: ["Embalaje anti-rotura", "Seguro incluido", "Retiro en boutique sin cargo"] },
  { id: "cursos", name: "Cursos de cata", text: "Cuatro encuentros para aprender a catar sin vueltas: vista, nariz, boca y cómo elegir un vino.", from: "$ 120.000 el curso", img: P.flight, points: ["Grupos de 12", "Material y vinos incluidos", "Certificado de asistencia"] },
  { id: "cavas", name: "Asesoría para cavas", text: "Armamos o renovamos la carta de vinos de tu restaurante, hotel o cava personal.", from: "a medida", img: P.cellarChalk, points: ["Selección por precio y estilo", "Capacitación al equipo", "Reposición programada"] },
] as const;

/* ---------------- Club ---------------- */

export const clubPlans = [
  { id: "descubrir", name: "Descubrir", bottles: 3, monthly: 45000, pitch: "Tres vinos nuevos por mes para empezar a conocer Mendoza.", features: ["3 botellas por mes", "Ficha de cata de cada vino", "10% en la tienda", "Envío gratis"] },
  { id: "altura", name: "Altura", bottles: 6, monthly: 82000, highlight: true, pitch: "Seis vinos de productores chicos, elegidos por nuestro sommelier.", features: ["6 botellas por mes", "Ficha de cata + maridaje", "15% en la tienda", "1 cata mensual en la boutique", "Prioridad en viajes de vendimia"] },
  { id: "reserva", name: "Reserva", bottles: 6, monthly: 140000, pitch: "Ediciones limitadas y vinos de guarda para coleccionistas.", features: ["6 botellas de alta gama", "Vinos que no llegan a góndola", "20% en la tienda", "2 catas mensuales", "1 viaje al año con 30% off"] },
] as const;

export const testimonials = [
  { name: "Camila", from: "Buenos Aires", text: "El viaje al Valle de Uco fue lo mejor de Mendoza. La guía sabía muchísimo y el almuerzo, increíble." },
  { name: "Thomas", from: "Hamburgo", text: "Perfect English, perfect wines. The horse ride at sunset was unforgettable." },
  { name: "Rodrigo", from: "Córdoba", text: "Hicimos el test del sommelier y le pegó: el Cabernet Franc es ahora mi vino favorito." },
  { name: "Juliana", from: "São Paulo", text: "Compramos 12 botellas y nos llegaron perfectas a Brasil por el envío internacional." },
  { name: "Martín", from: "Rosario", text: "Del club me encanta que todos los meses descubro una bodega chica que no conocía." },
];

export const faqs = [
  { q: "¿Envían a todo el país?", a: "Sí. Entregamos en 24 a 72 h con embalaje anti-rotura y seguro. El envío es gratis desde 6 botellas o con el Club." },
  { q: "¿Los viajes incluyen traslado?", a: "Todos incluyen pick-up y regreso a tu hotel en Ciudad, Chacras, Luján o Maipú. Nunca manejes después de una degustación." },
  { q: "¿Cuánto vino se sirve en las degustaciones?", a: "Cada bodega sirve entre 3 y 4 copas de 40 ml. En los almuerzos hay maridaje por paso. Siempre hay agua y opción sin alcohol." },
  { q: "¿Puedo cancelar un viaje?", a: "Sí, sin cargo hasta 48 h antes. Si llueve o hay viento zonda reprogramamos sin costo." },
  { q: "¿Cómo me doy de baja del Club?", a: "Desde el botón de baja al pie de cualquier página, sin llamar. La baja corta el próximo envío." },
  { q: "¿Venden a menores?", a: "No. Pedimos confirmar mayoría de edad y al entregar se verifica el DNI del receptor (Ley 24.788)." },
];
