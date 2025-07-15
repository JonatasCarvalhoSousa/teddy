# Teddy Teste - Sistema de CRUD de Clientes com Micro-frontends

Sistema desenvolvido com arquitetura de micro-frontends usando Module Federation, permitindo comunicação e funcionamento independente dos serviços.

## 🏗️ Arquitetura de Micro-frontends

### Aplicações:
- **shell** (porta 3000): Aplicação principal (roteamento e orquestração)
- **clients** (porta 3001): Micro-frontend para CRUD de clientes
- **selected** (porta 3002): Micro-frontend para visualização de clientes selecionados
- **design-system**: Biblioteca compartilhada (tipos, eventos, utilitários)

### 🔄 **Comunicação entre Micro-frontends**

Os serviços se comunicam através de:

1. **Event Bus Centralizado**: Sistema de eventos customizados
2. **Module Federation**: Compartilhamento de componentes e serviços
3. **Estado Sincronizado**: Sincronização automática entre micro-frontends

**Fluxo de Comunicação:**
```
Clients MF ←→ Event Bus ←→ Shell ←→ Event Bus ←→ Selected MF
     ↓                                              ↓
API Externa                                   Estado Local
```

**Eventos Principais:**
- `client:created` - Novo cliente criado
- `client:updated` - Cliente atualizado  
- `client:deleted` - Cliente excluído
- `client:selected` - Cliente selecionado
- `client:unselected` - Cliente desmarcado
- `state:sync` - Sincronização de estado

## 🚀 Tecnologias

- **React 18** + TypeScript
- **Module Federation** (Webpack 5)
- **NPM Workspaces** (monorepo)
- **React Router DOM** (roteamento)
- **Event-driven Architecture** (comunicação)
- **Vite** + **Webpack** (build tools)

## 📦 Estrutura do Projeto

```
teddy-teste/
├── apps/
│   ├── shell/          # App principal - Orquestrador
│   ├── clients/        # Micro-frontend - CRUD de clientes  
│   └── selected/       # Micro-frontend - Clientes selecionados
├── packages/
│   └── design-system/  # Tipos, eventos e utilitários compartilhados
├── docker/             # Configurações Docker
└── package.json        # Root package.json
```

## 🛠️ Como executar

### Setup Automático (Recomendado)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Setup Manual

```bash
# 1. Instalar dependências
npm install

# 2. Build do design system
cd packages/design-system && npm run build && cd ../..

# 3. Instalar dependências dos workspaces
npm install --workspaces

# 4. Rodar todos os micro-frontends
npm run dev
```

### 🌐 Acessar Aplicações

- **Shell Principal**: http://localhost:3000
- **Clients MF**: http://localhost:3001 (standalone)
- **Selected MF**: http://localhost:3002 (standalone)

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Todos os micro-frontends simultaneamente
npm run dev:shell        # Apenas Shell (porta 3000)
npm run dev:clients      # Apenas Clients (porta 3001)
npm run dev:selected     # Apenas Selected (porta 3002)

# Build
npm run build            # Build de todos os workspaces
npm run build:shell      # Build apenas do Shell
npm run build:clients    # Build apenas do Clients
npm run build:selected   # Build apenas do Selected

# Outros
npm run test             # Testes em todos os workspaces
npm run lint             # Linting em todos os workspaces
```

## 🔧 **Como Funciona a Comunicação**

### 1. **Event Bus Centralizado**
```typescript
// Emitir evento
eventBus.emit('client:created', newClient);

// Escutar evento
eventBus.on('client:created', (client) => {
  // Atualizar estado local
});
```

### 2. **Module Federation**
```typescript
// Shell carrega componentes remotos
const ClientsApp = React.lazy(() => import('clients/ClientsApp'));
const SelectedApp = React.lazy(() => import('selected/SelectedApp'));
```

### 3. **Sincronização de Estado**
```typescript
// Sincronizar estado entre micro-frontends
eventBus.syncState(clients, selectedIds);
```

## 🧪 **Testando a Comunicação**

1. **Acesse o Shell**: http://localhost:3000
2. **Navegue para Clientes**: Crie/edite/exclua clientes
3. **Navegue para Selecionados**: Veja as mudanças refletidas
4. **Teste Standalone**: Acesse http://localhost:3001 e http://localhost:3002

### Verificar Comunicação:
- Abra o **Console do Browser** (F12)
- Veja os logs do Event Bus: `[EventBus] Emitted: client:created`
- Observe a sincronização automática entre páginas

## 🐳 **Docker (Opcional)**

```bash
# Subir todos os serviços
docker-compose -f docker/docker-compose.yml up

# URLs:
# - Shell: http://localhost:3000
# - Clients: http://localhost:3001  
# - Selected: http://localhost:3002
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

```

