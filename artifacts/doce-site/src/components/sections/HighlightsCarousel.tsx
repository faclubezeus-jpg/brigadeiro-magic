import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Highlight } from "@workspace/api-client-react";

interface HighlightsCarouselProps {
  highlights: Highlight[];
}

const PLACEHOLDER_HIGHLIGHTS = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80", caption: "Brigadeiros Gourmet", sortOrder: 0, visible: true },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", caption: "Trufas Artesanais", sortOrder: 1, visible: true },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&q=80", caption: "Caixas Especiais", sortOrder: 2, visible: true },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&q=80", caption: "Kits Presenteáveis", sortOrder: 3, visible: true },
];

export function HighlightsCarousel({ highlights }: HighlightsCarouselProps) {
  const items = highlights.filter(h => h.visible).length > 0 ? highlights.filter(h => h.visible) : PLACEHOLDER_HIGHLIGHTS;
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, 3500);
  };

  useEffect(() => {
    startAutoplay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [items.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startAutoplay();
  };

  return (
    <section id="destaques" className="py-20 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-medium tracking-widest uppercase">Novidades</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2">Galeria de Destaques</h2>
      </motion.div>

      <div className="relative max-w-5xl mx-auto">
        <div className="relative h-[400px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === current ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              <img
                src={item.imageUrl}
                alt={item.caption ?? `Destaque ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {item.caption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: i === current ? 1 : 0, y: i === current ? 0 : 20 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-8 left-8 right-8"
                >
                  <p className="font-serif text-2xl md:text-3xl font-bold text-white text-glow">{item.caption}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => goTo((current - 1 + items.length) % items.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-heavy flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
        >
          &#8592;
        </button>
        <button
          onClick={() => goTo((current + 1) % items.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-heavy flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
        >
          &#8594;
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-primary/30 hover:bg-primary/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
