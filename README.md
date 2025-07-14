# Teddy Teste - Sistema de CRUD de Clientes

Sistema desenvolvido com arquitetura de micro-frontends para gerenciamento de clientes, utilizando NPM Workspaces e preparado para deploy na Vercel.

## 🏗️ Arquitetura

### Micro-frontends:
- **shell**: Aplicação principal (roteamento e orquestração)
- **clients**: Micro-frontend para CRUD de clientes
- **selected**: Micro-frontend para visualização de clientes selecionados
- **design-system**: Biblioteca de componentes compartilhados

## 🚀 Tecnologias

- React 18 + TypeScript
- Vite (build tool)
- NPM Workspaces (monorepo)
- React Router DOM (roteamento)
- Vercel (deploy)

## 📦 Estrutura do Projeto

```
teddy-teste/
├── apps/
│   ├── shell/          # App principal
│   ├── clients/        # CRUD de clientes
│   └── selected/       # Clientes selecionados
├── packages/
│   └── design-system/  # Componentes compartilhados
├── docker/             # Configurações Docker
└── package.json        # Root package.json
```

## 🛠️ Como executar

### Pré-requisitos
- Node.js >= 18.0.0
- NPM >= 8.0.0

### Instalação e Desenvolvimento
```bash
# Clonar o repositório
git clone https://github.com/JonatasCarvalhoSousa/teddy.git
cd teddy

# Instalar dependências (NPM Workspaces)
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
cd apps/shell && npm run preview
```

### Teste Local do Build
```bash
# Build do projeto
npm run build

# Testar build localmente
cd apps/shell
npm run preview

# Ou usar serve globalmente
npm install -g serve
serve -s dist
```

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento de todos os workspaces
npm run build        # Build de produção de todos os workspaces  
npm run test         # Testes em todos os workspaces
npm run lint         # Linting de todos os workspaces
npm run start        # Alias para npm run dev
npm run vercel-build # Build específico para Vercel
```

## 🌐 Deploy na Vercel

### Deploy Automático (Recomendado)
1. Faça push do código para GitHub/GitLab/Bitbucket
2. Conecte o repositório à Vercel
3. A Vercel detectará automaticamente a configuração via `vercel.json`
4. Deploy automático a cada push na branch main

### Deploy Manual
```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login na Vercel
vercel login

# Deploy do projeto
vercel

# Deploy de produção
vercel --prod
```

### Configuração Incluída
- ✅ `vercel.json` configurado para SPA
- ✅ Build command otimizado para NPM
- ✅ Output directory configurado
- ✅ Roteamento SPA (Single Page Application)

## 📋 Funcionalidades

- ✅ Tela de boas-vindas com design personalizado (seguindo inspiração fornecida)
- ✅ Layout padronizado com menu lateral e header consistente
- ✅ Listagem de clientes da API Teddy Open Finance
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ **Modais para criação e edição** - Interface popup elegante
- ✅ **Modal de confirmação para exclusão** - Segurança extra
- ✅ Seleção de clientes com checkbox
- ✅ Visualização de clientes selecionados com estatísticas
- ✅ Design system unificado (cores, componentes, tipografia)
- ✅ Design responsivo e moderno
- ✅ Loading states e feedback visual
- ✅ Integração completa com API REST
- ✅ Componentes reutilizáveis (Layout, Card, Button, Modal)
