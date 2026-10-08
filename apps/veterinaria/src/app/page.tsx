import { Benefits, ClinicTeaser, FinalCta, HealthBook, Hero, Marquee, PlansTeaser, Reviews, ServicesGrid, SpeciesBand, TeamTeaser, Triage } from "@/components/Home";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Benefits />
      <Triage />
      <ClinicTeaser />
      <HealthBook />
      <SpeciesBand />
      <ServicesGrid />
      <PlansTeaser />
      <TeamTeaser />
      <Reviews />
      <FinalCta />
    </main>
  );
}
