/**
 * Contenido de LUMEN — estudio de estética y yoga.
 *
 * MARCA FICTICIA. Todos los datos (dirección, teléfonos, precios, CUIT,
 * profesionales, clases y reseñas) son inventados para demostración.
 */

import { img, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { CatalogItem, RubroContent, Section, Slot } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "estetica")!;

export const brand = "LUMEN";

/** ── Estética: tratamientos ───────────────────────────────────────── */
const tratamientos: Section = {
  id: "estetica",
  kicker: "Estética",
  title: "Tratamientos que arrancan por escucharte",
  body: "Antes de tocar tu piel te preguntamos cómo dormís, qué te molesta y qué probaste antes. Si un tratamiento no sirve para tu caso, te lo decimos: preferimos que vuelvas en dos meses y no que no vuelvas nunca.",
  layout: "grid",
  items: [
    {
      id: "limpieza",
      title: "Limpieza facial profunda",
      body: "Extracción manual suave, vapor y máscara calmante. Salís con la piel limpia y un poco rosada, nunca tirante.",
      points: [
        "Vení sin maquillaje y sin crema aparte",
        "Si tenés rosacea activa, lo revisamos y lo ajustamos",
        "Incluye masaje final de hombros y cuello",
      ],
      meta: [
        { label: "Duración", value: "60 min" },
        { label: "Recuperación", value: "sin downtime" },
      ],
      price: { amount: "$ 62.000", note: "final, IVA incluido" },
      badge: "El más pedido",
    },
    {
      id: "ritual",
      title: "Ritual Lumen (piel seca)",
      body: "Limpieza, exfoliación enzimática y ácido suave en baja concentración, más 15 minutos de masaje de scalp.",
      points: [
        "Ideal para piel seca o desvitalizada",
        "En verano lo hacemos con protección solar de por medio",
        "Te damos la rutina para la casa, por escrito",
      ],
      meta: [
        { label: "Duración", value: "75 min" },
        { label: "Frecuencia", value: "cada 4 semanas" },
      ],
      price: { amount: "$ 84.000", note: "final, IVA incluido" },
    },
    {
      id: "masaje",
      title: "Masaje descontracturante",
      body: "Para espalda, cuello y hombros cargados. Trabajo por zonas, con presión ajustable: nos decís cuándo hay que bajar.",
      points: [
        "No es masaje relajante: las primeras dos semanas molesta",
        "Si venís con un cuadro reciente o una lesión, avisanos",
        "Se puede pedir de 30 o de 60 minutos",
      ],
      meta: [
        { label: "Duración", value: "60 min" },
        { label: "Personal", value: "Nahuel, kinesiólogo" },
      ],
      price: { amount: "$ 72.000", note: "final, IVA incluido" },
    },
    {
      id: "cejas",
      title: "Cejas: diseño y tinte",
      body: "Diseño a medida y tinte con henna vegetal. El precio incluye diseño y tinte; la depilación de la zona se cotiza aparte.",
      points: [
        "El diseño se hace mirándote, no de memoria",
        "La henna vegetal se retira con agua tibia",
        "Conviene llegar sin maquillaje en la zona",
      ],
      meta: [
        { label: "Duración", value: "45 min" },
        { label: "Retoque", value: "a los 21 días" },
      ],
      price: { amount: "$ 38.000", note: "final, IVA incluido" },
    },
    {
      id: "uñas",
      title: "Manicura + semipermanente",
      body: "Preparación, cutícula y esmaltado semipermanente que dura entre tres y cuatro semanas sin retocar.",
      points: [
        "Sin acrílico y sin uñas postizas",
        "Uña natural — 30 min — $ 26.000",
        "Traé tus bases si preferís tu tono",
      ],
      meta: [
        { label: "Duración", value: "90 min" },
        { label: "Duración del esmaltado", value: "3 a 4 semanas" },
      ],
      price: { amount: "$ 56.000", note: "final, IVA incluido" },
    },
    {
      id: "laser",
      title: "Depilación láser · pack de 6",
      body: "Láser diodo en piernas, axilas o línea de bikini. El pack se compra por sesión y se usa dentro de los 12 meses.",
      points: [
        "No se puede hacer con el sol prendido ni con la piel bronceada",
        "No se hace en embarazo ni lactancia",
        "Si no venís dentro de las 48 h se descuenta la sesión",
      ],
      meta: [
        { label: "Duración", value: "30 min" },
        { label: "Pack", value: "6 sesiones" },
      ],
      price: { amount: "$ 240.000", note: "final, IVA incluido" },
      badge: "Pack",
    },
  ],
};

