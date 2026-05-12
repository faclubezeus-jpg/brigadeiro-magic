import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Testimonial } from "@workspace/api-client-react";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const PLACEHOLDER_TESTIMONIALS = [
  { id: 1, name: "Ana Carolina", text: "Os brigadeiros mais deliciosos que já provei! Encomendei para o casamento da minha filha e todo mundo adorou. Voltarei sempre!", photoUrl: null, sortOrder: 0, visible: true },
  { id: 2, name: "Mariana Santos", text: "Qualidade impecável e atendimento maravilhoso. As caixinhas são lindas e os sabores são surpreendentes. Recomendo demais!", photoUrl: null, sortOrder: 1, visible: true },
  { id: 3, name: "Beatriz Lima", text: "Encomendei o kit corporativo para nossa empresa e foi um sucesso absoluto. Todos os funcionários elogiaram muito.", photoUrl: null, sortOrder: 2, visible: true },
  { id: 4, name: "Carla Mendes", text: "A melhor confeitaria artesanal da cidade! O brigadeiro de pistache é simplesmente divino. Não consigo parar de pedir!", photoUrl: null, sortOrder: 3, visible: true },
];

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const items = testimonials.filter(t => t.visible).length > 0 ? testimonials.filter(t => t.visible) : PLACEHOLDER_TESTIMONIALS;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section id="depoimentos" className="py-20 px-6 bg-secondary/20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-widest uppercase">Amor Recebido</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2">Depoimentos</h2>
      </motion.div>

      <div className="max-w-3xl mx-auto relative min-h-[240px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-8 md:p-10 shadow-xl border border-border text-center w-full"
          >
            <div className="text-4xl text-primary mb-6">"</div>
            <p className="text-foreground/80 text-lg md:text-xl leading-relaxed italic font-serif mb-8">
              {items[current].text}
            </p>
            <div className="flex items-center justify-center gap-3">
              {items[current].photoUrl ? (
                <img
                  src={items[current].photoUrl ?? ""}
                  alt={items[current].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {items[current].name[0]}
                </div>
              )}
              <div className="text-left">
                <div className="font-semibold text-foreground">{items[current].name}</div>
                <div className="text-primary text-sm">★★★★★</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-primary/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
