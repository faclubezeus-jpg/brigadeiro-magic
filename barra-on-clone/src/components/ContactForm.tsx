import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const { error } = await supabase.from('leads').insert([data]);
      if (error) throw error;
      setSent(true);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Erro ao enviar mensagem. Tente novamente ou use o WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-24 relative bg-black">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">
              VAMOS <span className="gradient-text">CONECTAR</span>?
            </h2>
            <p className="text-gray-400 mb-12 text-lg">
              Pronto para levar seu negócio ao próximo nível? <br />
              Preencha o formulário ou entre em contato pelos nossos canais.
            </p>

            <div className="space-y-6">
              {[
                { icon: <Phone className="w-5 h-5" />, label: 'Telefone/WhatsApp', value: '+55 (66) 99999-9999' },
                { icon: <Mail className="w-5 h-5" />, label: 'E-mail', value: 'contato@barraon.digital' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Localização', value: 'Barra do Garças - MT' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#00f2ff] group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                  <Send className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold">Mensagem Enviada!</h3>
                <p className="text-gray-400">Em breve nossa equipe entrará em contato com você.</p>
                <button onClick={() => setSent(false)} className="text-[#00f2ff] text-sm font-bold underline">Enviar outra mensagem</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400">NOME COMPLETO</label>
                    <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#00f2ff] outline-none transition-all" placeholder="Seu nome" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400">E-MAIL</label>
                    <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#00f2ff] outline-none transition-all" placeholder="exemplo@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400">WHATSAPP</label>
                  <input name="phone" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#00f2ff] outline-none transition-all" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400">MENSAGEM</label>
                  <textarea name="message" required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#00f2ff] outline-none transition-all resize-none" placeholder="Como podemos ajudar seu negócio?" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? 'Enviando...' : 'Enviar Solicitação'}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
