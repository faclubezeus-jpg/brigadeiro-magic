import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SiteSettings } from "@workspace/api-client-react";

interface HeroSectionProps {
  settings?: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const heroVideoUrl = settings?.heroVideoUrl ?? "/videos/hero.mp4";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleWhatsApp = () => {
    const num = settings?.whatsappNumber ?? "5566992576565";
    const msg = settings?.whatsappMessage ?? "Olá! Vim pelo site e gostaria de fazer um pedido.";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section
      ref={ref}
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{ marginTop: 0 }}
    >
      {/* VIDEO — fills 100% from top to bottom */}
      <div className="absolute inset-0 z-0">
        <video
          key={heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>

        {/* Warm gradient overlay — keeps text readable */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(114,92,63,0.30) 0%,
              rgba(229,173,168,0.22) 40%,
              rgba(239,232,216,0.18) 70%,
              rgba(239,232,216,0.65) 100%
            )`,
          }}
        />

        {/* Mouse-reactive warm glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-150"
          style={{
            background: `radial-gradient(ellipse at ${50 + mousePos.x}% ${50 + mousePos.y}%,
              rgba(229,173,168,0.28) 0%,
              rgba(208,167,123,0.14) 45%,
              transparent 70%)`,
          }}
        />
      </div>

      {/* Floating sparkles — caramel tones */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute text-lg pointer-events-none z-10"
          style={{ left: `${(i * 13) % 100}%`, top: `${(i * 11.7) % 80}%` }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.3, 0.6], rotate: [0, 360] }}
          transition={{ duration: 3 + (i % 3), delay: i * 0.6, repeat: Infinity }}
        >
          {["✨", "⭐", "💫", "🌟"][i % 4]}
        </motion.div>
      ))}

      {/* Hero content — centered, with padding-top for navbar */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20"
      >
        {/* Logo or badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-5"
        >
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.shopName}
              className="h-20 md:h-28 mx-auto object-contain drop-shadow-xl mb-2"
            />
          ) : (
            <span
              className="inline-block px-5 py-2 rounded-full text-sm font-semibold tracking-wide border mb-4"
              style={{
                background: "rgba(239,232,216,0.70)",
                borderColor: "rgba(208,167,123,0.45)",
                color: "#725C3F",
                backdropFilter: "blur(10px)",
              }}
            >
              Confeitaria Artesanal Premium
            </span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-5"
          style={{
            color: "#EFE8D8",
            textShadow: "0 2px 24px rgba(114,92,63,0.55), 0 0 60px rgba(229,173,168,0.30)",
          }}
        >
          {settings?.shopName ?? "Docinho O Docinho"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="text-base md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          style={{
            color: "rgba(239,232,216,0.92)",
            textShadow: "0 1px 12px rgba(114,92,63,0.6)",
          }}
        >
          Brigadeiros artesanais feitos com amor, ingredientes selecionados e muita magia
          para adoçar os seus momentos mais especiais.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            data-testid="button-hero-whatsapp"
            onClick={handleWhatsApp}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(229,173,168,0.45)" }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full font-semibold text-base shadow-xl transition-all flex items-center gap-2 justify-center"
            style={{ background: "#E5ADA8", color: "#fff" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fazer Pedido
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector("#destaques")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-full font-semibold text-base transition-all"
            style={{
              background: "rgba(239,232,216,0.22)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(239,232,216,0.45)",
              color: "#EFE8D8",
            }}
          >
            Ver Cardápio
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — brigadeiro emoji */}
      <motion.button
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => document.querySelector("#destaques")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
        style={{ opacity: 0.75 }}
      >
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#EFE8D8", textShadow: "0 1px 6px rgba(114,92,63,0.5)" }}>
          Scroll
        </span>
        <span className="text-2xl drop-shadow-md" title="brigadeiro">🍬</span>
      </motion.button>
    </section>
  );
}
