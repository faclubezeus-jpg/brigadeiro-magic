import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'E-commerce Premium',
    category: 'Desenvolvimento Web',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500',
    url: '#'
  },
  {
    title: 'App de Gestão',
    category: 'Mobile App',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=500',
    url: '#'
  },
  {
    title: 'Rebranding Digital',
    category: 'Identidade Visual',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=500',
    url: '#'
  }
];

const Portfolio: React.FC = () => {
  return (
    <section id="portfólio" className="py-24 bg-black">
      <div className="container">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
              TRABALHOS <br /> <span className="gradient-text">REALIZADOS</span>
            </h2>
            <p className="text-gray-400 max-w-md">
              Uma seleção de projetos que elevaram o patamar digital de nossos parceiros.
            </p>
          </div>
          <button className="px-8 py-3 rounded-full border border-white/10 hover:border-[#00f2ff] transition-all">
            Ver Todos os Projetos
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-video cursor-pointer"
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <span className="text-xs font-bold text-[#00f2ff] uppercase tracking-[0.2em] mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
