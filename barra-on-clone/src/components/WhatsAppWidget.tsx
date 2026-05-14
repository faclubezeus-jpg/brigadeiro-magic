import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: 'Consultoria de Sites', msg: 'Olá! Gostaria de uma consultoria gratuita sobre sites.' },
    { label: 'Gestão de Tráfego', msg: 'Olá! Quero saber mais sobre gestão de tráfego.' },
    { label: 'Identidade Visual', msg: 'Olá! Gostaria de um orçamento para branding.' },
  ];

  const handleOpenWA = (msg: string) => {
    const url = `https://wa.me/5566999999999?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-72 glass-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Barra On WhatsApp</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOpenWA(opt.msg)}
                  className="w-full p-4 bg-white/5 hover:bg-[#00f2ff]/10 border border-white/10 hover:border-[#00f2ff]/30 rounded-xl text-left text-sm flex items-center justify-between group transition-all"
                >
                  {opt.label}
                  <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            
            <p className="mt-6 text-[10px] text-gray-500 text-center uppercase tracking-widest">
              Resposta média em 15 minutos
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform neon-border"
        style={{ borderColor: '#25D366', boxShadow: '0 0 20px rgba(37, 211, 102, 0.4)' }}
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </div>
  );
};

export default WhatsAppWidget;
