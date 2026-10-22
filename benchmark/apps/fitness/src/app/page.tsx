import { ClubTeaser, CoachesTeaser, Crowd, Disciplines, FinalCta, FirstTime, Hero, Marquee, Stats, Testimonials } from "@/components/Home";

export default function Page() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Stats />
      <ClubTeaser />
      <FirstTime />
      <Disciplines />
      <Crowd />
      <CoachesTeaser />
      <Testimonials />
      <FinalCta />
    </main>
  );
}
