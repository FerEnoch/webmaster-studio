/**
 * ADMISION — la conversion principal, en cuatro pasos.
 *
 *   1) Carrera de interés
 *   2) Presencial u online
 *   3) Turno de visita (o videollamada) + datos
 *   4) Confirmación con <Ticket/>
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible (panel de
 * resumen). El aviso "Demo: no se envian datos" esta siempre a la vista.
 *
 * Isla React (hydrate en `client:visible`). Reusa el `Ticket` del kit.
 */

import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { appUrl } from "@lib/urls";
import Ticket from "./ui/Ticket";
import { rubroWhatsapp } from "@lib/whatsapp";
import type { Carrera, Modalidad, Turno } from "../content/universidades";

export interface AdmisionFlowProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  /** Nombres de los pasos (4). */
  steps: string[];
  /** Paso 1: las carreras. */
  carreras: Carrera[];
  /** Paso 3: los turnos de visita y las videollamadas. */
  turnos: Turno[];
  /** Aviso de demo. */
  demoNotice: string;
  /** Link al formulario de inscripcion (demo). */
  inscriptionHref: string;
}

type Form = { name: string; phone: string; email: string };

const EMPTY: Form = { name: "", phone: "", email: "" };

const MODALIDADES: { id: Modalidad; titulo: string; detail: string }[] = [
  {
    id: "presencial",
    titulo: "Presencial",
    detail:
      "De martes a viernes en campus, 8 horas semanales en aula. Un día de prácticas presenciales por cuatrimestre. Ideal si venis de lejos: la red se arma en el pasillo.",
  },
  {
    id: "online",
    titulo: "Online",
    detail:
      "Campus Virtual: 6 horas de videollamada en vivo por semana, materiales grabados y parciales a distancia. Las prácticas siguen siendo presenciales, en bloques de una semana.",
  },
];

/** Codigo de seguimiento a partir de la seleccion (determinista). */
function makeCode(brand: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  const prefix =
    brand
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.replace(/[^A-Za-z]/g, "").charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "WM";
  return `${prefix}-${String(hash).padStart(5, "0")}`;
}

