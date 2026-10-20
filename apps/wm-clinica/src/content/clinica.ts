/**
 * Contenido de CLÍNICA AURA — clínica general y diagnóstico por imágenes.
 *
 * MARCA FICTICIA. Todos los datos (direcciones, teléfonos, precios,CUIT,
 * profesionales, sedes) son inventados para demostración.
 */

import { img, poster, video } from "@lib/media";
import { RUBROS } from "@lib/rubros";
import type { RubroContent, Section } from "@lib/types";

const rubro = RUBROS.find((r) => r.id === "clinica")!;

export const brand = "CLÍNICA AURA";

/** ── Servicios ─────────────────────────────────────────────────────── */
const servicios: Section = {
  id: "servicios",
  kicker: "Qué hacemos",
  title: "Seis especialidades, un mismo equipo",
  body: "No te derivamos y volvés a esperar en otro lugar: el consultorio, el laboratorio y las imágenes están en el mismo edificio.",
  layout: "grid",
  items: [
    {
      id: "general",
      title: "Consulta médica general",
      body: "Primer paso para cualquier consulta. Salís con indicación y, si hace falta, pedido de estudio en el momento.",
      points: ["Turnos de 30 minutos", "Adultos y adolescentes desde los 16"],
      meta: [{ label: "Duración", value: "30 min" }],
      price: { amount: "$ 78.000", note: "final, IVA incluido" },
    },
    {
      id: "pediatria",
      title: "Pediatría",
      body: "Control de crecimiento, vacunación y seguimiento. Los padres salen con el resumen en el mismo turno.",
      points: ["Vacunación sin turno previo", "Resumen de crecimiento en el turno"],
      meta: [{ label: "Duración", value: "30 min" }],
      price: { amount: "$ 82.000", note: "final, IVA incluido" },
    },
    {
      id: "ginecologia",
      title: "Ginecología",
      body: "Consulta, control y espaciamiento. Ecografía en el mismo turno cuando está indicado.",
      points: ["Ecografía obstétrica sin turno extra"],
      meta: [{ label: "Duración", value: "40 min" }],
      price: { amount: "$ 95.000", note: "final, IVA incluido" },
    },
    {
      id: "dermatologia",
      title: "Dermatología",
      body: "Diagnóstico de manchas, lunares y lesions de la piel. Biopsia en consultorio si el profesional lo indica.",
      points: ["Luz polarizada", "Seguimiento con foto comparada"],
      meta: [{ label: "Duración", value: "30 min" }],
      price: { amount: "$ 88.000", note: "final, IVA incluido" },
    },
    {
      id: "cardiologia",
      title: "Cardiología",
      body: "Electrocardiograma en consulta y ecocardiograma con informe en 48 horas.",
      points: ["Electrocardiograma incluido en la consulta"],
      meta: [{ label: "Duración", value: "45 min" }],
      price: { amount: "$ 110.000", note: "final, IVA incluido" },
    },
    {
      id: "kinesiologia",
      title: "Kinesiología",
      body: "Rehabilitación postquirúrgica, contracturas y dolor de espalda. Plan de tratamiento con ejercicios para hacer en casa.",
      points: ["15 sesiones con precio fijo", "Rehabilitación postquirúrgica"],
      meta: [{ label: "Duración", value: "45 min" }],
      price: { amount: "$ 64.000", note: "final, IVA incluido" },
    },
  ],
};

