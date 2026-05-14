import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, CheckCircle2 } from 'lucide-react';

const options = [
  { id: 'site', label: 'Landing Page / Site', price: 1200 },
  { id: 'app', label: 'Aplicativo Mobile', price: 3500 },
  { id: 'branding', label: 'Identidade Visual', price: 800 },
  { id: 'social', label: 'Gestão Social (Mês)', price: 600 },
  { id: 'ads', label: 'Tráfego Pago (Mês)', price: 500 },
];

const PriceCalculator: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalPrice = selected.reduce((acc, id) => {
    const option = options.find(o => o.id === id);
    return acc + (option?.price || 0);
  }, 0);

  return (
    <section className="py-24 relative bg-white/[0.02]">
      <div className="container">
        <div className="glass-card max-w-4xl mx-auto p-8 md:p-12 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#ffd700]/10 flex items-center justify-center text-[#ffd700]">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Simulador de Investimento</h2>
              <p className="text-gray-400 text-sm">Selecione os serviços para uma estimativa inicial.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {options.map((option) => (
              <div 
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selected.includes(option.id) 
                    ? 'border-[#00f2ff] bg-[#00f2ff]/5' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    selected.includes(option.id) ? 'bg-[#00f2ff] border-[#00f2ff]' : 'border-white/30'
                  }`}>
                    {selected.includes(option.id) && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
                <span className="text-gray-400 text-sm">R$ {option.price}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
            <div>
              <span className="text-gray-400 block text-sm uppercase tracking-widest font-bold mb-1">Total Estimado</span>
              <span className="text-4xl md:text-5xl font-black gradient-text">
                R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <a href="#contato" className="btn-primary w-full md:w-auto text-center">
              Solicitar Proposta Formal
            </a>
          </div>

          {/* Decorative Sparkle */}
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#00f2ff]/10 rounded-full blur-[60px]" />
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
