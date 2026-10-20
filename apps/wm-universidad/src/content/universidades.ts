/**
 * Contenido de UNIVERSIDAD ALTA — universidad privada.
 *
 * MARCA FICTICIA. Todos los datos (direcciones, teléfonos, aranceles, CUIT,
 * campus, docentes, becarios, noticias y reseñas) son inventados para
 * demostración. Los medios están verificados con `curl -sI -m 15` (HTTP 200).
 *
 * Nota sobre medios: el pool `universidad` de `src/lib/media.ts` traía IDs
 * mal etiquetados (un avión, una bici, una autopista y un edificio
 * abandoned). La lista de abajo es la verificada y revisada cuadro a cuadro
 * el 2026-10-20.
 */

import { img, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { CatalogItem, RubroContent, Section, Slot } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "universidad")!;

export const brand = "UNIVERSIDAD ALTA";

/** Modalidad de cursada. */
export type Modalidad = "presencial" | "online";

/** Una carrera: hereda de `CatalogItem` y agrega los datos que el buscador
 *  necesita para filtrar y comparar. */
export interface Carrera extends CatalogItem {
  /** Área de conocimiento (para el filtro del buscador). */
  area: string;
  /** Sede donde se cursa. */
  sede: string;
  /** Modalidades disponibles. */
  modalidades: Modalidad[];
  /** Duración del plan de estudios. */
  duracion: string;
  /** Salida laboral concreta. */
  salida: string;
  /** Arancel: precio final con impuestos. */
  arancel: string;
  /** Materias o ejes del plan. */
  plan: string[];
}

/** Un turno de visita guiada o de videollamada. Hereda de `Slot`. */
export interface Turno extends Slot {
  modalidad: Modalidad;
  /** Qué es: "Visita guiada · Campus Norte" / "Videollamada de orientación". */
  etiqueta: string;
}