/** ── Yoga: clases por resultado ───────────────────────────────────── */
const clases: Section = {
  id: "yoga",
  kicker: "Yoga",
  title: "Clases por resultado, no por estilo",
  body: "No te vendemos estilos ni nombres en sánscrito: te decimos para qué sirve cada clase y a qué hora podés venir. Si no sabés por dónde empezar, empezá por la de descanso.",
  layout: "grid",
  items: [
    {
      id: "descanso",
      title: "Descanso",
      body: "Para cuando llegás con la cabeza a mil. Cuerpo acostado, respiración larga y movimiento lento. La clase que más gente pide.",
      points: [
        "Ideal para dormir mejor: se repite los sábados",
        "Se puede dormir la mitad de la clase (sí, pasa)",
        "Traé una mantita: el salón está frío",
      ],
      meta: [
        { label: "Horario", value: "Sáb 10:00 y 12:00" },
        { label: "Docente", value: "Carla Méndez" },
        { label: "Duración", value: "60 min" },
      ],
      price: { amount: "$ 22.000", note: "final, IVA incluido" },
      badge: "El más pedido",
    },
    {
      id: "movilidad",
      title: "Movilidad",
      body: "Abrir cadera, hombro y columna con trabajo de respiración. No es la clase post-parto ni la de alineación: es movilidad y nada más.",
      points: [
        "Para después de muchas horas sentado",
        "Se trabaja por tandas cortas, con pausa",
        "Props incluidos: bloques, cintas y mantas",
      ],
      meta: [
        { label: "Horario", value: "Mar 19:15" },
        { label: "Docente", value: "Nahuel Rivas" },
        { label: "Duración", value: "60 min" },
      ],
      price: { amount: "$ 22.000", note: "final, IVA incluido" },
    },
    {
      id: "fuerza",
      title: "Fuerza",
      body: "Una hora de trabajo con peso corporal y bandas. No es yoga: es entrenamiento, con yoga adentro para los hombros y la espalda.",
      points: [
        "Necesitás ropa cómoda que se pueda mover",
        "Traé toalla: hay duchas en el vestidor",
        "La primera clase es de nivelación",
      ],
      meta: [
        { label: "Horario", value: "Jue 18:30" },
        { label: "Docente", value: "Ivo Bauso" },
        { label: "Duración", value: "60 min" },
      ],
      price: { amount: "$ 24.000", note: "final, IVA incluido" },
    },
    {
      id: "ansiedad",
      title: "Ansiedad",
      body: "Setenta y cinco minutos lentos, con trabajo de respiración y un descanso final largo. Para días con mucha demanda mental.",
      points: [
        "Grupo máximo de 14 personas",
        "Se puede comprar el turno y no la clase entera",
        "Se puede salir un momento a mitad de la clase",
      ],
      meta: [
        { label: "Horario", value: "Jue 20:15" },
        { label: "Docente", value: "Carla Méndez" },
        { label: "Duración", value: "75 min" },
      ],
      price: { amount: "$ 26.000", note: "final, IVA incluido" },
      badge: "Nuevo",
    },
  ],
};

/** ── El equipo ─────────────────────────────────────────────────────── */
const equipo: Section = {
  id: "equipo",
  kicker: "El equipo",
  title: "Cuatro personas, con nombre y con cara",
  body: "No rotamos. Cada técnica tiene a su persona y la vas a ver siempre a la misma. Eso es lo que hace que un tratamiento funcione.",
  layout: "grid",
  items: [
    {
      id: "carla",
      title: "Carla Méndez",
      body: "Esteticista y docente de yoga. Empezó con estética facial y hace diez años que da clases de descanso. Es la que atiende el turno de las 18 h.",
      points: ["10 años en el rubro", "Estética facial + clases de descanso y ansiedad"],
      meta: [{ label: "En el estudio", value: "Lun a Vie y Sáb" }],
    },
    {
      id: "nahuel",
      title: "Nahuel Rivas",
      body: "Kinesiólogo. Hace el masaje descontracturante y las clases de movilidad. Si le preguntás por tu espalda, te responde con un plan de ejercicios, no con theories.",
      points: ["Kinesiólogo (EUDOC)", "Masaje descontracturante y movilidad"],
      meta: [{ label: "En el estudio", value: "Mar y Jue" }],
    },
    {
      id: "ivo",
      title: "Ivo Bauso",
      body: "Preparador físico. Da la clase de fuerza y hace las evaluaciones de postura que preceden a los packs de tratamiento.",
      points: ["Preparador físico (EUDOC)", "Fuerza y evaluaciones posturales"],
      meta: [{ label: "En el estudio", value: "Jue y Sáb" }],
    },
    {
      id: "sol",
      title: "Sol Ferreyra",
      body: "Fundadora de LUMEN. Está en recepción, responde el WhatsApp y coordina la agenda. Si algo sale mal, es la primera a la que le escribís.",
      points: ["Creadora de LUMEN", "Agenda y bienvenida"],
      meta: [{ label: "En el estudio", value: "Todos los días" }],
    },
  ],
};

