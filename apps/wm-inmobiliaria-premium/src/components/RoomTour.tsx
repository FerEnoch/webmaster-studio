import { useEffect, useId, useRef, useState } from "react";
import { imagePath, imageSrcSet } from "../lib/urls";
import type { TourRoom } from "../lib/experiences";
import "./RoomTour.css";

type Props = { rooms: TourRoom[]; propertyTitle: string };

const chapterNumber = (number: number) => String(number).padStart(2, "0");

export default function RoomTour({ rooms, propertyTitle }: Props) {
  const [index, setIndex] = useState(0);
  const [guiado, setGuiado] = useState(false);
  const [reducido, setReducido] = useState(false);
  const keyboardHint = useId();
  const rail = useRef<HTMLOListElement>(null);
  const currentCard = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducido(media.matches);
      if (media.matches) setGuiado(false);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!guiado || reducido || index >= rooms.length - 1) return;
    const timeout = window.setTimeout(() => {
      const next = index + 1;
      setIndex(next);
      if (next === rooms.length - 1) setGuiado(false);
    }, 4200);
    return () => window.clearTimeout(timeout);
  }, [guiado, reducido, index, rooms.length]);

  useEffect(() => {
    if (!rail.current || !currentCard.current) return;
    const track = rail.current.getBoundingClientRect();
    const card = currentCard.current.getBoundingClientRect();
    // Ajustá solo el carril horizontal; no saques al lector de la foto.
    if (card.left < track.left) rail.current.scrollLeft -= Math.ceil(track.left - card.left);
    else if (card.right > track.right) rail.current.scrollLeft += Math.ceil(card.right - track.right);
  }, [index]);

  const room = rooms[index];
  if (!room) return null;
  const last = index === rooms.length - 1;
  const previousIndex = (index + rooms.length - 1) % rooms.length;
  const nextIndex = (index + 1) % rooms.length;
  const next = rooms[nextIndex];
  // La foto vertical se muestra entera; las tomas horizontales llenan el marco.
  const portrait = room.imagen === "laguna-kitchen";

  function choose(chapter: number) {
    setGuiado(false);
    setIndex(chapter);
  }

  function toggleGuide() {
    if (!guiado && last) setIndex(0);
    setGuiado(!guiado);
  }

  return (
    <div data-room-tour className="room-tour">
      <div
        data-tour-viewport
        className="room-tour__viewer"
        role="group"
        aria-label={`Fotos del recorrido de ${propertyTitle}`}
        aria-describedby={keyboardHint}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          if (!event.repeat) choose(event.key === "ArrowRight" ? nextIndex : previousIndex);
        }}
      >
        {portrait && (
          <div
            className="room-tour__backdrop"
            style={{ backgroundImage: `url(${imagePath(room.imagen, 480)})` }}
            aria-hidden="true"
          />
        )}
        <img
          className={`room-tour__photo${portrait ? " room-tour__photo--portrait" : ""}`}
          src={imagePath(room.imagen, 1600)}
          srcSet={imageSrcSet(room.imagen)}
          sizes={portrait ? "(max-width: 639px) 50vw, 24rem" : "(max-width: 1464px) 100vw, 1400px"}
          alt={room.alt}
          decoding="async"
          draggable={false}
          data-local-image
          data-tour-photo={room.id}
        />
        <span className="room-tour__slate" aria-hidden="true">
          Capítulo <b>{chapterNumber(index + 1)}</b> / {chapterNumber(rooms.length)}
        </span>
        {rooms.length > 1 && (
          <div className="room-tour__navigation">
            <button
              type="button"
              className="room-tour__previous"
              aria-label={`Anterior: ${rooms[previousIndex].nombre}`}
              onClick={() => choose(previousIndex)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="room-tour__next"
              aria-label={last ? `Volver a ${next.nombre}` : `Siguiente: ${next.nombre}`}
              onClick={() => choose(nextIndex)}
            >
              <span>
                <small>{last ? "Volver a" : "Siguiente"}</small>
                {next.nombre}
              </span>
              <span className="room-tour__arrow" aria-hidden="true">{last ? "↺" : "→"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="room-tour__caption">
        <div>
          <h3 className="room-tour__title" data-tour-counter aria-live="polite">
            {room.nombre}<span className="sr-only"> · {index + 1} de {rooms.length}</span>
          </h3>
          <p className="room-tour__description">{room.descripcion}</p>
        </div>
        {rooms.length > 1 && (
          <div className="room-tour__guide">
            <button
              type="button"
              disabled={reducido}
              aria-pressed={guiado}
              onClick={toggleGuide}
            >
              <span aria-hidden="true">{guiado ? "Ⅱ" : "▶"}</span> Modo guiado
            </button>
            {reducido && <p>No disponible con movimiento reducido.</p>}
          </div>
        )}
      </div>

      <div className="room-tour__storyboard">
        <div className="room-tour__storyboard-heading">
          <h4>Paradas del recorrido</h4>
          <p id={keyboardHint}>Elegí una parada o usá las flechas del teclado en la foto.</p>
        </div>
        <ol ref={rail} className="room-tour__rail" role="list" aria-label="Paradas del recorrido">
          {rooms.map((item, i) => (
            <li key={item.id} ref={i === index ? currentCard : null}>
              <button
                type="button"
                className="room-tour__stop"
                data-tour-room={item.id}
                aria-current={i === index ? "step" : undefined}
                onClick={() => choose(i)}
              >
                <span className="room-tour__thumbnail">
                  <img src={imagePath(item.imagen, 480)} alt="" loading="lazy" decoding="async" data-local-image />
                  <span className="room-tour__badge room-tour__badge--number" aria-hidden="true">{chapterNumber(i + 1)}</span>
                  {i === index && <span className="room-tour__badge room-tour__badge--current" aria-hidden="true">Actual</span>}
                </span>
                <span className="room-tour__stop-title">{item.nombre}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="room-tour__disclaimer">Fotos fijas ilustrativas. No es un plano ni una vista 360°.</p>
      </div>
    </div>
  );
}
