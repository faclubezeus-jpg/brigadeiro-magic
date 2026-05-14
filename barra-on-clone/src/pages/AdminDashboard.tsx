import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LayoutDashboard, Image as ImageIcon, Users, MessageSquare, LogOut, Plus, Instagram as InstaIcon } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input name="email" type="email" placeholder="E-mail" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#00f2ff]" required />
            <input name="password" type="password" placeholder="Senha" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#00f2ff]" required />
            <button type="submit" className="btn-primary w-full">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8">
        <h2 className="text-xl font-bold gradient-text">BARRA ON ADMIN</h2>
        <nav className="flex flex-col gap-2">
          {[
            { id: 'leads', label: 'Leads', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'portfolio', label: 'Portfólio', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'instagram', label: 'Insta Feed', icon: <InstaIcon className="w-4 h-4" /> },
            { id: 'users', label: 'Equipe', icon: <Users className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-[#00f2ff]/10 text-[#00f2ff]' : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold capitalize">{activeTab}</h1>
          <button className="btn-primary flex items-center gap-2 text-sm px-6">
            <Plus className="w-4 h-4" /> Adicionar Novo
          </button>
        </header>

        <div className="glass-card p-6">
          <p className="text-gray-400">Gerencie seus {activeTab} aqui. Integração total com Supabase ativa.</p>
          {/* List tables would go here */}
          <div className="mt-8 border-t border-white/5 pt-8">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm uppercase">
                  <th className="pb-4">Data</th>
                  <th className="pb-4">Nome/Título</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/5">
                  <td className="py-4 text-sm">14/05/2026</td>
                  <td className="py-4 font-medium">Exemplo de Item</td>
                  <td className="py-4"><span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">Ativo</span></td>
                  <td className="py-4 flex gap-2">
                    <button className="text-xs hover:text-[#00f2ff]">Editar</button>
                    <button className="text-xs hover:text-red-400">Excluir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
