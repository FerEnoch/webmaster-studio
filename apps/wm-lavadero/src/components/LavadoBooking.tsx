/**
 * LAVADO BOOKING — la conversion principal del rubro, en 4 pasos.
 *
 * 1) Tu auto        (tamano: compacto / camioneta / furgon)
 * 2) Lavado y extras (nivel + add-ons, con total en vivo)
 * 3) Turno y sena   (datos + horario + monto de la sena)
 * 4) Tu pase        (Ticket del kit + CTA a WhatsApp)
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible. El aviso
 * "Demo: no se envian datos" esta siempre a la vista.
 *
 * Es una isla React: `client:visible`.
 */

import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import Ticket from "./ui/Ticket";
import { rubroWhatsapp } from "@lib/whatsapp";
import type { CatalogItem, Slot } from "@lib/types";

export interface LavadoBookingProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  /** Nombres de los pasos (4). */
  steps: string[];
  /** Paso 1: tamanos de auto. */
  options: CatalogItem[];
  /** Paso 2: niveles de lavado. */
  servicios: CatalogItem[];
  /** Paso 2: add-ons. */
  addons: CatalogItem[];
  /** Precios finales por servicio y tamano. */
  precios: Record<string, Record<string, number>>;
  /** Precios finales de cada add-on. */
  preciosAddons: Record<string, number>;
  /** Paso 3: horarios. */
  slots: Slot[];
  /** Porcentaje de sena (0.2). */
  sena: number;
  /** Aviso de demo. */
  demoNotice: string;
  /** Rubro para el mensaje de WhatsApp ("lavadero"). */
  rubroId: string;
}

/**
 * Formato de precio AR. Va aca adentro (y no como prop) porque las props de
 * una isla tienen que ser serializables a JSON.
 */
