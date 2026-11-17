/**
 * PROPERTY CARD — la ficha corta de una propiedad.
 *
 * Se usa en tres lugares (portada, buscador y fichas), asi que es un
 * componente React renderizado en servidor: no necesita hidratacion.
 *
 * Muestra: foto, zona y tipo, superficie, ambientes, precio final con
 * impuestos y las dos acciones (ver la ficha / agendar visita).
 */

import { appUrl } from "@lib/urls";
import type { CSSProperties } from "react";
import type { Propiedad } from "../content/inmobiliaria";

export interface PropertyCardProps {
  property: Propiedad;
  /** Posicion en la grilla: se usa para el retardo de la entrada. */
  index?: number;
  /** Version compacta para la portada. */
  compact?: boolean;
}

export default function PropertyCard({ property, index = 0, compact = false }: PropertyCardProps) {
  const specs = (property.meta ?? []).filter((m) =>
    ["Superficie", "Ambientes", "Expensas"].includes(m.label),
  );

  return (
    <article
      className="wm-card group flex h-full flex-col overflow-hidden p-0"
      style={{ "--wm-line-index": index } as CSSProperties}
    >
      <a href={appUrl(`/propiedades/${property.id}`)} className="block" tabIndex={-1} aria-hidden="true">
        <div className="wm-grade wm-grain wm-vignette overflow-hidden">
          <img
            src={property.media?.src ?? property.fotos[0]}
            alt={property.media?.alt ?? property.title}
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
      </a>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="wm-kicker">{property.zona}</p>
          {property.badge ? <span className="wm-chip shrink-0">{property.badge}</span> : null}
        </div>

        <h3 className="wm-display mt-3 text-2xl leading-tight">
          <a href={appUrl(`/propiedades/${property.id}`)} className="transition-colors hover:text-accent">
            {property.title}
          </a>
        </h3>

        {!compact ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">{property.body}</p>
        ) : null}

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.14em] text-muted">
          {specs.map((m) => (
            <div key={m.label}>
              <dt className="inline">{m.label}:</dt>{" "}
              <dd className="inline font-semibold text-fg">{m.value}</dd>
            </div>
          ))}
        </dl>

        {property.price ? (
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
            <span className="wm-display text-2xl text-accent">{property.price.amount}</span>
            {property.price.note ? (
              <span className="text-xs text-muted">{property.price.note}</span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a href={appUrl(`/propiedades/${property.id}`)} className="wm-btn wm-btn--ghost flex-1 text-xs">
            Ver la ficha
          </a>
          <a href={appUrl(`/?prop=${property.id}#visita`)} className="wm-btn flex-1 text-xs">
            Agendar visita
          </a>
        </div>
      </div>
    </article>
  );
}
