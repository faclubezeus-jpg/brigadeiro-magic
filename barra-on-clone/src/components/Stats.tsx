import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Projetos Entregues', value: '50+', color: 'var(--primary)' },
  { label: 'Alcance Social', value: '10M+', color: 'var(--secondary)' },
  { label: 'Clientes Satisfeitos', value: '100%', color: 'var(--accent)' },
  { label: 'Anos de Experiência', value: '05', color: '#fff' },
];

const Stats: React.FC = () => {
  return (
    <section className="py-20 bg-white/[0.02]">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <h3 className="text-4xl md:text-6xl font-black mb-2 brand-font" style={{ color: stat.color }}>
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
