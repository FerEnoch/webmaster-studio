/**
 * BUSCADOR DE CARRERAS — el diferencial del rubro.
 *
 * Filtra por sede, modalidad y area, y deja comparar hasta tres carreras
 * lado a lado (duracion, modalidad, sede, salida laboral, arancel): es la
 * comparacion que un postulante hace en su casa antes de llamar.
 *
 * Isla React (hydrate en `client:visible`). Sin backend: los datos del
 * contenido son estaticos.
 */

import { useMemo, useState } from "react";
import type { Carrera } from "../content/universidades";

export interface CarreraFinderProps {
  carreras: Carrera[];
  /** Cuantas carreras se pueden comparar a la vez. */
  maxComparar?: number;
}

const TODAS = "todas";

/** Etiqueta legible de una modalidad. */
function etiquetaModalidad(m: string): string {
  return m === "online" ? "Online" : "Presencial";
}

export default function CarreraFinder({ carreras, maxComparar = 3 }: CarreraFinderProps) {
  const [sede, setSede] = useState<string>(TODAS);
  const [modalidad, setModalidad] = useState<string>(TODAS);
  const [area, setArea] = useState<string>(TODAS);
  const [comparar, setComparar] = useState<string[]>([]);

  const sedes = useMemo(() => [...new Set(carreras.map((c) => c.sede))].sort(), [carreras]);
  const areas = useMemo(() => [...new Set(carreras.map((c) => c.area))].sort(), [carreras]);

  const filtradas = useMemo(
    () =>
      carreras.filter(
        (c) =>
          (sede === TODAS || c.sede === sede) &&
          (area === TODAS || c.area === area) &&
          (modalidad === TODAS || c.modalidades.includes(modalidad as Carrera["modalidades"][number])),
      ),
    [carreras, sede, area, modalidad],
  );

  const seleccionadas = useMemo(
    () => comparar.map((id) => carreras.find((c) => c.id === id)).filter(Boolean) as Carrera[],
    [comparar, carreras],
  );

  const hayFiltros = sede !== TODAS || modalidad !== TODAS || area !== TODAS;

  const limpiar = () => {
    setSede(TODAS);
    setModalidad(TODAS);
    setArea(TODAS);
  };

  const toggleComparar = (id: string) => {
    setComparar((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxComparar) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  return (
    <div>
      {/* ── Filtros ─────────────────────────────────────────────── */}
      <div className="wm-card">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="text-muted">Sede</span>
            <select
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none focus:border-accent"
            >
              <option value={TODAS}>Todas las sedes</option>
              {sedes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-muted">Modalidad</span>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none focus:border-accent"
            >
              <option value={TODAS}>Presencial y online</option>
              <option value="presencial">Solo presencial</option>
              <option value="online">Solo online</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-muted">Área</span>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none focus:border-accent"
            >
              <option value={TODAS}>Todas las áreas</option>
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-sm text-muted">
            <span className="font-semibold text-fg tabular-nums">{filtradas.length}</span>{" "}
            {filtradas.length === 1 ? "carrera coincide" : "carreras coinciden"} con el filtro
          </p>
          {hayFiltros ? (
            <button type="button" onClick={limpiar} className="text-sm font-semibold text-accent underline underline-offset-4">
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      {/* ── Resultados ──────────────────────────────────────────── */}
      {filtradas.length === 0 ? (
        <div className="mt-6 rounded-wm-lg border border-line p-10 text-center">
          <p className="wm-display text-2xl">Ninguna carrera con esos tres filtros</p>
          <p className="mt-3 text-sm text-muted">
            Probá con otra sede o con la modalidad "presencial y online". Son seis carreras:
            si ninguna te sirve, escribinos y miramos las del próximo ciclo.
          </p>
          <button type="button" onClick={limpiar} className="wm-btn mt-6">
            Ver todas
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((c) => {
            const marcada = comparar.includes(c.id);
            const tope = comparar.length >= maxComparar && !marcada;
            return (
              <li key={c.id} className="wm-card flex h-full min-w-0 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <span className="wm-chip shrink-0">{c.area}</span>
                  {c.badge ? <span className="text-xs uppercase tracking-[0.14em] text-muted">{c.badge}</span> : null}
                </div>

                <h3 className="wm-display mt-4 text-2xl leading-tight">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.body}</p>

                <dl className="mt-5 space-y-2 text-xs uppercase tracking-[0.14em] text-muted">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt>Duración</dt>
                    <dd className="font-semibold text-fg">{c.duracion}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt>Sede</dt>
                    <dd className="font-semibold text-fg">{c.sede}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt>Modalidad</dt>
                    <dd className="text-right font-semibold text-fg">
                      {c.modalidades.map((m) => etiquetaModalidad(m)).join(" / ")}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 border-l-2 border-accent pl-3 text-sm text-muted">
                  <span className="block text-xs uppercase tracking-[0.14em]">Salida laboral</span>
                  <span className="mt-1 block text-fg">{c.salida}</span>
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
                  <span className="wm-display text-xl text-accent">{c.arancel}</span>
                  <button
                    type="button"
                    onClick={() => toggleComparar(c.id)}
                    disabled={tope}
                    aria-pressed={marcada}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                      marcada
                        ? "border-accent bg-accent text-bg"
                        : "border-line text-muted hover:border-accent hover:text-fg"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {marcada ? "Comparando" : "Comparar"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Comparacion ─────────────────────────────────────────── */}
      {seleccionadas.length >= 2 ? (
        <div className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="wm-display text-[clamp(1.6rem,4vw,2.4rem)]">Comparación lado a lado</h3>
            <p className="text-sm text-muted">
              {seleccionadas.length} de {maxComparar} carreras
            </p>
          </div>

          <div className="mt-5 overflow-x-auto rounded-wm-lg border border-line">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">Comparación de carreras</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-4 text-left text-xs uppercase tracking-[0.14em] text-muted">Dato</th>
                  {seleccionadas.map((c) => (
                    <th key={c.id} scope="col" className="p-4 text-left">
                      <span className="wm-display text-lg leading-tight">{c.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Duración", (c: Carrera) => c.duracion],
                  ["Modalidad", (c: Carrera) => c.modalidades.map((m) => etiquetaModalidad(m)).join(" / ")],
                  ["Sede", (c: Carrera) => c.sede],
                  ["Área", (c: Carrera) => c.area],
                  ["Salida laboral", (c: Carrera) => c.salida],
                  ["Arancel", (c: Carrera) => c.arancel],
                ].map(([label, get]) => (
                  <tr key={label as string} className="border-b border-line last:border-0">
                    <th scope="row" className="p-4 text-left align-top text-xs uppercase tracking-[0.14em] text-muted">
                      {label as string}
                    </th>
                    {seleccionadas.map((c) => (
                      <td key={c.id} className="p-4 align-top">
                        {(get as (c: Carrera) => string)(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={() => setComparar([])} className="wm-btn wm-btn--ghost mt-5">
            Limpiar comparación
          </button>
        </div>
      ) : null}
    </div>
  );
}