/** ── El espacio ───────────────────────────────────────────────────── */
const espacio: Section = {
  id: "espacio",
  kicker: "El espacio",
  title: "Dos plantas, una sola luz",
  body: "Abajo los gabinetes de estética y la recepción; arriba la sala de yoga, con vigas, piso de madera y luz natural. Se escucha el ruido de la calle, no la música del local.",
  layout: "split",
  items: [
    {
      id: "recepcion",
      title: "Recepción y gabinetes",
      body: "Av. Corrientes 4400, Palermo. Planta baja: dos gabinetes de estética, recepción y un living para esperar con té.",
      points: ["Acceso sin escalones", "Baño con duchas en el vestidor del primer piso"],
      meta: [{ label: "Horario", value: "Lun a Vie de 9 a 21 h" }],
    },
    {
      id: "sala",
      title: "Sala de yoga",
      body: "Primer piso: una sola sala con 14 mats, piso de madera y luz natural. Los martes y los jueves a la tarde entra la mejor luz del día.",
      points: ["14 mats + 6 esterillas de repuesto", "Props incluidos: bloques, cintas y mantas"],
      meta: [{ label: "Horario", value: "Lun a Vie de 9 a 21 h · Sáb de 9 a 18 h" }],
    },
    {
      id: "acceso",
      title: "Cómo llegar",
      body: "A dos cuadras del subte B (Palermo), a cinco cuadras de la plaza. Hay un bicicletero en la puerta y un lugar para cochera a media cuadra.",
      points: ["Colectivos 71, 106 y 151", "Ascensor disponible"],
      meta: [{ label: "Estacionamiento", value: "Media cuadra" }],
    },
  ],
};

/** ── Preguntas frecuentes ──────────────────────────────────────────── */
const faq: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que todos preguntan antes de reservar",
  layout: "list",
  items: [
    {
      id: "q1",
      title: "¿Tengo que pagar algo para reservar?",
      body: "Sí: una seña de $ 15.000, que se descuenta del total del tratamiento o del pack de clases. Si cancelás con más de 24 h de anticipación, la seña te vuelve. En esta demo la seña no se procesa: el sitio es una simulación.",
    },
    {
      id: "q2",
      title: "¿Puedo reservar por WhatsApp?",
      body: "Sí, y es lo que hacemos la mayoría de las veces. Pero el formulario de esta web te deja elegir el horario exacto y te da un pase con código al instante, sin hablar con nadie.",
    },
    {
      id: "q3",
      title: "¿Puedo hacer una clase suelta o tengo que comprar un pack?",
      body: "Las dos. La clase suelta son $ 22.000 y el pack de 8 sale $ 148.000 (equivale a $ 18.500 por clase). El pack vence a los 60 días.",
    },
    {
      id: "q4",
      title: "¿Atienden por obra social o prepaga?",
      body: "No trabajamos con obras sociales: todos los precios son finales y con factura. Algunas prepagas de salud aceptan el tratamiento con derivación previa, pero eso se coordina por WhatsApp.",
    },
    {
      id: "q5",
      title: "¿Puedo estar embarazada o en tratamiento médico?",
      body: "Para las clases de fuerza y de movilidad, no: necesitás autorización médica. Para las clases de descanso y ansiedad, sí, con una adaptación. Para el masaje descontracturante, avisanos y lo ajustamos o te lo suspendemos.",
    },
    {
      id: "q6",
      title: "¿Hay vestidor? ¿Puedo dejar mis cosas?",
      body: "Sí: vestidor con duchas, toallero y un casillero con candado (traé un candado propio). Y hay un baño, que no es un detalle menor.",
    },
    {
      id: "q7",
      title: "¿La comparativa de fotos es real?",
      body: "No. La comparativa de antes y después de esta web es una simulación visual sobre fotos de stock, hecha para mostrar cómo se presentaría el resultado. No son fotos de clientas ni resultados reales del estudio.",
    },
    {
      id: "q8",
      title: "¿Los datos de esta web son reales?",
      body: "No. Es una demostración de portfolio: la marca, los precios, el domicilio, el equipo y los horarios son ficticios.",
    },
  ],
};

