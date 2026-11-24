import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { SolarLot as Lot } from "../lib/experiences";
import "./SolarLot.css";

type Props = { lot: Lot; propertyTitle: string };
type Season = "invierno" | "verano";

const seasons = {
  invierno: { label: "Invierno", dawn: 8, dusk: 18, arc: 65, height: 0.53 },
  verano: { label: "Verano", dawn: 6, dusk: 20.5, arc: 115, height: 0.92 },
};
const directions = ["norte", "noreste", "este", "sudeste", "sur", "sudoeste", "oeste", "noroeste"];

// Recorrido cualitativo del hemisferio sur, no calculado para una ubicación o fecha.
function sampleDay(hour: number, season: Season) {
  const { dawn, dusk, arc, height } = seasons[season];
  if (hour <= dawn || hour >= dusk) return null;
  const fraction = (hour - dawn) / (dusk - dawn);
  const angle = arc * (1 - 2 * fraction);
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.sin(radians),
    y: -Math.cos(radians),
    direction: directions[Math.round(angle / 45 + 8) % directions.length],
    shadow: 18 + 80 * (1 - height * Math.sin(fraction * Math.PI)),
  };
}

export type LotSun = ReturnType<typeof sampleDay>;
type Rectangle = { x: number; y: number; width: number; height: number };

function castShadow(footprint: Rectangle, sun: NonNullable<LotSun>) {
  const dx = Math.round(-sun.x * sun.shadow);
  const dy = Math.round(-sun.y * sun.shadow);
  const left = footprint.x;
  const right = left + footprint.width;
  const top = footprint.y;
  const bottom = top + footprint.height;
  const [leadX, trailX] = dx >= 0 ? [right, left] : [left, right];
  const [leadY, trailY] = dy >= 0 ? [bottom, top] : [top, bottom];
  return [
    [trailX, trailY], [leadX, trailY], [leadX + dx, trailY + dy],
    [leadX + dx, leadY + dy], [trailX + dx, leadY + dy], [trailX, leadY],
  ].map(([x, y]) => `${x},${y}`).join(" ");
}

