import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  { name: 'João Silva', company: 'TechFlow', img: 'https://i.pravatar.cc/150?u=1', text: 'A Barra On transformou nosso site em uma máquina de vendas.' },
  { name: 'Maria Souza', company: 'Gourmet Fit', img: 'https://i.pravatar.cc/150?u=2', text: 'O branding ficou impecável, exatamente o que precisávamos.' },
  { name: 'Pedro Alves', company: 'Next Level', img: 'https://i.pravatar.cc/150?u=3', text: 'Melhor investimento digital que já fizemos. Suporte nota 10.' },
  { name: 'Ana Costa', company: 'BioCare', img: 'https://i.pravatar.cc/150?u=4', text: 'Nossas vendas no Insta triplicaram em 3 meses.' },
];

const Testimonials: React.FC = () => {
  return (
    <section id="sobre" className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            CLIENTES QUE <span className="gradient-text">ACREDITAM</span>
          </h2>
          <p className="text-gray-400">Resultados reais de quem já faz parte do futuro.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {testimonials.map((t, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-4 cursor-pointer group"
            >
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#ffd700] via-[#bd00ff] to-[#00f2ff] transition-transform group-hover:scale-110">
                <div className="p-1 rounded-full bg-[#050505]">
                  <img 
                    src={t.img} 
                    alt={t.name}
                    className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                {/* Active Indicator */}
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#00f2ff] border-4 border-[#050505] rounded-full" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
