import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cake } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";

interface CakesSliderProps {
  cakes: Cake[];
}

const PLACEHOLDER_CAKES: Cake[] = [
  { id: 1, name: "Torta de Brigadeiro", description: "Camadas generosas de brigadeiro artesanal", price: "R$ 89,90", imageUrl: "/products/torta-brigadeiro.jpg", sortOrder: 0, visible: true },
];

function isVideo(url: string | null | undefined) {
  return url?.match(/\.(mp4|mov|webm|ogg)(\?|$)/i);
}

export function CakesSlider({ cakes }: CakesSliderProps) {
  const visibleCakes = cakes.filter(c => c.visible);
  const items = visibleCakes.length > 0 ? visibleCakes : PLACEHOLDER_CAKES;
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length < 2) return;
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
  }, [isDragging, items.length]);

  const duplicated = items.length > 1 ? [...items, ...items] : items;

  return (
    <section id="bolos" className="py-16 md:py-24 overflow-hidden" style={{ background: "#EFE8D8" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10 px-4"
      >
        <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#D0A77B" }}>
          Criações
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mt-2" style={{ color: "#725C3F" }}>
          Galeria de Bolos
        </h2>
        <p className="mt-3 text-sm md:text-base" style={{ color: "#9b8068" }}>
          Bolos artesanais para celebrar cada momento especial
        </p>
      </motion.div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-hidden px-4 select-none"
        style={{ scrollBehavior: "auto" }}
        onMouseDown={e => { setIsDragging(true); setStartX(e.pageX - (trackRef.current?.offsetLeft ?? 0)); setScrollLeft(trackRef.current?.scrollLeft ?? 0); }}
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={e => {
          if (!isDragging || !trackRef.current) return;
          const walk = (e.pageX - (trackRef.current.offsetLeft ?? 0) - startX) * 2;
          trackRef.current.scrollLeft = scrollLeft - walk;
        }}
        onTouchStart={e => { setIsDragging(true); setStartX(e.touches[0].pageX); setScrollLeft(trackRef.current?.scrollLeft ?? 0); }}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={e => {
          if (!isDragging || !trackRef.current) return;
          trackRef.current.scrollLeft = scrollLeft - (e.touches[0].pageX - startX) * 1.5;
        }}
      >
        {duplicated.map((cake, i) => (
          <div
            key={`${cake.id}-${i}`}
            data-testid={i < items.length ? `card-cake-${cake.id}` : undefined}
            className="flex-shrink-0 w-64 sm:w-72 md:w-80 rounded-3xl overflow-hidden shadow-lg border group"
            style={{ background: "#FFF8F0", borderColor: "rgba(208,167,123,0.25)" }}
          >
            <div className="h-64 sm:h-72 md:h-80 overflow-hidden relative">
              {isVideo(cake.imageUrl) ? (
                <video src={cake.imageUrl ?? ""} autoPlay muted loop playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" draggable={false} />
              ) : (
                <img src={cake.imageUrl ?? "/products/torta-brigadeiro.jpg"} alt={cake.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" draggable={false} />
              )}
              {cake.price && (
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold shadow-md"
                  style={{ background: "#E5ADA8", color: "#fff" }}>
                  {cake.price}
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-serif text-lg font-bold" style={{ color: "#725C3F" }}>{cake.name}</h3>
              {cake.description && (
                <p className="text-sm mt-1" style={{ color: "#9b8068" }}>{cake.description}</p>
              )}
              <button
                onClick={() => addItem({ id: cake.id, type: "cake", name: cake.name, price: cake.price, imageUrl: cake.imageUrl })}
                className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(208,167,123,0.15)", color: "#D0A77B" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#D0A77B"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(208,167,123,0.15)"; (e.currentTarget as HTMLElement).style.color = "#D0A77B"; }}
                data-testid={i < items.length ? `btn-add-cake-${cake.id}` : undefined}
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
