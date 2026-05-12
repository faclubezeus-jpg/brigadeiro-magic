import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cake } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";

interface CakesSliderProps {
  cakes: Cake[];
}

const PLACEHOLDER_CAKES: Cake[] = [
  { id: 1, name: "Bolo de Brigadeiro", description: null, imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80", sortOrder: 0, visible: true },
  { id: 2, name: "Bolo Naked Cake", description: null, imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80", sortOrder: 1, visible: true },
  { id: 3, name: "Bolo de Morango", description: null, imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80", sortOrder: 2, visible: true },
  { id: 4, name: "Bolo Elegante", description: null, imageUrl: "https://images.unsplash.com/photo-1551879400-111a9087cd86?w=400&q=80", sortOrder: 3, visible: true },
  { id: 5, name: "Bolo de Veludo", description: null, imageUrl: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=80", sortOrder: 4, visible: true },
];

function isVideo(url: string | null | undefined) {
  return url?.match(/\.(mp4|mov|webm|ogg)(\?|$)/i);
}

export function CakesSlider({ cakes }: CakesSliderProps) {
  const items = cakes.filter(c => c.visible).length > 0 ? cakes.filter(c => c.visible) : PLACEHOLDER_CAKES;
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let animFrame: number;
    let pos = track.scrollLeft;

    const animate = () => {
      if (!isDragging) {
        pos += 0.5;
        if (pos >= track.scrollWidth / 2) pos = 0;
        track.scrollLeft = pos;
      }
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isDragging]);

  return (
    <section id="bolos" className="py-16 md:py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10 px-4"
      >
        <span className="text-primary text-sm font-medium tracking-widest uppercase">Criações</span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-2">Galeria de Bolos</h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">Bolos artesanais para celebrar cada momento especial</p>
      </motion.div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-hidden px-4 select-none"
        style={{ scrollBehavior: "auto" }}
        onMouseDown={(e) => {
          setIsDragging(true);
          setStartX(e.pageX - (trackRef.current?.offsetLeft ?? 0));
          setScrollLeft(trackRef.current?.scrollLeft ?? 0);
        }}
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={(e) => {
          if (!isDragging || !trackRef.current) return;
          const x = e.pageX - (trackRef.current.offsetLeft ?? 0);
          const walk = (x - startX) * 2;
          trackRef.current.scrollLeft = scrollLeft - walk;
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          setStartX(e.touches[0].pageX);
          setScrollLeft(trackRef.current?.scrollLeft ?? 0);
        }}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={(e) => {
          if (!isDragging || !trackRef.current) return;
          const walk = (e.touches[0].pageX - startX) * 1.5;
          trackRef.current.scrollLeft = scrollLeft - walk;
        }}
      >
        {[...items, ...items].map((cake, i) => (
          <div
            key={`${cake.id}-${i}`}
            data-testid={`card-cake-${cake.id}`}
            className="flex-shrink-0 w-56 sm:w-64 md:w-72 rounded-2xl overflow-hidden shadow-lg border border-border bg-card group"
          >
            <div className="h-56 sm:h-64 md:h-72 overflow-hidden relative">
              {isVideo(cake.imageUrl) ? (
                <video
                  src={cake.imageUrl ?? ""}
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
              ) : (
                <img
                  src={cake.imageUrl ?? "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"}
                  alt={cake.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-base font-bold text-foreground">{cake.name}</h3>
              {cake.description && <p className="text-muted-foreground text-xs mt-1">{cake.description}</p>}
              <button
                onClick={() => addItem({ id: cake.id, type: "cake", name: cake.name, imageUrl: cake.imageUrl })}
                className="mt-3 w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                data-testid={`btn-add-cake-${cake.id}`}
              >
                + Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
