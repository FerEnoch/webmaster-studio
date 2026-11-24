import { formatPrice, type Property } from "../lib/properties";
import { imagePath, imageSrcSet, propertyHref } from "../lib/paths";
import FavoriteButton from "./FavoriteButton";

export default function PropertyCard({ property, highlighted = false, onHover }: { property: Property; highlighted?: boolean; onHover?: (slug: string | null) => void }) {
  const link = propertyHref(property.slug);
  return (
    <article
      data-testid="property-card"
      data-property-slug={property.slug}
      className="property-card group"
      onMouseEnter={() => onHover?.(property.slug)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className={`property-media ${highlighted ? "ring-2 ring-brass ring-offset-2 ring-offset-ivory" : ""}`}>
        <a data-property-link href={link} aria-label={`Ver ${property.title}`} className="block h-full w-full">
          <img
            src={imagePath(property.cover)}
            srcSet={imageSrcSet(property.cover)}
            sizes="(max-width: 640px) 92vw, (max-width: 1200px) 46vw, 30vw"
            alt={property.coverAlt}
            loading="lazy"
            decoding="async"
            data-cover-image
            data-local-image
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          />
        </a>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${property.op === "Venta" ? "bg-ink text-ivory" : "bg-brass text-white"}`}>{property.op}</span>
          {property.tag && <span className="rounded-full bg-ivory/90 px-3 py-1 text-[11px] backdrop-blur">{property.tag}</span>}
        </div>
        <FavoriteButton slug={property.slug} title={property.title} className="absolute top-3 right-3" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.15em] text-ink/50 uppercase">{property.type} · {property.barrio}</p>
          <h3 className="mt-1 truncate font-serif text-2xl leading-tight transition-colors group-hover:text-brass"><a href={link}>{property.title}</a></h3>
        </div>
        <a href={link} aria-label={`Abrir ${property.title}`} className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-all group-hover:-rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">→</a>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-sm">
        <span className="font-medium">{formatPrice(property)}</span>
        <span className="flex gap-3 text-ink/60">
          <span>{property.m2.toLocaleString("es-AR")} m²</span>
          {property.amb && <span>{property.amb} amb</span>}
          {property.dorm && <span>{property.dorm} dorm</span>}
        </span>
      </div>
    </article>
  );
}