/** ── Carreras ──────────────────────────────────────────────────────── */
export const carreras: Carrera[] = [
  {
    id: "ingenieria-software",
    title: "Ingeniería en Software",
    kicker: "Ingeniería",
    body: "Diez cuatrimestres, un proyecto real por año y prácticas desde el cuarto cuatrimestre. Salís con el título y con código publicado.",
    area: "Ingeniería",
    sede: "Campus Norte",
    modalidades: ["presencial", "online"],
    duracion: "4 años",
    salida: "Desarrollador/a de software en banca digital, retail o logística",
    arancel: "$ 68.000 / mes",
    badge: "Con prácticas",
    points: ["Secundario completo", "Promedio mínimo 6", "Entrevista de admisión de 30 min"],
    meta: [
      { label: "Duración", value: "4 años" },
      { label: "Sede", value: "Campus Norte" },
      { label: "Modalidad", value: "Presencial y online" },
    ],
    price: { amount: "$ 68.000 / mes", note: "final, IVA incluido" },
    plan: [
      "Programación y lógica",
      "Estructuras de datos y algoritmos",
      "Bases de datos y arquitectura de software",
      "Ingeniería de software y gestión de proyectos",
      "Práctica profesional supervisada",
    ],
  },
  {
    id: "diseno-grafico",
    title: "Diseño Gráfico y Comunicación Visual",
    kicker: "Diseño",
    body: "Tres años de taller y portfolio real con clientes. La carrera más corta del portfolio, y la que más proyectos tiene.",
    area: "Diseño",
    sede: "Campus Centro",
    modalidades: ["presencial", "online"],
    duracion: "3 años",
    salida: "Diseñador/a en agencia, estudio propio o comunicación de empresa",
    arancel: "$ 54.000 / mes",
    badge: "3 años",
    points: ["Secundario completo", "Promedio mínimo 6", "Portfolio o prueba de taller"],
    meta: [
      { label: "Duración", value: "3 años" },
      { label: "Sede", value: "Campus Centro" },
      { label: "Modalidad", value: "Presencial y online" },
    ],
    price: { amount: "$ 54.000 / mes", note: "final, IVA incluido" },
    plan: [
      "Taller de lenguaje visual",
      "Tipografía y producción gráfica",
      "Diseño para medios digitales",
      "Dirección de arte y comunicación de marca",
      "Proyecto final con cliente real",
    ],
  },
  {
    id: "administracion-finanzas",
    title: "Administración y Finanzas",
    kicker: "Economía",
    body: "Números, planes y decisiones. La carrera con más salidas inmediatas: casi todos los sectores contratan de este lado.",
    area: "Economía",
    sede: "Campus Sur",
    modalidades: ["presencial", "online"],
    duracion: "4 años",
    salida: "Analista financiero, controller o consultor de empresas",
    arancel: "$ 58.000 / mes",
    badge: "Más demandada",
    points: ["Secundario completo", "Promedio mínimo 6", "Entrevista de admisión"],
    meta: [
      { label: "Duración", value: "4 años" },
      { label: "Sede", value: "Campus Sur" },
      { label: "Modalidad", value: "Presencial y online" },
    ],
    price: { amount: "$ 58.000 / mes", note: "final, IVA incluido" },
    plan: [
      "Contabilidad y estados financieros",
      "Finanzas corporativas y valuation",
      "Marketing y gestión comercial",
      "Análisis de datos para decisiones",
      "Práctica en empresa",
    ],
  },
  {
    id: "psicologia",
    title: "Psicología",
    kicker: "Salud",
    body: "Cinco años, con práctica clínica desde el cuarto. La única carrera de la casa que no se puede cursar 100% online.",
    area: "Salud",
    sede: "Campus Norte",
    modalidades: ["presencial"],
    duracion: "5 años",
    salida: "Psicólogo/a clínico en consultorio, hospital o centro de salud",
    arancel: "$ 62.000 / mes",
    badge: "Práctica clínica",
    points: ["Secundario completo", "Promedio mínimo 7", "Entrevista y charla de motivation"],
    meta: [
      { label: "Duración", value: "5 años" },
      { label: "Sede", value: "Campus Norte" },
      { label: "Modalidad", value: "Solo presencial" },
    ],
    price: { amount: "$ 62.000 / mes", note: "final, IVA incluido" },
    plan: [
      "Psicología general y neurociencia",
      "Métodos de investigación",
      "Psicología clínica y psicopatología",
      "Intervención y dispositivos de salud",
      "Práctica clínica supervisada",
    ],
  },
  {
    id: "contaduria-publica",
    title: "Contaduría Pública",
    kicker: "Economía",
    body: "Título profesional habilitante y cuatro meses de práctica obligatoria. El camino corto al estudio contable propio.",
    area: "Economía",
    sede: "Campus Sur",
    modalidades: ["presencial"],
    duracion: "4 años",
    salida: "Contador/a público/a en estudio contable o área impositiva",
    arancel: "$ 56.000 / mes",
    badge: "Título profesional",
    points: ["Secundario completo", "Promedio mínimo 6", "Entrevista de admisión"],
    meta: [
      { label: "Duración", value: "4 años" },
      { label: "Sede", value: "Campus Sur" },
      { label: "Modalidad", value: "Solo presencial" },
    ],
    price: { amount: "$ 56.000 / mes", note: "final, IVA incluido" },
    plan: [
      "Contabilidad básica y aplicada",
      "Impuestos y régimen legal",
      "Auditoría y control interno",
      "Finanzas aplicadas y costos",
      "Práctica profesional",
    ],
  },
  {
    id: "tecnologia-alimentos",
    title: "Licenciatura en Tecnología de Alimentos",
    kicker: "Ciencias aplicadas",
    body: "La única 100% online de la casa. Laboratorios virtuales, práctica en planta y un título que habilita para bromatología.",
    area: "Ciencias aplicadas",
    sede: "Campus Centro",
    modalidades: ["online"],
    duracion: "4 años",
    salida: "Tecnólogo/a de alimentos en industria, bromatología o comercio",
    arancel: "$ 51.000 / mes",
    badge: "100% online",
    points: ["Secundario completo", "Promedio mínimo 6", "Entrevista de admisión"],
    meta: [
      { label: "Duración", value: "4 años" },
      { label: "Sede", value: "Campus Centro" },
      { label: "Modalidad", value: "Solo online" },
    ],
    price: { amount: "$ 51.000 / mes", note: "final, IVA incluido" },
    plan: [
      "Química de alimentos",
      "Microbiología y biología celular",
      "Tecnología de procesos",
      "Normativa y control de calidad",
      "Práctica en planta",
    ],
  },
];

