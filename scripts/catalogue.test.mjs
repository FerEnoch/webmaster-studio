import assert from "node:assert/strict";
import test from "node:test";
import * as catalogue from "../packages/webmaster-kit/rubros.ts";
import * as portfolio from "../apps/wm-portfolio/src/lib/rubros.ts";

const { RUBROS, APPS, getRubro, requireRubro } = catalogue;
const ids = (demos) => demos.map((demo) => demo.id);
const visibleIds = (requested, demos = RUBROS) => {
  const filter = catalogue.resolveRubroFilter(requested, demos);
  return ids(demos.filter((demo) => catalogue.matchesRubroFilter(demo, filter)));
};

test("one chip per family, in catalogue order, includes both base/premium pairs", () => {
  assert.equal(typeof catalogue.getRubroGroups, "function");
  const groups = catalogue.getRubroGroups();
  assert.deepEqual(ids(groups), ["concesionario", "lavadero", "estetica", "universidad", "inmobiliaria", "arquitectura"]);
  assert.equal(new Set(ids(groups)).size, groups.length);
  for (const [id, nombre] of [["lavadero", "Multiservicios"], ["arquitectura", "Estudios profesionales"]]) {
    const group = groups.find((group) => group.id === id);
    assert.equal(group.nombre, nombre);
    assert.equal(group.accent, getRubro(id).palette.accent);
    assert.deepEqual(ids(group.demos), [id, `${id}-premium`]);
    assert.deepEqual(visibleIds(id), [id, `${id}-premium`]);
  }
  assert.deepEqual(groups.flatMap((group) => group.demos), RUBROS);
});

test("family display names change without renaming demos or their public app metadata", () => {
  assert.deepEqual(catalogue.getRubroGroups().map(({ id, nombre }) => [id, nombre]), [
    ["concesionario", "Concesionarios"], ["lavadero", "Multiservicios"],
    ["estetica", "Estética"], ["universidad", "Institucional y educativo"],
    ["inmobiliaria", "Inmobiliaria"], ["arquitectura", "Estudios profesionales"],
  ]);
  const names = ["Concesionario", "Lavadero + bar", "Lavadero Premium", "Estética + yoga",
    "Universidad privada", "Inmobiliaria", "Arquitectura", "Arquitectura Premium"];
  assert.deepEqual(RUBROS.map(({ nombre }) => nombre), names);
  assert.deepEqual(APPS.slice(0, -1).map(({ nombre }) => nombre), names);
});

test("the standard car wash uses Autolavado and keeps its premium variant in Multiservicios", () => {
  const group = portfolio.getRubroGroups().find(({ id }) => id === "lavadero");
  assert.equal(group.nombre, "Multiservicios");
  assert.deepEqual(group.demos.map(({ id, rubro }) => [id, rubro]), [
    ["lavadero", "Autolavado con bar"],
    ["lavadero-premium", "Centro de estética vehicular"],
  ]);
});

test("new variants join existing families without name/suffix lists or mutation", () => {
  assert.equal(typeof catalogue.getRubroGroups, "function");
  const extra = [
    { ...getRubro("estetica"), id: "aura", slug: "aura", rubroId: "estetica", nombre: "Aura", demoUrl: "/demos/aura/", port: 3033 },
    { ...getRubro("lavadero"), id: "gloss-nocturno", slug: "gloss-nocturno", rubroId: "lavadero", nombre: "Gloss nocturno", demoUrl: "/demos/gloss-nocturno/", port: 3034 },
  ];
  const demos = Object.freeze([...RUBROS, ...extra].map((demo) => Object.freeze({ ...demo })));
  const before = structuredClone(demos);
  const groups = catalogue.getRubroGroups(demos);
  assert.equal(groups.length, 6);
  assert.deepEqual(ids(groups.find((group) => group.id === "estetica").demos), ["estetica", "aura"]);
  assert.deepEqual(visibleIds("estetica", demos), ["estetica", "aura"]);
  assert.deepEqual(visibleIds("lavadero", demos), ["lavadero", "lavadero-premium", "gloss-nocturno"]);
  assert.deepEqual(visibleIds("aura", demos), ["aura"]);
  assert.deepEqual(demos, before);
  assert.equal(RUBROS.length, 8);
});

test("a new family derives its own chip even without a same-named base demo", () => {
  assert.equal(typeof catalogue.getRubroGroups, "function");
  const demo = { ...getRubro("estetica"), id: "taller-uno", rubroId: "taller", nombre: "Taller" };
  const demos = [...RUBROS, demo];
  const group = catalogue.getRubroGroups(demos).at(-1);
  assert.deepEqual(group, { id: "taller", nombre: "Taller", accent: demo.palette.accent, demos: [demo] });
  assert.deepEqual(visibleIds("taller", demos), ["taller-uno"]);
  assert.deepEqual(catalogue.getRubroGroups([]), []);
});

test("unknown, absent and all filters show every demo without modifying the catalogue", () => {
  assert.equal(typeof catalogue.resolveRubroFilter, "function");
  const before = structuredClone(RUBROS);
  for (const requested of [null, undefined, "", "todos", "unknown", "Lavadero", "toString"]) {
    assert.equal(catalogue.resolveRubroFilter(requested), "todos");
    assert.deepEqual(visibleIds(requested), ids(RUBROS));
  }
  assert.deepEqual(RUBROS, before);
});

test("all previously supported rubro deep links retain their selection, including premium IDs", () => {
  assert.equal(typeof catalogue.resolveRubroFilter, "function");
  for (const demo of RUBROS) {
    const url = new URL(`/demos/?rubro=${demo.id}&source=portfolio#catalogue`, "https://studio.example");
    const requested = url.searchParams.get("rubro");
    assert.equal(catalogue.resolveRubroFilter(requested), demo.id);
    const expected = demo.id === "lavadero" || demo.id === "arquitectura"
      ? [demo.id, `${demo.id}-premium`]
      : [demo.id];
    assert.deepEqual(visibleIds(requested), expected);
  }
});

test("demo IDs, app ordering, ports, URLs and lookup aliases remain unchanged", () => {
  const expected = [
    ["concesionario", 3021], ["lavadero", 3022], ["lavadero-premium", 3031],
    ["estetica", 3023], ["universidad", 3024], ["inmobiliaria", 3025],
    ["arquitectura", 3026], ["arquitectura-premium", 3032], ["portfolio", 3027],
  ];
  assert.deepEqual(APPS.map(({ id, port }) => [id, port]), expected);
  assert.equal(new Set(ids(APPS)).size, APPS.length);
  assert.equal(new Set(APPS.map((app) => app.port)).size, APPS.length);
  for (const [id] of expected) {
    const app = APPS.find((app) => app.id === id);
    assert.equal(app.demoUrl, id === "portfolio" ? "/" : `/demos/${id}/`);
    if (id === "portfolio") continue;
    assert.equal(getRubro(id).slug, id);
    assert.equal(requireRubro(id), getRubro(id));
    assert.equal(getRubro(id).demoUrl, app.demoUrl);
  }
  assert.equal(getRubro("unknown"), undefined);
  assert.throws(() => requireRubro("unknown"), { message: 'Rubro desconocido: "unknown". Revisar packages/webmaster-kit/rubros.ts' });
});

test("portfolio consumes the canonical registry instead of maintaining a copied catalogue", () => {
  assert.equal(portfolio.RUBROS, RUBROS);
  assert.equal(portfolio.APPS, APPS);
  assert.equal(portfolio.getRubroGroups, catalogue.getRubroGroups);
});
