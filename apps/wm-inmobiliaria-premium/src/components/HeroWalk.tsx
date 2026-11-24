import { useEffect, useRef, useState, type CSSProperties } from "react";
import { heroWalk } from "../lib/properties";
import { appUrl } from "../lib/urls";
import { imagePath, imageSrcSet } from "../lib/paths";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function HeroWalk() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<number | undefined>(undefined);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  const [operation, setOperation] = useState<"Venta" | "Alquiler">("Venta");
  const [type, setType] = useState("Todas");
  const step = Math.min(heroWalk.length - 1, Math.max(0, Math.round(progress)));

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      setReducedMotion(media.matches);
      updateScroll();
    };
    const updateScroll = () => {
      frame.current = undefined;
      const element = section.current;
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(1, element.offsetHeight - window.innerHeight);
      setProgress(clamp((window.scrollY - top) / distance) * (heroWalk.length - 1));
    };
    const onScroll = () => {
      if (frame.current === undefined) frame.current = requestAnimationFrame(updateScroll);
    };
    updateMotion();
    media.addEventListener("change", updateMotion);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      media.removeEventListener("change", updateMotion);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goToStep = (index: number) => {
    const element = section.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY;
    const distance = element.offsetHeight - window.innerHeight;
    setProgress(index);
    window.scrollTo({ top: top + (distance * index) / (heroWalk.length - 1), behavior: "auto" });
  };

  const searchHref = `${appUrl("/propiedades")}?op=${operation}${type !== "Todas" ? `&type=${encodeURIComponent(type)}` : ""}`;
  const introOpacity = 1 - clamp(progress / 0.35);
  const fraction = progress - Math.floor(progress);
  const barHeight = reducedMotion ? 0 : Math.sin(fraction * Math.PI) * 7;

  return (
    <section ref={section} data-hero className="hero-walk" aria-label="Un recorrido en cinco pasos">
      <div className="grain sticky top-0 h-[100svh] overflow-hidden bg-ink">
        <div
          className="absolute -inset-3"
          style={{
            transform: reducedMotion
              ? undefined
              : `translateY(${Math.sin(progress * Math.PI * 4) * 5}px) rotate(${Math.sin(progress * Math.PI * 2) * 0.25}deg)`,
          }}
        >
          {heroWalk.map((item, index) => {
            const distance = Math.abs(progress - index);
            const opacity = reducedMotion ? (index === step ? 1 : 0) : clamp(1 - distance);
            const scale = reducedMotion ? 1 : index < progress ? 1 + (progress - index) * 0.32 : 1.08 + Math.max(0, index - progress) * 0.08;
            const style = {
              opacity,
              zIndex: heroWalk.length - index,
              transform: `scale(${scale})`,
              transformOrigin: `${item.focus[0]}% ${item.focus[1]}%`,
              filter: reducedMotion ? "brightness(.72)" : `blur(${clamp(distance - 0.45) * 8}px) brightness(${0.86 - clamp(distance) * 0.14})`,
            } satisfies CSSProperties;
            return (
              <div key={item.image} data-hero-frame={index + 1} aria-hidden={opacity < 0.05} className="hero-frame" style={style}>
                <img
                  src={imagePath(item.image, 1600)}
                  srcSet={imageSrcSet(item.image)}
                  sizes="100vw"
                  alt=""
                  style={{ objectPosition: index === heroWalk.length - 1 ? `${item.focus[0]}% ${item.focus[1]}%` : undefined }}
                  loading="eager"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding={index === 0 ? "sync" : "async"}
                  className="h-full w-full object-cover"
                  data-local-image
                />
              </div>
            );
          })}
        </div>

        <div className="hero-vignette" />
        <div className="absolute inset-x-0 top-0 z-20 bg-ink" style={{ height: `${barHeight}svh` }} />
        <div className="absolute inset-x-0 bottom-0 z-20 bg-ink" style={{ height: `${barHeight}svh` }} />

        <div
          className="absolute inset-x-0 bottom-0 z-10 px-5 pb-7 text-ivory sm:px-10 sm:pb-12"
          style={{ opacity: introOpacity, transform: reducedMotion ? undefined : `translateY(${-progress * 36}px)`, pointerEvents: introOpacity < 0.1 ? "none" : "auto" }}
        >
          <p className="mb-3 text-[11px] tracking-[0.25em] uppercase opacity-85 sm:mb-4 sm:text-xs sm:tracking-[0.3em]">Casas · Departamentos · Terrenos</p>
          <h1 className="max-w-6xl font-serif text-[clamp(2.85rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.025em]">
            <span className="block pb-1">Recorré tu próxima casa</span>
            <span className="block pb-2 italic">antes de visitarla.</span>
          </h1>
          <div className="hero-search mt-5 sm:mt-8" aria-label="Buscar propiedades">
            <div className="flex rounded-full bg-sand p-1" aria-label="Operación">
              {(["Venta", "Alquiler"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={operation === item}
                  onClick={() => setOperation(item)}
                  className={`flex-1 rounded-full px-5 py-2.5 text-sm whitespace-nowrap ${operation === item ? "bg-ink text-ivory" : "text-ink"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Tipo de propiedad" className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-3 text-sm">
              {["Todas", "Casa", "Departamento", "Loft", "Terreno"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <a href={searchHref} className="button-brass justify-center">
              Buscar
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </a>
          </div>
        </div>

        <div data-hero-step aria-live="polite" className="pointer-events-none absolute top-1/2 left-5 z-10 max-w-[80vw] -translate-y-1/2 text-ivory sm:left-10">
          {step > 0 && (
            <div key={step} className="hero-step-copy">
              <p className="text-xs tracking-[0.3em] uppercase opacity-85">{heroWalk[step].kicker}</p>
              <p className="mt-3 max-w-3xl font-serif text-[clamp(2.35rem,5.5vw,5.5rem)] leading-[0.94]">{heroWalk[step].title}</p>
            </div>
          )}
        </div>

        <nav aria-label="Pasos del recorrido" className="absolute top-1/2 right-3 z-30 flex -translate-y-1/2 flex-col gap-1.5 sm:right-8 sm:gap-2">
          {heroWalk.map((item, index) => (
            <button
              key={item.kicker}
              type="button"
              aria-label={item.kicker}
              aria-current={step === index ? "step" : undefined}
              onClick={() => goToStep(index)}
              className="hero-step-button"
            >
              <span aria-hidden="true" className={`block w-1.5 rounded-full bg-ivory transition-all ${step === index ? "h-9 opacity-100" : "h-2 opacity-45"}`} />
              <span className="sr-only">{item.title}</span>
            </button>
          ))}
        </nav>

        {step === heroWalk.length - 1 && (
          <div className="absolute inset-x-0 bottom-12 z-10 flex justify-center px-5">
            <a href={appUrl("/propiedades")} className="group flex items-center gap-3 rounded-full bg-ivory py-2 pr-2 pl-6 text-sm text-ink shadow-2xl">
              Ver todas las propiedades
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-ivory transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
