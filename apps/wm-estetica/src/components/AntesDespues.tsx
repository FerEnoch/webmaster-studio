/**
 * ANTES / DESPUÉS — la comparativa de la sección "pinned".
 *
 * Es una SIMULACIÓN visual: una sola foto de stock con dos tratamientos de
 * color (el "antes" desaturado y el "después" con luz). El aviso de demo
 * viaja siempre visible al lado del control, no escondido en el pie.
 *
 * Accesible: el tirador es un `role="slider"` con teclado (flechas, home,
 * end) y el puntero se captura para que el arrastre no se corte.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

export interface AntesDespuesProps {
  /** URL de la foto (misma para los dos estados: es una simulación de color). */
  src: string;
  /** Texto alternativo de la foto. */
  alt: string;
  /** Etiqueta del estado inicial. */
  antes?: string;
  /** Etiqueta del estado final. */
  despues?: string;
  /** Aviso de demo (visible al lado del control). */
  nota?: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export default function AntesDespues({
  src,
  alt,
  antes = "Antes",
  despues = "Después",
  nota,
}: AntesDespuesProps) {
  const [pos, setPos] = useState(42);
  const [arrastrando, setArrastrando] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const sweep = useRef<number | null>(null);

  /**
   * Barrido de entrada: la comparativa arranca mostrando SOLO el "antes" y
   * se revela hacia el "después" una vez (y no con reduced-motion).
   * El reposo es 42: el corte queda un poco a la izquierda del centro.
   */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const desde = performance.now();
    const duracion = 1100;
    const tick = (ahora: number) => {
      const t = Math.min(1, (ahora - desde) / duracion);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - t, 4);
      setPos(100 - 58 * eased); // 100 -> 42
      if (t < 1) sweep.current = requestAnimationFrame(tick);
    };
    sweep.current = requestAnimationFrame(tick);
    return () => {
      if (sweep.current !== null) cancelAnimationFrame(sweep.current);
    };
  }, []);

  const mover = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const caja = el.getBoundingClientRect();
    setPos(clamp(((clientX - caja.left) / caja.width) * 100));
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setArrastrando(true);
    mover(event.clientX);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!arrastrando) return;
    mover(event.clientX);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setArrastrando(false);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const salto = event.shiftKey ? 10 : 3;
    if (event.key === "ArrowLeft") setPos((p) => clamp(p - salto));
    else if (event.key === "ArrowRight") setPos((p) => clamp(p + salto));
    else if (event.key === "Home") setPos(0);
    else if (event.key === "End") setPos(100);
    else return;
    event.preventDefault();
  };

  return (
    <div className="wm-ad">
      <div
        ref={frame}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="wm-ad__frame"
      >
        {/* Estado "después": la foto tal cual, con luz cálida. */}
        <img src={src} alt={alt} className="wm-ad__img wm-ad__img--fin" loading="lazy" decoding="async" />

        {/* Estado "antes": la misma foto, desaturada, recortada desde la izquierda. */}
        <div
          className="wm-ad__antes"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          <img src={src} alt="" className="wm-ad__img wm-ad__img--inicio" loading="lazy" decoding="async" />
        </div>

        <span className="wm-ad__label wm-ad__label--inicio">{antes}</span>
        <span className="wm-ad__label wm-ad__label--fin">{despues}</span>

        {/* El aviso de demo va DENTRO del marco: si queda abajo, con el
            recorte 1:1 se va del pliegue y la comparativa parece real. */}
        <span className="wm-ad__demo">Simulación visual · no son fotos reales</span>

        {/* Tirador */}
        <div className="wm-ad__handle" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="wm-ad__line" />
          <span className="wm-ad__grip">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <button
          type="button"
          role="slider"
          aria-label="Comparar antes y después"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% de la foto en estado ${antes.toLowerCase()}`}
          onKeyDown={onKeyDown}
          style={{ left: `${pos}%` }}
          className="wm-ad__btn"
        />
      </div>

      <p className="mt-4 text-sm text-muted">
        <strong className="text-fg">Simulación, no un resultado real.</strong>{" "}
        {nota ??
          "El antes y el después se generan con un filtro de color sobre una foto de stock: no son fotos de clientas ni resultados del estudio."}
      </p>
    </div>
  );
}
