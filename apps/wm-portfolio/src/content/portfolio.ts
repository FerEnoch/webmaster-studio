/** Contenido del sitio de Webmaster Studio. Los ejemplos y datos de contacto son ficticios. */

import { img, poster, video } from "@lib/media";
import { PORTFOLIO, RUBROS } from "@lib/rubros";
import type { CatalogItem, RubroContent, Section } from "@lib/types";

export const brand = "Webmaster Studio";

/** Copy del catálogo del estudio; conserva las identidades y rutas del registro de rubros. */
const solutionCopy: Record<string, { tagline: string; objeccion: string }> = {
  concesionario: {
    tagline: "Catálogo de vehículos con fichas y consultas comerciales.",
    objeccion: "Información de cada vehículo y condiciones de compra en un mismo lugar.",
  },
  lavadero: {
    tagline: "Presentación de servicios de lavado y gestión de reservas.",
    objeccion: "Detalle de los tratamientos y del cuidado del vehículo.",
  },
  "lavadero-premium": {
    tagline: "Solución PREMIUM Gloss & Glass: showroom de luz, bar y detalle.",
    objeccion: "La experiencia premium del rubro: reserva en 30 segundos, cero letra chica.",
  },
  estetica: {
    tagline: "Servicios de estética, actividades y solicitud de turnos.",
    objeccion: "Información sobre tratamientos, profesionales y disponibilidad.",
  },
  universidad: {
    tagline: "Oferta académica, becas y consultas de admisión.",
    objeccion: "Programas de estudio y orientación para futuros estudiantes.",
  },
  inmobiliaria: {
    tagline: "Catálogo de propiedades y coordinación de visitas.",
    objeccion: "Fichas de propiedades con imágenes y características relevantes.",
  },
  arquitectura: {
    tagline: "Presentación de proyectos y consultas de obra.",
    objeccion: "Etapas de trabajo, alcance y criterios para solicitar un presupuesto.",
  },
  "arquitectura-premium": {
    tagline: "Solución PREMIUM del rubro arquitectura: recorrido 3D, tour de obra y cotización en vivo.",
    objeccion: "Ver la obra terminada antes de firmar: recorrido 3D, tour y precio en vivo.",
  },
};

export const solutions = RUBROS.map((r) => ({ ...r, ...solutionCopy[r.id] }));

const servicios: Section = {
  id: "servicios",
  kicker: "Servicios",
  title: "Desarrollo de software para tu organización",
  body: "Diseñamos y desarrollamos sitios web y aplicaciones según las necesidades de cada proyecto. Definimos el alcance, las integraciones y el mantenimiento junto con tu equipo.",
  layout: "grid",
  items: [
    {
      id: "consulta",
      title: "Análisis y cotización",
      body: "Revisamos los objetivos y requisitos para preparar una propuesta. Podemos preparar una demo rápida para explorar la solución antes de definir el desarrollo.",
      points: ["Relevamiento de necesidades", "Alcance y prioridades", "Propuesta de trabajo"],
      meta: [{ label: "Modalidad", value: "Según el proyecto" }],
    },
    {
      id: "sitio",
      title: "Sitios web por industria",
      body: "Sitios con contenido, navegación y consultas adaptados a la actividad de tu organización.",
      points: ["Diseño y contenido específicos", "Experiencia móvil y de escritorio", "Formularios y canales de contacto"],
      meta: [{ label: "Plazo estimado", value: "1 a 2 semanas, según alcance" }],
    },
    {
      id: "conversion",
      title: "Aplicaciones e integraciones",
      body: "Desarrollamos funcionalidades conectadas a los sistemas que necesita tu operación, según el alcance acordado.",
      points: ["Backend y bases de datos", "Agendas y gestión de reservas", "Integraciones con pagos y notificaciones"],
      meta: [{ label: "Plazo estimado", value: "3 a 5 semanas, según alcance" }],
    },
    {
      id: "mantenimiento",
      title: "Mantenimiento y soporte",
      body: "Acompañamos la operación del sitio con alojamiento, copias de seguridad y revisiones de rendimiento.",
      points: ["Backups y monitoreo", "Actualizaciones y despliegue", "Canal de consultas"],
      meta: [{ label: "Modalidad", value: "Mensual" }],
    },
  ],
};

