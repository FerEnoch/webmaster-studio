# Boutique de vinos + viajes en Mendoza — investigación y brief

> Rubro 9 del estudio. App `benchmark/apps/vinos`, puerto **3018**. Base técnica: `benchmark/apps/veterinaria` (que a su vez sale de fitness).
> **[verificado]** = comprobado (HTTP 200, fuente leída o revisado a ojo). **[a verificar]** = queda para el cliente real.

## 1. Qué hacen bien las mejores webs del rubro

Fuentes (roundups de agencias, con sesgo comercial): [Evey Events](https://www2.eveyevents.com/blog/best-winery-websites/), [Lucid Crew](https://www.lucidcrew.com/best-winery-websites), [MuffinGroup](https://muffingroup.com/blog/winery-websites/), [Wix](https://www.wix.com/blog/winery-websites).

- **La home se ordena por lo que la gente quiere hacer**: comprar, visitar, reservar (Camel Valley: tres accesos directos).
- **CTA de alta intención siempre a mano**: "Reservar experiencia", "Ver paquetes".
- **Transparencia de precios y FAQ** en la reserva de tours (North Georgia Wine Tours).
- **Catálogo con fichas** (foto, notas, maridaje) y **calendario de eventos/catas**.
- **Mobile-first**: el turista reserva desde el celular, muchas veces ya en Mendoza.

## 2. Antipatrones

- Fotos genéricas de copas de stock que podrían ser de cualquier país: Mendoza se vende con **cordillera, aridez y altura**.
- Edad: entrar sin ningún aviso de mayoría de edad.
- Tours sin precio, sin duración, sin qué incluye ni punto de encuentro.
- Fichas de vino con puntajes de críticos inventados (en la plantilla: nada de puntajes falsos).
- Carritos que piden registro para comprar.

## 3. Mercado (Mendoza)

- Tres zonas que el turista reconoce: **Maipú** (~750 m, cerca de la ciudad, en bici), **Luján de Cuyo** ("primera zona" del Malbec, ~950 m) y **Valle de Uco** (1.000–1.500 m, bodegas de autor, día completo).
- Precios de tours de referencia en agregadores (inestables): Maipú medio día desde ~€95; día completo Maipú ~€127–200; Valle de Uco ~€160–230; privados mucho más. Mínimo 2 personas y pick-up en hoteles de Ciudad, Luján y Maipú ([Winedering](https://www.winedering.com/wine-tourism_mendoza-province_g3844419_mendoza_dn355), [byfood](https://www.byfood.com/experiences/uco-valley-wine-tour-30993)). Los tours se publican en **USD**; la tienda, en **pesos**.
- La **vendimia** (feb–abr) es temporada alta y producto en sí mismo (cosecha propia).

## 4. Legal

- **Ley 24.788** (lucha contra el alcoholismo): prohibida la venta a menores de 18 en todo canal; toda publicidad debe llevar en lugar visible **"BEBER CON MODERACIÓN"** y **"PROHIBIDA SU VENTA A MENORES DE 18 AÑOS"**; no apuntar a menores, no asociar con rendimiento, sexualidad o violencia ([texto](https://www.argentina.gob.ar/normativa/nacional/norma-150972/texto), [análisis](https://abogados.com.ar/publicidad-de-bebidas-alcoholicas-limitaciones-impuestas-por-la-ley-24788-y-por-codigo-de-etica-de-la-industria/26369)). → **Aviso de edad al entrar + leyendas fijas en la web**.
- **Experiencias con consumo de vino**: informar claramente condiciones (qué se sirve, cantidades, transporte incluido). Hay fallo que sancionó por no describirlas ([Diario Judicial](https://www.diariojudicial.com/news-70078-al-pan-pan-y-al-vino-multa), **[a verificar]**). → Cada viaje dice qué incluye y "no manejes: el traslado está incluido".
- **Viajes**: comercializar paquetes requiere agencia habilitada (EVT con legajo) **[a verificar: Ley 18.829 y registro del Ministerio de Turismo]**. → Pie con "EVT Legajo N° 0000 (demo)".
- **Venta online**: botón de arrepentimiento, Defensa del Consumidor, precios finales; **club con suscripción** → botón de baja visible (Res. 316/2018 y 271/2020).

## 5. Dirección de arte

- **Sensación**: boutique de autor, nocturna y cálida, como una cava con luz baja. Distinta de las demás apps: fitness (negro/rojo), veterinaria (crema/coral).
- **Paleta**: noche vinoteca `#160d10`, borgoña `#5a1426`, crema papel `#f3ece0`, latón `#c19a5b`, verde viña `#6b7a4b`. Secciones de tienda en crema para que las botellas "respiren".
- **Tipografía**: Cormorant Garamond (display, itálica protagonista) + Manrope.
- **Imagen**: gradación cálida tipo película; las botellas son **ilustraciones SVG propias** (etiqueta con nombre ficticio), así no aparecen marcas reales y todo el catálogo se ve como una colección.
- **Sin 3D**: parallax 2D de la cordillera en SVG, video, máscaras y transiciones.

## 6. Marca y rutas

**ALTURA — Vinos & Viajes · Mendoza** (ficticia). Boutique en Ciudad de Mendoza.

| Ruta | Contenido |
| --- | --- |
| `/` | Hero con video en arco + altímetro, "Subí la montaña" (Maipú → Luján → Uco), sommelier virtual, selección, viajes teaser, calendario de vendimia, club teaser |
| `/vinos` | Tienda: filtros con animación de layout, fichas con notas y maridaje, carrito |
| `/viajes` | Experiencias con itinerario hora a hora y mapa que dibuja la ruta, reserva en pasos con voucher |
| `/servicios` | Catas privadas, eventos, regalos empresariales, envíos, cursos — scroll narrativo |
| `/club` | Suscripción mensual (3 niveles), cómo funciona, FAQ, botón de baja |

## 7. Experiencias firma

1. **Altímetro**: al scrollear la ruta Maipú (750 m) → Luján (950 m) → Valle de Uco (1.400 m) sube un altímetro y la cordillera hace parallax por capas; cada parada explica qué aporta la altura al vino.
2. **Sommelier virtual**: 3 preguntas (con qué lo tomás, cómo te gusta, presupuesto) → la copa se llena con el color del vino elegido y aparece la botella recomendada para sumar al carrito.
3. **Mapa de viaje**: el itinerario hora a hora dibuja la ruta sobre un mapa SVG de Mendoza.
4. **Voucher de viaje** tipo pase de embarque al terminar la reserva.
5. **Calendario de la vid**: cuándo venir (poda, brotación, envero, vendimia).

## 8. Medios [verificado]

Videos Mixkit (HTTP 200; 30 revisados por póster): viñedos aéreos 14704, 8188, 8198, 8291, 8200, 8293, 8196, 26539, 26545; gente en viñedo 26544, 46906; cosecha 26559, 47663; racimos 6968, 7159, 34630, 17729; servir vino 43893, 43896, 15788, 52406 (chorro sobre negro), 52412, 22735; corchos 28977; montaña/ruta árida 48489, 50199, 41366, 2392 (por título, confirmar al usarlos).
Fotos Unsplash (HTTP 200, revisadas a ojo): ver objeto `P` en `benchmark/apps/vinos/src/lib/content.ts`.
