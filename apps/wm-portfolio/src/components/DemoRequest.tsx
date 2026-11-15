/**
 * DEMO REQUEST — la conversion principal del portfolio madre.
 *
 * 1) Tu rubro  ->  2) Tu negocio  ->  3) Contacto  ->  4) Confirmacion (TICKET)
 *
 * Termina en el `<Ticket/>` del kit (la firma visual del portfolio) con el
 * código de la demo, y un CTA de WhatsApp con el mensaje prearmado del rubro
 * (`rubroWhatsapp`).
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible en el panel de
 * resumen. El aviso "Demo: no se envían datos" está siempre a la vista.
 */

import { useMemo, useState, type ChangeEvent } from "react";
import Ticket from "./ui/Ticket";
import { rubroWhatsapp, waLink } from "@lib/whatsapp";
import type { CatalogItem, Slot } from "@lib/types";

export interface DemoRequestProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  /** Nombres de los pasos (4). */
  steps: string[];
  /** Paso 1: los rubros disponibles. */
  options: CatalogItem[];
  /** Paso 3: ventanas de entrega. */
  slots: Slot[];
  /** Aviso de demo. */
  demoNotice: string;
  /** WhatsApp del estudio (para el que todavia no sabe el rubro). */
  studioWhatsapp: string;
  /** Texto del precio de referencia que va en el ticket. */
  priceNote: string;
}

type Form = {
  rubro: string;
  negocio: string;
  detalle: string;
  telefono: string;
  email: string;
  ciudad: string;
  ventana: string;
};

const EMPTY: Form = {
  rubro: "",
  negocio: "",
  detalle: "",
  telefono: "",
  email: "",
  ciudad: "",
  ventana: "",
};

/** Codigo de demo a partir de la seleccion (determinista: mismo dato, mismo ticket). */
function makeCode(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  return `DEMO-${String(hash).padStart(5, "0")}`;
}

/**
 * Rellena la plantilla de WhatsApp del rubro con los datos del negocio.
 * Cada rubro tiene sus propios placeholders (ver `packages/webmaster-kit/rubros.ts`).
 */
function ctxFor(
  rubroId: string,
  datos: { negocio: string; ciudad: string },
): Record<string, string> {
  const negocio = datos.negocio.trim() || "mi negocio";
  const ciudad = datos.ciudad.trim() || "mi zona";

  switch (rubroId) {
    case "concesionario":
      return { modelo: negocio };
    case "lavadero":
      return { tipo: negocio, dia: ciudad };
    case "estetica":
      return { servicio: negocio, dia: ciudad };
    case "universidad":
      return { carrera: negocio };
    case "inmobiliaria":
      return { zona: ciudad };
    case "arquitectura":
      return { tipo: negocio };
    default:
      return {};
  }
}

