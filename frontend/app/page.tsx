import { Hero } from "@/components/sections/hero";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { TruCommSection } from "@/components/sections/trucomm-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us";
import { ClientTestimonialsSection } from "@/components/sections/client-testimonials";
import { StayUpdatedSection } from "@/components/sections/stay-updated-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <TechStackSection />
      <TruCommSection />
      <WhyChooseUsSection />
      <ClientTestimonialsSection />
      <StayUpdatedSection />
    </main>
  );
}
