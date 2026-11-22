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
    // Pool revisado de wm-concesionario (2026-10): sin sala de subastas ni bebé.
    videos: [4207, 4189, 4191],
    photos: [
      "1549317661-bd32c8ce0db2",
      "1541899481282-d53bffe3c35d",
      "1550355291-bbee04a92027",
      "1533473359331-0135ef1b58bf",
      "1560958089-b8a1929cea89",
      "1600661653561-629509216228",
      "1502877338535-766e1452684a",
      "1449965408869-eaa3f722e40d",
    ],
  },
  lavadero: {
    // Pool revisado de wm-lavadero/-premium (2026-10-20): sin PC ni gimnasio.
    videos: [4307, 4293, 4295, 3082, 4189],
    photos: [
      "1626668893632-6f3a4466d22f",
      "1590362891991-f776e747a588",
      "1492144534655-ae79c964c9d7",
      "1625047509248-ec889cbff17f",
      "1549317661-bd32c8ce0db2",
      "1517248135467-4c7edcad34c4",
      "1530610476181-d83430b64dcd",
      "1470337458703-46ad1756a187",
    ],
  },
  estetica: {
    videos: [4210, 4212, 4258, 4346],
    photos: ["1596178065887-1198b6148b2b", "1515377905703-c4788e51af15", "1540555700478-4be289fbecef", "1571019613454-1cb2f99b2d8b"],
  },
  universidad: {
    // Pool revisado de wm-universidad (2026-10-20): sin avión ni bici.
    videos: [3046, 3036, 3090, 3091, 3092, 3093],
    photos: [
      "1562774053-701939374585",
      "1509062522246-3755977927d7",
      "1498243691581-b145c3f54a5a",
      "1522202176988-66273c2fd55f",
      "1519452575417-564c1401ecc0",
      "1523240795612-9a054b0db644",
      "1571260899304-425eee4c7efc",
      "1541339907198-e08756dedf3f",
    ],
  },
  inmobiliaria: {
    videos: [3090, 3092, 3046, 3056],
    photos: ["1560518883-ce09059eeffa", "1512917774080-9991f1c4c750", "1600596542815-ffad4c1539a9", "1600607687939-ce8a6c25118c"],
  },
  arquitectura: {
    videos: [3256, 3091, 3093, 3036],
    photos: ["1487958449943-2429e8be8625", "1497366754035-f200968a6e72", "1600585154340-be6161a56a0c", "1518005020951-eccb494ad742"],
  },
  /**
   * Portfolio madre.
   *
   * Hero 3257 (pareja trabajando con software de diseño) + bandas 13232
   * (equipo mirando un prototipo) y 13231 (planning de proyecto web): los
   * tres de software, únicos del portfolio, sin reusar obra de arquitectura.
   * Fotos: una por rubro desde los pools revisados + Pexels 6804073 para
   * el estudio (devs, no mesa de arquitectura). Todos HTTP 200.
   */
  portfolio: {
    videos: [3257, 13232, 13231, 4907],
    photos: [
      "1560958089-b8a1929cea89", // concesionario (Tesla nuevo)
      "1517248135467-4c7edcad34c4", // interior de bar (fuente de la portada compuesta)
      "1626668893632-6f3a4466d22f", // lavadero-premium (túnel turquesa)
      "1570172619644-dfd03ed5d881", // estetica (tratamiento en curso)
      "1562774053-701939374585", // universidad (campus)
      "1512917774080-9991f1c4c750", // inmobiliaria (temporal, T6 la pasa a Pexels AR)
      "1487958449943-2429e8be8625", // arquitectura (casa mínima)
      "1600585154340-be6161a56a0c", // arquitectura-premium (casa terminada)
    ],
  },
};
