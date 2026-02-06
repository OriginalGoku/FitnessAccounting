import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyDifferent from "@/components/WhyDifferent";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <WhyDifferent />
      <Services />
      <HowItWorks />
      <About />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
