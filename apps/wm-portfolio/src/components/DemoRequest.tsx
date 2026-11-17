/** Contacto y cotización del estudio: simulación local, sin backend. */
import { useState, type ChangeEvent } from "react";
import { waLink } from "@lib/whatsapp";
import type { CatalogItem } from "@lib/types";

export interface DemoRequestProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  options: CatalogItem[];
  demoNotice: string;
  studioWhatsapp: string;
}

type Form = {
  rubro: string;
  negocio: string;
  detalle: string;
  telefono: string;
  email: string;
};

const EMPTY: Form = { rubro: "", negocio: "", detalle: "", telefono: "", email: "" };

export default function DemoRequest({
  brand, title, kicker, body, options, demoNotice, studioWhatsapp,
}: DemoRequestProps) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const rubro = options.find((o) => o.id === form.rubro);
  const whatsappHref = waLink(
    studioWhatsapp,
    `Hola, quisiera consultar por un proyecto y solicitar una cotización a ${brand}.` +
      (form.negocio.trim() ? ` Organización: ${form.negocio.trim()}.` : "") +
      (rubro ? ` Industria: ${rubro.kicker ?? rubro.title}.` : "") +
      (form.detalle.trim() ? ` Proyecto: ${form.detalle.trim()}.` : "") +
      " También me interesa evaluar una demo rápida.",
  );

  const field = "mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="wm-card">
        {kicker ? <p className="wm-kicker">{kicker}</p> : null}
        <h3 className="wm-display mt-4 text-2xl leading-tight">{title}</h3>
        {body ? <p className="mt-3 text-sm text-muted">{body}</p> : null}
        <p className="mt-4 text-xs text-muted">{demoNotice}</p>

        {confirmed ? (
          <div className="mt-8" role="status">
            <h4 className="wm-display text-2xl">Resumen de consulta (simulación)</h4>
            <p className="mt-4 text-muted">
              No se envió la consulta ni se generó una cotización. Los datos se muestran
              únicamente en esta pantalla. No hay una solicitud en preparación.
            </p>
            <button
              type="button"
              className="wm-btn wm-btn--ghost mt-6"
              onClick={() => {
                setConfirmed(false);
                setError("");
              }}
            >
              Revisar datos
            </button>
          </div>
        ) : (
          <form
            className="mt-8 grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.negocio.trim()) {
                setError("Ingresá tu nombre o el de tu organización.");
                return;
              }
              if (!form.telefono.trim() && !form.email.trim()) {
                setError("Ingresá un teléfono o un email de contacto.");
                return;
              }
              setError("");
              setConfirmed(true);
            }}
          >
            <label className="block text-sm sm:col-span-2">
              <span className="text-muted">Tu nombre u organización</span>
              <input required value={form.negocio} onChange={set("negocio")} placeholder="Organización Sur" className={field} />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-muted">Industria (opcional)</span>
              <select value={form.rubro} onChange={set("rubro")} className={field}>
                <option value="">Otra industria / Por definir</option>
                {options.map((o) => <option key={o.id} value={o.id}>{o.kicker ?? o.title}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted">Teléfono</span>
              <input type="tel" value={form.telefono} onChange={set("telefono")} placeholder="11 1234 5678" className={field} />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Email</span>
              <input type="email" value={form.email} onChange={set("email")} placeholder="nombre@ejemplo.com" className={field} />
            </label>
            <p className="text-xs text-muted sm:col-span-2">Completá al menos un medio de contacto. Usá datos de ejemplo para esta simulación.</p>
            <label className="block text-sm sm:col-span-2">
              <span className="text-muted">¿Qué necesitás desarrollar? (opcional)</span>
              <textarea rows={4} value={form.detalle} onChange={set("detalle")} placeholder="Objetivos, funcionalidades o integraciones que necesitás" className={field} />
            </label>
            {error ? <p role="alert" className="text-sm text-accent sm:col-span-2">{error}</p> : null}
            <button type="submit" className="wm-btn mt-4 sm:col-span-2">Simular consulta de cotización</button>
          </form>
        )}
      </div>

      <aside className="wm-card h-fit">
        <p className="wm-kicker">Resumen de la simulación</p>
        <dl className="mt-5 grid gap-3 text-sm">
          {[
            ["Estado", confirmed ? "Consulta simulada, no enviada" : "Sin enviar"],
            ["Nombre u organización", form.negocio || "—"],
            ["Industria", rubro?.kicker ?? rubro?.title ?? "Por definir"],
            ["Teléfono", form.telefono || "—"],
            ["Email", form.email || "—"],
            ["Proyecto", form.detalle || "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
              <dd className="min-w-0 break-words text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-muted">
          Podemos preparar una demo rápida para explorar la propuesta. El alcance,
          el presupuesto y los plazos se acuerdan durante la consulta.
        </p>
        <a href={whatsappHref} className="wm-btn mt-6 w-full">Consultar por WhatsApp</a>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          {demoNotice} El enlace abre WhatsApp con un mensaje preparado; no lo envía automáticamente.
        </p>
      </aside>
    </div>
  );
}
