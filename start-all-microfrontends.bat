@echo off
echo Starting all micro-frontends...

echo.
echo Starting Clients micro-frontend on port 3001...
start "Clients MF" cmd /k "cd /d %~dp0apps\clients && npm run dev"

timeout /t 3 >nul

echo Starting Selected micro-frontend on port 3002...
start "Selected MF" cmd /k "cd /d %~dp0apps\selected && npm run dev"

timeout /t 3 >nul

echo Starting Shell micro-frontend on port 3000...
start "Shell MF" cmd /k "cd /d %~dp0apps\shell && npm run dev"

echo.
echo All micro-frontends are starting...
echo.
echo URLs:
echo - Shell (Main App): http://localhost:3000
echo - Clients Service: http://localhost:3001
echo - Selected Service: http://localhost:3002
echo.
echo Wait a few moments for all services to start, then open http://localhost:3000
pause
