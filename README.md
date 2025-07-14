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
npm run test         # Testes unitários em todos os workspaces
npm run lint         # Linting de todos os workspaces
npm run start        # Alias para npm run dev
npm run vercel-build # Build específico para Vercel

# Testes Específicos (no diretório apps/shell)
cd apps/shell
npm run test         # Executar testes unitários
npm run test:ui      # Interface visual dos testes
npm run test:coverage # Testes com cobertura
npm run cypress:open # Abrir Cypress UI para E2E
npm run cypress:run  # Executar testes E2E no terminal
npm run test:e2e     # Alias para cypress:run
```

## 🧪 Testes

### Estrutura de Testes
O projeto inclui testes abrangentes cobrindo diferentes níveis:

#### Testes Unitários (Vitest + Testing Library)
- **Componentes**: Button, SearchInput, Modal, etc.
- **Serviços**: ApiService (operações CRUD)
- **Context**: AppContext (gerenciamento de estado)
- **Localização**: `src/**/*.test.{ts,tsx}`

#### Testes End-to-End (Cypress)
- **Autenticação**: Login/logout flow
- **CRUD**: Criação, edição e exclusão de clientes
- **Pesquisa**: Funcionalidade de busca em tempo real
- **Seleção**: Sistema de seleção múltipla
- **Responsividade**: Testes em diferentes viewports
- **Localização**: `cypress/e2e/**/*.cy.ts`

### Executando Testes

#### Testes Unitários
```bash
# Executar todos os testes
cd apps/shell && npm run test

# Modo watch (desenvolvimento)
cd apps/shell && npm run test -- --watch

# Interface visual
cd apps/shell && npm run test:ui

# Com cobertura
cd apps/shell && npm run test:coverage
```

#### Testes E2E
```bash
# Interface interativa (recomendado)
cd apps/shell && npm run cypress:open

# Modo headless (CI/CD)
cd apps/shell && npm run cypress:run

# Executar aplicação e testes E2E
npm run dev # em um terminal
cd apps/shell && npm run test:e2e # em outro terminal
```

### Cobertura de Testes
- ✅ **Componentes UI**: 100% dos componentes principais
- ✅ **Serviços de API**: Todos os endpoints mockados
- ✅ **Gerenciamento de Estado**: Context completo
- ✅ **Fluxos E2E**: Cenários críticos de usuário
- ✅ **Responsividade**: Mobile, tablet e desktop

### CI/CD Integration
Os testes estão configurados para rodar automaticamente:
- **Pull Requests**: Testes unitários obrigatórios
- **Deploy**: Testes E2E em ambiente de staging
- **Vercel**: Build falha se testes falharem

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

## 📁 Estrutura Otimizada para Vercel
```

