/**
 * FILTRO POR INDUSTRIA — catálogo de soluciones del estudio.
 *
 * Las cards las renderiza el lado de Astro con `SolutionCard.astro` (una sola
 * fuente de verdad para el markup de la card). Esta isla solo maneja el
 * estado del filtro y le dice al DOM que cards mostrar:
 *
 *   - toggles `.is-out` on `[data-wm-rubro-card]`: a card matches by its
 *     `data-wm-rubro-card` or its `data-wm-rubro-grupo` (so the architecture
 *     premium edition also shows under the "Arquitectura" chip)
 *   - sincroniza el filtro con la URL (?rubro=concesionario) para que el link sea
 *     compartible
 *   - anuncia el resultado en una region `aria-live`
 *
 * Es una isla React (`client:load`): sin JS se ven las 8 soluciones, que es
 * justamente el fallback correcto.
 */

import { useCallback, useEffect, useState } from "react";

export interface RubroChip {
  id: string;
  nombre: string;
  /** Color de acento de la solución. */
  accent: string;
}

export interface RubroFilterProps {
  rubros: RubroChip[];
  /** Cantidad total de soluciones. */
  total: number;
}

const ALL = "todos";

export default function RubroFilter({ rubros, total }: RubroFilterProps) {
  const [active, setActive] = useState<string>(ALL);
  // `ready` evita que el primer efecto pise el ?rubro= de la URL antes de
  // haberlo leido.
  const [ready, setReady] = useState(false);

  /** Aplica el filtro a las cards renderizadas por Astro. */
  const apply = useCallback(
    (id: string) => {
      const cards = document.querySelectorAll<HTMLElement>("[data-wm-rubro-card]");
      let visible = 0;
      cards.forEach((card) => {
        const match =
          id === ALL ||
          card.dataset.wmRubroCard === id ||
          card.dataset.wmRubroGrupo === id;
        if (match) visible += 1;
        card.classList.toggle("is-out", !match);
        card.setAttribute("aria-hidden", match ? "false" : "true");
      });

      const live = document.querySelector<HTMLElement>("[data-wm-filter-live]");
      if (live) {
        const nombre = rubros.find((r) => r.id === id)?.nombre;
        live.textContent =
          id === ALL
            ? `Mostrando las ${visible} soluciones por industria.`
            : `Mostrando ${visible} ${visible === 1 ? "solución" : "soluciones"}: ${nombre ?? id}.`;
      }
    },
    [rubros, total],
  );

  // Al montar: si la URL trae ?rubro=..., se arranca filtrado.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("rubro");
    const initial =
      requested && rubros.some((r) => r.id === requested) ? requested : ALL;
    setActive(initial);
    setReady(true);
  }, [rubros]);

  // Al cambiar: se aplica y se refleja en la URL.
  useEffect(() => {
    if (!ready) return;

    apply(active);

    const url = new URL(window.location.href);
    if (active === ALL) url.searchParams.delete("rubro");
    else url.searchParams.set("rubro", active);
    window.history.replaceState({}, "", url);
  }, [active, apply, ready]);

  const chip = (selected: boolean) =>
    [
      "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
      selected
        ? "border-accent bg-soft text-fg"
        : "border-line text-muted hover:border-accent hover:text-fg",
    ].join(" ");

  return (
    <div className="wm-filter-inner">
      <div
        role="group"
        aria-label="Filtrar soluciones por industria"
        className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
      >
        <button
          type="button"
          aria-pressed={active === ALL}
          onClick={() => setActive(ALL)}
          className={chip(active === ALL)}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-accent"
          />
          Todas
          <span className="tabular-nums text-muted">({total})</span>
        </button>

        {rubros.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={active === r.id}
            onClick={() => setActive(r.id)}
            className={chip(active === r.id)}
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: r.accent }}
            />
            {r.nombre}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite" data-wm-filter-live />
    </div>
  );
}
