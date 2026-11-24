/**
 * WhatsApp deep-links con mensaje prearmado.
 *
 * Formato: `https://wa.me/<numero>?text=<mensaje codificado>`
 * El numero va sin `+`, sin espacios y con codigo de pais (549 = Argentina).
 */

import { RUBROS, getRubro, type Rubro } from "./rubros";

/**
 * Construye el link de WhatsApp.
 *
 * @param phone numero internacional sin signos: "5491123456789"
 * @param text  mensaje; se codifica con encodeURIComponent
 */
export function waLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * Rellena la plantilla del rubro con un contexto.
 *
 * Los placeholders son `{clave}`. Los que no esten en `ctx` quedan vacios
 * (nunca queda un `{clave}` colgando en el mensaje).
 *
 * @param id   id del rubro (ver rubros.ts)
 * @param ctx  valores para reemplazar
 */
export function rubroWhatsapp(id: string, ctx: Record<string, string> = {}): string {
  const rubro: Rubro | undefined = getRubro(id);
  if (!rubro) throw new Error(`Rubro desconocido: "${id}". Revisar packages/webmaster-kit/rubros.ts`);
  const text = rubro.whatsapp.template.replace(/\{(\w+)\}/g, (_m, key: string) => ctx[key] ?? "");
  return waLink(rubro.whatsapp.phone, text);
}

/** Todos los rubros (re-export por comodidad). */
export { RUBROS };