export default function AdmisionFlow({
  brand,
  title,
  kicker,
  body,
  steps,
  carreras,
  turnos,
  demoNotice,
  inscriptionHref,
}: AdmisionFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [carreraId, setCarreraId] = useState<string>(carreras[0]?.id ?? "");
  const [modalidad, setModalidad] = useState<Modalidad | "">("");
  const [turnoId, setTurnoId] = useState<string>("");
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  const carrera = useMemo(
    () => carreras.find((c) => c.id === carreraId),
    [carreras, carreraId],
  );
  const turno = useMemo(() => turnos.find((t) => t.id === turnoId), [turnos, turnoId]);
  const turnosDisponibles = useMemo(
    () => turnos.filter((t) => t.modalidad === modalidad),
    [turnos, modalidad],
  );

  const set =
    (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const elegirCarrera = (id: string) => {
    setCarreraId(id);
    const nueva = carreras.find((c) => c.id === id);
    // La modalidad se reinicia: la nueva carrera puede no ofrecer la anterior.
    if (nueva && modalidad && !nueva.modalidades.includes(modalidad)) {
      setModalidad("");
      setTurnoId("");
    }
  };

  const irATurno = () => {
    if (!carrera) {
      setError("Elegi una carrera para continuar.");
      return;
    }
    setError("");
    setStep(2);
  };

  const elegirModalidad = (m: Modalidad) => {
    setModalidad(m);
    setTurnoId("");
    setError("");
    setStep(3);
  };

  const confirmar = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!turno) {
      setError("Elegi un turno para continuar.");
      return;
    }
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Completa tu nombre y tu telefono para continuar.");
      return;
    }
    setError("");
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setModalidad("");
    setTurnoId("");
    setForm(EMPTY);
    setError("");
  };

  const code = makeCode(brand, `${carreraId}|${modalidad}|${turnoId}|${form.phone}`);
  const whatsappHref = rubroWhatsapp("universidad", { carrera: carrera?.title ?? "" });

  const pasoTitulos = steps.length === 4 ? steps : ["Carrera", "Modalidad", "Turno y datos", "Confirmación"];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      {/* ── Columna principal: los pasos ───────────────────────── */}
      <div className="wm-card min-w-0">
        {kicker ? <p className="wm-kicker">{kicker}</p> : null}
        <h3 className="wm-display mt-4 text-2xl leading-tight">{title}</h3>
        {body ? <p className="mt-3 text-sm text-muted">{body}</p> : null}

        <ol className="mb-8 mt-8 flex flex-wrap gap-2">
          {pasoTitulos.map((name, i) => {
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
          <p role="alert" className="mb-5 rounded-wm border border-accent px-4 py-3 text-sm text-accent">
            {error}
          </p>
        ) : null}

        <div key={step} className="animate-wm-rise">
          {/* ── Paso 1: carrera de interes ────────────────────── */}
          {step === 1 ? (
            <div>
              <fieldset>
                <legend className="wm-kicker mb-4">1 · {pasoTitulos[0]}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {carreras.map((c) => (
                    <label
                      key={c.id}
                      className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                        carreraId === c.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="carrera"
                        value={c.id}
                        checked={carreraId === c.id}
                        onChange={() => elegirCarrera(c.id)}
                        className="sr-only"
                      />
                      <span className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <span className="wm-display text-lg leading-tight">{c.title}</span>
                        {c.badge ? <span className="wm-chip shrink-0">{c.badge}</span> : null}
                      </span>
                      <span className="mt-2 block text-xs uppercase tracking-[0.14em] text-muted">
                        {c.area} · {c.duracion} · {c.sede}
                      </span>
                      <span className="mt-2 block text-sm text-muted">
                        Salida laboral: {c.salida}
                      </span>
                      <span className="mt-3 block text-sm font-semibold text-accent">
                        {c.arancel}
                        <span className="ml-1 font-normal text-muted">final, IVA incluido</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="button" onClick={irATurno} className="wm-btn mt-8 w-full">
                {pasoTitulos[1]}
              </button>
            </div>
          ) : null}

          {/* ── Paso 2: presencial u online ────────────────────── */}
          {step === 2 && carrera ? (
            <div>
              <p className="wm-kicker mb-4">2 · {pasoTitulos[1]}</p>
              <p className="mb-5 text-sm text-muted">
                Elegiste <strong className="text-fg">{carrera.title}</strong>. Esta carrera se puede cursar{" "}
                {carrera.modalidades.length === 1
                  ? "solo de una manera"
                  : `de ${carrera.modalidades.length} maneras`}
                :
              </p>

              <div className="grid gap-3">
                {MODALIDADES.filter((m) => carrera.modalidades.includes(m.id)).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => elegirModalidad(m.id)}
                    className="rounded-wm border border-line p-5 text-left transition-colors hover:border-accent"
                  >
                    <span className="wm-display block text-xl">{m.titulo}</span>
                    <span className="mt-2 block text-sm text-muted">{m.detail}</span>
                    <span className="mt-3 block text-sm font-semibold text-accent">
                      Elegir {m.titulo.toLowerCase()} →
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(1)} className="wm-btn wm-btn--ghost w-full sm:w-auto">
                  Volver
                </button>
              </div>
            </div>
          ) : null}

          {/* ── Paso 3: turno + datos ──────────────────────────── */}
          {step === 3 ? (
            <form onSubmit={confirmar}>
              <p className="wm-kicker mb-4">3 · {pasoTitulos[2]}</p>

              <p className="mb-5 text-sm text-muted">
                {modalidad === "presencial"
                  ? "Elegí el turno de la visita guiada al campus. Son 90 minutos con un estudiante y una persona de admisiones."
                  : "Elegí el turno de la videollamada de orientación. Son 45 minutos: te mostramos el campus por videollamada y respondemos todo."}
              </p>

              <ul className="grid gap-3 sm:grid-cols-2">
                {turnosDisponibles.map((t) => {
                  const selected = turnoId === t.id;
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => setTurnoId(t.id)}
                        className={`flex w-full flex-col items-start gap-1 rounded-wm border px-4 py-3 text-left transition-colors ${
                          selected ? "border-accent bg-soft" : "border-line hover:border-accent"
                        }`}
                      >
                        <span className="text-xs uppercase tracking-[0.14em] text-muted">{t.etiqueta}</span>
                        <span className="wm-display block text-xl leading-tight">
                          {t.day} · {t.time}
                        </span>
                        <span className={`text-xs ${t.places <= 3 ? "text-accent" : "text-muted"}`}>
                          {t.places <= 3 ? `Quedan ${t.places}` : `${t.places} lugares`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {turnosDisponibles.length === 0 ? (
                <p className="mt-5 rounded-wm border border-line p-4 text-sm text-muted">
                  Para esa modalidad todavía no hay turnos cargados. Escribinos por WhatsApp y te los abrimos a la medida.
                </p>
              ) : null}

              <fieldset className="mt-8">
                <legend className="wm-kicker mb-4">Tus datos</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-muted">Nombre y apellido</span>
                    <input
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Ana Gomez"
                      className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-muted">Teléfono</span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="11 1234 5678"
                      className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="text-muted">Email (opcional)</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="ana@email.com"
                      className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                    />
                  </label>
                </div>
              </fieldset>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(2)} className="wm-btn wm-btn--ghost w-full sm:w-auto">
                  Volver
                </button>
                <button type="submit" className="wm-btn w-full sm:w-auto">
                  {pasoTitulos[3]}
                </button>
              </div>
            </form>
          ) : null}

          {/* ── Paso 4: ticket ────────────────────────────────── */}
          {step === 4 && carrera && turno ? (
            <div className="text-center">
              <p className="wm-display text-4xl">Listo</p>
              <p className="mt-3 text-muted">
                Guardamos tu lugar para {carrera.title}. Lleva este pase y tu DNI.
              </p>

              <div className="mt-8">
                <Ticket
                  brand={brand}
                  title="Pase de admisión"
                  subtitle={carrera.title}
                  code={code}
                  stamp="RESERVADO"
                  rows={[
                    { label: "Carrera", value: carrera.title },
                    { label: "Modalidad", value: modalidad === "online" ? "Online" : "Presencial" },
                    { label: "Sede", value: carrera.sede },
                    { label: "Turno", value: turno.etiqueta },
                    { label: "Día y hora", value: `${turno.day} · ${turno.time}` },
                    { label: "Nombre", value: form.name },
                    { label: "Telefono", value: form.phone },
                  ]}
                  note="Mostrá este código al llegar a admisiones o al escribirnos por WhatsApp."
                  demoNotice={demoNotice}
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a href={whatsappHref} className="wm-btn">
                  Mandar por WhatsApp
                </a>
                <a href={appUrl(inscriptionHref)} className="wm-btn wm-btn--ghost">
                  Completar la inscripción
                </a>
              </div>

              <button type="button" onClick={reset} className="mt-6 text-sm text-muted underline underline-offset-4">
                Sacar otro pase
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Resumen: TODO el estado visible ───────────────────── */}
      <aside className="wm-card h-fit min-w-0">
        <p className="wm-kicker">Resumen de la simulación</p>
        <dl className="mt-5 grid gap-3 text-sm">
          {[
            ["Estado", step === 4 ? "Confirmado (demo)" : `Paso ${step} de 4`],
            ["Carrera", carrera?.title ?? "-"],
            ["Area", carrera?.area ?? "-"],
            ["Modalidad", modalidad === "online" ? "Online" : modalidad === "presencial" ? "Presencial" : "-"],
            ["Sede", carrera?.sede ?? "-"],
            ["Turno", turno ? `${turno.day} ${turno.time}` : "-"],
            ["Nombre", form.name || "-"],
            ["Teléfono", form.phone || "-"],
            ["Email", form.email || "-"],
            ["Código", step === 4 ? code : "-"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <a href={whatsappHref} className="wm-btn mt-6 w-full">
          Continuar por WhatsApp
        </a>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          {demoNotice} Esta pantalla muestra exactamente lo que se guardaria; en produccion se
          conecta a un backend y el pase se envía por email y WhatsApp.
        </p>
      </aside>
    </div>
  );
}
