import { PageHero } from "@/components/PageHero";
import { Team, Values } from "@/components/Pages";

export const metadata = { title: "Equipo — MANADA" };

export default function EquipoPage() {
  return (
    <main>
      <PageHero kicker="El equipo" title={["Seis especialistas,", "una misma manada."]} text="Cada uno en lo suyo y todos con el mismo trato. Pasá el mouse para verlos trabajar; tocá para conocerlos." />
      <Team />
      <Values />
    </main>
  );
}
