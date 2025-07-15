@echo off
echo 🔧 Testando Webpack Configs...

echo.
echo 📁 Testando Clients...
cd apps\clients
call npm run dev --help
if %errorlevel% neq 0 (
    echo ❌ Erro no Clients
) else (
    echo ✅ Clients OK
)

echo.
echo 📁 Testando Selected...
cd ..\selected
call npm run dev --help  
if %errorlevel% neq 0 (
    echo ❌ Erro no Selected
) else (
    echo ✅ Selected OK
)

echo.
echo 📁 Testando Shell...
cd ..\shell
call npm run dev --help
if %errorlevel% neq 0 (
    echo ❌ Erro no Shell
) else (
    echo ✅ Shell OK
)

echo.
echo 🎯 Para rodar os micro-frontends:
echo.
echo Terminal 1: cd apps\clients && npm run dev
echo Terminal 2: cd apps\selected && npm run dev  
echo Terminal 3: cd apps\shell && npm run dev
echo.
echo Depois acesse: http://localhost:3000

pause
