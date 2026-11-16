import { useId, useState } from "react";
import type { CatalogItem } from "@lib/types";
import { precio } from "../content/lavadero-premium";

interface ConfiguradorProps {
  tamanos: CatalogItem[];
  servicios: CatalogItem[];
  addons: CatalogItem[];
  PRECIOS: Record<string, Record<string, number>>;
  PRECIOS_ADDONS: Record<string, number>;
  SENIA_PORCENTAJE: number;
  reservarUrl: string;
}

const HOTSPOTS = [
  { id: "encerado", label: "Pintura" },
  { id: "interior", label: "Interior" },
  { id: "vapor", label: "Higiene" },
  { id: "detalle", label: "Corrección" },
];

export default function Configurador({
  tamanos,
  servicios,
  addons,
  PRECIOS,
  PRECIOS_ADDONS,
  SENIA_PORCENTAJE,
  reservarUrl,
}: ConfiguradorProps) {
  const id = useId();
  const [tamanoId, setTamanoId] = useState("compacto");
  const [nivelId, setNivelId] = useState("express");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const tamano = tamanos.find((item) => item.id === tamanoId)!;
  const nivel = servicios.find((item) => item.id === nivelId)!;
  const elegidos = addons.filter((item) => addonIds.includes(item.id));
  const base = PRECIOS[nivelId][tamanoId];
  const total = base + elegidos.reduce((sum, item) => sum + PRECIOS_ADDONS[item.id], 0);

  function cambiarNivel(next: string) {
    setNivelId(next);
    if (next !== "premium") {
      setAddonIds((prev) => prev.filter((item) => item !== "detalle"));
    }
  }

  function toggleAddon(addonId: string) {
    if (addonId === "detalle" && nivelId !== "premium") return;
    setAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((item) => item !== addonId) : [...prev, addonId],
    );
  }

  return (
    <div className="gg-configurator">
      <div className="gg-configurator-main">
        <fieldset className="gg-fieldset">
          <legend>01 · Tu vehículo</legend>
          <div className="gg-options">
            {tamanos.map((item) => (
              <label className="gg-option" key={item.id}>
                <input
                  type="radio"
                  name={`${id}-tamano`}
                  value={item.id}
                  checked={tamanoId === item.id}
                  onChange={() => setTamanoId(item.id)}
                />
                <span>{item.title}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="gg-fieldset">
          <legend>02 · Nivel de tratamiento</legend>
          <div className="gg-options">
            {servicios.map((item) => (
              <label className="gg-option" key={item.id}>
                <input
                  type="radio"
                  name={`${id}-nivel`}
                  value={item.id}
                  checked={nivelId === item.id}
                  onChange={() => cambiarNivel(item.id)}
                />
                <span>
                  {item.title}
                  <small>{precio(PRECIOS[item.id][tamanoId])}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="gg-fieldset gg-extras">
          <legend>03 · Extras sobre el auto</legend>
          <p className="gg-hint">Tocá un punto para sumar o quitar un extra.</p>
          <figure className="gg-vehicle">
            <div className="gg-stage">
              <svg
                className="gg-car"
                viewBox="0 0 900 380"
                role="img"
                aria-labelledby={`${id}-car-title`}
              >
                <title id={`${id}-car-title`}>Ilustración line-art de un auto en vista lateral</title>
                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path className="gg-car-ground" d="M55 310H845" />
                  <path d="M73 247 87 201Q92 184 126 178L251 161 344 92Q361 80 392 80H546Q578 81 605 105L689 169 785 187Q812 193 824 221L832 264 802 277H770M637 278H284M153 278H92Q70 276 73 247Z" />
                  <path d="m278 163 77-58q12-9 36-9h146q26 0 47 19l62 50Z" />
                  <path d="m422 97-8 67m118-67 28 67M413 176l-8 90m157-89 20 89M299 178l-18 53m-174-32 123-15m455 9 86 19M91 232h56m643-13 27 11M305 257h310" />
                  <path d="M152 278a66 66 0 0 1 132 0m353 0a66 66 0 0 1 132 0M459 187h25m94 0h23" />
                  <circle cx="218" cy="275" r="49" />
                  <circle cx="703" cy="275" r="49" />
                  <circle cx="218" cy="275" r="31" />
                  <circle cx="703" cy="275" r="31" />
                  <path d="m218 244 0 62m-31-31h62m454-31v62m-31-31h62" />
                  <path className="gg-car-accent" d="m117 211 117-19m85 49h284m154-30 39 10" />
                </g>
              </svg>
              {HOTSPOTS.map((point) => {
                const addon = addons.find((item) => item.id === point.id)!;
                const disabled = point.id === "detalle" && nivelId !== "premium";
                return (
                  <button
                    key={point.id}
                    type="button"
                    className={`gg-hotspot gg-hotspot--${point.id}`}
                    aria-label={`${point.label}: ${addon.title}, ${precio(PRECIOS_ADDONS[point.id])}`}
                    aria-pressed={addonIds.includes(point.id)}
                    aria-describedby={point.id === "detalle" ? `${id}-ceramica` : undefined}
                    disabled={disabled}
                    onClick={() => toggleAddon(point.id)}
                  >
                    <span className="gg-hotspot-dot" aria-hidden="true" />
                    <span>{point.label}<small>{precio(PRECIOS_ADDONS[point.id])}</small></span>
                  </button>
                );
              })}
            </div>
            <figcaption className="gg-caption">{tamano.title} · Vista lateral ilustrada, no modelo 3D.</figcaption>
          </figure>
          <p className="gg-hint" id={`${id}-ceramica`}>Corrección: requiere nivel Cerámica. Al cambiar de nivel, se quita ese extra.</p>
        </fieldset>
      </div>

      <aside className="gg-summary" aria-labelledby={`${id}-summary`}>
        <h3 className="gg-display" id={`${id}-summary`}>Tu tratamiento</h3>
        <div aria-live="polite" aria-atomic="true">
          <dl className="gg-breakdown">
            <div><dt>{tamano.title} · {nivel.title}</dt><dd>{precio(base)}</dd></div>
            {elegidos.map((item) => (
              <div key={item.id}><dt>{item.title}</dt><dd>{precio(PRECIOS_ADDONS[item.id])}</dd></div>
            ))}
            <div className="gg-total"><dt>Total</dt><dd>{precio(total)}</dd></div>
            <div className="gg-deposit"><dt>Seña ({Math.round(SENIA_PORCENTAJE * 100)}%)</dt><dd>{precio(Math.round((total * SENIA_PORCENTAJE) / 100) * 100)}</dd></div>
          </dl>
        </div>
        <p className="gg-hint">Precios finales con impuestos incluidos. La seña se descuenta del total.</p>
        <a className="gg-btn gg-book" href={reservarUrl}>Seguir en la reserva</a>
        <p className="gg-hint">La reserva confirma tamaño, nivel y extras</p>
      </aside>
    </div>
  );
}
