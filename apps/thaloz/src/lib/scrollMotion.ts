type Job = {
  reduced: boolean;
  /** Fracción que avanza por frame de 60fps: 1 - smoothing/100 (igual que Webflow IX2). */
  follow: number;
  current: number;
  started: boolean;
  read: () => number;
  write: (value: number) => void;
};

const jobs = new Set<Job>();
let raf = 0;
let last = 0;

function tick(now: number) {
  // Corrige por frame rate: a 120Hz avanza la mitad por frame, igual que a 60Hz por segundo.
  const frames = last ? Math.min((now - last) / (1000 / 60), 4) : 1;
  last = now;
  let live = false;
  jobs.forEach((job) => {
    const target = job.read();
    if (job.reduced || !job.started) {
      job.current = target;
      job.started = true;
    } else {
      job.current += (target - job.current) * (1 - Math.pow(1 - job.follow, frames));
      if (Math.abs(target - job.current) < 0.0005) job.current = target;
      else live = true;
    }
    job.write(job.current);
  });
  raf = live ? requestAnimationFrame(tick) : 0;
  if (!raf) last = 0;
}

function kick() {
  if (!raf) raf = requestAnimationFrame(tick);
}

/**
 * Un solo lazo para todas las animaciones de scroll.
 * `smoothing` es el mismo valor que tiene cada interacción en Webflow (50, 85, 90…).
 */
export function trackMotion(read: () => number, write: (value: number) => void, smoothing = 85) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const job: Job = { reduced, follow: 1 - smoothing / 100, current: 0, started: false, read, write };
  jobs.add(job);
  const onScroll = () => kick();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    jobs.delete(job);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Progreso de "While scrolling in view" de Webflow IX2.
 * - startsEntering: 0 cuando el borde superior toca el fondo de la ventana
 *   (si es false, 0 cuando el borde superior llega arriba de todo).
 * - startsExiting: 1 cuando el borde superior llega arriba de la ventana
 *   (si es false, 1 cuando el elemento terminó de salir por arriba).
 */
export function inViewProgress(el: HTMLElement, startsEntering = true, startsExiting = false) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const start = startsEntering ? vh : 0;
  const end = startsExiting ? 0 : rect.height;
  const total = start + end;
  if (total <= 0) return 1;
  return clamp01((start - rect.top) / total);
}
