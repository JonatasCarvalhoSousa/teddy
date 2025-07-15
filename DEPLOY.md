# 🚀 Guia de Deploy na Vercel - Micro Frontends

## 📋 Pré-requisitos

1. **Conta na Vercel**: Tenha uma conta ativa na [Vercel](https://vercel.com)
2. **Repositório Git**: Seu projeto deve estar em um repositório Git (GitHub, GitLab, etc.)
3. **Node.js**: Versão 18.x (definida no .nvmrc)

## 🔧 Configuração do Deploy

### Opção 1: Deploy via Dashboard da Vercel (Recomendado)

1. **Acesse o Dashboard da Vercel**
   - Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
   - Faça login com sua conta

2. **Conecte seu Repositório**
   - Clique em "Add New" → "Project"
   - Importe seu repositório Git
   - Selecione o repositório `teddy`

3. **Configure o Projeto**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `apps/shell/dist`
   - **Install Command**: `npm run install:all`

4. **Variáveis de Ambiente**
   ```
   NODE_ENV=production
   ```

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build terminar

### Opção 2: Deploy via CLI

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

## ⚙️ Configuração Importante

### Atualize URLs dos Micro Frontends

Após o primeiro deploy, você receberá uma URL como `https://seu-projeto.vercel.app`.

**IMPORTANTE**: Atualize o arquivo `apps/shell/webpack.config.js`:

```javascript
// Substitua "your-vercel-app" pela URL real do seu projeto
production: {
  clients: 'https://seu-projeto.vercel.app/clients/remoteEntry.js',
  selected: 'https://seu-projeto.vercel.app/selected/remoteEntry.js',
}
```

Então faça um novo deploy para que as URLs sejam atualizadas.

## 🔍 Verificação do Deploy

1. **Verifique os arquivos**:
   - `https://seu-projeto.vercel.app/` → Shell principal
   - `https://seu-projeto.vercel.app/clients/remoteEntry.js` → Micro frontend clients
   - `https://seu-projeto.vercel.app/selected/remoteEntry.js` → Micro frontend selected

2. **Teste a funcionalidade**:
   - Navegação entre páginas
   - CRUD de clientes
   - Seleção de clientes
   - Comunicação entre micro frontends

## 🐛 Troubleshooting

### Erro: "Module not found"
- Verifique se todos os micro frontends foram construídos
- Confirme se as URLs dos remotes estão corretas

### Erro: "CORS"
- Verifique os headers CORS no `vercel.json`
- Confirme se todos os micro frontends estão na mesma domínio

### Build falha
- Verifique se todas as dependências estão instaladas
- Execute `npm run build:all` localmente para testar

## 📁 Estrutura de Deploy

```
apps/shell/dist/
├── index.html              # Aplicação principal
├── assets/                 # Assets do shell
├── clients/                # Micro frontend clients
│   ├── remoteEntry.js
│   └── assets/
└── selected/               # Micro frontend selected
    ├── remoteEntry.js
    └── assets/
```

## 🔄 Atualizações

Para novas versões:
1. Faça push para o repositório
2. Vercel irá automaticamente fazer redeploy
3. Ou use `vercel --prod` para deploy manual

## ⚡ Dicas de Performance

1. **Cache**: Vercel automaticamente configura cache para assets
2. **CDN**: Todos os arquivos são servidos via CDN global
3. **Compression**: Gzip/Brotli são automaticamente aplicados
