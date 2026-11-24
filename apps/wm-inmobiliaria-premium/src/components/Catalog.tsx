import { useEffect, useMemo, useState } from "react";
import { defaultCatalogQuery, OPERATIONS, parseCatalogQuery, PROPERTY_TYPES, serializeCatalogQuery, SORTS, type CatalogQuery, type Sort } from "../lib/catalog";
import { useFavorites } from "../lib/favorites";
import { properties, type Property } from "../lib/properties";
import MapView from "./MapView";
import PropertyCard from "./PropertyCard";

export default function Catalog({ initialQuery }: { initialQuery: CatalogQuery }) {
  const [query, setQuery] = useState(initialQuery);
  const [hover, setHover] = useState<string | null>(null);
  const favorites = useFavorites();

  useEffect(() => {
    setQuery(parseCatalogQuery(new URLSearchParams(window.location.search)));
    const onPopState = () => setQuery(parseCatalogQuery(new URLSearchParams(window.location.search)));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const update = (patch: Partial<CatalogQuery>) => {
    const next = { ...query, ...patch };
    setQuery(next);
    window.history.replaceState({}, "", `${window.location.pathname}${serializeCatalogQuery(next)}`);
  };

  const list = useMemo(() => {
    const normalized = query.q.trim().toLocaleLowerCase("es-AR");
    let result: Property[] = properties.filter((property) =>
      (query.op === "Todas" || property.op === query.op) &&
      (query.type === "Todos" || property.type === query.type) &&
      (!query.amb || (property.amb ?? 0) >= query.amb) &&
      (!query.favs || favorites.includes(property.slug)) &&
      (!normalized || `${property.title} ${property.barrio} ${property.ciudad}`.toLocaleLowerCase("es-AR").includes(normalized)),
    );
    const usd = (property: Property) => property.currency === "USD" ? property.price : property.price / 1200;
    if (query.sort === "precio-asc") result = [...result].sort((a, b) => usd(a) - usd(b));
    if (query.sort === "precio-desc") result = [...result].sort((a, b) => usd(b) - usd(a));
    if (query.sort === "m2") result = [...result].sort((a, b) => b.m2 - a.m2);
    return result;
  }, [query, favorites]);

  const modified = serializeCatalogQuery(query) !== serializeCatalogQuery(defaultCatalogQuery);

  return (
    <div className="px-4 pt-28 pb-24 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs tracking-[0.25em] text-ink/50 uppercase">{query.favs ? "Tus favoritas" : "Catálogo"}</p>
            <h1 className="mt-2 font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.9]"><span className="tabular-nums">{list.length}</span> <span className="italic">propiedades</span></h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/55">Ocho lugares para imaginar una vida. Guardá tus favoritas solo en este navegador.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query.q}
              onChange={(event) => update({ q: event.target.value })}
              aria-label="Buscar barrio o ciudad"
              placeholder="Buscar barrio o ciudad…"
              className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white/60 px-5 py-3 text-sm outline-none focus:border-brass sm:w-72 sm:flex-none"
            />
            <div className="flex rounded-full bg-sand p-1 lg:hidden" aria-label="Vista del catálogo">
              {(["grid", "map"] as const).map((view) => (
                <button key={view} type="button" aria-pressed={query.view === view} onClick={() => update({ view })} className={`rounded-full px-4 py-2 text-sm ${query.view === view ? "bg-ink text-ivory" : ""}`}>
                  {view === "grid" ? "Lista" : "Mapa"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky top-24 z-30 -mx-1 mb-8 flex flex-wrap items-center gap-2 rounded-3xl bg-ivory/90 p-1 backdrop-blur-xl">
          <Chips options={OPERATIONS} value={query.op} onChange={(op) => update({ op })} label="Operación" />
          <Chips options={PROPERTY_TYPES} value={query.type} onChange={(type) => update({ type })} label="Tipo" />
          <Chips
            options={["Amb.", "1+", "2+", "3+", "4+"] as const}
            value={query.amb ? `${query.amb}+` : "Amb."}
            onChange={(value) => update({ amb: value === "Amb." ? 0 : Number(value[0]) })}
            label="Ambientes"
          />
          <select value={query.sort} onChange={(event) => update({ sort: event.target.value as Sort })} aria-label="Ordenar" className="rounded-full border border-ink/15 bg-transparent px-4 py-2 text-sm outline-none lg:ml-auto">
            {Object.entries(SORTS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          {query.favs && <button type="button" onClick={() => update({ favs: false })} className="rounded-full bg-brass px-4 py-2 text-sm text-white">Ver todas ✕</button>}
          {modified && <button type="button" onClick={() => update(defaultCatalogQuery)} className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:bg-sand">Restablecer filtros</button>}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(360px,38%)]">
          <div data-catalog-list className={`content-start gap-x-6 gap-y-12 sm:grid-cols-2 ${query.view === "map" ? "hidden lg:grid" : "grid"}`}>
            {list.map((property) => <PropertyCard key={property.slug} property={property} onHover={setHover} highlighted={hover === property.slug} />)}
            {list.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-ink/20 p-16 text-center">
                <p className="font-serif text-3xl">Sin resultados</p>
                <p className="mt-2 text-ink/60">Probá quitar algún filtro o guardar una propiedad.</p>
              </div>
            )}
          </div>
          <div className={query.view === "grid" ? "hidden lg:block" : "block"}>
            <MapView items={list} active={hover} onHover={setHover} className="sticky top-44 h-[70vh] min-h-[420px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Chips<T extends string>({ options, value, onChange, label }: { options: readonly T[]; value: string; onChange: (value: T) => void; label: string }) {
  return (
    <div className="filter-chips flex max-w-full flex-wrap rounded-3xl bg-sand p-1" aria-label={label}>
      {options.map((option) => (
        <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={`rounded-full px-3.5 py-2 text-sm sm:px-4 ${value === option ? "bg-ink text-ivory" : "text-ink/75"}`}>{option}</button>
      ))}
    </div>
  );
}
