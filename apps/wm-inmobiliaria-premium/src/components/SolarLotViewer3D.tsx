import { useEffect, useId, useRef, type KeyboardEvent, type PointerEvent } from "react";
import type { LotSun } from "./SolarLot";
import { createSolarLotScene } from "./SolarLotScene.mjs";

type Props = {
  front: number;
  depth: number;
  sun: LotSun;
  showFootprint: boolean;
  visible: boolean;
  onReady: () => void;
  onUnavailable: () => void;
};

const cameraControls = [
  ["←", "Girar a la izquierda", "ArrowLeft"], ["→", "Girar a la derecha", "ArrowRight"],
  ["+", "Acercar", "+"], ["−", "Alejar", "-"], ["↺", "Restablecer cámara", "Home"],
] as const;

export default function SolarLotViewer3D({ front, depth, sun, showFootprint, visible, onReady, onUnavailable }: Props) {
  const description = useId();
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof createSolarLotScene> | null>(null);
  const draw = useRef<(() => void) | null>(null);
  const state = useRef({ sun, showFootprint, visible });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    state.current = { sun, showFootprint, visible };
    if (visible) draw.current?.();
  }, [sun, showFootprint, visible]);

  useEffect(() => {
    const element = canvas.current;
    const viewport = frame.current;
    if (!element || !viewport) return;
    let animation = 0;
    let ready = false;
    let failed = false;
    const fail = () => {
      if (failed) return;
      failed = true;
      cancelAnimationFrame(animation);
      onUnavailable();
    };
    let model: ReturnType<typeof createSolarLotScene>;
    try {
      model = createSolarLotScene(element, front, depth);
    } catch {
      fail();
      return;
    }
    scene.current = model;

    function requestDraw() {
      if (animation || failed || (ready && !state.current.visible)) return;
      animation = requestAnimationFrame(() => {
        animation = 0;
        if (ready && !state.current.visible) return;
        const { clientWidth: width, clientHeight: height } = viewport!;
        if (!width || !height) return;
        try {
          model.resize(width, height);
          const { sun: currentSun, showFootprint: currentFootprint } = state.current;
          model.render(currentSun, currentFootprint);
          if (!ready) {
            ready = true;
            onReady();
          }
        } catch {
          fail();
        }
      });
    }

    draw.current = requestDraw;
    element.addEventListener("webglcontextlost", fail);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(requestDraw);
    observer?.observe(viewport);
    window.addEventListener("resize", requestDraw);
    requestDraw();
    return () => {
      cancelAnimationFrame(animation);
      observer?.disconnect();
      window.removeEventListener("resize", requestDraw);
      element.removeEventListener("webglcontextlost", fail);
      draw.current = null;
      scene.current = null;
      model.dispose();
    };
  }, [front, depth, onReady, onUnavailable]);

  function cameraKey(key: string) {
    const model = scene.current;
    if (!model) return false;
    switch (key) {
      case "ArrowLeft": model.orbit(-0.22, 0); break;
      case "ArrowRight": model.orbit(0.22, 0); break;
      case "ArrowUp": model.orbit(0, 0.12); break;
      case "ArrowDown": model.orbit(0, -0.12); break;
      case "+": case "=": model.zoomBy(1.18); break;
      case "−": case "-": model.zoomBy(1 / 1.18); break;
      case "Home": model.resetCamera(); break;
      default: return false;
    }
    draw.current?.();
    return true;
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && cameraKey(event.key)) event.preventDefault();
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const { clientX: x, clientY: y, pointerId: id } = event;
    drag.current = { id, x, y };
    event.currentTarget.setPointerCapture(id);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    // Let the browser claim vertical touch gestures for normal page scrolling.
    if (event.pointerType === "touch" && Math.abs(dx) <= Math.abs(dy)) return;
    start.x = event.clientX;
    start.y = event.clientY;
    scene.current?.orbit(-dx * 0.008, event.pointerType === "touch" ? 0 : dy * 0.007);
    draw.current?.();
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id === event.pointerId) drag.current = null;
  }

  return (
    <>
      <div className="solar-lot__viewport" data-covered={!visible || undefined} ref={frame} role="img" tabIndex={0}
        aria-label="Maqueta ilustrativa del lote en 3D" aria-describedby={description}
        onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
        <canvas ref={canvas} aria-hidden="true" />
      </div>
      <div className="solar-lot__view-help solar-lot__camera" data-covered={!visible || undefined}>
        <span id={description} className="sr-only">Norte al contrafrente, calle sobre el frente. Volumen conceptual, sin altura medida.</span>
        <p>Arrastrá para girar. Con teclado: flechas, + y −.</p>
        <div className="solar-lot__camera-buttons" role="group" aria-label="Controles de cámara">
          {cameraControls.map(([icon, label, key]) => (
            <button key={label} type="button" aria-label={label} title={label} onClick={() => cameraKey(key)}>
              <span aria-hidden="true">{icon}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
