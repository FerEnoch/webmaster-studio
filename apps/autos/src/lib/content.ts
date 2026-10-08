/** Videos libres de Mixkit (720p). */
export const video = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
export const poster = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`;
export const img = (id: string, w = 1400, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;

export const EV_PHOTO = "1593941707882-a5bba14938c7";

export const V = {
  hero: 35540, // deportivo blanco en autopista al atardecer
  dawn: 52427, // rojo en ruta con curvas al amanecer
  taillight: 63, // primer plano de ópticas
  closeup: 49,
  parking: 74, // convertible en estacionamiento subterráneo
  dashboard: 64, // tablero acelerando
  city: 72, // manejando en la ciudad
  driver: 4521, // conductora en ruta
  forest: 45312, // ruta con curvas en el bosque
  tunnel: 47629, // túnel a alta velocidad
  aerial: 45258, // autopista entre árboles de otoño
};

export const story = [
  {
    kicker: "01 — Diseño",
    title: "Cada línea, pensada para el viento.",
    text: "Seleccionamos autos por cómo se ven, cómo se sienten y cómo envejecen. Nada de relleno en nuestro salón.",
    video: V.taillight,
  },
  {
    kicker: "02 — Potencia",
    title: "De 0 a 100 en lo que dura esta frase.",
    text: "Deportivos, sedanes de alta gama y SUVs con mecánica revisada en 150 puntos por nuestro taller oficial.",
    video: V.dashboard,
  },
  {
    kicker: "03 — Libertad",
    title: "La ruta es tuya.",
    text: "Te lo entregamos patentado, con seguro y tanque lleno. Vos solo elegí para dónde salir.",
    video: V.forest,
  },
];

export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  type: "Deportivo" | "Sedán" | "SUV" | "Eléctrico" | "Familiar";
  fuel: "Nafta" | "Eléctrico" | "Híbrido";
  hp: number;
  zeroTo100: number;
  topSpeed: number;
  trans: "Automática" | "Manual";
  img: string;
  tag?: string;
};

export const cars: Car[] = [
  { id: "m4", brand: "BMW", model: "M4 Competition", year: 2023, km: 12000, price: 128000, type: "Deportivo", fuel: "Nafta", hp: 510, zeroTo100: 3.9, topSpeed: 290, trans: "Automática", img: "1580273916550-e323be2ae537", tag: "Destacado" },
  { id: "panamera", brand: "Porsche", model: "Panamera 4S", year: 2022, km: 21000, price: 165000, type: "Sedán", fuel: "Nafta", hp: 440, zeroTo100: 4.4, topSpeed: 289, trans: "Automática", img: "1503376780353-7e6692767b70" },
  { id: "rs6", brand: "Audi", model: "RS6 Avant", year: 2021, km: 34000, price: 139000, type: "Familiar", fuel: "Nafta", hp: 600, zeroTo100: 3.6, topSpeed: 280, trans: "Automática", img: "1606664515524-ed2f786a0bd6", tag: "Precio especial" },
  { id: "mustang", brand: "Ford", model: "Mustang GT 5.0", year: 2024, km: 0, price: 92000, type: "Deportivo", fuel: "Nafta", hp: 486, zeroTo100: 4.3, topSpeed: 250, trans: "Manual", img: "1494976388531-d1058494cdd8", tag: "0 km" },
  { id: "m5", brand: "BMW", model: "M5", year: 2022, km: 18000, price: 142000, type: "Sedán", fuel: "Nafta", hp: 600, zeroTo100: 3.4, topSpeed: 305, trans: "Automática", img: "1555215695-3004980ad54e" },
  { id: "camaro", brand: "Chevrolet", model: "Camaro SS", year: 2020, km: 41000, price: 68000, type: "Deportivo", fuel: "Nafta", hp: 455, zeroTo100: 4.2, topSpeed: 265, trans: "Automática", img: "1552519507-da3b142c6e3d" },
  { id: "tesla", brand: "Tesla", model: "Model S Plaid", year: 2023, km: 9000, price: 118000, type: "Eléctrico", fuel: "Eléctrico", hp: 1020, zeroTo100: 2.1, topSpeed: 322, trans: "Automática", img: "1617788138017-80ad40651399", tag: "Eléctrico" },
  { id: "amg", brand: "Mercedes-AMG", model: "GT 63 S", year: 2022, km: 15000, price: 175000, type: "Deportivo", fuel: "Nafta", hp: 639, zeroTo100: 3.2, topSpeed: 315, trans: "Automática", img: "1605559424843-9e4c228bf1c2" },
  { id: "elantra", brand: "Hyundai", model: "Elantra N Line", year: 2024, km: 0, price: 34000, type: "Sedán", fuel: "Nafta", hp: 201, zeroTo100: 7.1, topSpeed: 220, trans: "Automática", img: "1619767886558-efdc259cde1a", tag: "0 km" },
];

/** Modelos para el selector grande (con colores simulados por filtro). */
export const showcase = [
  { carId: "m4", headline: "Precisión alemana.", colors: [{ name: "Gris Brooklyn", hue: 0, sat: 1 }, { name: "Azul Portimao", hue: 205, sat: 2.2 }, { name: "Verde Isla", hue: 95, sat: 1.8 }, { name: "Rojo Toronto", hue: 356, sat: 2.2 }] },
  { carId: "mustang", headline: "V8. Sin disculpas.", colors: [{ name: "Gris Carbonizado", hue: 0, sat: 1 }, { name: "Rojo Racing", hue: 358, sat: 2.4 }, { name: "Azul Velocidad", hue: 200, sat: 2.4 }, { name: "Amarillo Grabber", hue: 40, sat: 2.6 }] },
  { carId: "panamera", headline: "Lujo a 290 km/h.", colors: [{ name: "Negro Jet", hue: 0, sat: 1 }, { name: "Azul Noche", hue: 210, sat: 1.6 }, { name: "Verde Python", hue: 100, sat: 1.6 }, { name: "Rojo Carmín", hue: 350, sat: 1.8 }] },
  { carId: "tesla", headline: "Silencio que acelera.", colors: [{ name: "Original", hue: 0, sat: 1 }, { name: "Azul Profundo", hue: 200, sat: 1.8 }, { name: "Rojo Multicapa", hue: 358, sat: 2 }, { name: "Verde Musgo", hue: 90, sat: 1.4 }] },
];

export const reel = [
  { id: V.closeup, title: "Detalles que enamoran", tag: "Diseño" },
  { id: V.dawn, title: "Ruta al amanecer", tag: "Test drive" },
  { id: V.aerial, title: "Escapada de otoño", tag: "Viajes" },
  { id: V.parking, title: "Convertible", tag: "Entrega" },
  { id: V.driver, title: "Primer manejo", tag: "Clientes" },
  { id: V.city, title: "En la ciudad", tag: "Día a día" },
];

export const testimonials = [
  { quote: "Me mandaron un video del auto por WhatsApp antes de viajar a verlo. Llegué y era exactamente eso.", name: "Federico A.", car: "BMW M4" },
  { quote: "Tomaron mi usado al valor que me dijeron online. Firmé en una hora.", name: "Sofía L.", car: "Audi RS6" },
  { quote: "El test drive en ruta fue una experiencia aparte. Volvería a comprar acá sin dudarlo.", name: "Martín R.", car: "Mustang GT" },
];
