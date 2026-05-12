import { motion } from "framer-motion";
import { Sweet } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";

interface SweetsGridProps {
  sweets: Sweet[];
}

const PLACEHOLDER_SWEETS: Sweet[] = [
  { id: 1, name: "Brigadeiro Tradicional", description: "O clássico irresistível de chocolate belga", imageUrl: "https://images.unsplash.com/photo-1589010588553-46e8e7c21788?w=400&q=80", sortOrder: 0, visible: true },
  { id: 2, name: "Brigadeiro de Pistache", description: "Cremoso com pistache importado", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80", sortOrder: 1, visible: true },
  { id: 3, name: "Trufa de Limão Siciliano", description: "Refrescante e sofisticado", imageUrl: "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&q=80", sortOrder: 2, visible: true },
  { id: 4, name: "Brigadeiro de Maracujá", description: "Tropical e delicioso", imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80", sortOrder: 3, visible: true },
  { id: 5, name: "Trufa de Morango", description: "Com frutas frescas selecionadas", imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80", sortOrder: 4, visible: true },
  { id: 6, name: "Brigadeiro de Café", description: "Para os amantes de café especial", imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80", sortOrder: 5, visible: true },
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
  const items = sweets.filter(s => s.visible).length > 0 ? sweets.filter(s => s.visible) : PLACEHOLDER_SWEETS;
  const { addItem } = useCart();

  return (
    <section id="docinhos" className="py-16 md:py-20 px-4 md:px-6 bg-secondary/20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-medium tracking-widest uppercase">Cardápio</span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-2">Nossos Docinhos</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm md:text-base">Cada docinho é uma obra de arte feita com ingredientes premium e muito amor</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5 max-w-7xl mx-auto"
      >
        {items.map((sweet) => (
          <motion.div
            key={sweet.id}
            data-testid={`card-sweet-${sweet.id}`}
            variants={item}
            whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(255,182,193,0.3)" }}
            className="bg-card rounded-2xl overflow-hidden shadow-md border border-border group transition-all duration-300"
          >
            <div className="aspect-square overflow-hidden relative">
              {isVideo(sweet.imageUrl) ? (
                <video
                  src={sweet.imageUrl ?? ""}
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <img
                  src={sweet.imageUrl ?? "https://images.unsplash.com/photo-1589010588553-46e8e7c21788?w=400&q=80"}
                  alt={sweet.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-3">
              <h3 className="font-serif text-sm font-bold text-foreground leading-tight">{sweet.name}</h3>
              {sweet.description && (
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2">{sweet.description}</p>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addItem({
                  id: sweet.id,
                  type: "sweet",
                  name: sweet.name,
                  imageUrl: sweet.imageUrl,
                })}
                className="mt-2.5 w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
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