/** ── Turnos de visita guiada y videollamada ───────────────────────── */
export const turnos: Turno[] = [
  {
    id: "vp-1",
    day: "Jueves 10",
    time: "10:00",
    places: 8,
    modalidad: "presencial",
    etiqueta: "Visita guiada · Campus Norte",
  },
  {
    id: "vp-2",
    day: "Jueves 10",
    time: "16:00",
    places: 5,
    modalidad: "presencial",
    etiqueta: "Visita guiada · Campus Norte",
  },
  {
    id: "vp-3",
    day: "Viernes 11",
    time: "09:30",
    places: 11,
    modalidad: "presencial",
    etiqueta: "Visita guiada · Campus Centro",
  },
  {
    id: "vp-4",
    day: "Viernes 11",
    time: "15:00",
    places: 3,
    modalidad: "presencial",
    etiqueta: "Visita guiada · Campus Centro",
  },
  {
    id: "vp-5",
    day: "Sábado 12",
    time: "11:00",
    places: 14,
    modalidad: "presencial",
    etiqueta: "Visita guiada · Campus Sur",
  },
  {
    id: "vo-1",
    day: "Martes 12",
    time: "18:30",
    places: 20,
    modalidad: "online",
    etiqueta: "Videollamada de orientación",
  },
  {
    id: "vo-2",
    day: "Miércoles 13",
    time: "19:00",
    places: 17,
    modalidad: "online",
    etiqueta: "Videollamada de orientación",
  },
  {
    id: "vo-3",
    day: "Jueves 14",
    time: "12:00",
    places: 9,
    modalidad: "online",
    etiqueta: "Videollamada + tour del campus",
  },
];

/** ── Secciones ─────────────────────────────────────────────────────── */

/** El buscador: las carreras, agrupadas para mostrar en grilla. */
const seccionCarreras: Section = {
  id: "carreras",
  kicker: "Buscador de carreras",
  title: "Seis carreras, con la salida laboral escrita de antemano",
  body: "Filtrá por sede, modalidad y área. Compará duración, arancel y salida laboral antes de decidir: es la misma información que vas a pedir en admisión, pero sin hacer cola.",
  layout: "grid",
  items: carreras,
};

/** Verificación de admisión: cómo se comprueba lo que dice el postulante. */
const seccionAdmision: Section = {
  id: "admision",
  kicker: "Admisión",
  title: "No hay examen de ingreso: la admisión es documental y una charla",
  body: "Verificamos lo que presentás, hablamos con vos y te decimos el resultado. Si no entrás a la carrera que querías, te ofrecemos las que sí quedan y por qué.",
  layout: "list",
  items: [
    {
      id: "verif-1",
      title: "Título secundario",
      body: "Certificado de estudios con el promedio cerrado. Aceptamos equivalencias de títulosforeign con el_same_trámite en la secretaría.",
      points: ["Escuela pública o privada", "Promedio mínimo 6 en todas las materias", "No se exige que el título sea de enero"],
    },
    {
      id: "verif-2",
      title: "Documentación",
      body: " DNI con foto, partidas de nacimiento y certificado de estudios. Todo se verifica en el sistema del Serializer provincial.",
      points: ["DNI, ambas caras", "Partidas de nacimiento", "Certificado de estudios sellado"],
    },
    {
      id: "verif-3",
      title: "Entrevista de admisión",
      body: "Treinta minutos con la coordinación de la carrera. No es un examen: es una charla para saber qué querés hacer y si el plan te sirve.",
      points: ["Online o presencial", "Se agenda en el mismo paso que la visita", "Si no podés, se reprograma sin costo"],
    },
    {
      id: "verif-4",
      title: "Promedio y equivalencias",
      body: "Si venís de otra carrera, evaluamos equivalencias antes de que te inscribas: así sabés cuántos años te faltan.",
      points: ["Equivalencias por plan", "Hasta 4 años de reconocimiento", "Respuesta escrita en 10 días hábiles"],
    },
  ],
};

