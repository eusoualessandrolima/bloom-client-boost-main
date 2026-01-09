# Configuração do Supabase - Bloom Client CRM

Este projeto agora está integrado com o **Supabase** para autenticação e banco de dados.

## 📋 Passos para Configuração

### 1. Configurar o Banco de Dados

Acesse o SQL Editor do Supabase:
```
https://supabase.com/dashboard/project/tdnbiyiukgcurwfliuxl/sql/new
```

Copie e execute todo o conteúdo do arquivo `supabase-setup.sql` no SQL Editor.

Este script irá criar:
- ✅ Tabela `profiles` (perfis de usuários)
- ✅ Tabela `clients` (clientes do CRM)
- ✅ Row Level Security (cada usuário só vê seus próprios dados)
- ✅ Triggers para atualização automática de timestamps
- ✅ Índices para melhor performance

### 2. Configurar Autenticação (Opcional)

No dashboard do Supabase:
1. Vá em **Authentication** > **Providers**
2. Certifique-se de que **Email** está habilitado
3. Em **Email Templates**, você pode customizar os emails de confirmação

**Dica**: Para desenvolvimento, você pode desabilitar a confirmação de email:
- Vá em **Authentication** > **Settings**
- Desative "Enable email confirmations"

### 3. Variáveis de Ambiente (Opcional)

As credenciais já estão configuradas no código, mas você pode sobrescrever via `.env`:

```bash
cp .env.example .env
```

Edite o `.env`:
```env
VITE_SUPABASE_URL=https://tdnbiyiukgcurwfliuxl.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 4. Executar o Projeto

```bash
npm install
npm run dev
```

## 🔐 Funcionalidades de Autenticação

- **Login**: Com email e senha
- **Registro**: Criar nova conta
- **Sessão persistente**: O usuário permanece logado
- **Logout**: Encerrar sessão

## 📊 Funcionalidades de Dados

- Os clientes são salvos no banco de dados Supabase
- Cada usuário só tem acesso a seus próprios clientes (RLS)
- Operações CRUD completas (criar, ler, atualizar, deletar)
- Sincronização em tempo real

## 🔒 Segurança

- Row Level Security (RLS) habilitado
- Cada usuário só pode ver/editar seus próprios dados
- Senhas são gerenciadas pelo Supabase Auth (hash seguro)
- Tokens JWT com expiração automática

## 📁 Arquivos Criados/Modificados

```
src/
├── lib/
│   └── supabase.ts           # Cliente Supabase
├── types/
│   └── database.ts           # Tipos TypeScript do banco
├── contexts/
│   ├── AuthContext.tsx       # Autenticação via Supabase
│   └── ClientContext.tsx     # CRUD de clientes via Supabase
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx # Proteção de rotas
└── pages/
    └── Login.tsx             # Login + Registro

supabase-setup.sql            # Script SQL para criar tabelas
.env.example                  # Exemplo de variáveis de ambiente
```

## 🚀 Próximos Passos (Opcional)

1. **Migrar dados existentes**: Se você tinha dados no localStorage, pode criar um script para migrar para o Supabase
2. **Recuperação de senha**: Implementar o fluxo de "Esqueceu a senha?"
3. **Real-time subscriptions**: Adicionar sync em tempo real entre abas/dispositivos
4. **Storage**: Usar Supabase Storage para uploads de arquivos