/** ── Estudios de diagnóstico ───────────────────────────────────────── */
const estudios: Section = {
  id: "estudios",
  kicker: "Diagnóstico por imágenes",
  title: "Estudios con hora garantizada y resultado online",
  body: "El informe queda en tu portal a las 48 horas. Si algo no está claro, te llamamos y lo explicamos sin que vuelvas a pagar la consulta.",
  layout: "grid",
  items: [
    {
      id: "rx",
      title: "Radiografía digital",
      body: "RX de tórax, columna, cadera y miembros. Informe en 24 horas.",
      points: [
        "Vení con ropa cómoda, sin objetos metálicos",
        "No necesitás ayuno",
        "La toma dura 15 minutos y el informe llega al día siguiente",
      ],
      meta: [
        { label: "Duración", value: "15 min" },
        { label: "Resultado", value: "24 h" },
      ],
      price: { amount: "$ 54.000", note: "final, IVA incluido" },
      badge: "Sin turno",
    },
    {
      id: "ecografia",
      title: "Ecografía",
      body: "Abdominal, tiroides, obstétrica, Doppler y partes blandas.",
      points: [
        "Ayuno de 6 horas para los estudios abdominales",
        "Traé ropa de dos piezas",
        "Para embarazo, la ecografía obstétrica se hace desde las 8 semanas",
      ],
      meta: [
        { label: "Duración", value: "25 min" },
        { label: "Resultado", value: "48 h" },
      ],
      price: { amount: "$ 72.000", note: "final, IVA incluido" },
    },
    {
      id: "mamografia",
      title: "Mamografía",
      body: "Digital bilateral con informe de radiólogo. Mamografía de screening anual.",
      points: [
        "No uses desodorante, perfume ni talco en axilas",
        "Vení sin acolchado",
        "Si fue tu primera mamografía, traé las radiografías previas",
      ],
      meta: [
        { label: "Duración", value: "30 min" },
        { label: "Resultado", value: "72 h" },
      ],
      price: { amount: "$ 98.000", note: "final, IVA incluido" },
    },
    {
      id: "tomografia",
      title: "Tomografía",
      body: "Sin contraste y con contraste. Escáner de 64 cortes: estudios más cortos y menor dosis.",
      points: [
        "Ayuno de 4 horas",
        "Avisá si sos claustrofóbico: tenemos protocolo con sedación",
        "Avisá si tenés marcapasos, punturas o placas metálicas en el cuerpo",
      ],
      meta: [
        { label: "Duración", value: "20 min" },
        { label: "Resultado", value: "72 h" },
      ],
      price: { amount: "$ 185.000", note: "final, IVA incluido" },
    },
    {
      id: "ecocardiograma",
      title: "Ecocardiograma",
      body: "Con Doppler. Informe cardiológico en 48 horas.",
      points: [
        "Sin preparación",
        "Traé los estudios anteriores",
        "Ducharse antes de venir: el gel no mancha la ropa",
      ],
      meta: [
        { label: "Duración", value: "40 min" },
        { label: "Resultado", value: "48 h" },
      ],
      price: { amount: "$ 132.000", note: "final, IVA incluido" },
    },
  ],
};

/** ── Sedes ─────────────────────────────────────────────────────────── */
const sedes: Section = {
  id: "sedes",
  kicker: "Dónde",
  title: "Tres sedes en la Ciudad y en el norte",
  body: "El mismo equipo y los mismos estudios en las tres. Podés pedir el estudio en una sede y retirar el informe en otra.",
  layout: "grid",
  items: [
    {
      id: "palermo",
      title: "AURA Palermo",
      body: "Av. Libertador 4180, Palermo. Planta baja con acceso sin escalones.",
      points: ["Guardia de estudios hasta las 21 h", "Estacionamiento en Medrano al 1200"],
      meta: [{ label: "Horario", value: "Lun a Sáb de 8 a 21 h" }],
    },
    {
      id: "belgrano",
      title: "AURA Belgrano",
      body: "Av. Cabildo 2150, Belgrano. Imagen en el subsuelo.",
      points: ["Reserva de estudios por WhatsApp", "Ascensor con espacio para silla de ruedas"],
      meta: [{ label: "Horario", value: "Lun a Vie de 8 a 20 h" }],
    },
    {
      id: "vicente",
      title: "AURA Vicente López",
      body: "Av. del Libertador 1690, Vicente López. Parking propio.",
      points: ["Sábados de 9 a 14 h", "Estudio de imagen el mismo día"],
      meta: [{ label: "Horario", value: "Lun a Sáb de 8 a 20 h" }],
    },
  ],
};

/** ── Preguntas frecuentes ──────────────────────────────────────────── */
const faq: Section = {
  id: "faq",
  kicker: "Dudas",
  title: "Lo que todos preguntan antes de pedir el turno",
  layout: "list",
  items: [
    {
      id: "a1",
      title: "¿Tengo que ir en ayunas?",
      body: "Solo para algunos estudios. En la ficha de cada estudio te decimos si necesitás ayuno y cuántas horas. Para la consulta médica no hace falta.",
    },
    {
      id: "a2",
      title: "¿Puedo pedir el turno por WhatsApp?",
      body: "Sí. Escribinos y te respondemos con los horarios disponibles. Si preferís, el formulario de esta web te deja elegir el horario exacto y genera un pase.",
    },
    {
      id: "a3",
      title: "¿Cuánto tarda el resultado?",
      body: "Las radiografías están online a las 24 horas; el resto, a las 48. Los estudios con contraste se los entrega el radiólogo en el turno.",
    },
    {
      id: "a4",
      title: "¿Atienden por obra social?",
      body: "Trabajamos con las principales prepagas y también con consultas particulares. Traé tu credencial: la cobertura se verifica en recepción.",
    },
    {
      id: "a5",
      title: "¿Y si el estudio sale normal?",
      body: "Es la mejor noticia. Si el informe necesita una consulta, la primera explicación va sin cargo dentro de los 30 días.",
    },
    {
      id: "a6",
      title: "¿Los datos de esta web son reales?",
      body: "No. Es una demostración de portfolio: la marca, los precios, las sedes y los profesionales son ficticios.",
    },
  ],
};