/** ── Horarios del funnel (turnos) ──────────────────────────────────── */
export const turnos: Slot[] = [
  { id: "lun-1000", day: "Lunes 20", time: "10:00", places: 4 },
  { id: "mar-1130", day: "Martes 21", time: "11:30", places: 3 },
  { id: "mar-1400", day: "Martes 21", time: "14:00", places: 2 },
  { id: "mar-1915", day: "Martes 21", time: "19:15", places: 4 },
  { id: "mie-1200", day: "Miércoles 22", time: "12:00", places: 5 },
  { id: "jue-1800", day: "Jueves 23", time: "18:00", places: 1 },
  { id: "jue-1830", day: "Jueves 23", time: "18:30", places: 3 },
  { id: "jue-1915", day: "Jueves 23", time: "19:15", places: 4 },
  { id: "jue-2015", day: "Jueves 23", time: "20:15", places: 4 },
  { id: "vie-0930", day: "Viernes 24", time: "09:30", places: 2 },
  { id: "vie-1700", day: "Viernes 24", time: "17:00", places: 3 },
  { id: "sab-1000", day: "Sábado 25", time: "10:00", places: 6 },
  { id: "sab-1200", day: "Sábado 25", time: "12:00", places: 2 },
];

/**
 * Turnos de cada clase de yoga: son los que coinciden con el horario que
 * publica la tabla de /yoga. Así no se puede reservar "Descanso (sábado)" en
 * un turno de estética del lunes.
 */
export const slotsPorClase: Record<string, string[]> = {
  descanso: ["sab-1000", "sab-1200"],
  movilidad: ["mar-1915"],
  fuerza: ["jue-1830"],
  ansiedad: ["jue-2015"],
};

/** Ids de las clases de yoga: sirven para separar los dos brazos del funnel. */
export const idsClases: string[] = (clases.items ?? []).map((c) => c.id);

/** Opciones del funnel: tratamientos + clases (doble funnel, una conversión). */
export const opciones: CatalogItem[] = [
  ...(tratamientos.items ?? []).map((item) => ({ ...item })),
  ...(clases.items ?? []).map((item) => ({ ...item })),
];

/** Seña de la reserva (demo). */
export const sena = {
  monto: "$ 15.000",
  nota: "Se descuenta del total. Se devuelve si cancelás con más de 24 h de anticipación.",
};

/**
 * Fotos de la app.
 *
 * IDs de Unsplash verificados con `curl -sI -m 15` (HTTP 200) y ADEMÁS
 * revisados a ojo: el `alt` de cada foto dice lo que se ve, ni una cosa más.
 * Ojo: el pool de `media.ts` para `estetica` mezcla fotos de resorts y de
 * fitness, así que acá se usan IDs propios, del rubro y con recorte 4:5.
 */
export const fotos = {
  /** Piel sin maquillaje sobre fondo oscuro: base de la comparativa. */
  piel: img("1601412436009-d964bd02edbc", 1000, 1250),
  /** Máscara facial aplicada con pincel: el tratamiento en curso. */
  tratamiento: img("1570172619644-dfd03ed5d881", 1200),
  /** Frasco de sérum con gotero sobre una mesa oscura. */
  producto: img("1515377905703-c4788e51af15", 1200),
  /** Sala de yoga interior: piso de madera y esterillas. */
  sala: img("1599447421416-3414500d18a5", 1200),
  /** Clase grupal en un estudio con luz alta. */
  clase: img("1518611012118-696072aa579a", 1200),
  /** Salón con plantas, sillón de rattan y luz cálida. */
  salon: img("1560750588-73207b1ef5b8", 1200),
  /** Retrato de una integrante del equipo, en el estudio. */
  equipo: img("1573497019940-1c28c88b4f3e", 1000, 1250),
  /** Insumos del gabinete: dispenser, toalla, vela y tulipanes. */
  insumos: img("1540555700478-4be289fbecef", 1200),
} as const;

/** Videos verificados (Mixkit 720p). */
export const clips = {
  /** Hero: tratamiento de relaxing en curso. */
  hero: { id: 4258 },
  /** Banda de index: rodillo de jade. */
  rodillo: { id: 4210 },
  /** Banda de estética: detalle labial. */
  labios: { id: 4212 },
} as const;

