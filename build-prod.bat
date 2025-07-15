@echo off
echo 🚀 Iniciando build para produção...

echo 📦 Instalando dependências...
call npm run install:all

echo 🎨 Construindo design system...
call npm run build:design-system

echo 🏗️ Construindo micro frontends...
call npm run build:clients
call npm run build:selected

echo 📁 Organizando arquivos para deploy...

if not exist "apps\shell\dist\clients" mkdir apps\shell\dist\clients
if not exist "apps\shell\dist\selected" mkdir apps\shell\dist\selected

xcopy "apps\clients\dist\*" "apps\shell\dist\clients\" /E /Y
xcopy "apps\selected\dist\*" "apps\shell\dist\selected\" /E /Y

echo 🏠 Construindo aplicação shell...
call npm run build:shell

echo ✅ Build concluído com sucesso!
