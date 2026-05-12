import { motion } from "framer-motion";
import { Kit } from "@workspace/api-client-react";

interface KitsGridProps {
  kits: Kit[];
}

const PLACEHOLDER_KITS = [
  { id: 1, name: "Kit Romântico", description: "12 brigadeiros gourmet + caixinha especial", price: "R$ 89,90", imageUrl: "https://images.unsplash.com/photo-1611329695518-1763fc1fd8c4?w=400&q=80", sortOrder: 0, visible: true },
  { id: 2, name: "Kit Festa", description: "50 unidades sortidas para sua celebração", price: "R$ 290,00", imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80", sortOrder: 1, visible: true },
  { id: 3, name: "Kit Corporativo", description: "100 unidades com embalagem personalizada", price: "Sob consulta", imageUrl: "https://images.unsplash.com/photo-1577308808467-f94f9e90882b?w=400&q=80", sortOrder: 2, visible: true },
  { id: 4, name: "Kit Degustação", description: "Experimente 6 sabores exclusivos", price: "R$ 45,00", imageUrl: "https://images.unsplash.com/photo-1575377522891-2bdd8d0ac8d0?w=400&q=80", sortOrder: 3, visible: true },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export function KitsGrid({ kits }: KitsGridProps) {
  const items = kits.filter(k => k.visible).length > 0 ? kits.filter(k => k.visible) : PLACEHOLDER_KITS;

  return (
    <section id="kits" className="py-20 px-6 holographic-bg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-widest uppercase">Presentes</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2">Kits & Combos</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Caixinhas irresistíveis para presentear com estilo e amor</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        {items.map((kit) => (
          <motion.div
            key={kit.id}
            data-testid={`card-kit-${kit.id}`}
            variants={card}
            whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(255,182,193,0.35)" }}
            className="bg-card/80 backdrop-blur-md rounded-3xl overflow-hidden border border-border shadow-md group transition-all duration-300"
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src={kit.imageUrl ?? "https://images.unsplash.com/photo-1611329695518-1763fc1fd8c4?w=400&q=80"}
                alt={kit.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {kit.price && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {kit.price}
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-serif text-lg font-bold text-foreground mb-1">{kit.name}</h3>
              {kit.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">{kit.description}</p>
              )}
              <motion.a
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Tenho interesse no ${kit.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="mt-4 block text-center py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Pedir Este Kit
              </motion.a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
