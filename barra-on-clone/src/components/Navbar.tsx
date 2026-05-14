import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass-bg backdrop-blur-md border-b border-white/10' : 'py-6'}`}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00f2ff] to-[#bd00ff] rounded-xl flex items-center justify-center neon-border">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter brand-font">
            BARRA<span className="gradient-text">ON</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['Início', 'Serviços', 'Portfólio', 'Sobre', 'Instagram'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#00f2ff] transition-colors">
              {item}
            </a>
          ))}
          <a href="#contato" className="btn-primary">
            Começar Projeto
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#050505] border-b border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4 text-center">
              {['Início', 'Serviços', 'Portfólio', 'Sobre', 'Instagram', 'Contato'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-lg py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
