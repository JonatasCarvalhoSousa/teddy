@echo off
echo 🚀 Iniciando Micro-frontends Teddy...

echo.
echo 🔧 Iniciando Clients (porta 3001)...
start "Clients MF" cmd /k "cd /d %cd%\apps\clients && npm run dev"

echo.
echo 🔧 Iniciando Selected (porta 3002)...  
start "Selected MF" cmd /k "cd /d %cd%\apps\selected && npm run dev"

echo.
echo 🔧 Iniciando Shell (porta 3000)...
start "Shell MF" cmd /k "cd /d %cd%\apps\shell && npm run dev"

echo.
echo ✅ Todos os micro-frontends foram iniciados!
echo.
echo 🌐 URLs disponíveis:
echo   - Shell Principal: http://localhost:3000
echo   - Clients Standalone: http://localhost:3001  
echo   - Selected Standalone: http://localhost:3002
echo.
echo 💡 Aguarde alguns segundos para que todos os serviços inicializem.
echo.

pause