const precios: Section = {
  id: "precios",
  kicker: "Valores de referencia",
  title: "Una cotización según el alcance",
  body: "Estos valores orientan la consulta inicial e incluyen impuestos. La propuesta final detalla funcionalidades, plazos y condiciones de cada proyecto.",
  layout: "grid",
  items: [
    {
      id: "plan-home",
      title: "Página de presentación",
      body: "Una página adaptada a tu actividad, con contenido propio y un canal de consulta.",
      points: ["1 a 2 semanas, según alcance", "Hasta 5 secciones", "Formulario, WhatsApp o solicitud de reserva"],
      meta: [{ label: "Incluye", value: "SEO base y despliegue" }],
      price: { amount: "desde USD 300", note: "final, impuestos incluidos" },
    },
    {
      id: "plan-conversion",
      title: "Sitio con integraciones",
      body: "Un sitio con backend para gestionar consultas, turnos o reservas, según lo acordado.",
      points: ["3 a 5 semanas, según alcance", "Turnos, reservas o carritos", "Notificaciones según integración"],
      meta: [{ label: "Incluye", value: "Panel o base de datos" }],
      price: { amount: "USD 600 a 1.200", note: "final, impuestos incluidos" },
    },
    {
      id: "plan-pack",
      title: "Contenido y SEO local",
      body: "Preparación de imágenes, textos y presencia en buscadores para acompañar el desarrollo.",
      points: ["Sesión de fotos o selección de imágenes", "Textos por sección", "Ficha de Google y SEO local"],
      meta: [{ label: "Duración estimada", value: "1 semana" }],
      price: { amount: "+ USD 200", note: "final, impuestos incluidos" },
    },
    {
      id: "plan-mantenimiento",
      title: "Mantenimiento",
      body: "Soporte técnico y revisiones periódicas para mantener el sitio actualizado.",
      points: ["Hosting y backups", "Cambios menores incluidos", "Revisión mensual de rendimiento"],
      meta: [{ label: "Modalidad", value: "Mensual" }],
      price: { amount: "USD 30 a 60 / mes", note: "final, impuestos incluidos" },
    },
  ],
};

const proceso: Section = {
  id: "proceso",
  kicker: "Proceso de trabajo",
  title: "De la consulta a la propuesta de desarrollo",
  body: "Partimos de las necesidades de tu organización para definir una solución, acordar su alcance y planificar la implementación.",
  layout: "timeline",
  items: [
    {
      id: "p1",
      title: "Consulta inicial",
      body: "Nos contás sobre tu actividad, tus objetivos y los procesos que necesitás mejorar.",
      points: ["Actividad y contexto", "Objetivos del proyecto"],
    },
    {
      id: "p2",
      title: "Análisis de requisitos",
      body: "Revisamos funcionalidades, contenido e integraciones. Si ayuda a evaluar la propuesta, podemos preparar una demo rápida.",
      points: ["Necesidades y prioridades", "Sistemas a integrar"],
    },
    {
      id: "p3",
      title: "Cotización y planificación",
      body: "Preparamos una propuesta con alcance, presupuesto y plazos para revisar antes de iniciar el trabajo.",
      points: ["Entregables definidos", "Condiciones y etapas acordadas"],
    },
    {
      id: "p4",
      title: "Desarrollo y seguimiento",
      body: "Implementamos la solución por etapas y revisamos los avances con tu equipo hasta la entrega.",
      points: ["Revisiones de avance", "Validación y puesta en marcha"],
    },
  ],
};

