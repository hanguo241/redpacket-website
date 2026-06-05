import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import HowItWorks from "@/components/sections/HowItWorks";
import PacketTypes from "@/components/sections/PacketTypes";
import UserStories from "@/components/sections/UserStories";
import ChainSupport from "@/components/sections/ChainSupport";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <HowItWorks />
      <PacketTypes />
      <UserStories />
      <ChainSupport />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
