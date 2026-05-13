import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SiteSettings } from "@workspace/api-client-react";

interface AboutSectionProps {
  settings?: SiteSettings;
}

export function AboutSection({ settings }: AboutSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const aboutTitle = settings?.aboutTitle ?? "Sobre Nós";
  const aboutText = settings?.aboutText ?? "A Docinho & Cia nasceu de uma paixão: transformar ingredientes simples em experiências extraordinárias. Cada brigadeiro que sai da nossa cozinha carrega horas de dedicação, ingredientes cuidadosamente selecionados e, acima de tudo, muito amor.\n\nNossa confeitaria é mais do que uma loja — é um ateliê de sonhos. Cada pedido é uma oportunidade de fazer parte de um momento especial na vida de alguém: um aniversário, um casamento, uma declaração de amor.\n\nTrabalhamos com cacau de origem, frutas frescas e coberturas premium para garantir que cada mordida seja uma experiência única. Porque você merece o melhor.";
  const aboutMediaUrl = settings?.aboutMediaUrl ?? "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80";

  const isVideo = aboutMediaUrl.match(/\.(mp4|mov|webm|ogg)(\?|$)/i);

  const paragraphs = aboutText.split("\n").filter(p => p.trim() !== "");

  return (
    <section id="sobre" ref={ref} className="py-20 px-6 bg-gradient-to-br from-secondary/30 to-accent/20">
      <div className="max-w-7xl mx-auto">
        {/* Toggle button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">Nossa História</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">{aboutTitle}</h2>
        </motion.div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-4">
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              {paragraphs.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="text-foreground/80 leading-relaxed mb-5 text-base md:text-lg"
                >
                  {text}
                </motion.p>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-6 mt-8"
              >
                {[
                  { num: settings?.aboutStat1Number ?? "500+", label: settings?.aboutStat1Label ?? "Pedidos por mês" },
                  { num: settings?.aboutStat2Number ?? "50+", label: settings?.aboutStat2Label ?? "Sabores exclusivos" },
                  { num: settings?.aboutStat3Number ?? "5★", label: settings?.aboutStat3Label ?? "Avaliação média" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-serif text-3xl font-bold text-primary">{stat.num}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Photo / Video */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{ y: photoY }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                {isVideo ? (
                  <video
                    src={aboutMediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={aboutMediaUrl}
                    alt="Sobre nós"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>

                  {/* Floating badge */}
                  <motion.div
                    animate={{ rotate: [-3, 3, -3], y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-4 -right-4 bg-card border border-border rounded-2xl p-4 shadow-xl"
                  >
                    <div className="text-2xl text-center mb-1">🍫</div>
                    <div className="font-serif text-sm font-bold text-foreground text-center">Feito com</div>
                    <div className="font-serif text-xs text-primary text-center">muito amor</div>
                  </motion.div>
                </motion.div>
              </div>
        </div>
      </div>
    </section>
  );
}