export default function DemoRequest({
  brand,
  title,
  kicker,
  body,
  steps,
  options,
  slots,
  demoNotice,
  studioWhatsapp,
  priceNote,
}: DemoRequestProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  const set =
    (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const rubro = useMemo(
    () => options.find((o) => o.id === form.rubro),
    [options, form.rubro],
  );
  const ventana = useMemo(
    () => slots.find((s) => s.id === form.ventana),
    [slots, form.ventana],
  );

  const code = makeCode(`${form.rubro}|${form.negocio}|${form.telefono}`);

  const whatsappHref = useMemo(() => {
    if (form.rubro && form.rubro !== "otro") {
      try {
        return rubroWhatsapp(
          form.rubro,
          ctxFor(form.rubro, { negocio: form.negocio, ciudad: form.ciudad }),
        );
      } catch {
        // Rubro desconocido: cae al WhatsApp del estudio.
      }
    }
    return waLink(
      studioWhatsapp,
      `Hola, quiero una demo gratis de mi negocio${form.negocio ? ` (${form.negocio})` : ""}.`,
    );
  }, [form.rubro, form.negocio, form.ciudad, studioWhatsapp]);

  const next = () => {
    setError("");
    setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
  };

  const back = () => {
    setError("");
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));
  };

  const submitNegocio = () => {
    if (!form.negocio.trim()) {
      setError("Escribí el nombre de tu negocio para continuar.");
      return;
    }
    next();
  };

  const submitContacto = () => {
    if (!form.telefono.trim() && !form.email.trim()) {
      setError("Dejanos un teléfono o un email para poder escribirte.");
      return;
    }
    if (!form.ventana) {
      setError("Elegí cuándo la querés recibir.");
      return;
    }
    next();
  };

  const reset = () => {
    setForm(EMPTY);
    setError("");
    setStep(1);
  };

  const field =
    "mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      {/* ── Columna principal: los 4 pasos ─────────────────────────── */}
      <div className="wm-card">
        {kicker ? <p className="wm-kicker">{kicker}</p> : null}
        <h3 className="wm-display mt-4 text-2xl leading-tight">{title}</h3>
        {body ? <p className="mt-3 text-sm text-muted">{body}</p> : null}

        <ol className="mb-8 mt-8 flex flex-wrap gap-2">
          {steps.map((name, i) => {
            const n = (i + 1) as 1 | 2 | 3 | 4;
            const state = step === n ? "current" : step > n ? "done" : "todo";
            return (
              <li
                key={name}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                  state === "todo" ? "border-line text-muted" : "border-accent text-accent"
                }`}
              >
                <span className="tabular-nums font-bold">{n}</span>
                <span>{name}</span>
              </li>
            );
          })}
        </ol>

        {error ? (
          <p
            role="alert"
            className="mb-5 rounded-wm border border-accent px-4 py-3 text-sm text-accent"
          >
            {error}
          </p>
        ) : null}

        {/* ── Paso 1: el rubro ────────────────────────────────────── */}
        {step === 1 ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.rubro) {
                setError("Elegí un rubro para continuar.");
                return;
              }
              next();
            }}
          >
            <fieldset>
              <legend className="wm-kicker mb-4">1 · {steps[0] ?? "Tu rubro"}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {options.map((o) => (
                  <label
                    key={o.id}
                    className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                      form.rubro === o.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rubro"
                      value={o.id}
                      checked={form.rubro === o.id}
                      onChange={() => setForm((prev) => ({ ...prev, rubro: o.id }))}
                      className="sr-only"
                    />
                    <span className="flex items-start justify-between gap-3">
                      <span className="wm-display text-lg leading-tight">{o.kicker ?? o.title}</span>
                      {o.badge ? <span className="wm-chip shrink-0">{o.badge}</span> : null}
                    </span>
                    <span className="mt-2 block text-sm text-muted">{o.body}</span>
                    {o.points?.length ? (
                      <span className="mt-3 block border-l-2 border-accent pl-3 text-sm italic text-muted">
                        {o.points[0]}
                      </span>
                    ) : null}
                  </label>
                ))}

                <label
                  className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                    form.rubro === "otro" ? "border-accent bg-soft" : "border-line hover:border-accent"
                  }`}
                >
                  <input
                    type="radio"
                    name="rubro"
                    value="otro"
                    checked={form.rubro === "otro"}
                    onChange={() => setForm((prev) => ({ ...prev, rubro: "otro" }))}
                    className="sr-only"
                  />
                  <span className="wm-display text-lg leading-tight">Todavía no sé</span>
                  <span className="mt-2 block text-sm text-muted">
                    Elegí esta y lo definimos juntos por WhatsApp.
                  </span>
                </label>
              </div>
            </fieldset>

            <button type="submit" className="wm-btn mt-8 w-full">
              {steps[1] ?? "Continuar"}
            </button>
          </form>
        ) : null}

        {/* ── Paso 2: el negocio ──────────────────────────────────── */}
        {step === 2 ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitNegocio();
            }}
          >
            <fieldset>
              <legend className="wm-kicker mb-4">2 · {steps[1] ?? "Tu negocio"}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-muted">Nombre del negocio</span>
                  <input
                    required
                    value={form.negocio}
                    onChange={set("negocio")}
                    placeholder="Librería Sur"
                    className={field}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-muted">Ciudad o zona</span>
                  <input
                    value={form.ciudad}
                    onChange={set("ciudad")}
                    placeholder="Mar del Plata"
                    className={field}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="text-muted">¿A qué se dedica (opcional)?</span>
                  <textarea
                    rows={3}
                    value={form.detalle}
                    onChange={set("detalle")}
                    placeholder="Venta de libros usados y una sección de café"
                    className={field}
                  />
                </label>
              </div>
            </fieldset>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={back} className="wm-btn wm-btn--ghost w-full sm:w-auto">
                Volver
              </button>
              <button type="submit" className="wm-btn w-full sm:w-auto">
                {steps[2] ?? "Continuar"}
              </button>
            </div>
          </form>
        ) : null}

        {/* ── Paso 3: contacto ────────────────────────────────────── */}
        {step === 3 ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitContacto();
            }}
          >
            <fieldset>
              <legend className="wm-kicker mb-4">3 · {steps[2] ?? "Contacto"}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-muted">Teléfono</span>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={set("telefono")}
                    placeholder="11 1234 5678"
                    className={field}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-muted">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="vos@email.com"
                    className={field}
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="wm-kicker mb-4">¿Cuándo la querés?</legend>
              <ul className="grid gap-3 sm:grid-cols-3">
                {slots.map((s) => {
                  const selected = form.ventana === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, ventana: s.id }))}
                        aria-pressed={selected}
                        className={`flex w-full flex-col items-start gap-1 rounded-wm border px-4 py-3 text-left transition-colors ${
                          selected ? "border-accent bg-soft" : "border-line hover:border-accent"
                        }`}
                      >
                        <span className="text-sm font-semibold">{s.day}</span>
                        <span className="wm-display text-xl">{s.time}</span>
                        <span className="text-xs text-muted">{s.places} lugares</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={back} className="wm-btn wm-btn--ghost w-full sm:w-auto">
                Volver
              </button>
              <button type="submit" className="wm-btn w-full sm:w-auto">
                {steps[3] ?? "Confirmar"}
              </button>
            </div>
          </form>
        ) : null}

        {/* ── Paso 4: ticket ──────────────────────────────────────── */}
        {step === 4 ? (
          <div className="text-center">
            <p className="wm-display text-4xl">Listo</p>
            <p className="mt-3 text-muted">
              Tu demo queda en la cola. Este es el ticket: el código va en el
              link que te mando.
            </p>

            <div className="mt-8">
              <Ticket
                brand={brand}
                title="Demo en preparación"
                subtitle={form.negocio || "Tu negocio"}
                code={code}
                stamp="48 H"
                rows={[
                  { label: "Rubro", value: rubro?.kicker ?? (form.rubro === "otro" ? "Por definir" : "—") },
                  { label: "Negocio", value: form.negocio || "—"},
                  { label: "Contacto", value: form.telefono || form.email || "—" },
                  { label: "Ciudad", value: form.ciudad || "—" },
                  { label: "Entrega", value: ventana ? `${ventana.day} ${ventana.time}` : "48 h" },
                  { label: "Costo", value: priceNote },
                ]}
                note={
                  form.detalle
                    ? `A qué se dedica: ${form.detalle}`
                    : "Cuando armemos la demo te escribo por WhatsApp."
                }
                demoNotice={demoNotice}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={whatsappHref} className="wm-btn">
                Mandar por WhatsApp
              </a>
              <button type="button" onClick={reset} className="wm-btn wm-btn--ghost">
                Pedir otra demo
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Resumen: TODO el estado visible ─────────────────────────── */}
      <aside className="wm-card h-fit">
        <p className="wm-kicker">Resumen de la simulación</p>
        <dl className="mt-5 grid gap-3 text-sm">
          {[
            ["Estado", step === 4 ? "Confirmado (demo)" : `Paso ${step} de 4`],
            ["Rubro", rubro?.kicker ?? (form.rubro === "otro" ? "Por definir" : "—")],
            ["Negocio", form.negocio || "—"],
            ["Ciudad", form.ciudad || "—"],
            ["Teléfono", form.telefono || "—"],
            ["Email", form.email || "—"],
            ["Entrega", ventana ? `${ventana.day} ${ventana.time}` : "—"],
            ["Código", step === 4 ? code : "—"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-line pb-2"
            >
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <a href={whatsappHref} className="wm-btn mt-6 w-full">
          Continuar por WhatsApp
        </a>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          {demoNotice} Esta pantalla muestra exactamente lo que se guardaría; en
          producción se conecta a un backend y el ticket llega por email y
          WhatsApp.
        </p>
      </aside>
    </div>
  );
}
