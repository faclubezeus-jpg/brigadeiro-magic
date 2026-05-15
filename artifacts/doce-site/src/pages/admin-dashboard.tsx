import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const TABS = [
  { id: "settings", label: "⚙️ Config" },
  { id: "sweets", label: "🍫 Docinhos" },
  { id: "cakes", label: "🎂 Bolos" },
  { id: "kits", label: "🎁 Kits" },
  { id: "highlights", label: "📸 Destaques" },
  { id: "testimonials", label: "💬 Depoimentos" },
];

function isVideo(url: string | null | undefined) {
  return url?.match(/\.(mp4|mov|webm|ogg)(\?|$)/i);
}

async function uploadFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(data.path);

  return publicUrl;
}

function MediaPreview({ url, alt }: { url: string; alt?: string }) {
  if (!url) return null;
  if (isVideo(url)) {
    return <video src={url} className="w-full h-full object-cover" muted autoPlay loop playsInline />;
  }
  return <img src={url} alt={alt ?? ""} className="w-full h-full object-cover" />;
}

function FileUploadButton({
  onUpload,
  accept = "image/*,video/mp4,video/mov,video/webm",
  label = "Subir arquivo",
  className = "",
}: {
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onUpload(url);
    } catch (err) {
      alert(`Erro no upload: ${err instanceof Error ? err.message : "Tente novamente"}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`px-3 py-2 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-primary/10 hover:border-primary transition-all disabled:opacity-50 ${className}`}
      >
        {uploading ? "Enviando..." : label}
      </button>
    </>
  );
}

function SettingsTab() {
  const { data: settings } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', 1);
      if (error) throw error;
    }
  });

  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string | null>>({});
  const [saved, setSaved] = useState(false);

  const getVal = (key: string) => {
    if (key in form) return form[key] ?? "";
    return (settings as Record<string, string | null | undefined> | undefined)?.[key] ?? "";
  };

  const setVal = (key: string, val: string | null) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? null : v])
    );
    updateMutation.mutate(payload, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['site_settings'] });
        setForm({});
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    });
  };

  const textField = (key: string, label: string, placeholder = "") => (
    <div key={key}>
      <label className="block text-xs font-semibold text-foreground/70 mb-1 uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={getVal(key)}
        onChange={e => setVal(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  const textAreaField = (key: string, label: string, rows = 4) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-foreground/70 mb-1 uppercase tracking-wide">{label}</label>
      <textarea
        value={getVal(key)}
        onChange={e => setVal(key, e.target.value)}
        rows={rows}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl font-bold text-foreground">Configurações do Site</h3>

      {/* Logo upload */}
      <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3">
        <h4 className="font-semibold text-sm text-foreground">Logo da Empresa</h4>
        <div className="flex items-start gap-4">
          <div className="w-24 h-16 rounded-xl border border-border bg-muted overflow-hidden flex items-center justify-center text-muted-foreground text-xs">
            {getVal("logoUrl") ? (
              <img src={getVal("logoUrl")} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <span>Sem logo</span>
            )}
          </div>
          <div className="space-y-2">
            <FileUploadButton
              onUpload={url => setVal("logoUrl", url)}
              accept="image/png,image/jpg,image/jpeg,image/webp,image/svg+xml"
              label="📷 Subir Logo (PNG/JPG)"
            />
            <input
              type="text"
              value={getVal("logoUrl")}
              onChange={e => setVal("logoUrl", e.target.value)}
              placeholder="Ou cole a URL da logo"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {getVal("logoUrl") && (
              <button onClick={() => setVal("logoUrl", null)} className="text-xs text-destructive hover:underline">
                Remover logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero video upload */}
      <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3">
        <h4 className="font-semibold text-sm text-foreground">Vídeo de Fundo (Hero)</h4>
        <p className="text-xs text-muted-foreground">O vídeo aparece como fundo da primeira seção do site. Aceita MP4.</p>
        <div className="flex items-start gap-4">
          <div className="w-32 h-20 rounded-xl border border-border bg-muted overflow-hidden flex items-center justify-center text-muted-foreground text-xs">
            {getVal("heroVideoUrl") ? (
              <video src={getVal("heroVideoUrl")} className="w-full h-full object-cover" muted loop autoPlay playsInline />
            ) : (
              <span className="text-center p-2">Sem vídeo (padrão do site)</span>
            )}
          </div>
          <div className="space-y-2 flex-1">
            <FileUploadButton
              onUpload={url => setVal("heroVideoUrl", url)}
              accept="video/mp4,video/mov,video/webm"
              label="🎬 Subir Vídeo MP4"
            />
            <input
              type="text"
              value={getVal("heroVideoUrl")}
              onChange={e => setVal("heroVideoUrl", e.target.value)}
              placeholder="Ou cole a URL do vídeo"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {getVal("heroVideoUrl") && (
              <button onClick={() => setVal("heroVideoUrl", null)} className="text-xs text-destructive hover:underline">
                Remover vídeo (volta ao padrão)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="p-5 bg-primary/5 rounded-2xl border border-primary/20 space-y-4">
        <h4 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
          <span>📖 Seção Sobre Nós</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {textField("aboutTitle", "Título da Seção", "Sobre Nós")}
            {textAreaField("aboutText", "Texto da História", 8)}
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wide">Imagem ou Vídeo (PNG/MP4)</label>
            <div className="aspect-[4/3] rounded-2xl border border-border bg-muted overflow-hidden">
              <MediaPreview url={getVal("aboutMediaUrl")} />
            </div>
            <div className="flex gap-2">
              <FileUploadButton
                onUpload={url => setVal("aboutMediaUrl", url)}
                label="📁 Alterar Mídia"
                className="flex-1"
              />
              {getVal("aboutMediaUrl") && (
                <button onClick={() => setVal("aboutMediaUrl", null)} className="px-3 py-2 rounded-xl border border-destructive/30 text-destructive text-xs hover:bg-destructive/5">
                  Reset
                </button>
              )}
            </div>
            <input
              type="text"
              value={getVal("aboutMediaUrl")}
              onChange={e => setVal("aboutMediaUrl", e.target.value)}
              placeholder="Ou cole a URL direta"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Counters / Stats */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-3">Números de Destaque (Contadores)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-background rounded-xl border border-border space-y-2">
              {textField("aboutStat1Number", "Número 1", "500+")}
              {textField("aboutStat1Label", "Legenda 1", "Pedidos")}
            </div>
            <div className="p-3 bg-background rounded-xl border border-border space-y-2">
              {textField("aboutStat2Number", "Número 2", "50+")}
              {textField("aboutStat2Label", "Legenda 2", "Sabores")}
            </div>
            <div className="p-3 bg-background rounded-xl border border-border space-y-2">
              {textField("aboutStat3Number", "Número 3", "5★")}
              {textField("aboutStat3Label", "Legenda 3", "Avaliação")}
            </div>
          </div>
        </div>
      </div>

      {/* Text fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {textField("shopName", "Nome da Loja", "Docinho O Docinho")}
        {textField("whatsappNumber", "WhatsApp (só números)", "5511999999999")}
        {textField("whatsappMessage", "Mensagem WhatsApp padrão")}
        {textField("instagram", "Instagram (@usuario)")}
        {textField("facebook", "Facebook")}
        {textField("tiktok", "TikTok")}
        {textField("phone", "Telefone de contato")}
        {textField("address", "Endereço")}
        {textField("footerText", "Texto do Rodapé")}
      </div>

      <button
        onClick={handleSave}
        disabled={updateMutation.isPending}
        className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60"
      >
        {saved ? "✓ Salvo!" : updateMutation.isPending ? "Salvando..." : "Salvar Configurações"}
      </button>
    </div>
  );
}

type AnyItem = { id: number; name: string; imageUrl?: string | null; description?: string | null; visible: boolean };

function ItemsManager<T extends AnyItem>({
  items,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
  extraFields,
  label,
}: {
  items: T[];
  onCreate: (data: Partial<T>) => void;
  onUpdate: (id: number, data: Partial<T>) => void;
  onDelete: (id: number) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  extraFields?: (setVal: (k: string, v: string) => void, val: (k: string) => string) => React.ReactNode;
  label: string;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showNew, setShowNew] = useState(false);

  const setVal = (k: string, v: string) => setFormData(prev => ({ ...prev, [k]: v }));
  const val = (k: string) => formData[k] ?? "";

  const handleCreate = () => {
    onCreate(formData as Partial<T>);
    setFormData({});
    setShowNew(false);
  };

  const handleEdit = (item: T) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      imageUrl: item.imageUrl ?? "",
      description: item.description ?? "",
      ...Object.fromEntries(Object.entries(item).filter(([k]) => !['id', 'name', 'imageUrl', 'description', 'visible'].includes(k)))
    });
  };

  const handleUpdate = (id: number) => {
    onUpdate(id, formData as Partial<T>);
    setEditingId(null);
    setFormData({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-xl font-bold text-foreground">{label}</h3>
        <button
          onClick={() => { setShowNew(!showNew); setFormData({}); }}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90"
        >
          + Adicionar
        </button>
      </div>

      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-secondary/30 rounded-2xl p-5 mb-5 border border-border space-y-3"
          >
            <h4 className="font-semibold text-sm text-foreground">Novo item</h4>
            <input placeholder="Nome" value={val("name")} onChange={e => setVal("name", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <input placeholder="Descrição" value={val("description")} onChange={e => setVal("description", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <input
                  placeholder="URL da imagem ou vídeo"
                  value={val("imageUrl")}
                  onChange={e => setVal("imageUrl", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FileUploadButton
                  onUpload={url => setVal("imageUrl", url)}
                  label="📎 Subir"
                />
              </div>
              {val("imageUrl") && (
                <div className="w-16 h-16 rounded-xl border border-border overflow-hidden">
                  <MediaPreview url={val("imageUrl")} />
                </div>
              )}
            </div>

            {extraFields?.(setVal, val)}

            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={isCreating} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60">
                {isCreating ? "Criando..." : "Criar"}
              </button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl bg-muted text-foreground text-sm">Cancelar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            {editingId === item.id ? (
              <div className="space-y-3">
                <input value={formData.name ?? item.name} onChange={e => setVal("name", e.target.value)} placeholder="Nome" className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input value={formData.description ?? item.description ?? ""} onChange={e => setVal("description", e.target.value)} placeholder="Descrição" className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input value={formData.imageUrl ?? item.imageUrl ?? ""} onChange={e => setVal("imageUrl", e.target.value)} placeholder="URL da mídia" className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <FileUploadButton onUpload={url => setVal("imageUrl", url)} label="📎 Subir" />
                  </div>
                  {(formData.imageUrl ?? item.imageUrl) && (
                    <div className="w-16 h-16 rounded-xl border border-border overflow-hidden">
                      <MediaPreview url={formData.imageUrl ?? item.imageUrl ?? ""} />
                    </div>
                  )}
                </div>
                {extraFields?.(setVal, val)}
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(item.id)} disabled={isUpdating} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60">
                    {isUpdating ? "Salvando..." : "Salvar"}
                  </button>
                  <button onClick={() => { setEditingId(null); setFormData({}); }} className="px-4 py-2 rounded-xl bg-muted text-foreground text-sm">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {item.imageUrl && (
                  <div className="w-14 h-14 rounded-xl border border-border flex-shrink-0 overflow-hidden">
                    <MediaPreview url={item.imageUrl} alt={item.name} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">{item.name}</div>
                  {item.description && <div className="text-muted-foreground text-xs truncate">{item.description}</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                  <button
                    onClick={() => onUpdate(item.id, { visible: !item.visible } as Partial<T>)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${item.visible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}
                  >
                    {item.visible ? "Visível" : "Oculto"}
                  </button>
                  <button onClick={() => handleEdit(item)} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground font-medium">Editar</button>
                  <button onClick={() => onDelete(item.id)} disabled={isDeleting} className="text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-medium disabled:opacity-60">Excluir</button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("settings");
  const qc = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['auth_user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: sweets = [] } = useQuery({ queryKey: ['sweets'], queryFn: async () => (await supabase.from('sweets').select('*').order('sort_order')).data });
  const { data: cakes = [] } = useQuery({ queryKey: ['cakes'], queryFn: async () => (await supabase.from('cakes').select('*').order('sort_order')).data });
  const { data: kits = [] } = useQuery({ queryKey: ['kits'], queryFn: async () => (await supabase.from('kits').select('*').order('sort_order')).data });
  const { data: highlights = [] } = useQuery({ queryKey: ['highlights'], queryFn: async () => (await supabase.from('highlights').select('*').order('sort_order')).data });
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'], queryFn: async () => (await supabase.from('testimonials').select('*').order('id')).data });

  const createMutation = (table: string) => useMutation({
    mutationFn: async (data: any) => { const { error } = await supabase.from(table).insert([data]); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] })
  });

  const updateMutation = (table: string) => useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => { const { error } = await supabase.from(table).update(data).eq('id', id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] })
  });

  const deleteMutation = (table: string) => useMutation({
    mutationFn: async (id: number) => { const { error } = await supabase.from(table).delete().eq('id', id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] })
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="glass-heavy border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-lg md:text-xl font-bold text-foreground">Painel Admin</h1>
            <p className="text-xs text-muted-foreground">Brigadeiro Magic — Área restrita</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive hover:text-white transition-all">Sair</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}>{tab.label}</button>
          ))}
        </div>

        <div className="bg-card rounded-3xl border border-border p-6 shadow-md">
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "sweets" && (
            <ItemsManager
              label="🍫 Nossos Docinhos"
              items={sweets || []}
              onCreate={d => createMutation('sweets').mutate(d)}
              onUpdate={(id, data) => updateMutation('sweets').mutate({ id, data })}
              onDelete={id => deleteMutation('sweets').mutate(id)}
              isCreating={false} isUpdating={false} isDeleting={false}
              extraFields={(setVal, val) => <input placeholder="Preço" value={val("price")} onChange={e => setVal("price", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary" />}
            />
          )}
          {activeTab === "cakes" && (
            <ItemsManager
              label="🎂 Galeria de Bolos"
              items={cakes || []}
              onCreate={d => createMutation('cakes').mutate(d)}
              onUpdate={(id, data) => updateMutation('cakes').mutate({ id, data })}
              onDelete={id => deleteMutation('cakes').mutate(id)}
              isCreating={false} isUpdating={false} isDeleting={false}
              extraFields={(setVal, val) => <input placeholder="Preço" value={val("price")} onChange={e => setVal("price", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary" />}
            />
          )}
          {activeTab === "kits" && (
            <ItemsManager
              label="🎁 Kits & Combos"
              items={kits || []}
              onCreate={d => createMutation('kits').mutate(d)}
              onUpdate={(id, data) => updateMutation('kits').mutate({ id, data })}
              onDelete={id => deleteMutation('kits').mutate(id)}
              isCreating={false} isUpdating={false} isDeleting={false}
              extraFields={(setVal, val) => <input placeholder="Preço" value={val("price")} onChange={e => setVal("price", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary" />}
            />
          )}
          {activeTab === "highlights" && (
            <ItemsManager
              label="📸 Destaques"
              items={highlights || []}
              onCreate={d => createMutation('highlights').mutate(d)}
              onUpdate={(id, data) => updateMutation('highlights').mutate({ id, data })}
              onDelete={id => deleteMutation('highlights').mutate(id)}
              isCreating={false} isUpdating={false} isDeleting={false}
              extraFields={(setVal, val) => (
                <div className="space-y-2">
                  <input placeholder="Texto do Botão" value={val("buttonText")} onChange={e => setVal("buttonText", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary" />
                  <input placeholder="Link (URL)" value={val("linkUrl")} onChange={e => setVal("linkUrl", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary" />
                </div>
              )}
            />
          )}
          {activeTab === "testimonials" && (
            <ItemsManager
              label="💬 Depoimentos"
              items={testimonials || []}
              onCreate={d => createMutation('testimonials').mutate(d)}
              onUpdate={(id, data) => updateMutation('testimonials').mutate({ id, data })}
              onDelete={id => deleteMutation('testimonials').mutate(id)}
              isCreating={false} isUpdating={false} isDeleting={false}
              extraFields={(setVal, val) => <input placeholder="Papel/Cargo" value={val("role")} onChange={e => setVal("role", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
