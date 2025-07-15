const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para produção...');

try {
  // Instalar dependências
  console.log('📦 Instalando dependências...');
  execSync('npm run install:all', { stdio: 'inherit' });

  // Build do design system
  console.log('🎨 Construindo design system...');
  execSync('npm run build:design-system', { stdio: 'inherit' });

  // Build dos micro frontends
  console.log('🏗️ Construindo micro frontends...');
  execSync('npm run build:clients', { stdio: 'inherit' });
  execSync('npm run build:selected', { stdio: 'inherit' });

  // Organizar arquivos para deploy
  console.log('📁 Organizando arquivos para deploy...');
  
  // Criar diretórios no shell/dist
  const shellDistPath = path.join(__dirname, 'apps', 'shell', 'dist');
  const clientsDistPath = path.join(shellDistPath, 'clients');
  const selectedDistPath = path.join(shellDistPath, 'selected');

  if (!fs.existsSync(clientsDistPath)) {
    fs.mkdirSync(clientsDistPath, { recursive: true });
  }
  
  if (!fs.existsSync(selectedDistPath)) {
    fs.mkdirSync(selectedDistPath, { recursive: true });
  }

  // Função para copiar diretório recursivamente
  function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Copiar arquivos dos micro frontends
  copyDir(path.join(__dirname, 'apps', 'clients', 'dist'), clientsDistPath);
  copyDir(path.join(__dirname, 'apps', 'selected', 'dist'), selectedDistPath);

  // Build do shell por último
  console.log('🏠 Construindo aplicação shell...');
  execSync('npm run build:shell', { stdio: 'inherit' });

  console.log('✅ Build concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