function LotPlan({ lot, sun, showFootprint }: { lot: Lot; sun: LotSun; showFootprint: boolean }) {
  const id = useId();
  const middle = 210;
  const ratio = lot.ancho / lot.fondo;
  const depth = Math.min(224, 248 / ratio);
  const width = depth * ratio;
  const top = 57;
  const front = top + depth;
  const left = middle - width / 2;
  const right = middle + width / 2;
  const center = top + depth / 2;
  const parcel = { x: left, y: top, width, height: depth };
  const footprint: Rectangle = { x: middle - width / 4, y: center - depth / 8, width: width / 2, height: depth / 4 };
  const sunX = sun && Math.round(middle + sun.x * 105);
  const sunY = sun && Math.round(center + sun.y * 105);
  const sunDescription = sun ? `Sol hacia el ${sun.direction}.` : "Sin luz solar.";

  return (
    <svg className="solar-lot__plan" viewBox="0 0 420 360" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
      <title id={`${id}-title`}>Plano ilustrativo del lote</title>
      <desc id={`${id}-description`}>
        {`${lot.ancho} metros de frente por ${lot.fondo} metros de fondo. Norte arriba, con el frente sobre la calle abajo. ${sunDescription}${showFootprint ? " La huella dibujada es conceptual." : ""}`}
      </desc>
      <defs>
        <clipPath id={`${id}-parcel`}><rect {...parcel} /></clipPath>
        <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0v5" stroke="#334331" strokeOpacity=".55" strokeWidth="1.6" />
        </pattern>
      </defs>

      <g className="solar-lot__street">
        <rect x="16" y={front} width="388" height="61" />
        <path d={`M16 ${front}H404 M16 ${front + 61}H404 M16 ${front + 54}H404`} />
        <path d={`M28 ${front + 32}H134 M286 ${front + 32}H392`} strokeDasharray="4 5" />
        <text x={middle} y={front + 36} textAnchor="middle">Calle · frente</text>
      </g>

      <g className="solar-lot__dimensions">
        <path d={`M${left} 29V${top - 5} M${right} 29V${top - 5} M${left} 35H${right} M60 ${top}H${left - 5} M60 ${front}H${left - 5} M65 ${top}V${front}`} />
        <path d={`M${left - 4} 39l8 -8 M${right - 4} 39l8 -8 M61 ${top + 4}l8 -8 M61 ${front + 4}l8 -8`} />
        <text x={middle} y="24" textAnchor="middle">{lot.ancho} m</text>
        <text transform={`translate(52 ${center}) rotate(-90)`} textAnchor="middle">{lot.fondo} m</text>
      </g>

      <rect {...parcel} className="solar-lot__parcel" />
      <path className="solar-lot__axis" d={`M${middle} ${top}V${front} M${left} ${center}H${right}`} />

      {showFootprint && sun && (
        <polygon data-lot-shadow points={castShadow(footprint, sun)} fill={`url(#${id}-hatch)`} clipPath={`url(#${id}-parcel)`} />
      )}
      {sun && (
        <path className="solar-lot__bearing" d={`M${middle} ${center}L${sunX} ${sunY}`} />
      )}
      {showFootprint && (
        <g data-lot-footprint className="solar-lot__footprint">
          <rect {...footprint} />
          <rect x={footprint.x + 4} y={footprint.y + 4} width={footprint.width - 8} height={footprint.height - 8} />
          <path d={`M${footprint.x + 4} ${center + 7}H${footprint.x + footprint.width - 4}`} />
        </g>
      )}

      <rect {...parcel} data-lot-boundary className="solar-lot__boundary" />
      <path className="solar-lot__frontage" d={`M${left} ${front}H${right}`} />
      <path className="solar-lot__corners" d={`M${left} ${top}h0 M${right} ${top}h0 M${left} ${front}h0 M${right} ${front}h0`} />

      {sun && (
        <g data-lot-sun className="solar-lot__sun" transform={`translate(${sunX} ${sunY})`}>
          <circle r="13.5" className="solar-lot__sun-halo" />
          <circle r="4.5" />
          <path d="M0-9v1.5 M0 7.5V9 M-9 0h1.5 M7.5 0H9 M-6.4-6.4l1 1 M5.4 5.4l1 1 M-6.4 6.4l1-1 M5.4-5.4l1-1" />
        </g>
      )}

      <g className="solar-lot__compass" transform="translate(369 70)" textAnchor="middle">
        <circle r="17" />
        <path d="M-20 0H20 M0-20V20" />
        <path className="solar-lot__north" d="M0-17 5 6 0 2-5 6Z" />
        <text className="solar-lot__north-label" y="-25">N</text>
        <text x="28" y="4">E</text><text x="-28" y="4">O</text><text y="34">S</text>
      </g>
    </svg>
  );
}

