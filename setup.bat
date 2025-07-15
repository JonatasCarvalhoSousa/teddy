@echo off
echo 🚀 Configurando Micro-frontends do Teddy...

REM Instalar dependências do root
echo 📦 Instalando dependências do projeto raiz...
call npm install

REM Build do design system primeiro
echo 🎨 Fazendo build do design system...
cd packages\design-system
call npm run build
cd ..\..

REM Instalar dependências de todos os workspaces
echo 📦 Instalando dependências dos workspaces...
call npm install --workspaces

echo ✅ Setup completo!
echo.
echo Para rodar o projeto:
echo   npm run dev    # Roda todos os micro-frontends simultaneamente
echo.
echo Ou individualmente:
echo   npm run dev:shell     # Shell (porta 3000)
echo   npm run dev:clients   # Clients (porta 3001)
echo   npm run dev:selected  # Selected (porta 3002)
echo.
echo 🌐 URLs:
echo   Shell:    http://localhost:3000
echo   Clients:  http://localhost:3001
echo   Selected: http://localhost:3002

pause
