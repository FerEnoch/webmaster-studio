import { PageHero } from "@/components/PageHero";
import { DisciplineDetails, Schedule } from "@/components/Pages";

export const metadata = { title: "Clases — NÚCLEO" };

export default function ClasesPage() {
  return (
    <main>
      <PageHero kicker="Grilla semanal" title={["Elegí tu", "horario."]} text="64 clases por semana en 3 sedes. Reservá en un toque, sin crear cuenta. Tu primera clase es gratis." />
      <Schedule />
      <DisciplineDetails />
    </main>
  );
}
