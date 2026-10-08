import { Header, Loader } from "@/components/Chrome";
import { Hero, Story, Ticker } from "@/components/Hero";
import { Closing, Electric, Finance, Reel, TestDrive } from "@/components/More";
import Showcase from "@/components/Showcase";
import Stock from "@/components/Stock";

export default function Page() {
  return (
    <>
      <Loader />
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Story />
        <Showcase />
        <Stock />
        <Reel />
        <Finance />
        <Electric />
        <TestDrive />
      </main>
      <Closing />
    </>
  );
}
