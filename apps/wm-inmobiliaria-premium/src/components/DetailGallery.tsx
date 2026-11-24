import { useCallback, useEffect, useState } from "react";
import { imagePath, imageSrcSet } from "../lib/paths";

export type GalleryImage = { imagen: string; alt: string; titulo: string };

/**
 * Galería con lightbox: teclado, táctil, contador y plano de estado.
 * Las fotos son reemplazos editoriales verificados servidos en local.
 */
export default function DetailGallery({ images, propertyTitle }: { images: GalleryImage[]; propertyTitle: string }) {
  const [index, setIndex] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const total = images.length;
  const actual = images[index];

  const irA = useCallback((next: number) => {
    setIndex(((next % total) + total) % total);
  }, [total]);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
      if (e.key === "ArrowRight") irA(index + 1);
      if (e.key === "ArrowLeft") irA(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, index, irA]);

  return (
    <div data-gallery>
      <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <button
          type="button"
          data-gallery-open={actual.imagen}
          onClick={() => setAbierto(true)}
          aria-label={`Ampliar foto: ${actual.titulo} de ${propertyTitle}`}
          className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-sand sm:aspect-[16/10]"
        >
          <img
            src={imagePath(actual.imagen, 1600)}
            srcSet={imageSrcSet(actual.imagen)}
            sizes="(max-width: 1024px) 100vw, 60vw"
            alt={actual.alt}
            loading="eager"
            decoding="async"
            data-gallery-cover
            data-detail-cover
            data-local-image
            className="h-full w-full object-cover"
          />
          <span className="absolute right-4 bottom-4 rounded-full bg-black/55 px-4 py-2 text-xs text-white">
            {index + 1} / {total} · tocá para ampliar
          </span>
        </button>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-2" role="group" aria-label="Miniaturas de la galería">
          {images.map((img, i) => (
            <button
              key={img.imagen + i}
              type="button"
              data-gallery-thumb={img.imagen}
              aria-label={`Ver ${img.titulo} (${i + 1} de ${total})`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-2xl bg-sand ${i === index ? "ring-2 ring-brass ring-offset-2" : "opacity-85 hover:opacity-100"}`}
            >
              <img src={imagePath(img.imagen, 480)} srcSet={imageSrcSet(img.imagen)} sizes="240px" alt="" loading="lazy" decoding="async" data-local-image className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3" data-gallery-nav>
        <button type="button" data-gallery-prev onClick={() => irA(index - 1)} aria-label="Foto anterior" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15">←</button>
        <p className="text-sm text-ink/65" aria-live="polite" data-gallery-counter>
          {actual.titulo} · {index + 1} de {total}
        </p>
        <button type="button" data-gallery-next onClick={() => irA(index + 1)} aria-label="Foto siguiente" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15">→</button>
      </div>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada: ${actual.titulo}`}
          data-lightbox
          className="fixed inset-0 z-[80] flex flex-col bg-ink/95 p-4 text-ivory sm:p-8"
          onTouchStart={(e) => {
            const x = e.touches[0]?.clientX ?? 0;
            (e.currentTarget as HTMLElement).dataset.x = String(x);
          }}
          onTouchEnd={(e) => {
            const start = Number((e.currentTarget as HTMLElement).dataset.x ?? 0);
            const end = e.changedTouches[0]?.clientX ?? start;
            if (end - start > 48) irA(index - 1);
            if (start - end > 48) irA(index + 1);
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm opacity-80">{actual.titulo} · {index + 1} de {total}</p>
            <button type="button" data-lightbox-close onClick={() => setAbierto(false)} aria-label="Cerrar vista ampliada" className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-ink">✕</button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center gap-3 py-4">
            <button type="button" onClick={() => irA(index - 1)} aria-label="Foto anterior" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory/15">←</button>
            <img src={imagePath(actual.imagen, 1600)} srcSet={imageSrcSet(actual.imagen)} sizes="90vw" alt={actual.alt} data-lightbox-image className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain" />
            <button type="button" onClick={() => irA(index + 1)} aria-label="Foto siguiente" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory/15">→</button>
          </div>
          <p className="text-center text-xs opacity-60">Flechaz para navegar · Esc para cerrar · Deslizá en táctil</p>
        </div>
      )}
    </div>
  );
}
