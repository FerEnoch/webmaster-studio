/**
 * COTIZADOR — la conversion principal, en 4 pasos.
 *
 * 1) Encargo     (proyecto / direccion / interiorismo / permisos)
 * 2) Escala      (banda de superficie, con honorario estimado en vivo)
 * 3) Visita      (dia, hora y sena)
 * 4) Tu pase     (Ticket del kit + CTA a WhatsApp)
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible. El aviso
 * "Demo: no se envian datos" esta siempre a la vista.
 *
 * Es una isla React: `client:visible`.
 */

import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import Ticket from "./ui/Ticket";
import { rubroWhatsapp } from "@lib/whatsapp";
import type { CatalogItem } from "@lib/types";

export interface CotizadorProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  /** Nombres de los pasos (4). */
  steps: string[];
  /** Paso 1: tipo de encargo. */
  opciones: CatalogItem[];
  /** Paso 2: bandas de escala. */
  alcances: CatalogItem[];
  /** Paso 3: horarios de visita al sitio. */
  visitas: { id: string; day: string; time: string; places: number }[];
  /** Honorarios estimados por encargo y banda de escala. */
  precios: Record<string, Record<string, number>>;
  /** Porcentaje de seña (0.2). */
  sena: number;
  /** Aviso de demo. */
  demoNotice: string;
  /** Id del rubro en el catálogo (para el mensaje de WhatsApp). */
  rubroId: string;
}

type Form = { name: string; phone: string; email: string; zona: string };

const EMPTY: Form = { name: "", phone: "", email: "", zona: "" };

