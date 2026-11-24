const BASE = import.meta.env.BASE_URL;

/** App-local links use Astro's configured base in standalone and deployment builds. */
export function href(path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${BASE}${clean}` : BASE;
}

export function propertyHref(slug: string): string {
  return href(`propiedades/${slug}/`);
}

export const imageWidths = [480, 960, 1600] as const;

export function imagePath(key: string, width: number = 960): string {
  return href(`images/${key}-${width}.webp`);
}

export function imageSrcSet(key: string): string {
  return imageWidths.map((width) => `${imagePath(key, width)} ${width}w`).join(", ");
}
