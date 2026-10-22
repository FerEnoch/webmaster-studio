import type { ReactNode } from "react";

/**
 * "Muesca" de la esquina superior derecha del original: un bloque del color
 * de fondo que se come la esquina de la card, con dos curvas invertidas.
 */
export default function Notch({ children, bg = "#fafafa" }: { children: ReactNode; bg?: string }) {
  const corner = `radial-gradient(circle at 0 100%, transparent 23.5px, ${bg} 24px)`;
  return (
    <div className="absolute top-0 right-0 z-20 hidden sm:block">
      <div className="relative rounded-bl-[28px] pb-3 pl-3" style={{ background: bg }}>
        <span className="absolute top-0 -left-6 h-6 w-6" style={{ background: corner }} />
        <span className="absolute right-0 -bottom-6 h-6 w-6" style={{ background: corner }} />
        {children}
      </div>
    </div>
  );
}
