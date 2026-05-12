import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Highlight } from "@workspace/api-client-react";

interface HighlightsCarouselProps {
  highlights: Highlight[];
}

const PLACEHOLDER_HIGHLIGHTS: Highlight[] = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80", caption: "Brigadeiros Gourmet", sortOrder: 0, visible: true },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", caption: "Trufas Artesanais", sortOrder: 1, visible: true },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&q=80", caption: "Caixas Especiais", sortOrder: 2, visible: true },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&q=80", caption: "Kits Presenteáveis", sortOrder: 3, visible: true },
];

function isVideo(url: string | null | undefined) {
  return url?.match(/\.(mp4|mov|webm|ogg)(\?|$)/i);
}

export function HighlightsCarousel({ highlights }: HighlightsCarouselProps) {
  const items = highlights.filter(h => h.visible).length > 0 ? highlights.filter(h => h.visible) : PLACEHOLDER_HIGHLIGHTS;
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, 4000);
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
    <section id="destaques" className="py-16 md:py-20 px-4 md:px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <span className="text-primary text-sm font-medium tracking-widest uppercase">Novidades</span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-2">Galeria de Destaques</h2>
      </motion.div>

      <div className="relative max-w-5xl mx-auto">
        <div className="relative h-[280px] sm:h-[380px] md:h-[520px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === current ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {isVideo(item.imageUrl) ? (
                <video
                  src={item.imageUrl}
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? `Destaque ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {item.caption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: i === current ? 1 : 0, y: i === current ? 0 : 20 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-5 md:bottom-8 left-4 md:left-8 right-4 md:right-8"
                >
                  <p className="font-serif text-xl md:text-3xl font-bold text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                    {item.caption}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => goTo((current - 1 + items.length) % items.length)}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full glass-heavy flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
          aria-label="Anterior"
        >
          &#8592;
        </button>
        <button
          onClick={() => goTo((current + 1) % items.length)}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full glass-heavy flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
          aria-label="Próximo"
        >
          &#8594;
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-primary/30 hover:bg-primary/60"
              }`}
              aria-label={`Ir para destaque ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
