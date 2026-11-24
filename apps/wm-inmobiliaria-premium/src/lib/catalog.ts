export const OPERATIONS = ["Todas", "Venta", "Alquiler"] as const;
export const PROPERTY_TYPES = ["Todos", "Casa", "Departamento", "Loft", "Terreno"] as const;
export const SORTS = {
  relevancia: "Relevancia",
  "precio-asc": "Menor precio",
  "precio-desc": "Mayor precio",
  m2: "Más m²",
} as const;

export type Sort = keyof typeof SORTS;
export type CatalogQuery = {
  op: (typeof OPERATIONS)[number];
  type: (typeof PROPERTY_TYPES)[number];
  amb: number;
  q: string;
  sort: Sort;
  favs: boolean;
  view: "grid" | "map";
};

export const defaultCatalogQuery: CatalogQuery = { op: "Todas", type: "Todos", amb: 0, q: "", sort: "relevancia", favs: false, view: "grid" };

function oneOf<T extends readonly string[]>(value: string | null, values: T, fallback: T[number]): T[number] {
  return value && values.includes(value) ? value : fallback;
}

export function parseCatalogQuery(params: URLSearchParams): CatalogQuery {
  const parsedAmb = Number(params.get("amb") ?? 0);
  const parsedSort = params.get("sort");
  return {
    op: oneOf(params.get("op"), OPERATIONS, "Todas"),
    type: oneOf(params.get("type"), PROPERTY_TYPES, "Todos"),
    amb: [1, 2, 3, 4].includes(parsedAmb) ? parsedAmb : 0,
    q: (params.get("q") ?? "").slice(0, 80),
    sort: parsedSort && parsedSort in SORTS ? parsedSort as Sort : "relevancia",
    favs: params.get("favs") === "1",
    view: params.get("view") === "map" ? "map" : "grid",
  };
}

export function serializeCatalogQuery(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.op !== "Todas") params.set("op", query.op);
  if (query.type !== "Todos") params.set("type", query.type);
  if (query.amb) params.set("amb", String(query.amb));
  if (query.q) params.set("q", query.q);
  if (query.sort !== "relevancia") params.set("sort", query.sort);
  if (query.favs) params.set("favs", "1");
  if (query.view !== "grid") params.set("view", query.view);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
