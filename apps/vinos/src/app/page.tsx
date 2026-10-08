import { Climb, ClubTeaser, FinalCta, Hero, Selection, Sommelier, TripsTeaser, Varietals, VineCalendar, Voices } from "@/components/Home";

export default function Home() {
  return (
    <main>
      <Hero />
      <Varietals />
      <Climb />
      <Selection />
      <Sommelier />
      <TripsTeaser />
      <VineCalendar />
      <ClubTeaser />
      <Voices />
      <FinalCta />
    </main>
  );
}
