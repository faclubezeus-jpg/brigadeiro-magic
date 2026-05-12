import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["🍫", "🌟", "✨", "💝"];

export function RainAnimation() {
  const [show, setShow] = useState(true);
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100, // percentage
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden bg-black/10 backdrop-blur-[2px]"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -50, x: `${p.x}vw`, opacity: 0, rotate: 0 }}
              animate={{ 
                y: "120vh", 
                opacity: [0, 1, 1, 0],
                rotate: 360 
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "linear",
              }}
              className="absolute text-2xl"
            >
              {p.emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