/** Becas. */
const seccionBecas: Section = {
  id: "becas",
  kicker: "Becas",
  title: "Cuatro becas que se piden con el mismo formulario que la carrera",
  body: "No hay que acreditar un trámite aparte: al inscribirte nos contás tu situación y el sistema arma el combination de beca que te corresponde.",
  layout: "grid",
  items: [
    {
      id: "beca-merito",
      title: "Beca Mérito",
      body: "Cubre el 50% del arancel para los mejores promedios de cada cohorte.",
      badge: "50% arancel",
      meta: [{ label: "Requisito", value: "Promedio 8 o más" }],
      price: { amount: "− 50%", note: "del arancel mensual" },
    },
    {
      id: "beca-economica",
      title: "Ayuda económica",
      body: "Hasta el 30% del arancel según la situación económica del grupo familiar.",
      badge: "Hasta 30%",
      meta: [{ label: "Requisito", value: "Situación económica" }],
      price: { amount: "− 30%", note: "del arancel mensual" },
    },
    {
      id: "beca-residencia",
      title: "Beca Residencia",
      body: "Habitación en el campus para estudiantes que vienen de otra localidad, más el 25% del arancel.",
      badge: "Habitación",
      meta: [{ label: "Requisito", value: "A más de 80 km" }],
      price: { amount: "− 25%", note: "del arancel mensual" },
    },
    {
      id: "beca-progreso",
      title: "Beca Progreso",
      body: "Se reevalúa cada año: si aprobás el 80% de las materias, la beca se renueva sola.",
      badge: "Renovable",
      meta: [{ label: "Requisito", value: "80% de materias" }],
      price: { amount: "− 35%", note: "del arancel mensual" },
    },
  ],
};

/** Campus y sedes. */
const seccionCampus: Section = {
  id: "campus",
  kicker: "Campus",
  title: "Tres campus y una residencia con lugar para 180 estudiantes",
  body: "Cada sede tiene su specialty: el Norte es el de los laboratorios, el Centro el de la comunicación y el Sur el de las aulas de gestión.",
  layout: "grid",
  items: [
    {
      id: "campus-norte",
      title: "Campus Norte",
      body: "Av. del Libertador 12400, Vicente López. Laboratorios de ingeniería y de alimentos, biblioteca y residencia universitaria.",
      points: ["Laboratorios de ingeniería y alimentos", "Residencia para 180 estudiantes", "Estacionamiento propio"],
      meta: [{ label: "Sede de", value: "Software y Psicología" }],
    },
    {
      id: "campus-centro",
      title: "Campus Centro",
      body: "Av. Corrientes 1380, CABA. Talleres de diseño, salas de producción y estudios de grabación.",
      points: ["Talleres de diseño con material incluido", "Sala de sonido y edición de video", "A 4 cuadras del subte"],
      meta: [{ label: "Sede de", value: "Diseño y Alimentos" }],
    },
    {
      id: "campus-sur",
      title: "Campus Sur",
      body: "Ruta 8 km 32, Lanús. Aulas grandes, laboratorio de datos y un observatorio para Administración.",
      points: ["Aulas para 120 personas", "Laboratorio de datos", "Cercanía a la estación"],
      meta: [{ label: "Sede de", value: "Finanzas y Contaduría" }],
    },
  ],
};

/** Noticias. */
const seccionNoticias: Section = {
  id: "noticias",
  kicker: "Noticias",
  title: "Lo último de la casa",
  layout: "grid",
  items: [
    {
      id: "noticia-1",
      title: "Abren 40 lugares para la Beca Mérito 2027",
      body: "El appels cierra el 15 de noviembre. Se asignan por promedio de los dos últimos años de secundaria.",
      badge: "Becas",
      meta: [{ label: "Fecha", value: "12 de octubre" }],
    },
    {
      id: "noticia-2",
      title: "Convenio con 30 empresas para prácticas",
      body: "Veintiocho empresas ya tienen vacantes en desarrollo, diseño, administración y logística.",
      badge: "Prácticas",
      meta: [{ label: "Fecha", value: "6 de octubre" }],
    },
    {
      id: "noticia-3",
      title: "Nueva biblioteca del Campus Sur",
      body: "Mil doscientos libros, 60 puestos de estudio y hemeroteca digital con acceso desde el campus.",
      badge: "Campus",
      meta: [{ label: "Fecha", value: "29 de septiembre" }],
    },
  ],
};

