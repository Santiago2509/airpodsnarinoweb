import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Showcase from "@/components/home/Showcase";
import Story from "@/components/home/Story";
import Featured from "@/components/home/Featured";
import HowToBuy from "@/components/home/HowToBuy";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Showcase />
      <Story />
      <Featured />
      <HowToBuy />
      <FinalCta />
    </main>
  );
}
