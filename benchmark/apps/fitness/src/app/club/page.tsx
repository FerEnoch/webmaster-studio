import { Amenities, Sedes, Tour } from "@/components/Club";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "El club — NÚCLEO" };

export default function ClubPage() {
  return (
    <main>
      <PageHero kicker="El club" title={["Entrá.", "Recorrelo."]} text="Siete zonas pensadas para que cada entrenamiento se sienta mejor que el anterior. Scrolleá para recorrer la sede Palermo." />
      <Tour />
      <Amenities />
      <Sedes />
    </main>
  );
}
