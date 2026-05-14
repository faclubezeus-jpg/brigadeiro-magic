import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Smartphone, Palette, Share2, Search, Cpu } from 'lucide-react';

const services = [
  {
    title: 'Landing Pages & Sites',
    desc: 'Sites institucionais e páginas de vendas focadas em conversão extrema.',
    icon: <Layout className="w-8 h-8" />,
    price: 'A partir de R$ 1.200'
  },
  {
    title: 'Aplicativos Mobile',
    desc: 'Soluções iOS e Android personalizadas para o seu modelo de negócio.',
    icon: <Smartphone className="w-8 h-8" />,
    price: 'A partir de R$ 3.500'
  },
  {
    title: 'Identidade Visual',
    desc: 'Branding que comunica autoridade e luxo para sua marca.',
    icon: <Palette className="w-8 h-8" />,
    price: 'A partir de R$ 800'
  },
  {
    title: 'Gestão de Redes Sociais',
    desc: 'Crescimento estratégico e conteúdo de alto valor no Instagram.',
    icon: <Share2 className="w-8 h-8" />,
    price: 'A partir de R$ 600/mês'
  },
  {
    title: 'Tráfego Pago',
    desc: 'Anúncios que colocam seu produto na frente do cliente certo.',
    icon: <Search className="w-8 h-8" />,
    price: 'A partir de R$ 500/mês'
  },
  {
    title: 'Sistemas Internos',
    desc: 'Automação de processos para escalar sua produtividade.',
    icon: <Cpu className="w-8 h-8" />,
    price: 'Sob consulta'
  }
];

const Services: React.FC = () => {
  return (
    <section id="serviços" className="py-24 relative">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
            O QUE <span className="gradient-text">FAZEMOS</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Combinamos inteligência tecnológica com design estratégico para entregar resultados exponenciais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-8 group relative overflow-hidden"
            >
              <div className="text-[#00f2ff] mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {service.desc}
              </p>
              <div className="text-xs font-bold text-[#ffd700] uppercase tracking-widest bg-[#ffd700]/10 px-3 py-1 rounded-full w-fit">
                {service.price}
              </div>
              
              {/* Hover Effect Light */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
