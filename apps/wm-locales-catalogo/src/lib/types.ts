/**
 * webmaster-kit — contrato de contenido.
 *
 * Una app de rubro (apps/wm-*) es un objeto `RubroContent` + un layout.
 * Todo lo que cambia entre rubros (textos, paleta, medios, legales) vive
 * en `src/content/<rubro>.ts`. Todo lo que NO cambia (navegación, hero,
 * ticket, cortina) vive en este kit.
 *
 * IMPORTANTE: las apps resuelven `@lib/*` -> `src/lib/*`.
 * Dentro del kit, `@lib/*` -> la raíz del kit (ver packages/webmaster-kit/tsconfig.json).
 */

/** Paleta de un rubro: 1 color de fondo + 1 claro + 1 acento. */
export interface Palette {
  /** Fondo dominante de la app. */
  bg: string;
  /** Color claro (texto sobre `bg`). */
  fg: string;
  /** Color de acento (CTA, precio, estados vivos). */
  accent: string;
}

/** Fuentes del rubro: 1 display + 1 de texto. Se cargan por `<link>` a Google Fonts. */
export interface Fonts {
  /** Familia display (titulares). */
  display: string;
  /** Familia de texto (párrafos, UI). */
  body: string;
  /** URL de Google Fonts completa. Si se omite, el layout la arma. */
  href?: string;
}

/** Tema visual por rubro. */
export interface Theme {
  /** Nombre del tema (para depurar). */
  name: string;
  palette: Palette;
  fonts: Fonts;
  /** Radio de esquinas en rem. */
  radius?: string;
}

/** Item de navegación. */
export interface NavItem {
  label: string;
  href: string;
}

/** Referencia a un medio (foto o video). */
export interface MediaRef {
  /** URL del recurso. */
  src: string;
  /** Poster (para video) o thumbnail. */
  poster?: string;
  /** Texto alternativo. Obligatorio: accesibilidad. */
  alt: string;
  /** `true` cuando `src` apunta a un .mp4. */
  isVideo?: boolean;
}

/** Señal "en vivo" creíble. */
export interface LiveSignal {
  /** Etiqueta: "Abierto ahora", "Quedan turnos", ... */
  label: string;
  /** Valor inicial. */
  count: number;
  /** Piso del número fluctuante. */
  min?: number;
  /** Techo del número fluctuante. */
  max?: number;
  /** Sufijo: "lugares", "turnos", "estudios". */
  unit?: string;
  /** Milisegundos entre fluctuaciones. */
  interval?: number;
}

/** Fila precio / dato. */
export interface Price {
  /** Texto del precio: "$ 48.000" */
  amount: string;
  /** Nota al pie: "final, IVA incluido". */
  note?: string;
}

/** Item de catálogo (servicio, estudio, sede, faq). */
export interface CatalogItem {
  id: string;
  title: string;
  /** Antetítulo corto. */
  kicker?: string;
  /** Texto principal. */
  body: string;
  /** Puntos clave (preparación, requisitos). */
  points?: string[];
  /** Datos clave: duración, sede,WxH. */
  meta?: { label: string; value: string }[];
  price?: Price;
  media?: MediaRef;
  /** Etiqueta corta: "Más pedido", "24 h". */
  badge?: string;
}

/** Bloque de contenido de una página. */
export interface Section {
  id: string;
  kicker?: string;
  title: string;
  body?: string;
  /** Layout sugerido para renderizar los items. */
  layout?: "grid" | "list" | "timeline" | "split";
  items?: CatalogItem[];
  cta?: { label: string; href: string };
}

/** Hero de portada. */
export interface HeroContent {
  kicker: string;
  /** Titular partido en líneas (una por línea de la máscara). */
  title: string[];
  subtitle: string;
  /** CTA principal (UNO solo sobre el fold). */
  cta: { label: string; href: string };
  /** CTA secundario (fuera del fold). */
  secondaryCta?: { label: string; href: string };
  /** Video de fondo que se encoge con el scroll. */
  video: MediaRef;
  live?: LiveSignal;
}

/** Horario disponible. */
export interface Slot {
  id: string;
  /** "Martes 21" */
  day: string;
  /** "09:30" */
  time: string;
  /** Lugares disponibles (se descuenta al confirmar). */
  places: number;
}

/** Conversión principal (la que termina en TICKET). */
export interface Conversion {
  /** Identificador: "turno", "reserva", "cotizacion". */
  id: string;
  kicker?: string;
  title: string;
  body?: string;
  /** Nombres de los pasos, en orden. */
  steps: string[];
  /** Paso 1: qué se agenda (estudio, servicio, Lavado XL...). */
  options: CatalogItem[];
  /** Paso 2: horarios disponibles. */
  slots: Slot[];
  /** Aviso de demo (la app NO manda datos). */
  demoNotice: string;
}

/** Datos legales (AR). */
export interface Legal {
  company: string;
  cuit: string;
  address: string;
  email: string;
  phone: string;
  /** true -> los precios publicados son finales (impuestos incluidos). */
  pricesIncludeTaxes: boolean;
  /** Texto del aviso de precios. */
  taxNote?: string;
  /** Botón de arrepentimiento / baja (Res. 316/2018 y 271/2020). */
  withdrawal: {
    enabled: boolean;
    label: string;
    note: string;
    /** Normativa citada. */
    resolution: string;
  };
  /** Link a Defensa del Consumidor. */
  consumerDefense: { label: string; url: string };
  /** Documentos legales con link interno. */
  documents: { label: string; href: string }[];
  privacy?: string[];
  terms?: string[];
}

/** Datos de contacto. */
export interface Contact {
  /** Número internacional sin signos: "5491100000000". */
  whatsapp: string;
  /** Número legible: "+54 11 0000-0000". */
  phone: string;
  email: string;
  address: string;
  /** "Lunes a viernes de 8 a 20 h" */
  hours: string;
  mapsUrl?: string;
}

/**
 * Contrato completo de una app de rubro.
 *
 * Las 8 apps (7 rubros + portfolio madre) implementan este mismo objeto.
 */
export interface RubroContent {
  /** Id del rubro (coincide con `packages/webmaster-kit/rubros.ts`). */
  id: string;
  /** Marca ficticia: "CLÍNICA AURA". */
  brand: string;
  /** Rubro: "Clínica general y diagnóstico por imágenes". */
  rubro: string;
  /** Bajada corta. */
  tagline: string;
  /** Objeción que la web responde ("«No quiero esperar 3 horas»"). */
  objeccion: string;
  theme: Theme;
  nav: NavItem[];
  hero: HeroContent;
  sections: Section[];
  conversion: Conversion;
  legal: Legal;
  contact: Contact;
  /** Datos estructurados extra (se mergean al JSON-LD LocalBusiness). */
  jsonLd?: Record<string, unknown>;
}
