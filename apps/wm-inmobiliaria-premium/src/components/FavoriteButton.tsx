import { toggleFavorite, useFavorites } from "../lib/favorites";

export default function FavoriteButton({ slug, title, className = "" }: { slug: string; title: string; className?: string }) {
  const favorites = useFavorites();
  const active = favorites.includes(slug);
  return (
    <button
      type="button"
      data-favorite-slug={slug}
      aria-pressed={active}
      aria-label={`${active ? "Quitar" : "Guardar"} ${title} ${active ? "de" : "en"} favoritos`}
      title={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={`favorite-button ${active ? "is-favorite" : ""} ${className}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(slug);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z" />
      </svg>
      <span className="sr-only">{active ? "Guardada solo en este navegador" : "Guardar solo en este navegador"}</span>
    </button>
  );
}