export default function SolarLot({ lot, propertyTitle }: Props) {
  const [hour, setHour] = useState(15.5);
  const [season, setSeason] = useState<Season>("invierno");
  const [showFootprint, setShowFootprint] = useState(true);
  const [preferredView, setPreferredView] = useState<"3d" | "2d">("3d");
  const [status, setStatus] = useState<"pending" | "ready" | "unavailable">("pending");
  const [Viewer3D, setViewer3D] = useState<typeof import("./SolarLotViewer3D").default | null>(null);
  const sheet = useRef<HTMLElement>(null);
  const planButton = useRef<HTMLButtonElement>(null);
  const sun = useMemo(() => sampleDay(hour, season), [hour, season]);
  const time = `${Math.floor(hour)}:${hour % 1 === 0 ? "00" : "30"}`;
  const show3D = status === "ready" && preferredView === "3d";
  const ready = useCallback(() => setStatus("ready"), []);
  const unavailable = useCallback(() => {
    if (sheet.current?.contains(document.activeElement)) planButton.current?.focus({ preventScroll: true });
    setStatus("unavailable");
  }, []);

  useEffect(() => {
    const element = sheet.current;
    if (!element) return;
    let cancelled = false;
    async function load() {
      try {
        const { default: Viewer } = await import("./SolarLotViewer3D");
        if (!cancelled) setViewer3D(() => Viewer);
      } catch {
        if (!cancelled) unavailable();
      }
    }
    if (typeof IntersectionObserver === "undefined") {
      void load();
      return () => { cancelled = true; };
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || cancelled) return;
      observer.disconnect();
      void load();
    }, { rootMargin: "240px 0px" });
    observer.observe(element);
    return () => { cancelled = true; observer.disconnect(); };
  }, [unavailable]);

  return (
    <div data-solar-scene className="solar-lot">
      <header className="solar-lot__header">
        <div>
          <p className="solar-lot__kicker">{propertyTitle} · Plano ilustrativo</p>
          <h3>Vista del lote</h3>
        </div>
        <p className="solar-lot__size"><strong>{lot.ancho} × {lot.fondo} m</strong><span>Frente × fondo</span></p>
      </header>
      <div className="solar-lot__layout">
        <figure ref={sheet} className="solar-lot__sheet">
          <div className="solar-lot__views" role="group" aria-label="Vista del terreno">
            <button type="button" aria-pressed={show3D} disabled={status !== "ready"} onClick={() => setPreferredView("3d")}>Maqueta 3D</button>
            <button ref={planButton} type="button" aria-pressed={!show3D} onClick={() => setPreferredView("2d")}>Plano 2D</button>
          </div>
          <div className="solar-lot__presentation">
            <div className="solar-lot__plan-slot" data-covered={show3D || undefined}>
              <LotPlan lot={lot} sun={sun} showFootprint={showFootprint} />
            </div>
            <div className="solar-lot__view-help solar-lot__plan-help" data-covered={show3D || undefined} aria-live="polite">
              {status === "unavailable" ? "No pudimos abrir la maqueta 3D. Podés seguir con el plano." : "Norte arriba · calle al frente"}
            </div>
            {Viewer3D && status !== "unavailable" && (
              <Viewer3D front={lot.ancho} depth={lot.fondo} sun={sun} showFootprint={showFootprint} visible={show3D} onReady={ready} onUnavailable={unavailable} />
            )}
          </div>
          <figcaption>
            <ul className="solar-lot__legend">
              <li><span className="solar-lot__key solar-lot__key--boundary" aria-hidden="true" />Límite del lote</li>
              <li><span className="solar-lot__key solar-lot__key--footprint" aria-hidden="true" />Huella conceptual</li>
              <li><span className="solar-lot__key solar-lot__key--shadow" aria-hidden="true" />Sombra orientativa</li>
              <li><span className="solar-lot__key solar-lot__key--sun" aria-hidden="true" />Dirección del sol</li>
            </ul>
          </figcaption>
        </figure>
        <div className="solar-lot__controls" role="group" aria-label="Controles solares">
          <div>
            <p className="solar-lot__kicker">Luz y sombra</p>
            <p className="solar-lot__intro">Mové la hora y compará la sombra entre estaciones.</p>
          </div>
          <div className="solar-lot__hour">
            <label>
              <span>Hora del sol <strong>{time}</strong></span>
              <input type="range" aria-label="Hora del sol" aria-valuetext={time} min={6} max={21} step={0.5} value={hour} onChange={(e) => setHour(Number(e.target.value))} />
            </label>
            <div aria-hidden="true" className="solar-lot__endpoints"><span>6:00</span><span>21:00</span></div>
            <p className="solar-lot__readout" role="status">{sun ? `Sol hacia el ${sun.direction}` : "Sin luz solar"}</p>
          </div>
          <div className="solar-lot__seasons" role="group" aria-label="Estación">
            {(["invierno", "verano"] as const).map((item) => (
              <button type="button" key={item} aria-pressed={season === item} onClick={() => setSeason(item)}>{seasons[item].label}</button>
            ))}
          </div>
          <label className="solar-lot__toggle">
            <input type="checkbox" checked={showFootprint} onChange={(e) => setShowFootprint(e.target.checked)} />
            Mostrar huella conceptual
          </label>
        </div>
      </div>
      <p className="solar-lot__note">Orientación y medidas ilustrativas. No es un relevamiento ni un cálculo de sol y sombra para esta propiedad.</p>
    </div>
  );
}
