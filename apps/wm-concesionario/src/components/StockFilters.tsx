/**
 * BUSCADOR DE USADOS — isla React.
 *
 * Filtra el stock por marca, modelo, precio maximo y kilometraje maximo, y
 * ordena el resultado. Es la misma busqueda de un configurador: filtros a la
 * izquierda, resultados a la derecha, contador siempre visible.
 *
 * Es una isla: `client:visible`. Los datos vienen del contenido de la app
 * (`src/content/concesionario.ts`), no de un backend.
 */

import { useMemo, useState } from "react";
import { img } from "@lib/media";
import { ars, km, type Auto } from "../content/concesionario";

export interface StockFiltersProps {
  autos: Auto[];
  /** Texto del boton de la ficha. */
  ctaLabel?: string;
  /** Ruta base de las fichas: "/usados" o "/nuevos". */
  basePath?: string;
}

type Orden = "precio-asc" | "precio-desc" | "km-asc" | "anio-desc";

export default function StockFilters({
  autos,
  ctaLabel = "Ver la ficha",
  basePath = "/usados",
}: StockFiltersProps) {
  const [marca, setMarca] = useState("Todas");
  const [modelo, setModelo] = useState("Todos");
  const [precioMax, setPrecioMax] = useState<number>(() =>
    Math.max(...autos.map((a) => a.precio)),
  );
  const [kmMax, setKmMax] = useState<number>(() => Math.max(...autos.map((a) => a.km)));
  const [orden, setOrden] = useState<Orden>("precio-asc");

  const marcas = useMemo(
    () => Array.from(new Set(autos.map((a) => a.marca))).sort(),
    [autos],
  );
  const modelos = useMemo(
    () =>
      Array.from(new Set(autos.filter((a) => marca === "Todas" || a.marca === marca).map((a) => a.modelo)))
        .sort()
        .filter((m) => marca === "Todas" || autos.some((a) => a.marca === marca && a.modelo === m)),
    [autos, marca],
  );

  const resultados = useMemo(() => {
    const lista = autos.filter(
      (a) =>
        (marca === "Todas" || a.marca === marca) &&
        (modelo === "Todos" || a.modelo === modelo) &&
        a.precio <= precioMax &&
        (a.km === 0 || a.km <= kmMax),
    );
    const ordenados = [...lista];
    if (orden === "precio-asc") ordenados.sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") ordenados.sort((a, b) => b.precio - a.precio);
    if (orden === "km-asc") ordenados.sort((a, b) => a.km - b.km);
    if (orden === "anio-desc") ordenados.sort((a, b) => b.anio - a.anio);
    return ordenados;
  }, [autos, marca, modelo, precioMax, kmMax, orden]);

  const hayFiltros = marca !== "Todas" || modelo !== "Todos";
  const limpiar = () => {
    setMarca("Todas");
    setModelo("Todos");
    setPrecioMax(Math.max(...autos.map((a) => a.precio)));
    setKmMax(Math.max(...autos.map((a) => a.km)));
    setOrden("precio-asc");
  };

  const slider =
    "w-full accent-[var(--wm-accent)] cursor-pointer";
  const campo =
    "mt-1 w-full rounded-wm border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-accent";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-12">
      {/* ── Filtros ─────────────────────────────────────────────── */}
      <aside className="wm-card wm-wa-gutter h-fit lg:sticky lg:top-28">
        <p className="wm-kicker">Filtros</p>

        <label className="mt-6 block text-sm">
          <span className="text-muted">Marca</span>
          <select
            value={marca}
            onChange={(e) => {
              setMarca(e.target.value);
              setModelo("Todos");
            }}
            className={campo}
          >
            <option value="Todas">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block text-sm">
          <span className="text-muted">Modelo</span>
          <select value={modelo} onChange={(e) => setModelo(e.target.value)} className={campo}>
            <option value="Todos">Todos los modelos</option>
            {modelos.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-6 block text-sm">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-muted">Precio maximo</span>
            <span className="font-semibold text-accent">{ars(precioMax)}</span>
          </span>
          <input
            type="range"
            min={Math.min(...autos.map((a) => a.precio))}
            max={Math.max(...autos.map((a) => a.precio))}
            step={100000}
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
            className={`${slider} mt-2`}
          />
        </label>

        <label className="mt-5 block text-sm">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-muted">Kilometraje maximo</span>
            <span className="font-semibold text-accent">{km(kmMax)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(...autos.map((a) => a.km))}
            step={1000}
            value={kmMax}
            onChange={(e) => setKmMax(Number(e.target.value))}
            className={`${slider} mt-2`}
          />
        </label>

        <label className="mt-5 block text-sm">
          <span className="text-muted">Ordenar por</span>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className={campo}
          >
            <option value="precio-asc">Precio: de menor a mayor</option>
            <option value="precio-desc">Precio: de mayor a menor</option>
            <option value="km-asc">Menos kilómetros</option>
            <option value="anio-desc">Más nuevo primero</option>
          </select>
        </label>

        <button
          type="button"
          onClick={limpiar}
          className="mt-6 w-full rounded-full border border-line px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Limpiar filtros
        </button>

        <p className="mt-5 text-xs leading-relaxed text-muted">
          Filtros y stock de demostración. No hay base de datos: todo se calcula
          en el navegador.
        </p>
      </aside>

      {/* ── Resultados ──────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm">
            <span className="tabular-nums font-semibold text-accent">{resultados.length}</span>{" "}
            <span className="text-muted">
              {resultados.length === 1 ? "unidad coincide" : "unidades coinciden"}
            </span>
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Stock actualizado hace 2 min
          </p>
        </div>

        {resultados.length === 0 ? (
          <div className="mt-10 rounded-wm-lg border border-line p-8 text-center">
            <p className="wm-display text-2xl">No hay unidades con esos filtros</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              Probá subiendo el tope de precio o de kilometraje: con los datos de
              esta demo el stock es chico y muy filtrado.
            </p>
            <button type="button" onClick={limpiar} className="wm-btn mt-6">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {resultados.map((auto) => (
              <li key={auto.id}>
                <article className="wm-card group flex h-full flex-col overflow-hidden p-0!">
                  <div className="wm-grade wm-grain wm-vignette relative overflow-hidden">
                    <img
                      src={img(auto.foto, 800, 520)}
                      alt={auto.fotoAlt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-3 left-3">
                      <span className="wm-chip">{auto.estado}</span>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      {auto.marca} · {auto.version}
                    </p>
                    <h3 className="wm-display mt-2 text-2xl leading-tight">
                      {auto.modelo} <span className="text-accent">{auto.anio}</span>
                    </h3>

                    <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted">
                      <div className="flex gap-1">
                        <dt>Km:</dt>
                        <dd className="font-semibold text-fg">
                          {auto.km === 0 ? "0" : auto.km.toLocaleString("es-AR")}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt>{auto.combustible}</dt>
                        <dd className="font-semibold text-fg">{auto.caja}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt>{auto.sucursal}</dt>
                      </div>
                    </dl>

                    <div className="mt-auto border-t border-line pt-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="wm-display text-2xl leading-none text-accent">
                          {ars(auto.precio)}
                        </span>
                        <span className="text-xs text-muted">final, IVA incluido</span>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        Cuota estimada{" "}
                        <span className="font-semibold text-fg">{ars(auto.cuota)}/mes</span>
                      </p>
                      <a
                        href={`${basePath}/${auto.id}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-accent underline underline-offset-4 transition-colors hover:text-fg"
                      >
                        {ctaLabel}
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {hayFiltros ? (
          <p className="mt-8 text-xs text-muted">
            Filtro aplicado: {marca === "Todas" ? "cualquier marca" : marca} ·{" "}
            {modelo === "Todos" ? "cualquier modelo" : modelo}. El precio que ves
            ya incluye IVA.
          </p>
        ) : null}
      </div>
    </div>
  );
}
