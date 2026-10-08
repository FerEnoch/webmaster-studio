/** Videos libres de Mixkit (720p) y fotos de Unsplash, verificados. */
export const video = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
export const poster = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`;
export const img = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;

export const V = {
  ropes: 52079, // cuerdas de combate (hero)
  ropes2: 52317,
  lunges: 52112,
  ball: 52104,
  box: 40246,
  pushups: 40248,
  rope: 23056,
  climbers: 726,
  sledge: 23955,
  bars: 23450,
  boxing: 45874,
  run: 40881,
  yoga: 4420,
  stretch: 780,
};

export const brand = {
  name: "NÚCLEO",
  tagline: "Entrenar acá se siente distinto.",
  whatsapp: "+54 11 6000 0000",
  rating: 4.9,
  reviews: 1284,
};

export const stats = [
  { value: 3, suffix: "", label: "Sedes en CABA" },
  { value: 1800, suffix: " m²", label: "Para entrenar" },
  { value: 64, suffix: "", label: "Clases por semana" },
  { value: 4.9, suffix: "★", label: `${1284} reseñas en Google` },
];

export const sedes = [
  { id: "palermo", name: "Palermo", address: "Godoy Cruz 1650", hours: "Lun a vie 6–23 · Sáb y dom 8–20", m2: 800, img: "1778828494354-9b717d36dc99" },
  { id: "belgrano", name: "Belgrano", address: "Av. Cabildo 2240", hours: "Lun a vie 6–23 · Sáb 8–20", m2: 550, img: "1637430308606-86576d8fef3c" },
  { id: "nunez", name: "Núñez", address: "Av. del Libertador 7300", hours: "Lun a vie 6–22 · Sáb 9–18", m2: 450, img: "1623874514711-0f321325f318" },
];

/** Recorrido del club: una zona por paso. `plan` = rectángulo en el plano (viewBox 0 0 100 60). */
export type Zone = {
  id: string;
  name: string;
  kicker: string;
  text: string;
  facts: string[];
  img: string;
  video?: number;
  plan: [number, number, number, number];
};

export const zones: Zone[] = [
  {
    id: "entrada",
    name: "Entrada",
    kicker: "01 — Llegás",
    text: "Recepción sin filas: entrás con el celular y te recibe alguien que sabe tu nombre.",
    facts: ["Acceso con QR", "Café de especialidad", "Lockers inteligentes"],
    img: "1648235692910-947cb90ddd97",
    plan: [2, 40, 22, 18],
  },
  {
    id: "fuerza",
    name: "Sala de fuerza",
    kicker: "02 — Fuerza",
    text: "Racks olímpicos, plataformas de levantamiento y mancuernas hasta 50 kg. Espacio para que nadie espere.",
    facts: ["12 racks olímpicos", "Mancuernas hasta 50 kg", "320 m²"],
    img: "1637430308606-86576d8fef3c",
    video: V.ropes2,
    plan: [2, 2, 46, 36],
  },
  {
    id: "funcional",
    name: "Estudio funcional",
    kicker: "03 — Funcional",
    text: "Techo alto, piso deportivo y todo lo que necesitás para clases de alta intensidad.",
    facts: ["Clases de hasta 16 personas", "Sled track de 20 m", "Música en vivo los viernes"],
    img: "1623874514711-0f321325f318",
    video: V.ball,
    plan: [50, 2, 28, 26],
  },
  {
    id: "cycling",
    name: "Estudio de cycling",
    kicker: "04 — Ritmo",
    text: "Luces, sonido envolvente y bicis con métricas en tiempo real. Una fiesta que suda.",
    facts: ["32 bicis conectadas", "Sonido envolvente", "Ranking en pantalla"],
    img: "1637870473618-8c9fa7d11f0a",
    plan: [80, 2, 18, 26],
  },
  {
    id: "pilates",
    name: "Pilates reformer",
    kicker: "05 — Control",
    text: "Luz natural, reformers de madera y grupos reducidos para que el instructor te corrija de verdad.",
    facts: ["10 reformers", "Máximo 10 personas", "Instructores certificados"],
    img: "1754258167278-4a91a38a4bd9",
    plan: [50, 30, 22, 16],
  },
  {
    id: "vestuarios",
    name: "Vestuarios",
    kicker: "06 — Pausa",
    text: "Madera, toallas incluidas y duchas que no te hacen esperar. El final que te merecés.",
    facts: ["Toallas incluidas", "Secadores Dyson", "Amenities de cortesía"],
    img: "1781274326569-7120016a6c7e",
    plan: [26, 40, 22, 18],
  },
  {
    id: "recuperacion",
    name: "Recuperación",
    kicker: "07 — Volvé mejor",
    text: "Botas de compresión, pistolas de masaje y zona de movilidad para que mañana puedas volver.",
    facts: ["Botas de compresión", "Zona de movilidad", "Nutricionista los sábados"],
    img: "1771270786606-f5a0e57db762",
    plan: [74, 30, 24, 28],
  },
];

export type Discipline = {
  id: string;
  name: string;
  short: string;
  level: string;
  duration: number;
  kcal: string;
  text: string;
  video?: number;
  img: string;
  color: string;
};

export const disciplines: Discipline[] = [
  { id: "fuerza", name: "Fuerza", short: "Fuerza", level: "Todos los niveles", duration: 60, kcal: "350–500", text: "Técnica primero, carga después. Programas de 6 semanas con progresión medida.", video: V.lunges, img: "1556817411-31ae72fa3ea0", color: "#ff3b2f" },
  { id: "hiit", name: "HIIT Funcional", short: "HIIT", level: "Intermedio", duration: 45, kcal: "500–700", text: "Intervalos, cajones, kettlebells y cuerdas. Te vas vacío y contento.", video: V.box, img: "1536922246289-88c42f957773", color: "#ff8a2f" },
  { id: "cycling", name: "Cycling", short: "Cycling", level: "Todos los niveles", duration: 45, kcal: "450–650", text: "Música fuerte, luces bajas y métricas en vivo. El ritmo te lleva.", img: "1637870473618-8c9fa7d11f0a", color: "#ff2f6d" },
  { id: "pilates", name: "Pilates Reformer", short: "Reformer", level: "Todos los niveles", duration: 50, kcal: "250–400", text: "Control, postura y core profundo en grupos de hasta 10 personas.", img: "1754258166816-0075fe0132ce", color: "#c8a46a" },
  { id: "boxeo", name: "Boxeo", short: "Boxeo", level: "Principiante", duration: 50, kcal: "500–800", text: "Técnica real de boxeo, sin contacto. Descarga garantizada.", video: V.boxing, img: "1601422407692-ec4eeec1d9b3", color: "#d6d1c4" },
  { id: "movilidad", name: "Movilidad", short: "Movilidad", level: "Todos los niveles", duration: 40, kcal: "150–250", text: "Para que tu cuerpo acompañe todo lo demás. Ideal después de fuerza.", video: V.stretch, img: "1761971975962-9cc397e2ba2a", color: "#8fb8a8" },
];

export type Coach = {
  id: string;
  name: string;
  role: string;
  disciplines: string[];
  certs: string[];
  quote: string;
  photo: string;
  video: number;
};

export const coaches: Coach[] = [
  { id: "tomas", name: "Tomás Ferrari", role: "Head coach · Fuerza", disciplines: ["fuerza"], certs: ["NSCA-CSCS", "Halterofilia nivel 2"], quote: "Si la técnica está bien, el resto llega solo.", photo: "1704223523169-52feeed90365", video: V.pushups },
  { id: "sofia", name: "Sofía Arce", role: "HIIT Funcional", disciplines: ["hiit"], certs: ["CrossFit L2", "Kettlebell RKC"], quote: "Nadie entrena solo en mi clase.", photo: "1539794830467-1f1755804d13", video: V.box },
  { id: "lucia", name: "Lucía Benítez", role: "Pilates Reformer", disciplines: ["pilates", "movilidad"], certs: ["Balanced Body", "Kinesióloga"], quote: "Controlar el movimiento es lo más difícil y lo más lindo.", photo: "1534438327276-14e5300c3a48", video: V.stretch },
  { id: "nico", name: "Nicolás Ríos", role: "Boxeo", disciplines: ["boxeo"], certs: ["Ex boxeador amateur", "Entrenador FAB"], quote: "Se entra con estrés, se sale liviano.", photo: "1584466977773-e625c37cdd50", video: V.boxing },
  { id: "agus", name: "Agustina Paz", role: "Cycling · HIIT", disciplines: ["cycling", "hiit"], certs: ["Schwinn Cycling", "Nutrición deportiva"], quote: "Subí el volumen y dejá todo en la bici.", photo: "1579758629938-03607ccdbaba", video: V.climbers },
  { id: "martin", name: "Martín Gil", role: "Personal trainer", disciplines: ["fuerza", "movilidad"], certs: ["Lic. en Educación Física", "Readaptación de lesiones"], quote: "Un plan hecho para vos, no para el promedio.", photo: "1648542036561-e1d66a5ae2b1", video: V.bars },
];

/** Grilla semanal determinística (misma "disponibilidad" en cada render). */
export type Slot = {
  id: string;
  day: number; // 0 = lunes
  time: string;
  discipline: string;
  coach: string;
  sede: string;
  capacity: number;
  booked: number;
};

const TIMES = ["07:00", "08:00", "09:30", "12:30", "18:00", "19:00", "20:00", "21:00"];

export const schedule: Slot[] = (() => {
  const out: Slot[] = [];
  let seed = 7;
  const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let day = 0; day < 6; day++) {
    for (const time of TIMES) {
      if (day === 5 && Number(time.slice(0, 2)) > 13) continue;
      const count = r() < 0.55 ? 2 : 1;
      for (let k = 0; k < count; k++) {
        const d = disciplines[Math.floor(r() * disciplines.length)];
        const options = coaches.filter((c) => c.disciplines.includes(d.id));
        const coach = options[Math.floor(r() * options.length)];
        const sede = sedes[Math.floor(r() * sedes.length)];
        const capacity = d.id === "pilates" ? 10 : d.id === "cycling" ? 32 : 16;
        const peak = ["07:00", "18:00", "19:00", "20:00"].includes(time);
        const booked = Math.min(capacity, Math.round(capacity * (peak ? 0.6 + r() * 0.4 : 0.15 + r() * 0.5)));
        out.push({ id: `${day}-${time}-${k}`, day, time, discipline: d.id, coach: coach.id, sede: sede.id, capacity, booked });
      }
    }
  }
  return out;
})();

export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/** Aforo promedio por hora (0..1) para "¿Cuándo hay menos gente?". */
export const crowd: { hour: number; level: number }[] = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
].map((hour) => ({
  hour,
  level:
    {
      6: 0.35, 7: 0.78, 8: 0.62, 9: 0.4, 10: 0.28, 11: 0.22, 12: 0.45, 13: 0.5, 14: 0.25,
      15: 0.2, 16: 0.3, 17: 0.55, 18: 0.88, 19: 0.95, 20: 0.82, 21: 0.5, 22: 0.25,
    }[hour] ?? 0.3,
}));

export type Plan = {
  id: string;
  name: string;
  monthly: number;
  pitch: string;
  features: string[];
  highlight?: boolean;
};

export const plans: Plan[] = [
  {
    id: "esencial",
    name: "Esencial",
    monthly: 42000,
    pitch: "Sala de fuerza y cardio, a tu ritmo.",
    features: ["Sala de fuerza y cardio", "1 sede", "App con tu plan", "Evaluación inicial"],
  },
  {
    id: "ilimitado",
    name: "Ilimitado",
    monthly: 68000,
    pitch: "Todas las clases, todas las sedes.",
    features: ["Clases ilimitadas", "Las 3 sedes", "Reserva con 7 días de anticipación", "Toallas incluidas", "Evaluación cada 6 semanas"],
    highlight: true,
  },
  {
    id: "club",
    name: "Club+",
    monthly: 98000,
    pitch: "La experiencia completa.",
    features: ["Todo lo de Ilimitado", "4 sesiones de personal trainer", "Zona de recuperación", "Nutricionista", "Invitado gratis 2 veces por mes"],
  },
];

export const periods = [
  { id: "mensual", label: "Mensual", months: 1, discount: 0 },
  { id: "trimestral", label: "Trimestral", months: 3, discount: 0.1 },
  { id: "anual", label: "Anual", months: 12, discount: 0.22 },
] as const;

export const paths = [
  { id: "fuerza", title: "Quiero ponerme fuerte", text: "Ganar fuerza y músculo con técnica.", discipline: "fuerza", plan: "ilimitado" },
  { id: "peso", title: "Quiero bajar de peso", text: "Quemar más, sin aburrirme.", discipline: "hiit", plan: "ilimitado" },
  { id: "bienestar", title: "Quiero sentirme mejor", text: "Postura, movilidad y menos estrés.", discipline: "pilates", plan: "esencial" },
];

export const testimonials = [
  { quote: "Vine por una clase de prueba y a la semana ya conocía a medio box. Nunca me había pasado en un gimnasio.", name: "Carla M.", since: "Socia desde 2024", img: "1580489944761-15a19d654956" },
  { quote: "Los coaches te corrigen de verdad. En seis meses mejoré más que en tres años entrenando solo.", name: "Diego R.", since: "Socio desde 2023", img: "1571019614242-c5c5dee9f50b" },
  { quote: "Me di de baja por un viaje con un clic y volví sin trámites. Así tiene que ser.", name: "Paula G.", since: "Socia desde 2022", img: "1573496359142-b8d87734a5a2" },
];

export const faqs = [
  { q: "Nunca entrené. ¿Es para mí?", a: "Sí. Todas las clases tienen opciones por nivel y en tu primera visita un coach te hace una evaluación y te recomienda por dónde empezar." },
  { q: "¿Qué tengo que llevar?", a: "Ropa cómoda, zapatillas y una botella. Toallas, candado y amenities los ponemos nosotros." },
  { q: "¿Hay permanencia o matrícula?", a: "No. Pagás mes a mes (o trimestral/anual con descuento) y te das de baja cuando quieras desde el botón de baja de la web." },
  { q: "¿Puedo congelar mi plan?", a: "Sí, hasta 30 días por año por viaje o lesión, sin costo." },
  { q: "¿Cómo me doy de baja?", a: "Con el botón \"Dar de baja mi membresía\" que está al pie de cada página. Sin llamadas ni formularios eternos." },
];

export const marquee = ["Primera clase gratis", "Sin permanencia", "3 sedes", "64 clases por semana", "Toallas incluidas", "Coaches certificados"];
