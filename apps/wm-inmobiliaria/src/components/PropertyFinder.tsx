/**
 * BUSCADOR DE PROPIEDADES — isla React.
 *
 * Filtros por zona, tipo, precio y ambientes. La idea es que el filtro sea
 * RAPIDO: no hay mapa pesado ni paginacion, la lista entera esta en el DOM
 * y el filtrado es local (antipatron conocido del rubro: mapa lento).
 *
 * Se lee `?zona=` de la URL para preseleccionar un barrio (lo usan las
 * paginas de zonas).
 */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import PropertyCard from "./PropertyCard";
import type { Propiedad } from "../content/inmobiliaria";

export interface PropertyFinderProps {
  properties: Propiedad[];
}

type PrecioFiltro = "todos" | "hasta-250" | "250-400" | "mas-400";

const PRECIOS: { id: PrecioFiltro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "hasta-250", label: "Hasta USD 250k" },
  { id: "250-400", label: "USD 250k - 400k" },
  { id: "mas-400", label: "Más de USD 400k" },
];

const AMBIENTES: { id: number | null; label: string }[] = [
  { id: null, label: "Todos" },
  { id: 2, label: "2 ambientes" },
  { id: 3, label: "3 ambientes" },
  { id: 4, label: "4 o más" },
];

function pasaPrecio(precio: number, filtro: PrecioFiltro): boolean {
  if (filtro === "hasta-250") return precio <= 250000;
  if (filtro === "250-400") return precio > 250000 && precio <= 400000;
  if (filtro === "mas-400") return precio > 400000;
  return true;
}

export default function PropertyFinder({ properties }: PropertyFinderProps) {
  const [zona, setZona] = useState<string>("Todas");
  const [tipo, setTipo] = useState<string>("Todos");
  const [precio, setPrecio] = useState<PrecioFiltro>("todos");
  const [ambientes, setAmbientes] = useState<number | null>(null);

  // Preseleccion por query (?zona=Palermo).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const z = params.get("zona");
    if (z && properties.some((p) => p.zona === z)) setZona(z);
  }, [properties]);

  const zonas = useMemo(
    () => ["Todas", ...Array.from(new Set(properties.map((p) => p.zona)))],
    [properties],
  );
  const tipos = useMemo(
    () => ["Todos", ...Array.from(new Set(properties.map((p) => p.tipo)))],
    [properties],
  );

  const results = useMemo(
    () =>
      properties.filter((p) => {
        if (zona !== "Todas" && p.zona !== zona) return false;
        if (tipo !== "Todos" && p.tipo !== tipo) return false;
        if (!pasaPrecio(p.precioUsd, precio)) return false;
        if (ambientes !== null) {
          if (ambientes === 4 ? p.ambientes < 4 : p.ambientes !== ambientes) return false;
        }
        return true;
      }),
    [properties, zona, tipo, precio, ambientes],
  );

  const activos =
    (zona !== "Todas" ? 1 : 0) +
    (tipo !== "Todos" ? 1 : 0) +
    (precio !== "todos" ? 1 : 0) +
    (ambientes !== null ? 1 : 0);

  const limpiar = () => {
    setZona("Todas");
    setTipo("Todos");
    setPrecio("todos");
    setAmbientes(null);
  };

  const grupo = (label: string, children: ReactNode) => (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">{label}</legend>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
        {children}
      </div>
    </fieldset>
  );

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
      active ? "border-accent bg-soft text-accent" : "border-line text-muted hover:border-accent hover:text-fg"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
      {/* ── Filtros ───────────────────────────────────────────── */}
      <aside className="wm-card h-fit lg:sticky lg:top-28">
        <div className="flex items-baseline justify-between gap-3">
          <p className="wm-kicker">Filtros</p>
          <span className="text-xs text-muted">{activos} activo(s)</span>
        </div>

        <div className="mt-6 grid gap-6">
          {grupo(
            "Zona",
            zonas.map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZona(z)}
                aria-pressed={zona === z}
                className={chip(zona === z)}
              >
                {z}
              </button>
            )),
          )}

          {grupo(
            "Tipo",
            tipos.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                aria-pressed={tipo === t}
                className={chip(tipo === t)}
              >
                {t}
              </button>
            )),
          )}

          {grupo(
            "Precio",
            PRECIOS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPrecio(p.id)}
                aria-pressed={precio === p.id}
                className={chip(precio === p.id)}
              >
                {p.label}
              </button>
            )),
          )}

          {grupo(
            "Ambientes",
            AMBIENTES.map((a) => (
              <button
                key={a.id ?? "todos"}
                type="button"
                onClick={() => setAmbientes(a.id)}
                aria-pressed={ambientes === a.id}
                className={chip(ambientes === a.id)}
              >
                {a.label}
              </button>
            )),
          )}
        </div>

        <button
          type="button"
          onClick={limpiar}
          className="mt-7 w-full text-sm text-muted underline underline-offset-4 transition-colors hover:text-fg"
        >
          Limpiar filtros
        </button>
      </aside>

      {/* ── Resultados ────────────────────────────────────────── */}
      <div>
        <p className="text-sm text-muted">
          <span className="font-semibold text-fg tabular-nums">{results.length}</span>{" "}
          {results.length === 1 ? "propiedad coincide" : "propiedades coinciden"} con tu búsqueda.
        </p>

        {results.length === 0 ? (
          <div className="wm-card mt-6">
            <p className="wm-display text-2xl">No hay nada con esos filtros</p>
            <p className="mt-3 text-muted">
              Nuestra cartera es de seis propiedades. Probá sacar menos filtros: capaz la
              propiedad que buscás tiene otra zona u otro tipo.
            </p>
            <button type="button" onClick={limpiar} className="wm-btn mt-6">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
