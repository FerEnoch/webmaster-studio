/**
 * CALCULADORA DE CUOTA — isla React.
 *
 * Muestra la cuota mensual real de cada usado del stock segun el anticipo y
 * el plazo. Es la version simple del configurador de la casa: mismo dato que
 * se publica, mismos numeros que se firman en el mostrador.
 *
 * El calculo es deterministico (sistema frances, tasa fija): el mismo input
 * devuelve siempre la misma cuota. Sin backend.
 */

import { useMemo, useState } from "react";
import { ars, type Auto } from "../content/concesionario";

export interface CuotaCalculatorProps {
  autos: Auto[];
  /** Tasa anual nominal de referencia (%). */
  tasaAnual?: number;
}

/** Cuota mensual de un credito con amortizacion francesa. */
export function cuotaMensual(
  precio: number,
  anticipoPct: number,
  plazo: number,
  tasaAnual: number,
): number {
  const saldo = precio * (1 - anticipoPct / 100);
  const i = tasaAnual / 100 / 12;
  if (i <= 0) return Math.round(saldo / plazo);
  const factor = (i * Math.pow(1 + i, plazo)) / (Math.pow(1 + i, plazo) - 1);
  return Math.round(saldo * factor);
}

export default function CuotaCalculator({ autos, tasaAnual = 42 }: CuotaCalculatorProps) {
  const [anticipo, setAnticipo] = useState(30);
  const [plazo, setPlazo] = useState(36);

  const filas = useMemo(
    () =>
      autos.map((auto) => ({
        auto,
        cuota: cuotaMensual(auto.precio, anticipo, plazo, tasaAnual),
        anticipoPesos: Math.round(auto.precio * (anticipo / 100)),
      })),
    [autos, anticipo, plazo, tasaAnual],
  );

  const campo =
    "mt-1 w-full rounded-wm border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-accent";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-12">
      {/* ── Controles ──────────────────────────────────────────── */}
      <aside className="wm-card h-fit lg:sticky lg:top-28">
        <p className="wm-kicker">Tu plan</p>

        <label className="mt-6 block text-sm">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-muted">Anticipo</span>
            <span className="font-semibold text-accent">{anticipo}%</span>
          </span>
          <input
            type="range"
            min={10}
            max={60}
            step={5}
            value={anticipo}
            onChange={(e) => setAnticipo(Number(e.target.value))}
            className="mt-2 w-full cursor-pointer accent-[var(--wm-accent)]"
          />
        </label>

        <label className="mt-5 block text-sm">
          <span className="text-muted">Plazo</span>
          <select value={plazo} onChange={(e) => setPlazo(Number(e.target.value))} className={campo}>
            <option value={12}>12 cuotas</option>
            <option value={24}>24 cuotas</option>
            <option value={36}>36 cuotas</option>
            <option value={48}>48 cuotas</option>
          </select>
        </label>

        <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">Tasa</dt>
            <dd className="font-semibold">{tasaAnual}% anual fija</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">Cuota sobre</dt>
            <dd className="font-semibold">{ars(100 - anticipo)}% del precio</dd>
          </div>
        </dl>

        <p className="mt-5 text-xs leading-relaxed text-muted">
          Calculo con sistema frances, tasa fija y precio final con IVA
          incluido. No incluye patentaria, seguro ni consumibles. Es una
          demostracion: no hay consulta crediticia ni envio de datos.
        </p>
      </aside>

      {/* ── Resultado ──────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-muted">
            {anticipo}% de anticipo · {plazo} cuotas · tasa fija {tasaAnual}%
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Cuotas estimadas
          </p>
        </div>

        <ul className="mt-6 divide-y divide-line border-y border-line">
          {filas.map(({ auto, cuota, anticipoPesos }) => (
            <li
              key={auto.id}
              className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  {auto.marca} · {auto.version}
                </p>
                <h3 className="wm-display mt-2 text-2xl leading-tight">
                  {auto.modelo} <span className="text-accent">{auto.anio}</span>
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Precio final {ars(auto.precio)} · anticipo de{" "}
                  <span className="font-semibold text-fg">{ars(anticipoPesos)}</span>
                </p>
              </div>
              <div className="sm:text-right">
                <p className="wm-display text-3xl leading-none text-accent">{ars(cuota)}</p>
                <p className="mt-1 text-xs text-muted">por mes, IVA incluido</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted">
          La cuota final depende de la aprobacion crediticia y de la documentacion
          que se solicite en el mostrador. Los valores publicados en las fichas
          usan anticipo del 30% y 36 cuotas.
        </p>
      </div>
    </div>
  );
}
