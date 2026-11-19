/**
 * Helpers de medios + pool de IDs VERIFICADOS.
 *
 * REGLA DEL REPO: no se scrapea mixkit.co. Se usan los IDs de esta tabla,
 * que fueron verificados con `curl -sI -m 15 <url>` (HTTP 200) y revisados
 * por poster. Maximo 6 videos y 8 fotos por app.
 *
 * - Video Mixkit:  https://assets.mixkit.co/videos/{id}/{id}-720.mp4
 * - Poster Mixkit: https://assets.mixkit.co/videos/{id}/{id}-thumb-720-0.jpg
 * - Foto Unsplash:  https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w={w}
 * - Foto Pexels:    https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w={w}
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

/** URL de una foto de Pexels (hotlink estable del CDN). */
export function pex(id: number, w = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
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
  concesionario: {
    videos: [4189, 4191, 4207, 4227],
    photos: [
      "1515187029135-18ee286d815b",
      "1493238792000-8113da705763",
      "1503376780353-7e6692767b70",
      "1449965408869-eaa3f722e40d",
    ],
  },
  lavadero: {
    videos: [4345, 4189],
    photos: ["1637430308606-86576d8fef3c", "1600661653561-629509216228", "1558618666-fcd25c85cd64", "1521543387600-c745f8e83d77"],
  },
  estetica: {
    videos: [4210, 4212, 4258, 4346],
    photos: ["1596178065887-1198b6148b2b", "1515377905703-c4788e51af15", "1540555700478-4be289fbecef", "1571019613454-1cb2f99b2d8b"],
  },
  universidad: {
    videos: [3099, 3119, 3120, 3056],
    photos: ["1519452575417-564c1401ecc0", "1541339907198-e08756dedf3f", "1562774053-701939374585", "1523240795612-9a054b0db644"],
  },
  inmobiliaria: {
    // Set propio AR (2026-11-19): 3090 living (hero) + 3092 oficina + 42337
    // barrio aéreo (banda Zonas, único, sin reusar la obra 3093) + 4 Pexels
    // argentinas, sin reusar las 4 fotos de arquitectura. Todas HTTP 200.
    videos: [3090, 3092, 42337, 3046, 3056],
    photos: [
      "1560518883-ce09059eeffa", // llaves / entrega
      "1512917774080-9991f1c4c750", // casa con pileta
      "1600596542815-ffad4c1539a9", // casa con tobogán
      "1600607687939-ce8a6c25118c", // living luminoso
      // Pexels AR (IDs numéricos, ver pex()): 29810846 PH ladrillo Mercedes,
      // 13944645 patio con hiedra Mendoza, 37136105 piedra+vidrio Mardel,
      // 31689258 casa antigua Córdoba (local).
    ],
  },
  arquitectura: {
    videos: [3256, 3091, 3093, 3036],
    photos: ["1487958449943-2429e8be8625", "1497366754035-f200968a6e72", "1600585154340-be6161a56a0c", "1518005020951-eccb494ad742"],
  },
};
