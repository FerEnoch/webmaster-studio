import Dental from "@/components/Dental";
import HeroMorph from "@/components/HeroMorph";
import Laser from "@/components/Laser";
import Physio from "@/components/Physio";
import { Faq, Location, Team, Trust } from "@/components/Team";
import { BodyMap, Quiz } from "@/components/Treatments";

export default function Page() {
  return (
    <main>
      <HeroMorph />
      <Quiz />
      <BodyMap />
      <Dental />
      <Laser />
      <Physio />
      <Team />
      <Trust />
      <Faq />
      <Location />
    </main>
  );
}
