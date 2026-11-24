import { formatPrice, type Property } from "../lib/properties";
import { propertyHref } from "../lib/urls";

export default function MapView({ items, active, onHover, className = "" }: { items: Property[]; active?: string | null; onHover?: (slug: string | null) => void; className?: string }) {
  return (
    <div role="region" aria-label="Mapa ilustrativo de propiedades" className={`map-view ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs><pattern id="estudio-blocks" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="3.35" height="3.35" fill="#f3efe6" /></pattern></defs>
        <rect width="100" height="100" fill="url(#estudio-blocks)" />
        <path d="M60 -5 C 75 20, 95 25, 105 40 L 105 -5 Z" fill="#b9cbd3" />
        <path d="M60 -5 C 75 20, 95 25, 105 40" fill="none" stroke="#a3b9c3" strokeWidth="0.6" />
        <ellipse cx="42" cy="38" rx="7" ry="4" fill="#cfd8b8" />
        <ellipse cx="20" cy="60" rx="9" ry="6" fill="#cfd8b8" />
        <path d="M-5 30 C 30 35, 50 45, 105 70" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path d="M30 105 C 35 70, 45 40, 70 -5" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path d="M-5 85 C 25 80, 60 85, 105 95" fill="none" stroke="#fff" strokeWidth="1.1" />
      </svg>
      {items.map((property) => {
        const on = active === property.slug;
        return (
          <a
            key={property.slug}
            href={propertyHref(property.slug)}
            aria-label={`${property.title}, ${formatPrice(property)}`}
            onMouseEnter={() => onHover?.(property.slug)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(property.slug)}
            onBlur={() => onHover?.(null)}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${property.map[0]}%`, top: `${property.map[1] + 8}%`, zIndex: on ? 20 : 10 }}
          >
            <span className={`map-pin ${on ? "bg-ink text-ivory" : "bg-ivory text-ink"}`}>
              {property.currency === "USD" ? `US$ ${Math.round(property.price / 1000)}K` : `$ ${(property.price / 1e6).toFixed(1)}M`}
            </span>
          </a>
        );
      })}
      <span className="absolute bottom-3 left-3 rounded-full bg-ivory/90 px-3 py-1 text-[11px] text-ink/60">Mapa ilustrativo · AMBA y Patagonia</span>
      {items.length === 0 && <span className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-ink/60">Sin propiedades para mostrar</span>}
    </div>
  );
}
