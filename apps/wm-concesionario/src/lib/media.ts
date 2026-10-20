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
 * URL de una foto de Unsplash con recorte controlado.
 *
 * La galeria de la ficha de un auto muestra la misma foto con recortes
 * distintos (`entropy`, `top`, `bottom`): tres encuadres de la unidad sin
 * bajar imagenes nuevas del CDN.
 */
export function imgCrop(id: string, w: number, h: number, crop = "entropy"): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=${crop}&w=${w}&h=${h}&q=75`;
}

/**
 * Pool de medios verificados por rubro.
 *
 * `videos`: ids de Mixkit (720p). `photos`: ids de Unsplash.
 * Todos devuelven HTTP 200 (video + poster). Los de `clinica` fueron ademas
 * revisados cuadro por cuadro; en los demas rubros revisá el poster antes de
 * usarlo (el id no garantiza que la imagen sea del rubro).
 *
 * Cuando agregues un medio nuevo, verifica y sumalo aca:
 *   curl -sI -m 15 "https://assets.mixkit.co/videos/1234/1234-720.mp4"
 *   curl -sI -m 15 "https://assets.mixkit.co/videos/1234/1234-thumb-720-0.jpg"
 */
export const VERIFIED: Record<string, { videos: number[]; photos: string[] }> = {
  clinica: {
    videos: [4126, 4219, 3062],
    photos: [
      "1771270786606-f5a0e57db762", // instrumental medico sobre madera
      "1761971975962-9cc397e2ba2a", // corridor / interior de centro medico
      "1553877522-43269d4ea984", // profesional en consultorio (B&W)
      "1472099645785-5658abf4ff4e", // profesional (equipo medico)
      "1500648767791-00dcc994a43e", // profesional (equipo medico)
      "1573496359142-b8d87734a5a2", // profesional (equipo medico)
      "1580489944761-15a19d654956", // profesional (equipo medico)
      "1522071820081-009f0129c71c", // equipo multidisciplinary
    ],
  },
  /**
   * Concesionario. Pool revisado foto por foto (los ids del kit no garantizan
   * que la imagen sea del rubro: `1515187029135-18ee286d815b` era una sala de
   * subasta de arte y `4227` era un bebe, asi que quedaron fuera).
   */
  concesionario: {
    // 4207 = autos desde el aire (banda de test drive) · 4189 = convertible en
    // ruta (hero) · 4191 = camioneta clasica (banda de usados).
    videos: [4207, 4189, 4191],
    photos: [
      "1549317661-bd32c8ce0db2", // Fiat 500 celeste (usado)
      "1541899481282-d53bffe3c35d", // VW Golf azul (usado)
      "1550355291-bbee04a92027", // Hyundai Tucson rojo (usado)
      "1533473359331-0135ef1b58bf", // Ford Expedition blanco (usado)
      "1560958089-b8a1929cea89", // Tesla Model 3 blanco (nuevo)
      "1600661653561-629509216228", // Tesla Model Y blanco (nuevo)
      "1502877338535-766e1452684a", // BMW M4 azul (nuevo)
      "1449965408869-eaa3f722e40d", // manos al volante (banda test drive)
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
    videos: [3090, 3092, 3046, 3056],
    photos: ["1560518883-ce09059eeffa", "1512917774080-9991f1c4c750", "1600596542815-ffad4c1539a9", "1600607687939-ce8a6c25118c"],
  },
  arquitectura: {
    videos: [3256, 3091, 3093, 3036],
    photos: ["1487958449943-2429e8be8625", "1497366754035-f200968a6e72", "1600585154340-be6161a56a0c", "1518005020951-eccb494ad742"],
  },
};
