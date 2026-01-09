# Bloom CRM - Sistema de Gestão de Clientes

Sistema CRM moderno integrado com Supabase para autenticação e banco de dados.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes
- **Supabase** - Backend (Auth + Database)
- **React Query** - Gerenciamento de estado

## 📋 Funcionalidades

- ✅ Autenticação (Login/Registro)
- ✅ Dashboard com métricas
- ✅ Gestão de clientes (CRUD)
- ✅ Kanban board por status
- ✅ Relatórios
- ✅ Configurações personalizáveis

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## ⚙️ Configuração do Supabase

Veja o arquivo [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instruções detalhadas.

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── contexts/       # Context providers (Auth, Clients)
├── hooks/          # Custom hooks
├── lib/            # Configurações (Supabase, utils)
├── pages/          # Páginas da aplicação
└── types/          # Tipos TypeScript
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

## 📄 Licença

MIT
