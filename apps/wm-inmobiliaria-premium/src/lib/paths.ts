import { appUrl } from "./urls";

/** Link a la ficha de una propiedad. */
export function propertyHref(slug: string): string {
  return appUrl(`/propiedades/${slug}/`);
}

export const imageWidths = [480, 960, 1600] as const;

export function imagePath(key: string, width: number = 960): string {
  return appUrl(`/images/${key}-${width}.webp`);
}

export function imageSrcSet(key: string): string {
  return imageWidths.map((width) => `${imagePath(key, width)} ${width}w`).join(", ");
}
