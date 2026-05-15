import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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
  const { data: settings } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (error) throw error;
      return data;
    }
  });

  const { data: highlights } = useQuery({
    queryKey: ['highlights'],
    queryFn: async () => {
      const { data, error } = await supabase.from('highlights').select('*').eq('visible', true).order('sort_order');
      if (error) throw error;
      return data;
    }
  });

  const { data: sweets } = useQuery({
    queryKey: ['sweets'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sweets').select('*').eq('visible', true).order('sort_order');
      if (error) throw error;
      return data;
    }
  });

  const { data: cakes } = useQuery({
    queryKey: ['cakes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('cakes').select('*').eq('visible', true).order('sort_order');
      if (error) throw error;
      return data;
    }
  });

  const { data: kits } = useQuery({
    queryKey: ['kits'],
    queryFn: async () => {
      const { data, error } = await supabase.from('kits').select('*').eq('visible', true).order('sort_order');
      if (error) throw error;
      return data;
    }
  });

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').eq('visible', true);
      if (error) throw error;
      return data;
    }
  });

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
