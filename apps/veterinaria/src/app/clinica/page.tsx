import { PageHero } from "@/components/PageHero";
import { Sedes, Separated, Tour } from "@/components/Pages";

export const metadata = { title: "La clínica — MANADA" };

export default function ClinicaPage() {
  return (
    <main>
      <PageHero kicker="La clínica" title={["Pasá,", "estás en casa."]} text="620 m² en Belgrano pensados para que tu mascota llegue, espere y se atienda tranquila. Scrolleá y recorrela sala por sala." />
      <Tour />
      <Separated />
      <Sedes />
    </main>
  );
}
