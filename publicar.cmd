@echo off
REM ===========================================================================
REM  Publica el sitio de OrcLuxuryTransport en Cloudflare Pages.
REM
REM  Antes de usarlo por primera vez, o cuando caduque la sesion:
REM      npx wrangler login
REM
REM  Requiere Node.js instalado: https://nodejs.org
REM ===========================================================================
setlocal
cd /d "%~dp0"

echo.
echo   Preparando la carpeta dist...

if exist dist rmdir /s /q dist
mkdir dist
mkdir dist\en

copy /y "sitio-para-subir\index.html"    "dist\"    >nul
copy /y "sitio-para-subir\404.html"      "dist\"    >nul
copy /y "sitio-para-subir\en\index.html" "dist\en\" >nul
xcopy /e /i /y "sitio-para-subir\fotos"  "dist\fotos" >nul

echo   Listo. Subiendo a Cloudflare...
echo.

npx wrangler pages deploy

echo.
echo   Si aparecio la direccion del despliegue, el sitio ya esta actualizado.
echo   Si dijo que no hay sesion, ejecute primero:  npx wrangler login
echo.
pause
