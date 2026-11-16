/**
 * Helpers de medios + pool de IDs VERIFICADOS de la demo premium.
 *
 * REGLA DEL REPO: no se scrapea mixkit.co. Se usan los IDs de esta tabla,
 * verificados con `curl -sI -m 15 <url>` (HTTP 200) y revisados por poster.
 * Maximo 6 videos y 8 fotos por app.
 *
 * - Video Mixkit:  https://assets.mixkit.co/videos/{id}/{id}-720.mp4
 * - Poster Mixkit: https://assets.mixkit.co/videos/{id}/{id}-thumb-720-0.jpg
 * - Foto Unsplash:  https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w={w}
 */

/** URL del video 720p de Mixkit. */
export function video(id: number): string {
  return `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
}

/** URL del poster de un video de Mixkit. */
export function poster(id: number): string {
  return `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`;
}

/** URL de una foto de Unsplash. */
export function img(id: string, w = 1200, h?: number): string {
  const extra = h ? `&h=${h}` : "";
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${extra}&q=75`;
}

/**
 * Pool de medios verificados por rubro.
 *
 * `videos`: ids de Mixkit (720p). `photos`: ids de Unsplash.
 * Todos devuelven HTTP 200 (video + poster). Revisá el poster antes de
 * usarlo (el id no garantiza que la imagen sea del rubro).
 *
 * Cuando agregues un medio nuevo, verifica y sumalo aca:
 *   curl -sI -m 15 "https://assets.mixkit.co/videos/1234/1234-720.mp4"
 *   curl -sI -m 15 "https://assets.mixkit.co/videos/1234/1234-thumb-720-0.jpg"
 */
export const VERIFIED: Record<string, { videos: number[]; photos: string[] }> = {
  /**
   * ARQUITECTURA PREMIUM — pool revisado a mano (2026-11-16).
   *
   * Los ids del kit correspondian a la demo comun; esta edicion usa un
   * set propio, re-verificado con `curl -sI -m 15` (todos HTTP 200) y
   * revisado por poster para que cada foto sea de arquitectura o interior.
   *
   * Videos (2): 3091 interior de madera con luz natural (recorrido) ·
   * 3093 estructura de obra en curso (antes/despues).
   * Fotos (8): sala vacia luminosa, casa terminada con patio, interior
   * amueblado, sala vacia de obra, obra gruesa con equipo, fachada
   * angular, casa de linea minima, estudio con mesa.
   */
  "arquitectura-premium": {
    videos: [3091, 3093],
    photos: [
      "1560448204-e02f11c3d0e2", // sala vacia y luminosa (estado previo)
      "1600585154340-be6161a56a0c", // casa terminada con patio y vidrio
      "1600210492486-724fe5c67fb0", // interior terminado con mobiliario
      "1616486338812-3dadae4b4ace", // sala vacia de primer piso (estado previo)
      "1541888946425-d81bb19240f5", // obra gruesa con equipo en el terreno
      "1518005020951-eccb494ad742", // fachada angular de hormigon
      "1487958449943-2429e8be8625", // casa de linea minima
      "1497366754035-f200968a6e72", // estudio con mesa y luz lateral
    ],
  },
};
