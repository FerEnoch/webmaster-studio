import type { CSSProperties, ReactNode } from "react";

/**
 * Carrusel infinito del original (keyframe scroll-left: 0 → -50%).
 * Duplica el contenido para que el loop no salte. Se pausa al hover.
 */
export default function Marquee({
  children,
  reverse = false,
  duration = 60,
  className = "",
  gap = "gap-4",
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  gap?: string;
}) {
  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div
        className={`marquee-track flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <div className={`flex shrink-0 ${gap} pr-4`}>{children}</div>
        <div className={`flex shrink-0 ${gap} pr-4`} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
