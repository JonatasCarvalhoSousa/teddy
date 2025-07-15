#!/bin/bash

echo "🚀 Iniciando build para produção..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm run install:all

# Build do design system
echo "🎨 Construindo design system..."
npm run build:design-system

# Build dos micro frontends
echo "🏗️ Construindo micro frontends..."
npm run build:clients
npm run build:selected

# Copiar arquivos dos micro frontends para o shell
echo "📁 Organizando arquivos para deploy..."

# Criar diretórios no shell/dist
mkdir -p apps/shell/dist/clients
mkdir -p apps/shell/dist/selected

# Copiar arquivos do clients
cp -r apps/clients/dist/* apps/shell/dist/clients/

# Copiar arquivos do selected  
cp -r apps/selected/dist/* apps/shell/dist/selected/

# Build do shell por último
echo "🏠 Construindo aplicação shell..."
npm run build:shell

echo "✅ Build concluído com sucesso!"
