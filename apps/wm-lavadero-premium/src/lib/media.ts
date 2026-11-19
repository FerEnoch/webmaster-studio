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
  /**
   * LAVADERO PREMIUM — GLOSS & GLASS (2026-11-19).
   *
   * Hero 47833 (pulido en detalle) único del premium; el estándar conserva
   * 4307 (agua a presión). Tamaño Compacto con Pexels 18542767
   * (descapotable blanco, HTTP 200), sin reusar el Fiat 500 de concesionario.
   */
  lavadero: {
    videos: [47833, 4307, 4293, 4295, 3082, 4189],
    photos: [
      "1626668893632-6f3a4466d22f", // auto en tunel con luz turquesa
      "1590362891991-f776e747a588", // auto blanco en garage iluminado
      "1492144534655-ae79c964c9d7", // garage oscuro + auto
      "1625047509248-ec889cbff17f", // tecnico trabajando en el motor
      // Pexels 18542767 (chico premium) + resto Unsplash:
      "1517248135467-4c7edcad34c4", // interior de bar
      "1530610476181-d83430b64dcd", // medialunas / facturas
      "1470337458703-46ad1756a187", // brindis (servicio a la barra)
    ],
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
    videos: [3090, 3092, 3046, 3056],
    photos: ["1560518883-ce09059eeffa", "1512917774080-9991f1c4c750", "1600596542815-ffad4c1539a9", "1600607687939-ce8a6c25118c"],
  },
  arquitectura: {
    videos: [3256, 3091, 3093, 3036],
    photos: ["1487958449943-2429e8be8625", "1497366754035-f200968a6e72", "1600585154340-be6161a56a0c", "1518005020951-eccb494ad742"],
  },
};