/** Código de pase a partir de la seleccion. */
function makeCode(brand: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  const prefix =
    brand
      .split(/\s+/)
      .filter(Boolean)
      .map((palabra) => palabra.replace(/[^A-Za-z]/g, "").charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "EV";
  return `${prefix}-${String(hash).padStart(5, "0")}`;
}

const pesos = (n: number) => `$ ${n.toLocaleString("es-AR")}`;

export default function Cotizador({
  brand,
  title,
  kicker,
  body,
  steps,
  opciones,
  alcances,
  visitas,
  precios,
  sena,
  demoNotice,
  rubroId,
}: CotizadorProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [opcionId, setOpcionId] = useState<string>(opciones[0]?.id ?? "");
  const [alcanceId, setAlcanceId] = useState<string>(alcances[0]?.id ?? "");
  const [visitaId, setVisitaId] = useState<string>("");
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  const opcion = useMemo(() => opciones.find((o) => o.id === opcionId), [opciones, opcionId]);
  const alcance = useMemo(() => alcances.find((a) => a.id === alcanceId), [alcances, alcanceId]);
  const visita = useMemo(() => visitas.find((v) => v.id === visitaId), [visitas, visitaId]);

  const total = precios[opcionId]?.[alcanceId] ?? 0;
  const deposito = Math.round(total * sena);

  const set =
    (campo: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [campo]: event.target.value }));
    };

  const whatsappHref = rubroWhatsapp(rubroId, {
    tipo: opcion?.title ?? "",
    alcance: alcance?.title ?? "",
    fecha: visita ? `${visita.day} ${visita.time}` : "",
    nombre: form.name || "mi proyecto",
  });

  const irAEscala = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Completá tu nombre y tu teléfono para continuar.");
      return;
    }
    setError("");
    setStep(2);
  };

  const confirmar = () => {
    if (!visita) {
      setError("Elegí un día y una hora para la visita.");
      return;
    }
    setError("");
    setStep(4);
  };

  const reiniciar = () => {
    setStep(1);
    setVisitaId("");
    setForm(EMPTY);
    setError("");
  };

  const code = makeCode(brand, `${opcionId}|${alcanceId}|${visitaId}|${form.phone}`);

  return (
    <div className="vt-quote">
      <div>
        {kicker ? <p className="wm-kicker">{kicker}</p> : null}
        <h2 className="vt-step__title mt-5">{title}</h2>
        {body ? <p className="vt-obras__body mt-4">{body}</p> : null}

        <ol className="vt-quote__steps">
          {steps.map((name, i) => {
            const n = (i + 1) as 1 | 2 | 3 | 4;
            const state = step === n ? "current" : step > n ? "done" : "todo";
            return (
              <li key={name} className="vt-quote__step" data-state={state}>
                <span className="vt-step__num">{n}</span>
                <span>{name}</span>
              </li>
            );
          })}
        </ol>

        {error ? (
          <p
            role="alert"
            className="mt-6 border border-[var(--wm-accent)] px-4 py-3 text-sm text-[var(--wm-accent)]"
          >
            {error}
          </p>
        ) : null}

        {/* ── Paso 1: encargo y datos ──────────────────────────── */}
        {step === 1 ? (
          <form onSubmit={irAEscala}>
            <fieldset>
              <legend className="vt-quote__option-title mb-5">1 · {steps[0]}</legend>
              <div className="grid gap-3">
                {opciones.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="vt-quote__option"
                    aria-pressed={opcionId === o.id}
                    data-selected={opcionId === o.id ? "true" : "false"}
                    onClick={() => setOpcionId(o.id)}
                  >
                    <span className="vt-quote__option-title">{o.title}</span>
                    {o.body ? <span className="vt-quote__option-body">{o.body}</span> : null}
                    {o.price ? <span className="vt-quote__option-price">{o.price.amount}</span> : null}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-10 grid gap-5 sm:grid-cols-2">
              <legend className="vt-quote__option-title col-span-full mb-5">Tus datos</legend>
              <label className="vt-quote__field">
                <span>Nombre y apellido</span>
                <input
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Ana Gomez"
                  autoComplete="name"
                />
              </label>
              <label className="vt-quote__field">
                <span>Telefono</span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="11 1234 5678"
                  autoComplete="tel"
                />
              </label>
              <label className="vt-quote__field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="ana@email.com"
                  autoComplete="email"
                />
              </label>
              <label className="vt-quote__field">
                <span>¿Dónde está el proyecto?</span>
                <input
                  value={form.zona}
                  onChange={set("zona")}
                  placeholder="Palermo, CABA"
                />
              </label>
            </fieldset>

            <button type="submit" className="wm-btn mt-10 w-full sm:w-auto">
              {steps[1] ?? "Ver escala"}
            </button>
          </form>
        ) : null}

        {/* ── Paso 2: escala ──────────────────────────────────── */}
        {step === 2 ? (
          <div>
            <p className="vt-quote__option-title mb-5">2 · {steps[1] ?? "Escala"}</p>
            <div className="grid gap-3">
              {alcances.map((a) => {
                const estimado = precios[opcionId]?.[a.id] ?? 0;
                return (
                  <button
                    key={a.id}
                    type="button"
                    className="vt-quote__option"
                    aria-pressed={alcanceId === a.id}
                    data-selected={alcanceId === a.id ? "true" : "false"}
                    onClick={() => setAlcanceId(a.id)}
                  >
                    <span className="vt-quote__option-title">{a.title}</span>
                    {a.body ? <span className="vt-quote__option-body">{a.body}</span> : null}
                    <span className="vt-quote__option-price">
                      {a.meta?.[0]?.value}
                      {estimado ? ` · desde ${pesos(estimado)}` : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="wm-btn wm-btn--ghost" onClick={() => setStep(1)}>
                Volver
              </button>
              <button type="button" className="wm-btn" onClick={() => setStep(3)}>
                {steps[2] ?? "Elegir visita"}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Paso 3: visita ──────────────────────────────────── */}
        {step === 3 ? (
          <div>
            <p className="vt-quote__option-title mb-5">3 · {steps[2] ?? "Visita al sitio"}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {visitas.map((v) => {
                const seleccionado = visitaId === v.id;
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      className="vt-quote__option"
                      aria-pressed={seleccionado}
                      data-selected={seleccionado ? "true" : "false"}
                      onClick={() => setVisitaId(v.id)}
                    >
                      <span className="vt-quote__option-title">{v.day}</span>
                      <span className="vt-quote__option-price">
                        {v.time} · {v.places <= 1 ? "ultimo lugar" : `${v.places} lugares`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="wm-btn wm-btn--ghost" onClick={() => setStep(2)}>
                Volver
              </button>
              <button type="button" className="wm-btn" onClick={confirmar}>
                {steps[3] ?? "Confirmar"}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Paso 4: el pase ─────────────────────────────────── */}
        {step === 4 && opcion && alcance && visita ? (
          <div className="text-center">
            <p className="vt-head__title !text-4xl">Listo</p>
            <p className="vt-obras__body mt-4">
              Guardamos tu lugar para la visita. Este es el pase que llevás al sitio.
            </p>

            <div className="vt-ticket mt-8">
              <Ticket
                brand={brand}
                title="Pase de visita"
                subtitle={`${opcion.title} · ${alcance.title}`}
                code={code}
                stamp="RESERVADO"
                rows={[
                  { label: "Nombre", value: form.name },
                  { label: "Telefono", value: form.phone },
                  { label: "Zona", value: form.zona || "—" },
                  { label: "Visita", value: `${visita.day} ${visita.time}` },
                  { label: "Honorario estimado", value: total ? pesos(total) : "a definir" },
                  { label: `Seña ${Math.round(sena * 100)}%`, value: deposito ? pesos(deposito) : "a definir" },
                ]}
                note="La seña se descuenta del honorario final. Estimación orientativa: no es una cotización."
                demoNotice={demoNotice}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={whatsappHref} className="wm-btn">
                Mandar por WhatsApp
              </a>
              <button type="button" className="wm-btn wm-btn--ghost" onClick={reiniciar}>
                Sacar otra consulta
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Resumen: TODO el estado visible ─────────────────────── */}
      <aside className="vt-quote__summary" aria-label="Resumen de la simulacion">
        <p className="vt-quote__option-title">Resumen</p>
        <dl className="mt-5">
          {[
            ["Estado", step === 4 ? "Reservado (demo)" : `Paso ${step} de 4`],
            ["Encargo", opcion?.title ?? "—"],
            ["Escala", alcance?.title ?? "—"],
            ["Honorario estimado", total ? pesos(total) : "a definir"],
            [`Seña ${Math.round(sena * 100)}%`, deposito ? pesos(deposito) : "a definir"],
            ["Nombre", form.name || "—"],
            ["Telefono", form.phone || "—"],
            ["Email", form.email || "—"],
            ["Zona", form.zona || "—"],
            ["Visita", visita ? `${visita.day} ${visita.time}` : "—"],
            ["Codigo", step === 4 ? code : "—"],
          ].map(([label, value]) => (
            <div key={label} className="vt-quote__row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <a href={whatsappHref} className="wm-btn mt-6 w-full">
          Continuar por WhatsApp
        </a>

        <p className="vt-quote__note">
          {demoNotice} Esta pantalla muestra exactamente lo que se guardaria; en produccion se
          conecta a un backend y se envia la consulta por email y WhatsApp. Los honorarios son
          estimaciones orientativas: el numero definitivo se cierra por escrito con el alcance
          definido.
        </p>
      </aside>
    </div>
  );
}
