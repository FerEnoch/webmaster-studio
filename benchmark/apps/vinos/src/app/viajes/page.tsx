import { PageHero } from "@/components/PageHero";
import { Faq, TripsDetail } from "@/components/Pages";

export const metadata = { title: "Viajes por Mendoza — ALTURA" };

export default function ViajesPage() {
  return (
    <main>
      <PageHero kicker="Viajes" title={["Mendoza,", "copa por copa."]} text="Itinerarios hora a hora, con traslado desde tu hotel, guía sommelier y grupos chicos. Scrolleá el día y mirá la ruta en el mapa." />
      <TripsDetail />
      <Faq />
    </main>
  );
}
