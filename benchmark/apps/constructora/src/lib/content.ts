export const img = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/** Etapas que recorre el edificio 3D del hero; `at` es el progreso del scroll donde arranca cada una. */
export const stages = [
  {
    at: 0,
    n: "01",
    title: "Terreno y fundaciones",
    text: "Estudio de suelo, excavación y platea de hormigón armado. Todo empieza bajo tierra.",
    data: ["Excavación 3.200 m³", "Pilotes Ø 60 cm", "Platea H-30"],
  },
  {
    at: 0.14,
    n: "02",
    title: "Estructura",
    text: "Columnas y losas suben piso por piso. Un nivel completo cada 9 días, con control topográfico continuo.",
    data: ["14 niveles", "9 días por losa", "Hormigón H-35"],
  },
  {
    at: 0.5,
    n: "03",
    title: "Cerramientos y fachada",
    text: "Muro cortina de doble vidriado hermético con control solar. La piel del edificio toma forma.",
    data: ["DVH low-e", "4.800 m² de fachada", "Aislación térmica A+"],
  },
  {
    at: 0.78,
    n: "04",
    title: "Entrega",
    text: "Terminaciones, instalaciones y amenities. Las luces se encienden: el edificio ya es un lugar para vivir.",
    data: ["112 unidades", "Certificación EDGE", "Posesión 2027"],
  },
];

export const stats = [
  { value: 38, suffix: "", label: "Años construyendo" },
  { value: 412, suffix: "K", label: "m² entregados" },
  { value: 96, suffix: "", label: "Obras terminadas" },
  { value: 100, suffix: "%", label: "Entregas en plazo desde 2015" },
];

export const projects = [
  {
    name: "Torre Nogal",
    place: "Palermo, CABA",
    status: "En obra · 64%",
    progress: 64,
    year: "2027",
    type: "Residencial · 14 pisos",
    img: img("1545324418-cc1a3fa10c00"),
  },
  {
    name: "Basalto Costa",
    place: "Nordelta, Tigre",
    status: "Entregado",
    progress: 100,
    year: "2024",
    type: "Residencial · 8 pisos",
    img: img("1460317442991-0ec209397118"),
  },
  {
    name: "Distrito Lumen",
    place: "Puerto Madero, CABA",
    status: "Preventa",
    progress: 12,
    year: "2028",
    type: "Oficinas AAA · 22 pisos",
    img: img("1486406146926-c627a92ad1ab"),
  },
  {
    name: "Casa Mirador",
    place: "Pilar, Buenos Aires",
    status: "Entregado",
    progress: 100,
    year: "2023",
    type: "Vivienda unifamiliar",
    img: img("1600585154340-be6161a56a0c"),
  },
  {
    name: "Edificio Ombú",
    place: "Belgrano, CABA",
    status: "En obra · 38%",
    progress: 38,
    year: "2027",
    type: "Residencial · 10 pisos",
    img: img("1487958449943-2429e8be8625"),
  },
  {
    name: "Parque Industrial Sur",
    place: "Ezeiza, Buenos Aires",
    status: "Entregado",
    progress: 100,
    year: "2022",
    type: "Naves logísticas · 28.000 m²",
    img: img("1565008447742-97f6f38c985c"),
  },
];

export const beforeAfter = {
  render: img("1580587771525-78b9dba3b914", 2000),
  obra: img("1541888946425-d81bb19240f5", 2000),
};

export const process = [
  { n: "01", title: "Factibilidad", text: "Análisis de terreno, normativa y rentabilidad. Sabés si el proyecto cierra antes de invertir." },
  { n: "02", title: "Proyecto & BIM", text: "Arquitectura e ingeniería modeladas en BIM: cada caño y cada viga existe primero en digital." },
  { n: "03", title: "Render & preventa", text: "Recorridos virtuales y renders fotorrealistas para vender desde el pozo." },
  { n: "04", title: "Obra", text: "Dirección y ejecución con avance publicado en tiempo real para cada inversor." },
  { n: "05", title: "Entrega & postventa", text: "Garantía extendida de 10 años en estructura y un equipo que responde." },
];

export type Room = { id: string; name: string; m2: number; d: string; label: [number, number] };

/** Planta de un 3 ambientes (unidades: 1 = 10 cm). */
export const floorPlan: Room[] = [
  { id: "living", name: "Living comedor", m2: 32.4, d: "M20 20 H380 V200 H20 Z", label: [200, 110] },
  { id: "cocina", name: "Cocina integrada", m2: 9.8, d: "M380 20 H560 V140 H380 Z", label: [470, 80] },
  { id: "balcon", name: "Balcón aterrazado", m2: 14.2, d: "M20 200 H380 V280 H20 Z", label: [200, 240] },
  { id: "dorm1", name: "Dormitorio principal", m2: 16.5, d: "M560 20 H780 V200 H560 Z", label: [670, 110] },
  { id: "bano1", name: "Baño en suite", m2: 5.2, d: "M560 200 H680 V300 H560 Z", label: [620, 250] },
  { id: "dorm2", name: "Dormitorio 2", m2: 11.8, d: "M680 200 H780 V380 H680 Z", label: [730, 290] },
  { id: "bano2", name: "Baño", m2: 4.1, d: "M380 140 H470 V240 H380 Z", label: [425, 190] },
  { id: "hall", name: "Hall y circulación", m2: 7.6, d: "M470 140 H560 V300 H470 Z", label: [515, 220] },
];

export const testimonials = [
  {
    quote: "Seguimos el avance de la obra desde el celular todas las semanas. Nos entregaron dos meses antes.",
    name: "Lucía Ferreyra",
    role: "Propietaria · Basalto Costa",
  },
  {
    quote: "El render era igual al edificio terminado. Compramos en pozo con total confianza.",
    name: "Martín Echeverría",
    role: "Inversor · Torre Nogal",
  },
  {
    quote: "Profesionales, ordenados y transparentes con los costos. Ya vamos por el tercer proyecto juntos.",
    name: "Grupo Andes Desarrollos",
    role: "Desarrollador",
  },
];