function formatPrice(n: number): string {
  return `$ ${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

type Form = { name: string; phone: string; email: string; plate: string };

const EMPTY: Form = { name: "", phone: "", email: "", plate: "" };

/** Codigo de pase a partir del hash de la seleccion. */
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

export default function LavadoBooking({
  brand,
  title,
  kicker,
  body,
  steps,
  options,
  servicios,
  addons,
  precios,
  preciosAddons,
  slots,
  sena,
  demoNotice,
  rubroId,
}: LavadoBookingProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [sizeId, setSizeId] = useState<string>(options[0]?.id ?? "");
  const [serviceId, setServiceId] = useState<string>(servicios[1]?.id ?? servicios[0]?.id ?? "");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [slotId, setSlotId] = useState<string>("");
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  const size = useMemo(() => options.find((o) => o.id === sizeId), [options, sizeId]);
  const service = useMemo(() => servicios.find((s) => s.id === serviceId), [servicios, serviceId]);
  const slot = useMemo(() => slots.find((s) => s.id === slotId), [slots, slotId]);

  const chosenAddons = useMemo(
    () => addons.filter((a) => addonIds.includes(a.id)),
    [addons, addonIds],
  );

  /** Total: precio del nivel para el tamano + add-ons. */
  const total = useMemo(() => {
    const base = precios[serviceId]?.[sizeId] ?? 0;
    const extras = chosenAddons.reduce((acc, a) => acc + (preciosAddons[a.id] ?? 0), 0);
    return base + extras;
  }, [precios, preciosAddons, serviceId, sizeId, chosenAddons]);

  /** Sena: 20% del total, redondeado a los 100. */
  const deposit = useMemo(() => Math.round((total * sena) / 100) * 100, [total, sena]);

  const set =
    (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const toggleAddon = (id: string) => {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const whatsappHref = rubroWhatsapp(rubroId, {
    tipo: size?.title ?? "",
    dia: slot ? `${slot.day} ${slot.time}` : "",
  });

  const goToService = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStep(2);
  };

  const goToSlot = () => {
    if (!size) {
      setError("Elegí el tamaño de tu auto.");
      return;
    }
    setError("");
    setStep(3);
  };

  const confirm = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.plate.trim()) {
      setError("Completá tu nombre, tu teléfono y la patente.");
      return;
    }
    if (!slot) {
      setError("Elegí un horario para continuar.");
      return;
    }
    setError("");
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setSlotId("");
    setAddonIds([]);
    setForm(EMPTY);
    setError("");
  };

  const code = makeCode(brand, `${sizeId}|${serviceId}|${slotId}|${form.plate}`);
  const stepLabels = steps.length === 4 ? steps : ["Tu auto", "Lavado", "Turno", "Tu pase"];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      {/* ── Columna principal: los pasos ───────────────────────── */}
      <div className="wm-card">
        {kicker ? <p className="wm-kicker">{kicker}</p> : null}
        <h3 className="wm-display mt-4 text-2xl leading-tight">{title}</h3>
        {body ? <p className="mt-3 text-sm text-muted">{body}</p> : null}

        <ol className="mb-8 mt-8 flex flex-wrap gap-2">
          {stepLabels.map((name, i) => {
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

        {/* ── Paso 1: tu auto ─────────────────────────────────── */}
        {step === 1 ? (
          <form onSubmit={goToService}>
            <fieldset>
              <legend className="wm-kicker mb-4">1 · {stepLabels[0]}</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {options.map((o) => (
                  <label
                    key={o.id}
                    className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                      sizeId === o.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={o.id}
                      checked={sizeId === o.id}
                      onChange={() => setSizeId(o.id)}
                      className="sr-only"
                    />
                    <span className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                      <span className="wm-display text-lg leading-tight">{o.title}</span>
                      {o.badge ? <span className="wm-chip">{o.badge}</span> : null}
                    </span>
                    {o.kicker ? (
                      <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-muted">
                        {o.kicker}
                      </span>
                    ) : null}
                    <span className="mt-2 block text-sm text-muted">{o.body}</span>
                    {o.price ? (
                      <span className="mt-3 block text-sm font-semibold text-accent">
                        {o.price.amount}
                        <span className="ml-1 font-normal text-muted">desde</span>
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-6 rounded-wm border border-line p-4 text-sm text-muted">
              El precio final depende del tamaño y del nivel de lavado. En el
              próximo paso lo ves antes de confirmar, con la seña calculada.
            </p>

            <button type="submit" className="wm-btn mt-8 w-full">
              Elegir el lavado
            </button>
          </form>
        ) : null}

        {/* ── Paso 2: lavado y extras ─────────────────────────── */}
        {step === 2 ? (
          <div>
            <p className="wm-kicker mb-4">2 · {stepLabels[1] ?? "Lavado y extras"}</p>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Nivel de lavado</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {servicios.map((s) => (
                  <label
                    key={s.id}
                    className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                      serviceId === s.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={s.id}
                      checked={serviceId === s.id}
                      onChange={() => setServiceId(s.id)}
                      className="sr-only"
                    />
                    <span className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                      <span className="wm-display text-lg leading-tight">{s.title}</span>
                      {s.badge ? <span className="wm-chip">{s.badge}</span> : null}
                    </span>
                    <span className="mt-2 block text-sm text-muted">{s.body}</span>
                    <span className="mt-3 block text-sm font-semibold text-accent">
                      {formatPrice(precios[s.id]?.[sizeId] ?? 0)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="mb-3 text-sm font-semibold">Extras (opcionales)</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {addons.map((a) => {
                  const on = addonIds.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-wm border p-4 transition-colors ${
                        on ? "border-accent bg-soft" : "border-line hover:border-accent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleAddon(a.id)}
                        className="mt-1 h-4 w-4 accent-[var(--wm-accent)]"
                      />
                      <span className="flex-1">
                        <span className="block font-semibold">{a.title}</span>
                        <span className="mt-1 block text-sm text-muted">{a.body}</span>
                        <span className="mt-2 block text-sm font-semibold text-accent">
                          {a.price?.amount}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex items-baseline justify-between gap-4 rounded-wm border border-accent px-5 py-4">
              <span className="text-xs uppercase tracking-[0.14em] text-muted">Total del lavado</span>
              <span className="wm-display text-3xl text-accent">{formatPrice(total)}</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="wm-btn w-full sm:w-auto">
                Volver
              </button>
              <button type="button" onClick={goToSlot} className="wm-btn w-full sm:w-auto">
                Elegir el turno
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Paso 3: turno y sena ────────────────────────────── */}
        {step === 3 ? (
          <form onSubmit={confirm}>
            <p className="wm-kicker mb-4">3 · {stepLabels[2] ?? "Turno y seña"}</p>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Elegí el turno</legend>
              <ul className="grid gap-3 sm:grid-cols-2">
                {slots.map((s) => {
                  const selected = slotId === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSlotId(s.id)}
                        className={`flex w-full items-center justify-between gap-4 rounded-wm border px-4 py-3 text-left transition-colors ${
                          selected ? "border-accent bg-soft" : "border-line hover:border-accent"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-semibold">{s.day}</span>
                          <span className="wm-display block text-xl">{s.time}</span>
                        </span>
                        <span className={`text-xs ${s.places <= 3 ? "text-accent" : "text-muted"}`}>
                          {s.places <= 3 ? `Quedan ${s.places}` : `${s.places} libres`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="mb-3 text-sm font-semibold">Tus datos</legend>
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
                <label className="block text-sm">
                  <span className="text-muted">Patente del auto</span>
                  <input
                    required
                    value={form.plate}
                    onChange={set("plate")}
                    placeholder="AB 123 CD"
                    className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                  />
                </label>
                <label className="block text-sm">
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

            <div className="mt-8 grid gap-3 rounded-wm border border-line p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">Total</p>
                <p className="wm-display mt-1 text-xl">{formatPrice(total)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  Seña ({Math.round(sena * 100)}%)
                </p>
                <p className="wm-display mt-1 text-xl text-accent">{formatPrice(deposit)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">A pagar al retirar</p>
                <p className="wm-display mt-1 text-xl">{formatPrice(total - deposit)}</p>
              </div>
              <p className="text-xs text-muted sm:col-span-3">
                La seña se descuenta del total. Precios finales con impuestos
                incluidos.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(2)} className="wm-btn w-full sm:w-auto">
                Volver
              </button>
              <button type="submit" className="wm-btn w-full sm:w-auto">
                Confirmar y ver mi pase
              </button>
            </div>
          </form>
        ) : null}

        {/* ── Paso 4: el pase ─────────────────────────────────── */}
        {step === 4 && size && service && slot ? (
          <div className="text-center">
            <p className="wm-display text-4xl">Listo</p>
            <p className="mt-3 text-muted">
              Turno reservado. Presentá este pase en la recepción y tomá el
              café mientras lavan el auto.
            </p>

            <div className="mt-8">
              <Ticket
                brand={brand}
                title={stepLabels[3] ?? "Pase de lavado"}
                subtitle={`${size.title} · ${service.title}`}
                code={code}
                stamp="RESERVADO"
                rows={[
                  { label: "Nombre", value: form.name },
                  { label: "Telefono", value: form.phone },
                  { label: "Patente", value: form.plate },
                  { label: "Auto", value: size.title },
                  { label: "Servicio", value: service.title },
                  {
                    label: "Extras",
                    value: chosenAddons.length ? chosenAddons.map((a) => a.title).join(", ") : "Ninguno",
                  },
                  { label: "Turno", value: `${slot.day} ${slot.time}` },
                  { label: "Total", value: formatPrice(total) },
                  { label: "Sena", value: formatPrice(deposit) },
                ]}
                note={`Entrega estimada: ${service.meta?.find((m) => m.label === "Duración")?.value ?? "45 min"}. Cafe de cortesia en la barra.`}
                demoNotice={demoNotice}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={whatsappHref} className="wm-btn">
                Mandar por WhatsApp
              </a>
              <button type="button" onClick={reset} className="wm-btn wm-btn--ghost">
                Reservar otro lavado
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Resumen: TODO el estado visible ───────────────────── */}
      <aside className="wm-card h-fit">
        <p className="wm-kicker">Resumen de la simulación</p>
        <dl className="mt-5 grid gap-3 text-sm">
          {[
            ["Estado", step === 4 ? "Reservado (demo)" : `Paso ${step} de 4`],
            ["Auto", size?.title ?? "-"],
            ["Lavado", service?.title ?? "-"],
            ["Extras", chosenAddons.length ? chosenAddons.length : "Ninguno"],
            ["Nombre", form.name || "-"],
            ["Teléfono", form.phone || "-"],
            ["Patente", form.plate || "-"],
            ["Turno", slot ? `${slot.day} ${slot.time}` : "-"],
            ["Total", formatPrice(total)],
            ["Seña", formatPrice(deposit)],
            ["Código", step === 4 ? code : "-"],
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
          producción se conecta a un backend y se manda el pase por email y
          WhatsApp.
        </p>
      </aside>
    </div>
  );
}
