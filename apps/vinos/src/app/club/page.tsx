import { PageHero } from "@/components/PageHero";
import { ClubPlans, Faq, HowItWorks } from "@/components/Pages";

export const metadata = { title: "Club de vinos — ALTURA" };

export default function ClubPage() {
  return (
    <main>
      <PageHero kicker="El Club" title={["Mendoza llega", "a tu casa, cada mes."]} text="Vinos de productores chicos, elegidos por nuestro sommelier, con fichas de cata y catas en vivo. Sin permanencia." />
      <ClubPlans />
      <HowItWorks />
      <Faq />
    </main>
  );
}
