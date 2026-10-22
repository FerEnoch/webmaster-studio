import type { ReactNode } from "react";
import { ArrowRight } from "./Icons";

type Variant = "dark" | "light" | "ghost" | "link" | "linkLight" | "glass";

const styles: Record<Variant, string> = {
  dark: "bg-zinc-950 text-zinc-50 hover:bg-zinc-800 px-4 py-2.5",
  light: "bg-white text-zinc-950 border border-zinc-200 hover:bg-zinc-100 px-4 py-2.5",
  ghost: "bg-white/10 text-white border border-white/25 hover:bg-white/20 backdrop-blur px-4 py-2.5",
  glass: "bg-white/90 text-zinc-950 hover:bg-white px-4 py-2.5 shadow-lg",
  link: "text-zinc-950 hover:text-indigo-hero",
  linkLight: "text-white hover:text-indigo-200",
};

/** Botón píldora del original; la flecha se desliza al hover (mejora). */
export default function Button({
  children,
  href = "#",
  variant = "dark",
  arrow = false,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group/btn inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[0.97] ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      {arrow && (
        <span className="relative inline-flex h-4 w-4 overflow-hidden">
          <ArrowRight className="absolute h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-full" />
          <ArrowRight className="absolute h-4 w-4 -translate-x-full transition-transform duration-300 group-hover/btn:translate-x-0" />
        </span>
      )}
    </a>
  );
}
