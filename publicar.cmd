@echo off
REM ===========================================================================
REM  Publica el sitio de OrcLuxuryTransport en Cloudflare Pages.
REM  Metodo MANUAL de respaldo: el metodo principal es git push a main
REM  (Cloudflare Pages hace el deploy automatico desde GitHub).
REM
REM  Antes de usarlo por primera vez, o cuando caduque la sesion:
REM      npx wrangler login
REM
REM  Requiere Node.js instalado: https://nodejs.org
REM ===========================================================================
setlocal
cd /d "%~dp0"

echo.
echo   Subiendo sitio-para-subir/ a Cloudflare Pages...

npx wrangler pages deploy

echo.
echo   Si aparecio la direccion del despliegue, el sitio ya esta actualizado.
echo   Si dijo que no hay sesion, ejecute primero:  npx wrangler login
echo.
pause
