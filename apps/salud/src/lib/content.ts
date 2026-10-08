export const img = (id: string, w = 1200, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;

export type SpecialtyId = "estetica" | "odontologia" | "kinesiologia" | "depilacion" | "dermatologia";

export const specialties: { id: SpecialtyId; name: string; short: string; color: string }[] = [
  { id: "estetica", name: "Medicina estética", short: "Estética", color: "#f3a78c" },
  { id: "odontologia", name: "Odontología", short: "Odontología", color: "#7fd6c7" },
  { id: "kinesiologia", name: "Kinesiología", short: "Kinesio", color: "#9db8ff" },
  { id: "depilacion", name: "Depilación láser", short: "Láser", color: "#f6c76f" },
  { id: "dermatologia", name: "Dermatología", short: "Dermato", color: "#d4a5e8" },
];

/** Etapas del modelo 3D del hero (una forma por especialidad). */
export const heroStages = [
  {
    shape: "body",
    kicker: "Alba · Salud y estética",
    title: "Tu cuerpo, entendido.",
    text: "Cinco especialidades en un mismo lugar, con profesionales que trabajan juntos sobre tu caso.",
  },
  {
    shape: "face",
    kicker: "Medicina estética y dermatología",
    title: "Resultados naturales.",
    text: "Toxina, rellenos, bioestimuladores y cuidado de la piel con diagnóstico previo y seguimiento.",
  },
  {
    shape: "tooth",
    kicker: "Odontología",
    title: "Una sonrisa sana, primero.",
    text: "Implantes, ortodoncia invisible y blanqueamiento con planificación digital 3D.",
  },
  {
    shape: "spine",
    kicker: "Kinesiología",
    title: "Moverte sin dolor.",
    text: "Rehabilitación, deportología y columna con planes que seguís también desde tu casa.",
  },
  {
    shape: "skin",
    kicker: "Depilación láser",
    title: "Piel suave, para siempre.",
    text: "Láser diodo de triple longitud de onda, apto para todo tipo de piel, todo el año.",
  },
] as const;

export type Zone = {
  id: string;
  name: string;
  /** Posición en la silueta (viewBox 0 0 200 440). */
  x: number;
  y: number;
  treatments: { name: string; sessions: string; time: string; from: number; specialty: SpecialtyId }[];
};

export const zones: Zone[] = [
  {
    id: "rostro",
    name: "Rostro",
    x: 100,
    y: 38,
    treatments: [
      { name: "Toxina botulínica", sessions: "1 sesión", time: "30 min", from: 180000, specialty: "estetica" },
      { name: "Ácido hialurónico", sessions: "1 sesión", time: "45 min", from: 260000, specialty: "estetica" },
      { name: "Peeling químico", sessions: "3 a 4", time: "40 min", from: 75000, specialty: "dermatologia" },
    ],
  },
  {
    id: "boca",
    name: "Sonrisa",
    x: 100,
    y: 60,
    treatments: [
      { name: "Blanqueamiento LED", sessions: "1 a 2", time: "60 min", from: 120000, specialty: "odontologia" },
      { name: "Ortodoncia invisible", sessions: "12 a 18 meses", time: "Controles mensuales", from: 1900000, specialty: "odontologia" },
      { name: "Implante dental", sessions: "2 etapas", time: "90 min", from: 950000, specialty: "odontologia" },
    ],
  },
  {
    id: "cuello",
    name: "Cuello y cervicales",
    x: 100,
    y: 86,
    treatments: [
      { name: "Kinesiología cervical", sessions: "8 a 10", time: "45 min", from: 25000, specialty: "kinesiologia" },
      { name: "Bioestimuladores", sessions: "2", time: "40 min", from: 290000, specialty: "estetica" },
    ],
  },
  {
    id: "axilas",
    name: "Axilas",
    x: 66,
    y: 128,
    treatments: [{ name: "Depilación láser axilas", sessions: "6 a 8", time: "10 min", from: 18000, specialty: "depilacion" }],
  },
  {
    id: "abdomen",
    name: "Abdomen",
    x: 100,
    y: 175,
    treatments: [
      { name: "Radiofrecuencia corporal", sessions: "6 a 10", time: "40 min", from: 42000, specialty: "estetica" },
      { name: "Láser línea alba", sessions: "6 a 8", time: "10 min", from: 15000, specialty: "depilacion" },
    ],
  },
  {
    id: "espalda",
    name: "Columna lumbar",
    x: 138,
    y: 200,
    treatments: [
      { name: "RPG / reeducación postural", sessions: "10", time: "60 min", from: 32000, specialty: "kinesiologia" },
      { name: "Ondas de choque", sessions: "4 a 6", time: "20 min", from: 38000, specialty: "kinesiologia" },
    ],
  },
  {
    id: "rodilla",
    name: "Rodilla",
    x: 82,
    y: 318,
    treatments: [
      { name: "Rehabilitación de LCA", sessions: "20 a 30", time: "60 min", from: 28000, specialty: "kinesiologia" },
      { name: "Magnetoterapia", sessions: "10", time: "30 min", from: 18000, specialty: "kinesiologia" },
    ],
  },
  {
    id: "piernas",
    name: "Piernas",
    x: 120,
    y: 370,
    treatments: [
      { name: "Depilación láser piernas", sessions: "6 a 8", time: "40 min", from: 55000, specialty: "depilacion" },
      { name: "Escleroterapia", sessions: "2 a 4", time: "30 min", from: 90000, specialty: "dermatologia" },
    ],
  },
];

export type Pro = {
  id: string;
  name: string;
  title: string;
  specialty: SpecialtyId;
  mn: string;
  photo: string;
  rating: number;
  reviews: number;
  bio: string;
  next: string;
};

export const pros: Pro[] = [
  {
    id: "valeria",
    name: "Dra. Valeria Sosa",
    title: "Medicina estética",
    specialty: "estetica",
    mn: "MN 112.540",
    photo: "1651008376811-b90baee60c1f",
    rating: 4.9,
    reviews: 312,
    bio: "Especialista en armonización facial con enfoque natural. Docente de la Sociedad Argentina de Medicina Estética.",
    next: "Mañana 10:30",
  },
  {
    id: "lucia",
    name: "Dra. Lucía Ferraro",
    title: "Odontología · Ortodoncia",
    specialty: "odontologia",
    mn: "MN 41.208",
    photo: "1594824476967-48c8b964273f",
    rating: 4.9,
    reviews: 268,
    bio: "Ortodoncia invisible y planificación digital de sonrisa. 12 años de experiencia.",
    next: "Hoy 18:00",
  },
  {
    id: "tomas",
    name: "Dr. Tomás Ibarra",
    title: "Odontología · Implantes",
    specialty: "odontologia",
    mn: "MN 38.977",
    photo: "1612531386530-97286d97c2d2",
    rating: 4.8,
    reviews: 190,
    bio: "Cirugía guiada e implantes de carga inmediata. Formación en Italia y Brasil.",
    next: "Jueves 09:00",
  },
  {
    id: "martin",
    name: "Lic. Martín Quiroga",
    title: "Kinesiología deportiva",
    specialty: "kinesiologia",
    mn: "MN 9.814",
    photo: "1622253692010-333f2da6031d",
    rating: 5,
    reviews: 405,
    bio: "Rehabilitación de rodilla y hombro. Kinesiólogo de un club de primera división.",
    next: "Mañana 08:15",
  },
  {
    id: "ana",
    name: "Dra. Ana Medina",
    title: "Dermatología",
    specialty: "dermatologia",
    mn: "MN 97.331",
    photo: "1559839734-2b71ea197ec2",
    rating: 4.9,
    reviews: 221,
    bio: "Dermatología clínica y estética. Control de lunares con dermatoscopía digital.",
    next: "Viernes 11:45",
  },
  {
    id: "julian",
    name: "Dr. Julián Pereyra",
    title: "Láser y medicina estética",
    specialty: "depilacion",
    mn: "MN 120.115",
    photo: "1612349317150-e413f6a5b16d",
    rating: 4.8,
    reviews: 158,
    bio: "Director del área de láser. Protocolos personalizados por fototipo.",
    next: "Hoy 16:30",
  },
];

export const photos = {
  clinic: "1519494026892-80bbd2d6fd0d",
  dentalRoom: "1629909613654-28e377c37b09",
  dentalChair: "1598256989800-fe5f95da9787",
  facial: "1570172619644-dfd03ed5d881",
  skincare: "1616394584738-fc6e612e71b9",
  laser: "1620331311520-246422fd82f9",
  physioMat: "1571019613454-1cb2f99b2d8b",
  physioGym: "1597452485669-2c7bb5fef90d",
  consult: "1666214280557-f1b5022eb634",
  patientA: "1580489944761-15a19d654956",
  patientB: "1573496359142-b8d87734a5a2",
};

export const testimonials = [
  {
    quote: "Llegué por un dolor de rodilla y en seis semanas volví a correr. Las rutinas en video para casa hicieron la diferencia.",
    name: "Carolina M.",
    detail: "Kinesiología",
    photo: photos.patientA,
  },
  {
    quote: "Me explicaron todo con el modelo 3D de mi boca antes de empezar. Cero sorpresas en el presupuesto.",
    name: "Diego R.",
    detail: "Implantes",
    photo: "1582750433449-648ed127bb54",
  },
  {
    quote: "Resultados súper naturales. Nadie nota que me hice algo, solo me dicen que me ven descansada.",
    name: "Paula G.",
    detail: "Medicina estética",
    photo: photos.patientB,
  },
];

export const faqs = [
  { q: "¿Atienden por obra social o prepaga?", a: "Sí. Trabajamos con las principales prepagas y obras sociales en kinesiología, odontología y dermatología clínica. Los tratamientos estéticos son particulares, con hasta 6 cuotas sin interés." },
  { q: "¿La primera consulta tiene costo?", a: "La evaluación inicial de estética y de láser es sin cargo. En odontología incluye escaneo intraoral 3D y plan de tratamiento." },
  { q: "¿Puedo cambiar o cancelar mi turno?", a: "Sí, desde el link del recordatorio de WhatsApp hasta 12 h antes, sin costo." },
  { q: "¿El láser sirve para piel oscura?", a: "Nuestro equipo diodo de triple onda es apto para fototipos I a VI. El protocolo se ajusta en la primera sesión con una prueba de tolerancia." },
  { q: "¿Tienen estacionamiento?", a: "Sí, convenio con el estacionamiento de la esquina: 2 horas sin cargo con tu turno." },
];

export const coverage = ["Particular", "Prepagas", "Obras sociales", "Hasta 6 cuotas sin interés", "Mercado Pago", "Transferencia"];
