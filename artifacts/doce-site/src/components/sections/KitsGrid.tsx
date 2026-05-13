import { motion } from "framer-motion";
import { Kit } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";

interface KitsGridProps {
  kits: Kit[];
}

const PLACEHOLDER_KITS: Kit[] = [
  { id: 1, name: "Kit Romântico", description: "12 brigadeiros gourmet + caixinha especial", price: "R$ 89,90", imageUrl: "https://images.unsplash.com/photo-1611329695518-1763fc1fd8c4?w=400&q=80", sortOrder: 0, visible: true },
  { id: 2, name: "Kit Festa", description: "50 unidades sortidas para sua celebração", price: "R$ 290,00", imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80", sortOrder: 1, visible: true },
  { id: 3, name: "Kit Corporativo", description: "100 unidades com embalagem personalizada", price: "Sob consulta", imageUrl: "https://images.unsplash.com/photo-1577308808467-f94f9e90882b?w=400&q=80", sortOrder: 2, visible: true },
  { id: 4, name: "Kit Degustação", description: "Experimente 6 sabores exclusivos", price: "R$ 45,00", imageUrl: "https://images.unsplash.com/photo-1575377522891-2bdd8d0ac8d0?w=400&q=80", sortOrder: 3, visible: true },
];

function isVideo(url: string | null | undefined) {
  return url?.match(/\.(mp4|mov|webm|ogg)(\?|$)/i);
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export function KitsGrid({ kits }: KitsGridProps) {
  const visibleKits = Array.isArray(kits) ? kits.filter(k => k.visible) : [];
  const items = visibleKits.length > 0 ? visibleKits : PLACEHOLDER_KITS;
  const { addItem } = useCart();

  return (
    <section id="kits" className="py-16 md:py-20 px-4 md:px-6 holographic-bg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-medium tracking-widest uppercase">Presentes</span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-2">Kits & Combos</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm md:text-base">Caixinhas irresistíveis para presentear com estilo e amor</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto"
      >
        {items.map((kit) => (
          <motion.div
            key={kit.id}
            data-testid={`card-kit-${kit.id}`}
            variants={card}
            whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(255,182,193,0.35)" }}
            className="bg-card/80 backdrop-blur-md rounded-3xl overflow-hidden border border-border shadow-md group transition-all duration-300 flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              {isVideo(kit.imageUrl) ? (
                <video
                  src={kit.imageUrl ?? ""}
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <img
                  src={kit.imageUrl ?? "https://images.unsplash.com/photo-1611329695518-1763fc1fd8c4?w=400&q=80"}
                  alt={kit.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              {kit.price && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {kit.price}
                </div>
              )}
            </div>
            <div className="p-4 md:p-5 flex flex-col flex-1">
              <h3 className="font-serif text-lg font-bold text-foreground mb-1">{kit.name}</h3>
              {kit.description && (
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{kit.description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <motion.button
                  onClick={() => addItem({ id: kit.id, type: "kit", name: kit.name, price: kit.price, imageUrl: kit.imageUrl })}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all"
                  data-testid={`btn-add-kit-${kit.id}`}
                >
                  + Carrinho
                </motion.button>
                <motion.a
                  href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Tenho interesse no ${kit.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  className="px-3 py-2.5 rounded-xl border border-green-300 text-green-600 hover:bg-green-50 transition-all text-sm flex items-center"
                  title="WhatsApp direto"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
