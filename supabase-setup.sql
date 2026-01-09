-- =============================================
-- Supabase Database Setup for Bloom Client CRM
-- =============================================
-- Execute este script no SQL Editor do Supabase
-- Acesse: https://supabase.com/dashboard/project/tdnbiyiukgcurwfliuxl/sql/new

-- Habilitar UUID extension (geralmente já está habilitado)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Tabela: profiles (perfis de usuários)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- =============================================
-- Tabela: clients (clientes do CRM)
-- =============================================
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    responsible_name TEXT NOT NULL,
    responsible_phone TEXT NOT NULL,
    responsible_email TEXT,
    responsible_role TEXT,
    email TEXT NOT NULL,
    document TEXT NOT NULL,
    niche TEXT NOT NULL,
    connections INTEGER NOT NULL DEFAULT 1,
    product TEXT NOT NULL,
    monthly_value DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'boleto', 'transfer')),
    due_date INTEGER NOT NULL CHECK (due_date >= 1 AND due_date <= 31),
    notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'overdue', 'inactive', 'cancelled')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    company_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para clients
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_company_name ON public.clients(company_name);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at DESC);

-- =============================================
-- Row Level Security (RLS) - Segurança
-- =============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para clients
DROP POLICY IF EXISTS "Users can view own clients" ON public.clients;
CREATE POLICY "Users can view own clients" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own clients" ON public.clients;
CREATE POLICY "Users can insert own clients" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own clients" ON public.clients;
CREATE POLICY "Users can update own clients" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own clients" ON public.clients;
CREATE POLICY "Users can delete own clients" ON public.clients
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Triggers para updated_at
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para clients
DROP TRIGGER IF EXISTS set_clients_updated_at ON public.clients;
CREATE TRIGGER set_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- Trigger para criar profile automaticamente
-- =============================================

-- Função para criar profile quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar profile automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Verificação final
-- =============================================
SELECT 'Tabelas criadas com sucesso!' as status;
