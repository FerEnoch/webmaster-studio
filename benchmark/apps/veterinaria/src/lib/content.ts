/* Contenido de MANADA — clínica veterinaria ficticia (plantilla de demostración). */

export const video = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
export const poster = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`;
export const img = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

/** Videos Mixkit (verificados HTTP 200). */
export const V = {
  ears: 48986, // veterinario revisa orejas de un ovejero
  firstVax: 48987, // cachorro, primeras vacunas
  vaccine: 21465,
  visit: 15172,
  injection: 14978,
  groomCut: 45883,
  groomBrush: 45884,
  groomTrim: 45890,
  claws: 45891,
  bath: 1665,
  wetDog: 33103,
  relaxDog: 33101,
  groomer: 1662,
  puppies: 48739,
  catPet: 47711,
  catBelly: 26150,
  catOwner: 1779,
  kittens: 32282,
  bunny: 45522,
  hedgehog: 24813,
  ownerDog: 1658,
  grandmaCat: 12529,
  puppyBed: 16619,
  labrador: 17123,
  lick: 24979,
} as const;

/** Fotos Unsplash (verificadas HTTP 200 y revisadas a ojo). */
export const P = {
  exam: "1770836037289-e00e5f351d11",
  inject: "1770836037275-38b44e4b101f",
  dachs: "1770836037793-95bdbf190f71",
  loupe: "1770836037816-4445dbd449fd",
  teeth: "1770836037949-c5e8db65aa86",
  echo: "1770836037183-e0b4471fe2c0",
  kittenExam: "1725409796872-8b41e8eca929",
  catExam: "1733783506192-653df6185a7d",
  vetCat: "1628009368231-7bb7cfcb0def",
  catHold: "1596272875729-ed2ff7d6d9c5",
  teamDog: "1700665537604-412e89a285c3",
  teamDog2: "1700665537650-1bf37979aae0",
  chihuahua: "1654895716780-b4664497420d",
  kitten: "1728013274420-ed02b1f58887",
  dra1: "1623854767648-e7bb8009f0db",
  dra2: "1678695972687-033fa0bdbac9",
  dra3: "1757125736482-328a3cdd9743",
  dra4: "1643297654416-05795d62e39c",
  or: "1551076805-e1869033e561",
  surgery: "1758653500348-5944e186ab1d",
  lab: "1602052577122-f73b9710adba",
  steth: "1763070282954-c6f7c27d6ffa",
  cone: "1788044908314-6a11871f9de4",
  turtle: "1692314896200-dad04cbd1dd5",
  waiting: "1629909614456-6b1c5c94cecc",
  reception: "1581982231900-6a1a46b744c9",
  lounge: "1787496994323-59ac5cff09f9",
  lobby: "1608979827489-2b855e79debe",
  dogPink: "1561037404-61cd46aa615b",
  dogRun: "1534361960057-19889db9621e",
  corgi: "1537151608828-ea2b11777ee8",
  cavalier: "1560807707-8cc77767d783",
  pomTowel: "1611173622933-91942d394b04",
  groomCut: "1719464454959-9cf304ef4774",
  catSide: "1515002246390-7bf7e8f87b54",
  catPet: "1513360371669-4adf3dd7dff8",
  catTabby: "1550606873-e09a0d1a5a93",
  rabbit: "1535241749838-299277b6305f",
  rabbit2: "1529040181623-e04ebc611e25",
  bulldog: "1597595735781-6a57fb8e3e3d",
} as const;

export const brand = {
  name: "MANADA",
  tagline: "Clínica veterinaria. Donde tu mascota viene tranquila.",
  phone: "11 4000-2400",
  phoneHref: "tel:+541140002400",
  whatsapp: "11 5000-2400",
  rating: 4.9,
  reviews: 2316,
  director: "Dra. Valeria Sosa · M.P. 0000 (demo)",
};

export const sedes = [
  {
    id: "belgrano",
    name: "Belgrano",
    address: "Av. Cabildo 2450, CABA",
    hours: "Guardia 24 h · los 365 días",
    always: true,
    img: P.lobby,
    m2: 620,
  },
  {
    id: "palermo",
    name: "Palermo",
    address: "Gorriti 4870, CABA",
    hours: "Lun a sáb · 8 a 21 h",
    always: false,
    img: P.reception,
    m2: 280,
  },
] as const;

export type Species = "perro" | "gato" | "exotico";
export const SPECIES: { id: Species; name: string; plural: string }[] = [
  { id: "perro", name: "Perro", plural: "Perros" },
  { id: "gato", name: "Gato", plural: "Gatos" },
  { id: "exotico", name: "Exótico", plural: "Exóticos" },
];

export type Service = {
  id: string;
  name: string;
  short: string;
  text: string;
  from: number;
  minutes: number;
  img: string;
  video?: number;
  points: string[];
};

export const services: Service[] = [
  {
    id: "consulta",
    name: "Consulta clínica",
    short: "Consulta",
    text: "30 minutos reales con tu veterinario: revisión completa, sin apuro y con todo explicado en criollo.",
    from: 28000,
    minutes: 30,
    img: P.exam,
    video: V.ears,
    points: ["Revisión de cabeza a cola", "Historia clínica digital", "Resumen por WhatsApp"],
  },
  {
    id: "vacunas",
    name: "Vacunas y desparasitación",
    short: "Vacunas",
    text: "Plan de vacunación a medida de su edad y su vida. Te avisamos cuando se acerca cada refuerzo.",
    from: 19500,
    minutes: 20,
    img: P.inject,
    video: V.firstVax,
    points: ["Libreta sanitaria al día", "Recordatorios automáticos", "Antirrábica con certificado"],
  },
  {
    id: "cirugia",
    name: "Castración y cirugía",
    short: "Cirugía",
    text: "Quirófano con monitoreo multiparamétrico, anestesia inhalatoria y recuperación acompañada.",
    from: 145000,
    minutes: 120,
    img: P.or,
    points: ["Prequirúrgico incluido", "Anestesia inhalatoria", "Te mandamos fotos del post"],
  },
  {
    id: "odonto",
    name: "Odontología",
    short: "Odontología",
    text: "Limpieza con ultrasonido, extracciones y control del sarro: la boca también es salud.",
    from: 89000,
    minutes: 60,
    img: P.teeth,
    points: ["Ultrasonido y pulido", "Radiografía dental", "Plan de cuidado en casa"],
  },
  {
    id: "imagenes",
    name: "Ecografía y rayos",
    short: "Imágenes",
    text: "Ecografía y radiología digital en la clínica: resultados el mismo día, sin derivarte.",
    from: 42000,
    minutes: 40,
    img: P.echo,
    points: ["Informe el mismo día", "Equipos digitales", "Sin sedación cuando se puede"],
  },
  {
    id: "laboratorio",
    name: "Laboratorio",
    short: "Laboratorio",
    text: "Análisis de sangre, orina y materia fecal en nuestro propio laboratorio, en menos de una hora.",
    from: 24000,
    minutes: 15,
    img: P.lab,
    points: ["Resultados en < 1 hora", "Perfil senior completo", "Te llegan al celular"],
  },
  {
    id: "internacion",
    name: "Internación",
    short: "Internación",
    text: "Boxes separados para perros y gatos, monitoreo 24 h y partes diarios con foto y video.",
    from: 98000,
    minutes: 1440,
    img: P.cone,
    points: ["Veterinario las 24 h", "Parte diario con video", "Visitas con horario"],
  },
  {
    id: "peluqueria",
    name: "Peluquería y baño",
    short: "Peluquería",
    text: "Baño, corte y uñas con productos hipoalergénicos y mucha paciencia. Sin jaulas ni secadores ruidosos.",
    from: 22000,
    minutes: 90,
    img: P.groomCut,
    video: V.groomTrim,
    points: ["Productos hipoalergénicos", "Secado silencioso", "Te avisamos al terminar"],
  },
];

export type Vet = {
  id: string;
  name: string;
  role: string;
  quote: string;
  photo: string;
  video: number;
  services: string[];
  species: Species[];
  certs: string[];
};

export const vets: Vet[] = [
  {
    id: "sosa",
    name: "Dra. Valeria Sosa",
    role: "Directora · Clínica general",
    quote: "Una consulta sin apuro detecta lo que un apuro no ve.",
    photo: P.dra3,
    video: V.ears,
    services: ["consulta", "vacunas"],
    species: ["perro", "gato"],
    certs: ["Medicina interna (UBA)", "Fear Free Certified"],
  },
  {
    id: "rios",
    name: "Dra. Julieta Ríos",
    role: "Medicina felina",
    quote: "Los gatos no son perros chiquitos: tienen su propio consultorio.",
    photo: P.vetCat,
    video: V.catPet,
    services: ["consulta", "vacunas"],
    species: ["gato"],
    certs: ["Cat Friendly Clinic (ISFM)", "Nefrología felina"],
  },
  {
    id: "ocampo",
    name: "Dr. Martín Ocampo",
    role: "Odontología",
    quote: "La mitad de los perros de 3 años tiene un problema dental y nadie lo nota.",
    photo: P.loupe,
    video: V.ears,
    services: ["odonto"],
    species: ["perro", "gato"],
    certs: ["Odontología veterinaria", "Cirugía oral"],
  },
  {
    id: "aguirre",
    name: "Dr. Tomás Aguirre",
    role: "Cirugía y traumatología",
    quote: "Antes de operar, te explico todo con dibujos si hace falta.",
    photo: P.dachs,
    video: V.visit,
    services: ["cirugia"],
    species: ["perro", "gato"],
    certs: ["Cirugía de tejidos blandos", "Traumatología"],
  },
  {
    id: "duarte",
    name: "Dra. Camila Duarte",
    role: "Diagnóstico por imágenes",
    quote: "Una buena ecografía te ahorra semanas de dudas.",
    photo: P.dra2,
    video: V.injection,
    services: ["imagenes", "laboratorio"],
    species: ["perro", "gato", "exotico"],
    certs: ["Ecografía abdominal", "Cardiología"],
  },
  {
    id: "herrera",
    name: "Dra. Lucía Herrera",
    role: "Exóticos y pequeños mamíferos",
    quote: "Conejos, hurones, tortugas: todos merecen un especialista.",
    photo: P.dra1,
    video: V.bunny,
    services: ["consulta", "vacunas"],
    species: ["exotico"],
    certs: ["Medicina de exóticos", "Nutrición de conejos"],
  },
];

/** Zonas de la clínica (sede Belgrano). plan = [x, y, w, h] en un viewBox de 100 × 60. */
export const rooms = [
  {
    id: "recepcion",
    name: "Recepción",
    kicker: "01 — Llegás",
    text: "Te reciben por tu nombre y el de tu mascota. Check-in con el celular: nada de planillas.",
    facts: ["Check-in por QR", "Balanza a la entrada", "Agua y premios"],
    img: P.lobby,
    plan: [0, 0, 34, 22] as const,
  },
  {
    id: "espera",
    name: "Salas de espera",
    kicker: "02 — Esperás tranquilo",
    text: "Una sala para perros y otra para gatos, con entradas separadas. Menos ladridos, menos estrés.",
    facts: ["Sala felina aparte", "Feromonas calmantes", "Demora en pantalla"],
    img: P.waiting,
    plan: [0, 22, 34, 20] as const,
  },
  {
    id: "consultorio",
    name: "Consultorios",
    kicker: "03 — La consulta",
    text: "Cuatro consultorios con mesa calefaccionada y luz cálida. 30 minutos por turno, sin apuro.",
    facts: ["Mesa calefaccionada", "Turnos de 30 min", "Premios en cada paso"],
    img: P.exam,
    video: V.ears,
    plan: [34, 0, 34, 22] as const,
  },
  {
    id: "felinos",
    name: "Consultorio felino",
    kicker: "04 — Solo gatos",
    text: "Sin olor a perro, con escondites y manejo suave. Certificado Cat Friendly.",
    facts: ["Cat Friendly", "Manejo sin estrés", "Escondites y mantas"],
    img: P.catExam,
    video: V.catPet,
    plan: [68, 0, 32, 22] as const,
  },
  {
    id: "diagnostico",
    name: "Diagnóstico",
    kicker: "05 — Imágenes y laboratorio",
    text: "Ecógrafo, rayos digitales y laboratorio propio. La mayoría de los resultados, en menos de una hora.",
    facts: ["Ecografía", "Rayos digitales", "Laboratorio < 1 h"],
    img: P.echo,
    plan: [34, 22, 34, 20] as const,
  },
  {
    id: "quirofano",
    name: "Quirófano",
    kicker: "06 — Cirugía",
    text: "Monitoreo multiparamétrico, anestesia inhalatoria y un equipo dedicado solo a cirugía.",
    facts: ["Anestesia inhalatoria", "Monitoreo continuo", "Esterilización propia"],
    img: P.or,
    plan: [68, 22, 32, 20] as const,
  },
  {
    id: "internacion",
    name: "Internación",
    kicker: "07 — Recuperación",
    text: "Boxes separados por especie, veterinario las 24 h y un parte diario con foto para vos.",
    facts: ["Boxes por especie", "Vet 24 h", "Parte diario con video"],
    img: P.cone,
    plan: [0, 42, 50, 18] as const,
  },
  {
    id: "peluqueria",
    name: "Peluquería",
    kicker: "08 — Spa",
    text: "Baño y corte con productos hipoalergénicos y secado silencioso. Sale oliendo a limpio y sin estrés.",
    facts: ["Sin jaulas", "Secado silencioso", "Productos hipoalergénicos"],
    img: P.groomCut,
    video: V.groomTrim,
    plan: [50, 42, 50, 18] as const,
  },
];

export const plans = [
  {
    id: "cachorro",
    name: "Cachorro",
    age: "Hasta 1 año",
    monthly: 18900,
    pitch: "Todo lo que necesita su primer año.",
    img: P.corgi,
    features: ["Plan completo de vacunas", "Desparasitación mensual", "Consultas ilimitadas", "Castración con 30% off", "Guardia con 50% off"],
  },
  {
    id: "adulto",
    name: "Adulto",
    age: "1 a 7 años",
    monthly: 24900,
    pitch: "Prevención para que nunca tengas que correr.",
    img: P.dogPink,
    highlight: true,
    features: ["Refuerzos anuales incluidos", "Chequeo anual con análisis", "Limpieza dental anual", "Consultas ilimitadas", "Guardia con 50% off", "2 baños por año"],
  },
  {
    id: "senior",
    name: "Senior",
    age: "Más de 7 años",
    monthly: 32900,
    pitch: "Más controles, menos sorpresas.",
    img: P.catTabby,
    features: ["Chequeo cada 6 meses", "Perfil sanguíneo y renal", "Control cardiológico", "Consultas ilimitadas", "Guardia con 50% off", "Visita a domicilio 1 vez por año"],
  },
] as const;

export const periods = [
  { id: "mensual", label: "Mensual", discount: 0, months: 1 },
  { id: "anual", label: "Anual", discount: 0.15, months: 12 },
] as const;

/* ---------------- Triage: orienta, no diagnostica ---------------- */

export type Level = "rojo" | "amarillo" | "verde";
export const symptoms: { id: string; text: string; level: Level | "ask"; species?: Species[] }[] = [
  { id: "respira", text: "Le cuesta respirar o tiene las encías pálidas o azuladas", level: "rojo" },
  { id: "convulsion", text: "Convulsiona, se desmayó o no se puede parar", level: "rojo" },
  { id: "toxico", text: "Comió algo tóxico (veneno, chocolate, uvas, medicamentos)", level: "rojo" },
  { id: "sangrado", text: "Sangra mucho o tuvo un golpe fuerte", level: "rojo" },
  { id: "orina", text: "Hace fuerza para orinar y no le sale", level: "rojo", species: ["gato"] },
  { id: "panza", text: "Tiene la panza hinchada y quiere vomitar sin poder", level: "rojo", species: ["perro"] },
  { id: "vomito", text: "Vomita o tiene diarrea", level: "ask" },
  { id: "apetito", text: "No quiere comer o está decaído", level: "ask" },
  { id: "dolor", text: "Cojea o le duele algo", level: "ask" },
  { id: "piel", text: "Se rasca mucho, oídos o piel", level: "verde" },
  { id: "control", text: "Necesita un control, una vacuna o un chequeo", level: "verde" },
];
export const moods: { id: string; text: string; level: Level }[] = [
  { id: "normal", text: "Come, juega y está como siempre", level: "verde" },
  { id: "bajon", text: "Está más quieto de lo normal", level: "amarillo" },
  { id: "mal", text: "No responde, no toma agua o empeora rápido", level: "rojo" },
];

/* ---------------- Libreta de salud (demostrativa) ---------------- */

export type Milestone = { month: number; title: string; text: string; service: string };
export const timeline: Record<"perro" | "gato", Milestone[]> = {
  perro: [
    { month: 1.5, title: "Primera vacuna", text: "Séxtuple + desparasitación", service: "vacunas" },
    { month: 2.5, title: "Segunda dosis", text: "Refuerzo séxtuple", service: "vacunas" },
    { month: 3.5, title: "Antirrábica", text: "Obligatoria desde los 3 meses", service: "vacunas" },
    { month: 6, title: "Castración", text: "Con prequirúrgico incluido", service: "cirugia" },
    { month: 12, title: "Refuerzo anual", text: "Vacunas + chequeo completo", service: "vacunas" },
    { month: 24, title: "Limpieza dental", text: "Antes de que aparezca el sarro", service: "odonto" },
    { month: 84, title: "Etapa senior", text: "Chequeo y análisis cada 6 meses", service: "laboratorio" },
  ],
  gato: [
    { month: 2, title: "Primera vacuna", text: "Triple felina + desparasitación", service: "vacunas" },
    { month: 3, title: "Segunda dosis", text: "Refuerzo triple felina", service: "vacunas" },
    { month: 4, title: "Antirrábica", text: "Obligatoria desde los 3 meses", service: "vacunas" },
    { month: 6, title: "Castración", text: "Menos estrés y más salud", service: "cirugia" },
    { month: 12, title: "Refuerzo anual", text: "Vacunas + chequeo completo", service: "vacunas" },
    { month: 36, title: "Control dental", text: "Los gatos esconden el dolor", service: "odonto" },
    { month: 84, title: "Etapa senior", text: "Perfil renal cada 6 meses", service: "laboratorio" },
  ],
};

/* ---------------- Turnos (agenda demo determinística) ---------------- */

export type Slot = { id: string; day: number; time: string; vet: string };
const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];
export function slotsFor(service: string, day: number): Slot[] {
  const pool = vets.filter((v) => v.services.includes(service));
  const list = pool.length ? pool : vets.slice(0, 2);
  return TIMES.filter((_, i) => (i * 7 + day * 3 + service.length) % 5 > 1).map((t, i) => ({
    id: `${service}-${day}-${t}`,
    day,
    time: t,
    vet: list[(i + day) % list.length].id,
  }));
}

export const marquee = ["Guardia 24 h", "Consultorio felino", "Laboratorio propio", "Turnos de 30 minutos", "Peluquería sin jaulas", "Ecografía en el día", "Exóticos"];

export const benefits = [
  { id: "especies", title: "Gatos por un lado, perros por el otro", text: "Salas de espera y entradas separadas. Menos estrés desde la puerta." },
  { id: "turno", title: "Turno en un minuto", text: "Elegís día, hora y veterinario. Sin llamar, sin esperar." },
  { id: "guardia", title: "Guardia 24 h, 365 días", text: "Siempre hay un veterinario despierto en Belgrano." },
  { id: "whatsapp", title: "Su historia clínica en tu WhatsApp", text: "Vacunas, recetas y resultados, siempre a mano." },
  { id: "calma", title: "Atención sin miedo", text: "Manejo suave, premios y tiempos de tu mascota." },
  { id: "precios", title: "Precios publicados", text: "Sabés cuánto sale antes de venir. Sin sorpresas." },
] as const;

export const testimonials = [
  { name: "Carolina", pet: "Lola, 4 años", species: "perro", text: "Lola tiembla en cualquier veterinaria. Acá entró moviendo la cola. No lo podía creer." },
  { name: "Javier", pet: "Mishi, 12 años", species: "gato", text: "El consultorio para gatos cambia todo. Mishi no se escondió ni una vez." },
  { name: "Florencia", pet: "Ramón, 2 años", species: "perro", text: "Fuimos a la guardia a las 3 de la mañana y nos atendieron en 10 minutos. Gracias, de verdad." },
  { name: "Matías", pet: "Copito, conejo", species: "exotico", text: "Por fin una veterinaria que sabe de conejos. Explicaron todo con una paciencia enorme." },
  { name: "Lucía", pet: "Toto, 9 años", species: "perro", text: "El parte diario con video durante la internación me dio una paz enorme." },
  { name: "Andrés", pet: "Nala, 1 año", species: "gato", text: "Saqué el turno desde el celular en un minuto y me llegó todo por WhatsApp." },
];

export const faqs = [
  { q: "¿Necesito turno para la guardia?", a: "No. La guardia de Belgrano atiende las 24 h sin turno. Si podés, llamanos en camino y te esperamos preparados." },
  { q: "¿Cuánto sale la guardia?", a: "La consulta de guardia arranca en $ 42.000. De 22 a 8 h, domingos y feriados tiene un recargo del 50%. Con cualquier plan, tenés 50% off." },
  { q: "¿Los planes tienen permanencia?", a: "No. Pagás mes a mes (o anual con descuento) y te das de baja cuando quieras desde el botón de baja, sin llamar." },
  { q: "¿Atienden exóticos?", a: "Sí: conejos, hurones, cobayos, aves y tortugas, con la Dra. Herrera. Consultá disponibilidad para otras especies." },
  { q: "¿Puedo pagar con tarjeta o en cuotas?", a: "Sí, débito, crédito, transferencia y Mercado Pago. Cirugías hasta 6 cuotas sin interés con bancos adheridos." },
  { q: "¿Qué hago si es una urgencia?", a: "No reserves turno: llamá al 11 4000-2400 o vení directo a Av. Cabildo 2450. Abierto siempre." },
];
