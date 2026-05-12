import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SiteSettings } from "@workspace/api-client-react";

interface HeroSectionProps {
  settings?: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const heroVideoUrl = settings?.heroVideoUrl ?? "/videos/hero.mp4";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleWhatsApp = () => {
    const num = settings?.whatsappNumber ?? "5511999999999";
    const msg = settings?.whatsappMessage ?? "Olá! Vim pelo site e gostaria de fazer um pedido.";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          key={heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.75 }}
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(255,248,240,0.55) 0%,
              rgba(255,182,193,0.35) 40%,
              rgba(232,213,245,0.25) 70%,
              rgba(255,248,240,0.7) 100%
            )`,
          }}
        />
        {/* Mouse-reactive holographic overlay */}
        <div
          className="absolute inset-0 transition-all duration-100"
          style={{
            background: `radial-gradient(ellipse at ${50 + mousePos.x}% ${50 + mousePos.y}%, 
              rgba(255,182,193,0.25) 0%, 
              rgba(232,213,245,0.15) 40%, 
              transparent 70%)`,
          }}
        />
      </div>

      {/* Floating sparkles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute text-xl pointer-events-none z-10"
          style={{ left: `${(i * 10.5) % 100}%`, top: `${(i * 12.3) % 85}%` }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2.5 + (i % 3),
            delay: i * 0.5,
            repeat: Infinity,
          }}
        >
          {["✨", "⭐", "💫", "🌟", "💝"][i % 5]}
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Logo or Shop Name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.shopName}
              className="h-20 md:h-28 mx-auto object-contain drop-shadow-xl mb-4"
            />
          ) : (
            <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-primary border border-primary/20 mb-6">
              Confeitaria Artesanal Premium
            </span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{ textShadow: "0 2px 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,182,193,0.4)" }}
        >
          <span className="text-foreground">{settings?.shopName ?? "Docinho"}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-base md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          style={{ textShadow: "0 1px 10px rgba(255,255,255,0.9)" }}
        >
          Brigadeiros artesanais feitos com amor, ingredientes selecionados e muita magia
          para adoçar os seus momentos mais especiais.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            data-testid="button-hero-whatsapp"
            onClick={handleWhatsApp}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,182,193,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-xl transition-all flex items-center gap-2 justify-center backdrop-blur-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fazer Pedido
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector("#destaques")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-full glass border border-white/40 text-foreground font-semibold text-base transition-all backdrop-blur-md"
          >
            Ver Cardápio
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 z-20"
      >
        <span className="text-xs text-foreground/70 font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