/** ── Contenido completo ────────────────────────────────────────────── */
export const estetica: RubroContent = {
  id: rubro.id,
  brand,
  rubro: rubro.rubro,
  tagline: rubro.tagline,
  objeccion: rubro.objeccion,
  theme: {
    name: "lumen",
    palette: { ...rubro.palette },
    fonts: {
      display: "Fraunces",
      body: "Jost",
      // Ejes variables: Fraunces con opsz (óptica por tamaño) y Jost completa.
      href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..800&family=Jost:wght@300..600&display=swap",
    },
    radius: "0.5rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Estética", href: "/estetica" },
    { label: "Yoga", href: "/yoga" },
    { label: "Reservar", href: "/reservar" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Estética + yoga · Palermo, CABA",
    title: ["Soltá", "el peso", "de la", "semana"],
    subtitle:
      "Tratamientos de estética y clases de yoga en el mismo estudio, con equipo propio y sin rotar. Reservás el turno, elegís la hora y te llevás tu pase.",
    cta: { label: "Reservar mi turno", href: "/reservar" },
    secondaryCta: { label: "Ver las clases", href: "/yoga" },
    video: {
      src: video(clips.hero.id),
      poster: poster(clips.hero.id),
      alt: "Mujer relajada durante un tratamiento de estética en LUMEN (imagen de demostración).",
      isVideo: true,
    },
    live: {
      label: "Abierto ahora",
      count: 3,
      min: 2,
      max: 5,
      unit: "turnos libres hoy",
      interval: 3400,
    },
  },
  sections: [tratamientos, clases, equipo, espacio, faq],
  conversion: {
    id: "reserva",
    kicker: "Reserva online",
    title: "Reservá tu tratamiento o tu clase y salí con pase",
    body: "Cuatro pasos: elegís qué querés, el turno, tus datos y la seña. Al confirmar te damos un pase con código.",
    steps: ["Qué querés", "Turno", "Tus datos y seña", "Confirmación"],
    options: opciones,
    slots: turnos,
    demoNotice: "Demo: no se envían datos ni se procesa la seña.",
  },
  legal: {
    company: "Lumen Estética y Yoga S.A.S. (ficticia)",
    cuit: "30-71888888-4",
    address: "Av. Corrientes 4400, Palermo, CABA",
    email: "hola@lumen.demo",
    phone: "+54 11 5555-0100",
    pricesIncludeTaxes: true,
    taxNote:
      "Todos los precios publicados son precios finales e incluyen IVA. La seña de las reservas online se descuenta del total y no se cobra un segundo tiempo en el estudio.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar una reserva online",
      note:
        "Si compraste una reserva o un pack de clases online, podés cancelarlo sin costo desde acá. Completá los datos de la reserva y se anula en el momento; la seña te vuelve si avisaste con más de 24 h de anticipación.",
      resolution:
        "Resolución 316/2018 y 271/2020 — Botón de arrepentimiento para compras online.",
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
      "Los datos que dejás en esta web se usan únicamente para coordinar tu turno y avisarte por WhatsApp o email.",
      "No se comparten con terceros ni con fines comerciales.",
      "Pedí la baja de tus datos desde el botón de baja del pie de página: se elimina todo en un plazo máximo de 10 días.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "La reserva queda confirmada recién cuando recibís el pase con código.",
      "La seña se descuenta del total del tratamiento o del pack de clases.",
      "Si no podés asistir, avisanos con al menos 24 horas de anticipación para liberar el lugar y devolver la seña.",
      "Las clases de fuerza y movilidad requieren autorización médica en embarazo, post-parto o lesión reciente.",
      "Los tratamientos de láser no se realizan en embarazo, lactancia, sobre piel bronceada ni con medicación fotosensibilizante: avisanos antes.",
      "Los packs de clases vencen a los 60 días corridos desde la primera clase.",
    ],
  },
  contact: {
    whatsapp: rubro.whatsapp.phone,
    phone: "+54 11 5555-0100",
    email: "hola@lumen.demo",
    address: "Av. Corrientes 4400, Palermo, CABA",
    hours: "Lunes a viernes de 9 a 21 h · Sábados de 9 a 18 h · Yoga de mañana a la tarde",
    mapsUrl: "https://maps.google.com/?q=Av+Corrientes+4400+Palermo",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
    priceRange: "$$",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Esteticistas", value: true },
      { "@type": "LocationFeatureSpecification", name: "Clases de yoga", value: true },
    ],
  },
};
