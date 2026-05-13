import { motion } from "framer-motion";
import { Sweet } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";

interface SweetsGridProps {
  sweets: Sweet[];
}

const PLACEHOLDER_SWEETS: Sweet[] = [
  { id: 1, name: "Brigadeiro de Coco", description: "Coco ralado com toque de chocolate belga", price: "R$ 5,00", imageUrl: "/products/brigadeiro-coco.jpg", sortOrder: 0, visible: true },
  { id: 2, name: "Brigadeiro de Amendoim", description: "Amendoim torrado crocante com brigadeiro", price: "R$ 5,00", imageUrl: "/products/brigadeiro-amendoim.jpg", sortOrder: 1, visible: true },
  { id: 3, name: "Mix de Sabores", description: "Sortido com os nossos melhores sabores", price: "A partir de R$ 5,00", imageUrl: "/products/brigadeiros-sortidos.jpg", sortOrder: 2, visible: true },
];

function isVideo(url: string | null | undefined) {
  return url?.match(/\.(mp4|mov|webm|ogg)(\?|$)/i);
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function SweetsGrid({ sweets }: SweetsGridProps) {
  const visibleSweets = Array.isArray(sweets) ? sweets.filter(s => s.visible) : [];
  const items = visibleSweets.length > 0 ? visibleSweets : PLACEHOLDER_SWEETS;
  const { addItem } = useCart();

  return (
    <section id="docinhos" className="py-16 md:py-24 px-4 md:px-6 bg-background relative">
      {/* Subtle decorative background glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(235,179,185,0.05)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12 relative z-10"
      >
        <span className="text-sm font-semibold tracking-widest uppercase text-accent">
          Cardápio
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mt-2 text-foreground">
          Nossos Docinhos
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm md:text-base text-muted-foreground">
          Cada docinho é uma obra de arte feita com ingredientes premium e muito amor
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto relative z-10"
      >
        {items.map((sweet) => (
          <motion.div
            key={sweet.id}
            data-testid={`card-sweet-${sweet.id}`}
            variants={item}
            whileHover={{ y: -6 }}
            className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border group transition-all duration-300 flex flex-col bg-card"
          >
            <div className="aspect-square overflow-hidden relative">
              {isVideo(sweet.imageUrl) ? (
                <video src={sweet.imageUrl ?? ""} autoPlay muted loop playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <img src={sweet.imageUrl ?? "/products/brigadeiro-coco.jpg"} alt={sweet.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              )}
              {sweet.price && (
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold shadow-md bg-primary text-primary-foreground">
                  {sweet.price}
                </div>
              )}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h3 className="font-serif text-sm font-bold leading-tight text-foreground">
                {sweet.name}
              </h3>
              {sweet.description && (
                <p className="text-xs mt-1 leading-relaxed line-clamp-2 flex-1 text-muted-foreground">
                  {sweet.description}
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addItem({ id: sweet.id, type: "sweet", name: sweet.name, price: sweet.price, imageUrl: sweet.imageUrl })}
                className="mt-2.5 w-full py-2 rounded-xl text-xs font-semibold transition-all bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground"
                data-testid={`btn-add-sweet-${sweet.id}`}
              >
                + Carrinho
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
