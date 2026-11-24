import type { TramaProduct } from "./shop";

export interface Photo {
  name: string;
  alt: string;
  widths: readonly [number, ...number[]];
}

export const editorialPhoto: Photo = {
  name: "street-editorial",
  alt: "Dos looks de calle con camperas oscuras sobre una vereda de adoquines",
  widths: [600, 1200],
};

const productAlt: Record<TramaProduct["motivo"], string> = {
  remera: "Remera negra holgada de manga corta junto a una pared de hormigón",
  hoodie: "Buzo negro con capucha, visto de perfil contra una pared de cemento",
  cargo: "Pantalón cargo marrón arena con bolsillos laterales con solapa",
  campera: "Campera rompeviento gris oscuro con capucha y cierre frontal",
  vestido: "Vestido negro entallado de manga larga, visto de perfil",
  gorra: "Gorra negra con visera curva y bordado blanco en primer plano",
};

export function productPhoto(product: TramaProduct): Photo {
  return { name: product.id, alt: productAlt[product.motivo], widths: [400, 800, 1000] };
}