/** ── Contenido completo ────────────────────────────────────────────── */
export const clinica: RubroContent = {
  id: rubro.id,
  brand,
  rubro: rubro.rubro,
  tagline: rubro.tagline,
  objeccion: rubro.objeccion,
  theme: {
    name: "aura",
    palette: { ...rubro.palette },
    fonts: { display: "Bricolage Grotesque", body: "Manrope" },
    radius: "0.75rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Estudios", href: "/estudios" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Clínica general + diagnóstico por imágenes",
    title: ["Todo tu", "diagnóstico", "en un día"],
    subtitle:
      "Consultas, estudios y resultados en el mismo edificio. Turno online con hora garantizada, informe online en 48 horas y WhatsApp directo con el equipo.",
    cta: { label: "Sacar mi turno", href: "#turno" },
    secondaryCta: { label: "Ver estudios", href: "/estudios" },
    video: {
      src: video(4126),
      poster: poster(4126),
      alt: "Monitor de signos vitales en una sala de estudios de CLÍNICA AURA (imagen de demostración).",
      isVideo: true,
    },
    live: { label: "Abierto ahora", count: 6, min: 3, max: 9, unit: "turnos hoy", interval: 3400 },
  },
  sections: [servicios, estudios, sedes, faq],
  conversion: {
    id: "turno",
    kicker: "Turno online",
    title: "Pedí tu turno y recibí el pase al instante",
    body: "Elegís el estudio, la hora y tus datos. Al confirmar te damos un pase con código para mostrar en recepción.",
    steps: ["Datos", "Horario", "Confirmación"],
    options: estudios.items ?? [],
    slots: [
      { id: "s1", day: "Martes 21", time: "08:30", places: 2 },
      { id: "s2", day: "Martes 21", time: "10:15", places: 4 },
      { id: "s3", day: "Martes 21", time: "12:00", places: 1 },
      { id: "s4", day: "Miércoles 22", time: "09:00", places: 5 },
      { id: "s5", day: "Miércoles 22", time: "11:30", places: 3 },
      { id: "s6", day: "Miércoles 22", time: "16:45", places: 6 },
      { id: "s7", day: "Jueves 23", time: "08:00", places: 2 },
      { id: "s8", day: "Jueves 23", time: "14:30", places: 4 },
    ],
    demoNotice: "Demo: no se envían datos.",
  },
  legal: {
    company: "Clínica Aura Sociedad por Acciones (ficticia)",
    cuit: "30-71234567-9",
    address: "Av. Libertador 4180, CABA",
    email: "turnos@clinicaaura.demo",
    phone: "+54 11 4321-0000",
    pricesIncludeTaxes: true,
    taxNote:
      "Todos los precios publicados son precios finales e incluyen el IVA. No hay cargos adicionales en recepción.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar un turno online",
      note:
        "Si compraste un turno o un estudio online, podés cancelarlo sin costo desde acá. Completá los datos del turno y se anula en el momento.",
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
      "Los datos que dejás en esta web se usan únicamente para coordinar tu turno y avisarte por WhatsApp o email.",
      "No se comparten con terceros ni con fines comerciales.",
      "Pedí la baja de tus datos desde el botón de baja del pie de página: se elimina todo en un plazo máximo de 10 días.",
      "Esta web es una demostración de portfolio: los formularios no envían información a ningún servidor.",
    ],
    terms: [
      "El horario queda confirmado recién cuando recibís el pase con código.",
      "Si no podés asistir, avisanos con al menos 4 horas de anticipación para liberar el turno.",
      "Los estudios con ayuno requieren que se cumpla la preparación indicada: si no, el estudio se reprograma.",
      "La cobertura de obra social se verifica en recepción y depende de cada prepaidora.",
    ],
  },
  contact: {
    whatsapp: rubro.whatsapp.phone,
    phone: "+54 11 4321-0000",
    email: "turnos@clinicaaura.demo",
    address: "Av. Libertador 4180, Palermo, CABA",
    hours: "Lunes a sábado de 8 a 21 h · Guardias de estudios hasta las 21 h",
    mapsUrl: "https://maps.google.com/?q=Av+Libertador+4180+Palermo",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "MedicalClinic"],
    medicalSpecialty: ["PrimaryCare", "DiagnosticImaging"],
  },
};

/** Fotos de la app (pool verificado de `media.ts`). */
export const fotos = {
  instrumental: img("1771270786606-f5a0e57db762", 1200),
  corredor: img("1761971975962-9cc397e2ba2a", 1200),
  profesional: img("1553877522-43269d4ea984", 800, 1000),
  equipo: img("1522071820081-009f0129c71c", 1200),
} as const;
