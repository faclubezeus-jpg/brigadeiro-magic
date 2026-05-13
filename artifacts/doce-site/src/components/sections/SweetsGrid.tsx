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
  const visibleSweets = sweets.filter(s => s.visible);
  const items = visibleSweets.length > 0 ? visibleSweets : PLACEHOLDER_SWEETS;
  const { addItem } = useCart();

  return (
    <section id="docinhos" className="py-16 md:py-24 px-4 md:px-6" style={{ background: "hsl(40 38% 92%)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#D0A77B" }}>
          Cardápio
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mt-2" style={{ color: "#725C3F" }}>
          Nossos Docinhos
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm md:text-base" style={{ color: "#9b8068" }}>
          Cada docinho é uma obra de arte feita com ingredientes premium e muito amor
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto"
      >
        {items.map((sweet) => (
          <motion.div
            key={sweet.id}
            data-testid={`card-sweet-${sweet.id}`}
            variants={item}
            whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(208,167,123,0.30)" }}
            className="rounded-2xl overflow-hidden shadow-md border group transition-all duration-300 flex flex-col"
            style={{ background: "#FFF8F0", borderColor: "rgba(208,167,123,0.25)" }}
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
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold shadow-md"
                  style={{ background: "#E5ADA8", color: "#fff" }}>
                  {sweet.price}
                </div>
              )}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h3 className="font-serif text-sm font-bold leading-tight" style={{ color: "#725C3F" }}>
                {sweet.name}
              </h3>
              {sweet.description && (
                <p className="text-xs mt-1 leading-relaxed line-clamp-2 flex-1" style={{ color: "#9b8068" }}>
                  {sweet.description}
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addItem({ id: sweet.id, type: "sweet", name: sweet.name, price: sweet.price, imageUrl: sweet.imageUrl })}
                className="mt-2.5 w-full py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "rgba(208,167,123,0.15)", color: "#D0A77B" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#D0A77B"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(208,167,123,0.15)"; (e.currentTarget as HTMLElement).style.color = "#D0A77B"; }}
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