/** Preguntas frecuentes. */
const seccionFaq: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que todos preguntan antes de anotarse",
  layout: "list",
  items: [
    {
      id: "faq-1",
      title: "¿Hay examen de ingreso?",
      body: "No. La admisión es documental más una entrevista de 30 minutos con la coordinación de la carrera.",
    },
    {
      id: "faq-2",
      title: "¿Puedo cursar online y hacer las prácticas en el campus?",
      body: "Sí, y es lo habitual. Las prácticas son presenciales en el campus de la carrera, en bloques de una semana cada dos meses.",
    },
    {
      id: "faq-3",
      title: "¿La visita guiada me compromete con algo?",
      body: "No. Reservar el turno no bloquea vacante ni implica-inscripción. Si al final no te anulás, no pasa nada.",
    },
    {
      id: "faq-4",
      title: "¿Las cuotas tienen recargo o interés?",
      body: "No. Doce cuotas fijas sin interés, sin recargo por pago diferido y sin costo de inscripción.",
    },
    {
      id: "faq-5",
      title: "¿Hay beca para estudiantes que vienen de otra provincia?",
      body: "Sí: la Beca Residencia cubre habitación en el campus para quien viva a más de 80 km. Se pide en el mismo formulario de inscripción.",
    },
    {
      id: "faq-6",
      title: "¿Los datos de esta web son reales?",
      body: "No. Es una demostración de portfolio: la marca, los campus, los aranceles, las becas y las noticias son ficticios.",
    },
  ],
};

/** ── El recorrido de la visita guiada ──────────────────────────────── */
export interface Parada {
  id: string;
  titulo: string;
  minutos: string;
  que: string;
  llevas: string;
}

export const recorrido: Parada[] = [
  {
    id: "p1",
    titulo: "Recepción y el mapa",
    minutos: "10 min",
    que: "Te recibe el equipo de admisiones, no un vendedor. Te dan el plano del campus y el horario del día.",
    llevas: "El plano del campus y el horario real del primer cuatrimestre.",
  },
  {
    id: "p2",
    titulo: "El laboratorio de tu carrera",
    minutos: "20 min",
    que: "Vas a la sala donde cursarías y al laboratorio de tu carrera. Ahí te explican cómo se trabaja, no qué promisos hay.",
    llevas: "El plan de estudios y los horarios de cursada reales.",
  },
  {
    id: "p3",
    titulo: "Una hora de clase",
    minutos: "25 min",
    que: "Una clase de muestra de una materia del segundo año, con los docentes de la carrera y tus preguntas.",
    llevas: "Una idea concreta de cómo se da una materia acá.",
  },
  {
    id: "p4",
    titulo: "Biblioteca y centro de documentación",
    minutos: "15 min",
    que: "Docecientos metros lineales, hemeroteca digital y salas de estudio con reserva individual o grupal.",
    llevas: "El acceso al centro de documentación desde el primer día.",
  },
  {
    id: "p5",
    titulo: "Residencia, comedor y cierre",
    minutos: "20 min",
    que: "Termina en el comedor, que es donde los estudiantes se conocen de verdad. Un rato de charla con dos del curso.",
    llevas: "El horario del comedor, de la residencia y de la biblioteca.",
  },
];

