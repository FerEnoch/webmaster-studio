"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { Logo } from "./Logo";

const quint = "cubic-bezier(0.86, 0, 0.07, 1)"; // inOutQuint de Webflow
const power2Out = "cubic-bezier(0.215, 0.61, 0.355, 1)"; // GSAP power2.out

function Chevron({ open, openMs, closeMs }: { open: boolean; openMs: number; closeMs: number }) {
  return (
    <span
      className="flex h-4 w-4 items-center justify-center"
      style={{
        transform: `rotate(${open ? 180 : 0}deg)`,
        transition: `transform ${open ? openMs : closeMs}ms ease`,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
        <path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Dropdown de escritorio, se abre con hover (data-hover="true", delay 0).
 * - "fade" = "Navbar 7 dropdown": opacity 0→1 300ms, chevron 200ms (cierra en 300ms).
 * - "rise" = "Navbar 1 dropdown": sube de 3rem a 0 en 300ms, opacity 200ms, chevron 300ms;
 *   al cerrar se desvanece en 200ms y queda en 4rem para la próxima apertura.
 */
function DesktopDropdown({ item, kind }: { item: (typeof nav)[number]; kind: "fade" | "rise" }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [y, setY] = useState(kind === "rise" ? 3 : 0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const enter = () => {
    clearTimeout(closeTimer.current);
    setShown(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setOpen(true);
        if (kind === "rise") setY(0);
      }),
    );
  };
  const leave = () => {
    setOpen(false);
    closeTimer.current = setTimeout(
      () => {
        setShown(false);
        if (kind === "rise") setY(4);
      },
      kind === "rise" ? 200 : 300,
    );
  };

  const twoCols = item.items.length > 6;

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className="flex items-center gap-2 px-4 py-6 text-white/90 hover:text-white">
        {item.label}
        <Chevron open={open} openMs={kind === "fade" ? 200 : 300} closeMs={300} />
      </button>
      <div
        className={`absolute left-0 top-full pt-4 ${shown ? "block" : "hidden"}`}
        style={{
          opacity: open ? 1 : 0,
          transform: `translate3d(0, ${y}rem, 0)`,
          transition:
            kind === "fade" ? "opacity 300ms ease" : `opacity 200ms ease, transform ${open ? 300 : 0}ms ease`,
        }}
      >
        <div
          className={`grid gap-x-8 rounded-lg border border-white/10 bg-[#0a0a0a] p-8 ${
            twoCols ? "min-w-[30rem] grid-cols-2" : "min-w-[20rem] grid-cols-1"
          }`}
        >
          {item.items.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap py-2 text-white/90 transition-colors duration-200 hover:text-[#a98dff] ${
                i === 0 ? "font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** "Navbar 7 dropdown [Tablet]": altura 0 → auto en 500ms, cierra en 300ms. */
function MobileDropdown({ item }: { item: (typeof nav)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 py-3 text-lg text-white"
      >
        {item.label}
        <Chevron open={open} openMs={300} closeMs={300} />
      </button>
      <div
        className="grid overflow-hidden"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: `grid-template-rows ${open ? 500 : 300}ms ease`,
        }}
      >
        <div className="min-h-0">
          {item.items.map((link) => (
            <Link key={link.label} href={link.href} className="block py-2 text-white/80">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Ícono "menu-icon1": las líneas de arriba/abajo se cruzan en X y la del medio se achica. */
function MenuIcon({ open }: { open: boolean }) {
  const line = "block h-0.5 w-6 bg-white";
  const move = (dy: number) => ({
    transform: `translateY(${open ? dy : 0}px)`,
    transition: `transform ${open ? 400 : 600}ms ${quint}`,
  });
  const rotate = (deg: number) => ({
    transform: `rotate(${open ? deg : 0}deg)`,
    transition: `transform ${open ? 600 : 400}ms ${quint}`,
  });
  return (
    <span className="flex h-12 w-12 flex-col items-center justify-center">
      <span style={move(8)}>
        <span className={line} style={rotate(-45)} />
      </span>
      <span className="my-1.5 flex h-0.5 w-6 justify-center">
        <span
          className="block h-0.5 bg-white"
          style={{
            width: open ? 0 : 24,
            transition: `width 200ms ${quint} ${open ? 0 : 400}ms`,
          }}
        />
      </span>
      <span style={move(-8)}>
        <span className={line} style={rotate(45)} />
      </span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tinted, setTinted] = useState(false);

  // Script "Navbar Scroll" del original (GSAP): al bajar, espera 500ms y se esconde
  // (y -100%, opacity 0, 0.5s power2.out); al subir aparece al instante y queda con fondo.
  useEffect(() => {
    let last = window.scrollY;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > last) {
        if (!hideTimeout) {
          hideTimeout = setTimeout(() => {
            setHidden(true);
            hideTimeout = null;
          }, 500);
        }
      } else if (y < last) {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = null;
        setHidden(false);
        setTinted(true);
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  const away = hidden && !open;

  return (
    <>
      <div className="relative flex min-h-12 items-center justify-center gap-3 bg-white px-4 py-2 text-sm text-black">
        <span
          className="hidden h-5 w-5 items-center justify-center rounded bg-brand text-[10px] text-white sm:inline-flex"
          aria-hidden
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2.5h8v6.2L6 11 2 8.7V2.5Z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
        <p className="truncate">
          <span className="font-semibold">New Blogpost!</span>{" "}
          <span className="text-black/80">What Makes Global Delivery Actually Work</span>
        </p>
        <Link href="#" className="shrink-0 font-bold transition-colors duration-200 hover:text-[#a98dff]">
          Check it out
        </Link>
      </div>

      <header
        className="sticky top-0 z-[999] flex min-h-16 items-center px-[5%] backdrop-blur-[250px] lg:min-h-[4.5rem]"
        style={{
          backgroundColor: tinted ? "rgba(11, 11, 11, 0.80)" : "transparent",
          transform: `translate3d(0, ${away ? -100 : 0}%, 0)`,
          opacity: away ? 0 : 1,
          transition: `transform 500ms ${power2Out}, opacity 500ms ${power2Out}`,
        }}
      >
        <div className="flex w-full items-center justify-between">
          <Logo />

          <nav className="hidden items-center text-base lg:flex" aria-label="Principal">
            {nav.map((item, i) => (
              <DesktopDropdown key={item.label} item={item} kind={i === 0 ? "fade" : "rise"} />
            ))}
            {["Blog", "Resources"].map((label) => (
              <Link key={label} href="#" className="px-4 py-6 text-white/90 transition-colors hover:text-white">
                {label}
              </Link>
            ))}
            <Link
              href="#contacto"
              className="ml-4 rounded-full bg-brand px-6 py-4 leading-none text-white transition-colors duration-200 hover:bg-[#865fff]"
            >
              Contact Us
            </Link>
          </nav>

          <button
            type="button"
            className="-mr-2 lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>

        {/* Menú mobile: animación "default" de Webflow (baja desde arriba, 400ms ease). */}
        <div
          className={`absolute inset-x-0 top-full h-[100dvh] overflow-hidden lg:hidden ${
            open ? "" : "pointer-events-none"
          }`}
        >
          <div
            className="h-full overflow-auto bg-[#0a0a0a] px-[5%] pb-24 pt-4"
            style={{
              transform: `translate3d(0, ${open ? 0 : -100}%, 0)`,
              transition: "transform 400ms ease",
            }}
          >
            {nav.map((item) => (
              <MobileDropdown key={item.label} item={item} />
            ))}
            {["Blog", "Resources"].map((label) => (
              <Link key={label} href="#" className="block py-3 text-lg text-white">
                {label}
              </Link>
            ))}
            <Link
              href="#contacto"
              className="mt-6 flex justify-center rounded-full bg-brand px-6 py-4 leading-none"
              onClick={() => setOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