const prueba: Section = {
  id: "prueba",
  kicker: "Criterios de trabajo",
  title: "Calidad y claridad en cada etapa",
  body: "Las soluciones por industria permiten explorar nuestro enfoque de diseño y desarrollo. Son ejemplos con información ficticia, no casos de clientes ni resultados comerciales acreditados.",
  layout: "grid",
  items: [
    {
      id: "lighthouse",
      title: "Rendimiento y accesibilidad",
      body: "Incluimos revisiones de rendimiento, accesibilidad y SEO en el proceso de validación.",
      points: ["Evaluación con herramientas de diagnóstico"],
    },
    {
      id: "un-cta",
      title: "Navegación orientada a objetivos",
      body: "Organizamos el contenido y las acciones principales para facilitar las consultas y el uso del sitio.",
      points: ["Jerarquía de contenido", "Acciones claras"],
    },
    {
      id: "consola",
      title: "Validación técnica",
      body: "Revisamos las vistas móviles y de escritorio y realizamos comprobaciones técnicas antes de la entrega.",
      points: ["Revisión de rutas", "Comprobación de tipos"],
    },
    {
      id: "entrega",
      title: "Alcance documentado",
      body: "La propuesta establece qué se desarrolla y qué integraciones se incluyen, con plazos acordados para cada etapa.",
      points: ["Entregables y condiciones", "Seguimiento del proyecto"],
    },
  ],
};

const faq: Section = {
  id: "faq",
  kicker: "Preguntas frecuentes",
  title: "Información para iniciar un proyecto",
  layout: "list",
  items: [
    {
      id: "f1",
      title: "¿Qué es Webmaster Studio?",
      body: "Somos un estudio de desarrollo de software. Diseñamos sitios web, aplicaciones e integraciones para organizaciones de distintas industrias.",
    },
    {
      id: "f2",
      title: "¿Qué representan las soluciones por industria?",
      body: "Son ocho ejemplos navegables con marcas, precios y datos ficticios. Sus formularios simulan interacciones y no envían información a un servidor. No son servicios operativos ni proyectos de clientes.",
    },
    {
      id: "f3",
      title: "¿Cómo se solicita una cotización?",
      body: "La consulta inicial permite revisar objetivos, funcionalidades y necesidades de integración. Con esa información definimos una propuesta. El formulario de este sitio es una simulación: no envía solicitudes ni genera una cotización real.",
    },
    {
      id: "f4",
      title: "¿Se puede evaluar una idea antes de desarrollarla?",
      body: "Podemos preparar una demo rápida para revisar una idea o una funcionalidad. Su alcance y disponibilidad se acuerdan durante la consulta, sin prometer una entrega en un plazo fijo.",
    },
    {
      id: "f5",
      title: "¿Cómo se definen los plazos y el presupuesto?",
      body: "Dependen del alcance, el contenido disponible y las integraciones necesarias. Los valores publicados son orientativos; la cotización detalla las condiciones antes de comenzar.",
    },
    {
      id: "f6",
      title: "¿Podemos usar nuestras imágenes y nuestra marca?",
      body: "Sí. Trabajamos con la identidad y los materiales de tu organización. Si necesitás contenido adicional, lo incluimos en la propuesta según lo acordado.",
    },
  ],
};

const rubroOptions: CatalogItem[] = solutions.map((r) => ({
  id: r.id,
  kicker: r.nombre,
  title: r.rubro,
  body: r.tagline,
}));

