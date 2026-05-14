import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      <div className="container text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/10 text-[#00f2ff] text-xs font-bold uppercase tracking-widest mb-6">
            O Futuro é Digital
          </span>
          
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-none">
            TRANSFORME SUA <br /> 
            <span className="gradient-text">PRESENÇA ONLINE</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Criamos ecossistemas digitais de alto impacto que conectam sua marca ao futuro. 
            Estratégia, design e tecnologia em um só lugar.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a href="#contato" className="btn-primary flex items-center gap-2 group">
              Agendar Consultoria Grátis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#portfolio" className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all">
              Ver Projetos
            </a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#00f2ff]/10 to-[#bd00ff]/10 rounded-full blur-[120px] -z-10" />
    </section>
  );
};

export default Hero;
