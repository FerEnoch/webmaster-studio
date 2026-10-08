"use client";

import { animate as animateEl, motion, useAnimate } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

type Ctx = { navigate: (href: string) => void; busy: boolean };
const TransitionCtx = createContext<Ctx>({ navigate: () => {}, busy: false });
export const usePageTransition = () => useContext(TransitionCtx);

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Transición entre páginas: una cortina negra con la marca sube, cambia la ruta
 * y la cortina sigue subiendo hasta revelar la página nueva.
 * Es imperativa (useAnimate) para que la salida no se pierda cuando el App Router desmonta la ruta.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scope, animate] = useAnimate();
  const [busy, setBusy] = useState(true);
  const [label, setLabel] = useState("NÚCLEO");
  const waitingFor = useRef<{ resolve: () => void; path: string } | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Primer ingreso: la cortina arranca cubriendo y se levanta (hace de loader).
  // Usa `animateEl` (no el de useAnimate) + flag de cancelación: en StrictMode el efecto
  // corre dos veces y useAnimate frena las animaciones del primer montaje, dejando la cortina trabada.
  useEffect(() => {
    let cancelled = false;
    let done = false;
    const el = scope.current as HTMLElement;
    const word = el.querySelector(".curtain-word") as HTMLElement;
    const lift = () => {
      if (done) return;
      done = true;
      animateEl(el, { y: "-100%" }, { duration: 0.8, ease });
      setBusy(false);
    };
    (async () => {
      await animateEl(word, { y: ["110%", "0%"] }, { duration: 0.7, ease });
      if (cancelled) return;
      await animateEl(word, { y: "-110%" }, { duration: 0.5, ease, delay: 0.25 });
      if (cancelled) return;
      lift();
    })();
    // Red de seguridad: si algo se interrumpe, nunca dejar la página tapada.
    const safety = setTimeout(() => !cancelled && lift(), 3200);
    return () => {
      cancelled = true;
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando la ruta efectivamente cambió, liberamos la promesa de navegación.
  useEffect(() => {
    if (waitingFor.current && waitingFor.current.path === pathname) {
      waitingFor.current.resolve();
      waitingFor.current = null;
    }
  }, [pathname]);

  const navigate = useCallback(
    async (href: string) => {
      const path = href.split("#")[0].split("?")[0] || "/";
      if (busy || path === pathname) {
        if (href.includes("#")) document.getElementById(href.split("#")[1])?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      setBusy(true);
      setLabel(LABELS[path] ?? "NÚCLEO");
      const d = reduced.current ? 0.01 : 1;
      await animate(scope.current, { y: ["100%", "0%"] }, { duration: 0.6 * d, ease });
      animate(".curtain-word", { y: ["110%", "0%"] }, { duration: 0.45 * d, ease });
      const arrived = new Promise<void>((resolve) => (waitingFor.current = { resolve, path }));
      router.push(href, { scroll: false });
      await Promise.race([arrived, new Promise((r) => setTimeout(r, 2500))]);
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 120 * d));
      animate(".curtain-word", { y: "-110%" }, { duration: 0.4 * d, ease });
      await animate(scope.current, { y: "-100%" }, { duration: 0.7 * d, ease, delay: 0.15 * d });
      setBusy(false);
    },
    [animate, busy, pathname, router, scope],
  );

  return (
    <TransitionCtx.Provider value={{ navigate, busy }}>
      {children}
      <motion.div
        ref={scope}
        initial={{ y: "0%" }}
        className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-coal"
        style={{ willChange: "transform" }}
        aria-hidden
      >
        <div className="overflow-hidden">
          <span className="curtain-word display block translate-y-[110%] text-[clamp(4rem,14vw,12rem)] text-bone">
            {label}
            <span className="text-signal">.</span>
          </span>
        </div>
        <span className="absolute bottom-0 left-0 h-1 w-full bg-signal" />
      </motion.div>
    </TransitionCtx.Provider>
  );
}

const LABELS: Record<string, string> = {
  "/": "NÚCLEO",
  "/club": "El club",
  "/clases": "Clases",
  "/planes": "Planes",
  "/entrenadores": "Coaches",
};

/** Link que dispara la transición de cortina. */
export function TLink({ href, onClick, children, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
