import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminMe, useAdminLogout, getAdminMeQueryKey,
  useGetSettings, useUpdateSettings, getGetSettingsQueryKey,
  useGetSweets, useCreateSweet, useUpdateSweet, useDeleteSweet, getGetSweetsQueryKey,
  useGetCakes, useCreateCake, useUpdateCake, useDeleteCake, getGetCakesQueryKey,
  useGetKits, useCreateKit, useUpdateKit, useDeleteKit, getGetKitsQueryKey,
  useGetHighlights, useCreateHighlight, useUpdateHighlight, useDeleteHighlight, getGetHighlightsQueryKey,
  useGetTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, getGetTestimonialsQueryKey,
  Sweet, Cake, Kit, Highlight, Testimonial,
} from "@workspace/api-client-react";

const TABS = [
  { id: "settings", label: "Configurações" },
  { id: "sweets", label: "Docinhos" },
  { id: "cakes", label: "Bolos" },
  { id: "kits", label: "Kits" },
  { id: "highlights", label: "Destaques" },
  { id: "testimonials", label: "Depoimentos" },
];

function SettingsTab() {
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const merged = { ...settings, ...form };

  const handleSave = () => {
    updateSettings.mutate({ data: form as never }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        setForm({});
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  const field = (key: string, label: string, type = "text") => (
    <div key={key}>
      <label className="block text-xs font-semibold text-foreground/70 mb-1 uppercase tracking-wide">{label}</label>
      <input
        data-testid={`input-settings-${key}`}
        type={type}
        value={form[key] ?? (settings as Record<string, string> | undefined)?.[key] ?? ""}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <h3 className="font-serif text-xl font-bold text-foreground">Configurações do Site</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field("shopName", "Nome da Loja")}
        {field("logoUrl", "URL do Logo")}
        {field("whatsappNumber", "WhatsApp (apenas números)")}
        {field("whatsappMessage", "Mensagem WhatsApp")}
        {field("instagram", "Instagram (@usuario)")}
        {field("facebook", "Facebook")}
        {field("tiktok", "TikTok")}
        {field("phone", "Telefone")}
        {field("address", "Endereço")}
        {field("footerText", "Texto do Rodapé")}
      </div>
      <button
        data-testid="button-save-settings"
        onClick={handleSave}
        disabled={updateSettings.isPending}
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60"
      >
        {saved ? "Salvo!" : updateSettings.isPending ? "Salvando..." : "Salvar Configurações"}
      </button>
    </div>
  );
}

function ItemsManager<T extends { id: number; name: string; imageUrl?: string | null; description?: string | null; visible: boolean }>({
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
  extraFields?: (item: T | null, setVal: (k: string, v: string) => void, val: (k: string) => string) => React.ReactNode;
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
    setFormData({ name: item.name, imageUrl: item.imageUrl ?? "", description: item.description ?? "" });
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
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all"
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
            <input placeholder="URL da Imagem" value={val("imageUrl")} onChange={e => setVal("imageUrl", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <input placeholder="Descrição" value={val("description")} onChange={e => setVal("description", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            {extraFields?.(null, setVal, val)}
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
            data-testid={`item-admin-${item.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            {editingId === item.id ? (
              <div className="space-y-3">
                <input value={formData.name ?? item.name} onChange={e => setVal("name", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input value={formData.imageUrl ?? item.imageUrl ?? ""} onChange={e => setVal("imageUrl", e.target.value)} placeholder="URL da Imagem" className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input value={formData.description ?? item.description ?? ""} onChange={e => setVal("description", e.target.value)} placeholder="Descrição" className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                {extraFields?.(item, setVal, (k) => formData[k] ?? "")}
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(item.id)} disabled={isUpdating} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60">
                    {isUpdating ? "Salvando..." : "Salvar"}
                  </button>
                  <button onClick={() => { setEditingId(null); setFormData({}); }} className="px-4 py-2 rounded-xl bg-muted text-foreground text-sm">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-border flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">{item.name}</div>
                  {item.description && <div className="text-muted-foreground text-xs truncate">{item.description}</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onUpdate(item.id, { visible: !item.visible } as Partial<T>)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${item.visible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}
                  >
                    {item.visible ? "Visível" : "Oculto"}
                  </button>
                  <button onClick={() => handleEdit(item)} className="text-xs px-3 py-1 rounded-full bg-secondary text-foreground font-medium">Editar</button>
                  <button onClick={() => onDelete(item.id)} disabled={isDeleting} className="text-xs px-3 py-1 rounded-full bg-destructive/10 text-destructive font-medium disabled:opacity-60">Excluir</button>
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

  const { data: session, isLoading } = useAdminMe({ query: { queryKey: getAdminMeQueryKey() } });
  const logoutMutation = useAdminLogout();

  const { data: sweets = [] } = useGetSweets();
  const { data: cakes = [] } = useGetCakes();
  const { data: kits = [] } = useGetKits();
  const { data: highlights = [] } = useGetHighlights();
  const { data: testimonials = [] } = useGetTestimonials();

  const createSweet = useCreateSweet();
  const updateSweet = useUpdateSweet();
  const deleteSweet = useDeleteSweet();

  const createCake = useCreateCake();
  const updateCake = useUpdateCake();
  const deleteCake = useDeleteCake();

  const createKit = useCreateKit();
  const updateKit = useUpdateKit();
  const deleteKit = useDeleteKit();

  const createHighlight = useCreateHighlight();
  const updateHighlight = useUpdateHighlight();
  const deleteHighlight = useDeleteHighlight();

  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center holographic-bg">
      <div className="text-foreground font-serif text-xl animate-pulse">Carregando...</div>
    </div>
  );

  if (!session?.authenticated) {
    setLocation("/admin");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getAdminMeQueryKey() });
        setLocation("/admin");
      }
    });
  };

  const invalidate = (qkFn: () => unknown[]) => () => qc.invalidateQueries({ queryKey: qkFn() });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-heavy border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">Painel DM</h1>
            <p className="text-xs text-muted-foreground">Docinho & Cia — Administração</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-muted-foreground hover:text-primary transition-colors">Ver Site</a>
            <button
              data-testid="button-logout"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive hover:text-white transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "settings" && <SettingsTab />}

              {activeTab === "sweets" && (
                <ItemsManager
                  label="Nossos Docinhos"
                  items={sweets}
                  onCreate={(d) => createSweet.mutate({ data: d as never }, { onSuccess: invalidate(getGetSweetsQueryKey) })}
                  onUpdate={(id, d) => updateSweet.mutate({ id, data: d as never }, { onSuccess: invalidate(getGetSweetsQueryKey) })}
                  onDelete={(id) => deleteSweet.mutate({ id }, { onSuccess: invalidate(getGetSweetsQueryKey) })}
                  isCreating={createSweet.isPending}
                  isUpdating={updateSweet.isPending}
                  isDeleting={deleteSweet.isPending}
                />
              )}

              {activeTab === "cakes" && (
                <ItemsManager
                  label="Galeria de Bolos"
                  items={cakes}
                  onCreate={(d) => createCake.mutate({ data: d as never }, { onSuccess: invalidate(getGetCakesQueryKey) })}
                  onUpdate={(id, d) => updateCake.mutate({ id, data: d as never }, { onSuccess: invalidate(getGetCakesQueryKey) })}
                  onDelete={(id) => deleteCake.mutate({ id }, { onSuccess: invalidate(getGetCakesQueryKey) })}
                  isCreating={createCake.isPending}
                  isUpdating={updateCake.isPending}
                  isDeleting={deleteCake.isPending}
                />
              )}

              {activeTab === "kits" && (
                <ItemsManager
                  label="Kits & Combos"
                  items={kits}
                  onCreate={(d) => createKit.mutate({ data: d as never }, { onSuccess: invalidate(getGetKitsQueryKey) })}
                  onUpdate={(id, d) => updateKit.mutate({ id, data: d as never }, { onSuccess: invalidate(getGetKitsQueryKey) })}
                  onDelete={(id) => deleteKit.mutate({ id }, { onSuccess: invalidate(getGetKitsQueryKey) })}
                  isCreating={createKit.isPending}
                  isUpdating={updateKit.isPending}
                  isDeleting={deleteKit.isPending}
                  extraFields={(_item, setVal, val) => (
                    <input placeholder="Preço (ex: R$ 89,90)" value={val("price")} onChange={e => setVal("price", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  )}
                />
              )}

              {activeTab === "highlights" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif text-xl font-bold text-foreground">Galeria de Destaques</h3>
                    <button onClick={() => createHighlight.mutate({ data: { imageUrl: "https://via.placeholder.com/800x500", caption: "Nova imagem", sortOrder: highlights.length, visible: true } }, { onSuccess: invalidate(getGetHighlightsQueryKey) })} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                      + Adicionar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {highlights.map(h => (
                      <div key={h.id} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border border-border">
                        <img src={h.imageUrl} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <input defaultValue={h.caption ?? ""} onBlur={e => updateHighlight.mutate({ id: h.id, data: { caption: e.target.value } }, { onSuccess: invalidate(getGetHighlightsQueryKey) })} placeholder="Legenda" className="w-full bg-transparent text-sm text-foreground focus:outline-none border-b border-border" />
                          <input defaultValue={h.imageUrl} onBlur={e => updateHighlight.mutate({ id: h.id, data: { imageUrl: e.target.value } }, { onSuccess: invalidate(getGetHighlightsQueryKey) })} placeholder="URL da Imagem" className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none mt-1" />
                        </div>
                        <button onClick={() => updateHighlight.mutate({ id: h.id, data: { visible: !h.visible } }, { onSuccess: invalidate(getGetHighlightsQueryKey) })} className={`text-xs px-2 py-1 rounded-full ${h.visible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>{h.visible ? "Visível" : "Oculto"}</button>
                        <button onClick={() => deleteHighlight.mutate({ id: h.id }, { onSuccess: invalidate(getGetHighlightsQueryKey) })} className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">Excluir</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "testimonials" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif text-xl font-bold text-foreground">Depoimentos</h3>
                    <button onClick={() => createTestimonial.mutate({ data: { name: "Nome do Cliente", text: "Escreva o depoimento aqui...", visible: true, sortOrder: testimonials.length } }, { onSuccess: invalidate(getGetTestimonialsQueryKey) })} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                      + Adicionar
                    </button>
                  </div>
                  <div className="space-y-4">
                    {testimonials.map(t => (
                      <div key={t.id} className="bg-muted/30 rounded-2xl p-4 border border-border">
                        <div className="flex items-center gap-3 mb-3">
                          <input defaultValue={t.name} onBlur={e => updateTestimonial.mutate({ id: t.id, data: { name: e.target.value } }, { onSuccess: invalidate(getGetTestimonialsQueryKey) })} className="font-semibold text-foreground text-sm bg-transparent border-b border-border focus:outline-none flex-1" />
                          <button onClick={() => updateTestimonial.mutate({ id: t.id, data: { visible: !t.visible } }, { onSuccess: invalidate(getGetTestimonialsQueryKey) })} className={`text-xs px-2 py-1 rounded-full ${t.visible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>{t.visible ? "Visível" : "Oculto"}</button>
                          <button onClick={() => deleteTestimonial.mutate({ id: t.id }, { onSuccess: invalidate(getGetTestimonialsQueryKey) })} className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">Excluir</button>
                        </div>
                        <textarea defaultValue={t.text} onBlur={e => updateTestimonial.mutate({ id: t.id, data: { text: e.target.value } }, { onSuccess: invalidate(getGetTestimonialsQueryKey) })} className="w-full text-muted-foreground text-sm bg-transparent border border-border rounded-xl p-2 focus:outline-none resize-none" rows={3} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