export const portfolio: RubroContent = {
  id: PORTFOLIO.id,
  brand,
  rubro: "Estudio de Desarrollo de Software",
  tagline: "Webmaster Studio: desarrollo de software, sitios web e integraciones para organizaciones.",
  objeccion: "Software adaptado a las necesidades de tu organización",
  theme: {
    name: "portfolio",
    palette: { ...PORTFOLIO.palette },
    fonts: {
      display: "Archivo Black",
      body: "Hanken Grotesk",
      // Archivo Black solo ofrece peso 400; se conserva su URL específica.
      href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hanken+Grotesk:wght@400;500;600;700&display=swap",
    },
    radius: "0.6rem",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Soluciones por industria", href: "/demos" },
    { label: "Servicios", href: "/servicios" },
    { label: "Contacto", href: "/contacto" },
    { label: "Legal", href: "/legal" },
  ],
  hero: {
    kicker: "Webmaster Studio",
    title: ["Estudio de", "Desarrollo", "de Software"],
    subtitle: "Diseñamos y desarrollamos sitios web, aplicaciones e integraciones. Acompañamos a tu organización desde la definición del proyecto hasta su implementación y mantenimiento.",
    cta: { label: "Solicitar cotización", href: "#demo" },
    secondaryCta: { label: "Soluciones por industria", href: "/demos" },
    video: {
      src: video(3256),
      poster: poster(3256),
      alt: "Plano de una obra en curso utilizado como imagen ilustrativa del estudio.",
      isVideo: true,
    },
    live: { label: "Soluciones por industria", count: 8, min: 8, max: 8, unit: "soluciones", interval: 3400 },
  },
  sections: [servicios, precios, proceso, prueba, faq],
  conversion: {
    id: "demo",
    kicker: "Contacto y cotización",
    title: "Conversemos sobre tu proyecto",
    body: "Contanos qué necesitás para definir el alcance y preparar una cotización. Podemos preparar una demo rápida para explorar la propuesta. Este formulario es una simulación y no envía solicitudes.",
    steps: ["Tu proyecto", "Contacto", "Resumen"],
    options: rubroOptions,
    slots: [],
    demoNotice: "Demo: no se envían datos ni se registra una solicitud. Los datos de contacto publicados son ficticios.",
  },
  legal: {
    company: "Webmaster Studio (datos legales ficticios)",
    cuit: "30-70987654-3",
    address: "Av. Corrientes 1234, CABA · domicilio ficticio",
    email: "hola@webmasterstudio.demo",
    phone: "+54 11 0000-0000",
    pricesIncludeTaxes: true,
    taxNote: "Los valores de referencia incluyen impuestos. El presupuesto y las condiciones de pago se definen en la cotización de cada proyecto.",
    withdrawal: {
      enabled: true,
      label: "Botón de baja · Cancelar un servicio online",
      note: "Este formulario simula una solicitud de baja. No envía datos, no cancela servicios ni registra una solicitud real.",
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
      "Los formularios de este sitio son simulaciones: no envían información a un servidor ni guardan solicitudes.",
      "Los datos ingresados se muestran únicamente en la interfaz durante la interacción. No ingreses información sensible.",
      "Los enlaces a WhatsApp abren un servicio externo con un mensaje preparado. El mensaje solo se envía si decidís hacerlo desde ese servicio.",
      "Los datos de contacto publicados son ficticios y no constituyen un canal operativo de atención.",
    ],
    terms: [
      "Este sitio presenta los servicios de Webmaster Studio y soluciones ilustrativas por industria. Las marcas y los datos de los ejemplos son ficticios.",
      "La consulta y cotización se representan mediante una simulación local, sin backend ni envío de solicitudes.",
      "Se puede preparar una demo rápida para evaluar una propuesta; su alcance y disponibilidad se acuerdan durante la consulta, sin un plazo fijo de entrega.",
      "Los valores publicados son de referencia. El alcance, presupuesto, plazos e integraciones se acuerdan en una propuesta específica antes de iniciar un proyecto.",
    ],
  },
  contact: {
    whatsapp: "5491100000000",
    phone: "+54 11 0000-0000",
    email: "hola@webmasterstudio.demo",
    address: "Av. Corrientes 1234, CABA · domicilio ficticio",
    hours: "Lunes a viernes de 9 a 19 h · horario ilustrativo",
    mapsUrl: "https://maps.google.com/?q=Av+Corrientes+1234+CABA",
  },
  jsonLd: {
    "@type": ["LocalBusiness", "ProfessionalService"],
    areaServed: "AR",
  },
};

/** Imágenes ilustrativas de las ocho soluciones por industria. */
export const demoImages: Record<string, string> = {
  concesionario: img("1503376780353-7e6692767b70", 1200),
  lavadero: img("1637430308606-86576d8fef3c", 1200),
  "lavadero-premium": img("1637430308606-86576d8fef3c", 1200),
  estetica: img("1596178065887-1198b6148b2b", 1200),
  universidad: img("1562774053-701939374585", 1200),
  inmobiliaria: img("1512917774080-9991f1c4c750", 1200),
  arquitectura: img("1487958449943-2429e8be8625", 1200),
  "arquitectura-premium": img("1600585154340-be6161a56a0c", 1200),
};

export const fotoEstudio = img("1497366754035-f200968a6e72", 1200);