/** ── Contenido completo ────────────────────────────────────────────── */
export const universidad: RubroContent = {
  id: rubro.id,
  brand,
  rubro: rubro.rubro,
  tagline: rubro.tagline,
  objeccion: rubro.objeccion,
  theme: {
    name: "alta",
    palette: { ...rubro.palette },
    fonts: { display: "Fraunces", body: "Instrument Sans" },
    radius: "0.5rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Carreras", href: "/carreras" },
    { label: "Admisión", href: "/admision" },
    { label: "Campus", href: "/campus" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Universidad privada · Admisión 2027",
    title: ["Cada carrera,", "con su salida", "laboral"],
    subtitle:
      "Buscás por sede, modalidad y área, compará duración, arancel y salida laboral, y agendás una visita guiada al campus. Todo en la misma página, sin hacer cola.",
    cta: { label: "Pedir información", href: "#admision" },
    secondaryCta: { label: "Ver las carreras", href: "/carreras" },
    video: {
      src: video(3046),
      poster: poster(3046),
      alt: "Plaza central del campus de UNIVERSIDAD ALTA con su monumento y el edificio de aulas al fondo (imagen de demostración).",
      isVideo: true,
    },
    live: {
      label: "Cupos de visita",
      count: 12,
      min: 6,
      max: 18,
      unit: "lugares esta semana",
      interval: 3600,
    },
  },
  sections: [
    seccionCarreras,
    seccionAdmision,
    seccionBecas,
    seccionCampus,
    seccionNoticias,
    seccionFaq,
  ],
  conversion: {
    id: "admision",
    kicker: "Admisión 2027",
    title: "Pedí información y agendá tu visita guiada",
    body: "Cuatro pasos: elegís la carrera, cómo la vas a cursar, el turno de la visita o la videollamada y tus datos. Al final te damos el pase con el código de seguimiento.",
    steps: ["Carrera", "Modalidad", "Turno y datos", "Confirmación"],
    options: carreras,
    slots: turnos,
    demoNotice: "Demo: no se envían datos.",
  },
  legal: {
    company: "Universidad Alta Sociedad de Gestión (ficticia)",
    cuit: "30-67890123-4",
    address: "Av. del Libertador 12400, Campus Norte, Vicente López, Buenos Aires",
    email: "admisiones@universidadalta.demo",
    phone: "+54 11 4788-9000",
    pricesIncludeTaxes: true,
    taxNote:
      "Todos los importes publicados (arancel, cuotas, becas y residencia) son precios finales e incluyen IVA. Las doce cuotas no tienen recargo por pago diferido.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar una preinscripción online",
      note:
        "Si te preinscribiste online, podés cancelar sin costo desde acá. Completá el DNI y el email con el que te anotaste y la preinscripción se da de baja en el momento.",
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
      { label: "Becas y arancel", href: "/admision#becas" },
    ],
    privacy: [
      "Los datos que dejás en esta web (nombre, teléfono, email y carrera de interés) se usan solo para responder tu consulta de admisión y coordinar tu visita.",
      "El postulante tiene derecho de acceso, rectificación y supresión de sus datos: se lo pide por email y se tramita en un plazo máximo de 10 días.",
      "Las postulaciones y los resultados de admisión se conservan por el plazo legal del archivo universitario (5 años) y después se eliminan.",
      "No sharing con terceros: los datos no se venden, no se ceden y no se usan con fines comerciales.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "El arancel publicado corresponde a doce cuotas mensuales fijas, sin interés y sin recargo por pago diferido.",
      "La beca se reevalúa una vez por año según el rendimiento académico: si el promedio baja, la beca se pierde.",
      "Agendar una visita guiada no compromete la inscripción ni reserva vacante.",
      "La modalidad online mantiene las prácticas presenciales obligatorias en el campus, en bloques de una semana.",
      "Los cupos de cada turno son reales para la demostración: al confirmar, el lugar queda bloqueado.",
    ],
  },
  contact: {
    whatsapp: rubro.whatsapp.phone,
    phone: "+54 11 4788-9000",
    email: "admisiones@universidadalta.demo",
    address: "Av. del Libertador 12400, Campus Norte, Vicente López",
    hours: "Lunes a viernes de 9 a 19 h · Sábados de 9 a 13 h (visitas guiadas)",
    mapsUrl: "https://maps.google.com/?q=Av+del+Libertador+12400+Vicente+Lopez",
  },
  jsonLd: {
    "@type": ["EducationalOrganization", "CollegeOrUniversity"],
    alumniOf: "UNIVERSIDAD ALTA",
    department: [
      { "@type": "EducationalOrganization", name: "Ingeniería" },
      { "@type": "EducationalOrganization", name: "Diseño" },
      { "@type": "EducationalOrganization", name: "Economía" },
    ],
  },
};

/** ── Medios verificados (2026-10-20) ────────────────────────────────── */

/** Fotos (8, todas HTTP 200 y revisadas). */
export const fotos = {
  campus: img("1562774053-701939374585", 1200),
  aula: img("1509062522246-3755977927d7", 1200),
  biblioteca: img("1498243691581-b145c3f54a5a", 1200),
  grupos: img("1522202176988-66273c2fd55f", 1200),
  aulaMagna: img("1519452575417-564c1401ecc0", 1200),
  estudio: img("1523240795612-9a054b0db644", 1200),
  online: img("1571260899304-425eee4c7efc", 1200),
  graduacion: img("1541339907198-e08756dedf3f", 1200),
} as const;

/** Videos de Mixkit (6, mp4 + poster HTTP 200 y posters revisados). */
export const clips = {
  plaza: video(3046),
  fachada: video(3036),
  moderno: video(3090),
  aula: video(3091),
  estudio: video(3092),
  escalera: video(3093),
} as const;

export const posters = {
  plaza: poster(3046),
  fachada: poster(3036),
  moderno: poster(3090),
  aula: poster(3091),
  estudio: poster(3092),
  escalera: poster(3093),
} as const;
