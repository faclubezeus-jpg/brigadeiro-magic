import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useGetSettings, useGetHighlights, useGetSweets, useGetCakes, useGetKits, useGetTestimonials } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightsCarousel } from "@/components/sections/HighlightsCarousel";
import { SweetsGrid } from "@/components/sections/SweetsGrid";
import { CakesSlider } from "@/components/sections/CakesSlider";
import { KitsGrid } from "@/components/sections/KitsGrid";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const { data: settings } = useGetSettings();
  const { data: highlights } = useGetHighlights();
  const { data: sweets } = useGetSweets();
  const { data: cakes } = useGetCakes();
  const { data: kits } = useGetKits();
  const { data: testimonials } = useGetTestimonials();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar settings={settings} />
      <HeroSection settings={settings} />
      <HighlightsCarousel highlights={highlights ?? []} />
      <SweetsGrid sweets={sweets ?? []} />
      <CakesSlider cakes={cakes ?? []} />
      <KitsGrid kits={kits ?? []} />
      <AboutSection settings={settings} />
      <TestimonialsCarousel testimonials={testimonials ?? []} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </div>
  );
}
