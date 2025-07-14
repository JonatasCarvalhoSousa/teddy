# ✅ Checklist de Deploy na Vercel

## Pré-requisitos
- [ ] Node.js >= 18.0.0 instalado
- [ ] NPM >= 8.0.0 instalado
- [ ] Conta na Vercel criada
- [ ] Repositório Git configurado

## Arquivos de Configuração ✅
- [x] `package.json` - Configurado com NPM workspaces
- [x] `vercel.json` - Configuração de deploy da Vercel
- [x] `.npmrc` - Configuração NPM para workspaces
- [x] `.gitignore` - Ignorando arquivos desnecessários
- [x] `.env.example` - Exemplo de variáveis de ambiente
- [x] `README.md` - Documentação completa

## Scripts Configurados ✅
- [x] `npm run dev` - Desenvolvimento
- [x] `npm run build` - Build de produção
- [x] `npm run vercel-build` - Build específico Vercel
- [x] `npm run start` - Alias para desenvolvimento
- [x] `npm run lint` - Linting
- [x] `npm run test` - Testes

## Deploy Automático (Recomendado)

### 1. Push para Git
```bash
git add .
git commit -m "feat: configuração para deploy Vercel com NPM"
git push origin main
```

### 2. Conectar à Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Import Project"
3. Conecte seu repositório GitHub/GitLab
4. Selecione o repositório `teddy-teste`
5. Vercel detectará automaticamente as configurações

### 3. Configurações da Vercel (Automáticas)
- **Framework**: Vite ✅
- **Build Command**: `cd apps/shell && npm install && npm run build` ✅
- **Output Directory**: `apps/shell/dist` ✅
- **Install Command**: `npm install` ✅

## Deploy Manual (Alternativo)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy de teste
vercel

# 4. Deploy de produção
vercel --prod
```

## Variáveis de Ambiente (Opcional)

Se necessário, configure na Vercel Dashboard:
- `VITE_API_BASE_URL=https://boasorte.teddybackoffice.com.br`
- `VITE_APP_NAME=Teddy Open Finance`

## Pós-Deploy

### Verificações
- [ ] Site carrega corretamente
- [ ] Roteamento SPA funcionando
- [ ] API calls funcionando
- [ ] Responsividade mobile
- [ ] Performance (Core Web Vitals)

### URLs Importantes
- **Production**: `https://seu-projeto.vercel.app`
- **Dashboard**: `https://vercel.com/dashboard`
- **Analytics**: Disponível no dashboard Vercel

## Troubleshooting

### Problemas Comuns

**Build Error: NPM não encontrado**
- Solução: Verificar se `installCommand` está como `npm install`

**Roteamento não funciona**
- Solução: `vercel.json` configurado para SPA

**Variáveis de ambiente não funcionam**
- Solução: Prefixar com `VITE_` e configurar na Vercel

**Build muito lento**
- Solução: Otimizar dependências e usar cache do NPM

### Comandos de Debug
```bash
# Testar build localmente
npm run build
cd apps/shell && npm run preview

# Verificar estrutura dos arquivos
ls -la apps/shell/dist/

# Testar API localmente
curl https://boasorte.teddybackoffice.com.br/users
```

## Próximos Passos

### Otimizações Opcionais
- [ ] Configurar CDN para assets
- [ ] Implementar PWA (Service Worker)
- [ ] Configurar Analytics
- [ ] Configurar monitoramento de erros
- [ ] Implementar testes E2E

### Domínio Personalizado
1. Comprar domínio
2. Configurar DNS
3. Adicionar domínio na Vercel Dashboard
4. Configurar SSL (automático)

---

**🚀 Projeto pronto para deploy na Vercel com NPM!**
