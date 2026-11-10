import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import BrandAxel from "@/components/home/BrandAxel";
import Categories from "@/components/home/Categories";
import Showcase from "@/components/home/Showcase";
import Featured from "@/components/home/Featured";
import HowToBuy from "@/components/home/HowToBuy";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <BrandAxel />
      <Categories />
      <Showcase />
      <Featured />
      <HowToBuy />
      <FinalCta />
    </main>
  );
}
