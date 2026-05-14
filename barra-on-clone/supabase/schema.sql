-- Schema para Barra On Digital

-- Tabela de Leads (Contatos)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Portfólio
CREATE TABLE portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  project_url TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Serviços
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price_info TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Instagram Feed
CREATE TABLE instagram_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  likes TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS (Segurança)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_feed ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para leitura
CREATE POLICY "Public Read Portfolio" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Instagram Feed" ON instagram_feed FOR SELECT USING (true);

-- Política de inserção pública para Leads (permitir que clientes enviem mensagens)
CREATE POLICY "Public Insert Leads" ON leads FOR INSERT WITH CHECK (true);
